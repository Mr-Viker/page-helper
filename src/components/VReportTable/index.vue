<template>
    <el-table 
        :data="data" 
        :height='config.height' 
        :class="['report-common-table', config.class, {'table-has-summary': config.showSummary, 'table-has-gather': config.showGather}]"
        :show-header='!config.hideHeader' 
        :span-method="config.spanMethod"
        :row-class-name='({row, rowIndex}) => `table-row-${rowIndex}`' 
        :border='config.border' 
        :stripe='config.stripe' 
        highlight-current-row
        @select="(selection, row) => $emit('select', {selection, row})" 
        @select-all="$emit('select-all', $event)"
        @selection-change="$emit('selection-change', $event)"
        @sort-change="({ column, prop, order }) => config.sortChange && config.sortChange({ column, prop, order })"
        :show-summary="config.showSummary" 
        :summary-method='config.summaryMethod'
        :show-gather="config.showGather" 
        :gather-method='config.gatherMethod'
        :default-sort="config.defaultSort"
        v-table-infinite-scroll:[config.infiniteScroll]='loadMore'
        :infinite-scroll-disabled='infiniteScrollDisabled' 
        :infinite-scroll-immediate='infiniteScrollImmediate'
        :infinite-scroll-delay='infiniteScrollDelay' 
        :infinite-scroll-distance='infiniteScrollDistance'
        :key='config.tableId || tableId'
        v-bind="config.nativeProps"
        ref='table'
        >

        <template v-for='(column, columnIndex) in config.columns'>
            <!-- 提供两种渲染列的方式 默认根据config.columns下的配置来渲染 另一种是slot(需在config.columns下配置一下该列的key) -->
            <slot :name="'el-table-column-' + column.key" :column="column" :column-index='columnIndex' :data='data'>

                <!-- 外部没有定义列slot则使用默认渲染 -->

                <!-- 勾选框或者定义了formatter渲染函数的 -->
                <el-table-column v-if='["selection", "index"].includes(column.type) || !!column.formatter' v-bind="column" 
                    :class-name="`table-column-${columnIndex} table-column-${column.key}`"
                    :show-overflow-tooltip='showOverflowTooltip(column)' :key='column.key'>
                </el-table-column>

                <!-- 开关 -->
                <el-table-column v-else-if='column.type == "switch"' v-bind="column" :class-name="`table-column-${columnIndex}`" :key='column.key'>
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row[column.vModelName]" :active-value='column.activeValue' :inactive-value='column.inactiveValue'
                            @change='$emit("switch", scope)' @click.native.stop :disabled="disabled(scope, column)">
                        </el-switch>
                    </template>
                </el-table-column>

                <!-- 操作列 -->
                <el-table-column v-else-if='column.type == "action"' v-bind="column" :class-name="`table-column-${columnIndex}`" :key='column.key'>
                    <template slot-scope="scope">
                        <el-button class="font-12" type="text" size="mini" v-bind="btn" @click.stop="$emit(btn.actionName, scope)" :loading="scope.row.loading"
                            v-for="btn in column.buttons" :key='btn.actionName'>
                            {{btn.text}}
                        </el-button>
                    </template>
                </el-table-column>

                <!-- 默认 -->
                <el-table-column v-else v-bind="column" :class-name="`table-column-${columnIndex} table-column-${column.key}`" 
                    :show-overflow-tooltip='showOverflowTooltip(column)' :key='column.key'>
<!--                    <ad-table-header slot="header" :column-data="column"></ad-table-header>-->
                    <template slot-scope="scope">
                        <template v-if="!scope.row.hasOwnProperty(column.prop)">-</template>
                        <!-- image -->
                        <el-popover v-else-if='column.tag == "image"' popper-class='table-popover' placement="right-start" width="300" trigger="hover">
                            <img :src="scope.row[column.prop] + '?imageMogr2/thumbnail/480x'" class='table-popover-img' />
                            <img slot="reference" :src="scope.row[column.prop] + '?imageMogr2/thumbnail/480x'" class='table-img' />
                        </el-popover>

                        <!-- tag -->
                        <el-tag v-else-if="column.tag == 'tag' && column.map[scope.row[column.prop]]" :type='column.map[scope.row[column.prop]].type'>
                            {{column.map[scope.row[column.prop]].label}}
                        </el-tag>

                        <!-- default -->
                        <template v-else>{{getCellValue(scope.row, column)}}</template>

                        <!-- copy -->
                        <span v-if="column.copy" class="copy-container">
                            <i @click="$emit('copy', {value: getCellValue(scope.row, column), event: $event})" class="icon-copy el-icon-copy-document"></i>
                        </span>
                    </template>
                </el-table-column>

            </slot>
        </template>


        <!-- 提供两种方式给表格的slot 一种是在config里配置 一种是slot -->
        <div slot='append'><slot name='append'></slot></div>

    </el-table>
</template>


<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { ITableConfig } from './type';
// @ts-ignore
import TableInfiniteScroll from "./directives/table-infinite-scroll";
import { isFunction, isEqual } from '@/utils/jy-util';
import { getTableCellFormatValue } from './utils';


@Component({
    name: 'v-report-table',
    directives: { TableInfiniteScroll },
})
export default class VReportTable extends Vue {
    @Prop(Object) config!: ITableConfig; // 配置
    @Prop(Array) data!: Array<any>; // 数据源
    @Prop(Boolean) infiniteScrollDisabled!: boolean; // 禁用滚动加载
    @Prop({type: Boolean, default: false}) infiniteScrollImmediate!: boolean; // 是否立即执行加载方法
    @Prop({type: Number, default: 200}) infiniteScrollDistance!: number; // 距离底部阈值
    @Prop({type: Number, default: 200}) infiniteScrollDelay!: number; // 多久触发一次

    private timer: any = null;
    // private renderTimer: number = null;
    private tableId: number = 1; // 用于重新渲染表格


    get table(): any { return this.$refs.table; }

    // 列变化则重新渲染表格（除非调用者指定了tableId）
    @Watch('config.columns')
    onWatchColumns(newVal: any, oldVal: any) {
        if(!isEqual(newVal, oldVal)) this.tableId++;
    }

    mounted() {
        this.table.bodyWrapper.addEventListener('scroll', this.syncPostion, { passive: true });
    }

    destroyed() {
        this.table.bodyWrapper.removeEventListener('scroll', this.syncPostion, { passive: true });
    }

    // 滚动停止后自动同步位置 防止header和footer错乱
    private syncPostion() {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => this.table.syncPostion(), 50);
    }

    // 是否显示tooltips
    showOverflowTooltip(column: any) { return column.hasOwnProperty("showOverflowTooltip") ? column.showOverflowTooltip : true; }
    // 是否禁用
    disabled(scope: any, column: any) { return isFunction(column.disabled) ? column.disabled(scope, column) : column.disabled; }

    // 滚动加载触发
    loadMore() { this.$emit("load-more"); }

    // @ts-ignore
    scrollTop(top: number = 0) { this.$refs.table.bodyWrapper.scrollTop = top; }


    // 获取值 根据列配置action动作来格式化
    getCellValue(...args: any[]) {
        return getTableCellFormatValue(...args);
    }

}
</script>


<style lang='scss' scoped>
.report-common-table {

    ::v-deep .table-img {
        display: inline-block;
        max-height: 24px;
        max-width: 100%;
        vertical-align: middle;
    }

    ::v-deep td {
        overflow: hidden;
        .cell {
            background-color: inherit;
        }
    }

    .copy-container {
        position: absolute;
        right: 8px;
        background-color: inherit;
        padding-left: 5px;
        .icon-copy {
            color: #0486FE;
            font-size: 14px;
            line-height: 18px;
            cursor: pointer;
        }
    }

}
</style>

<style lang="scss">
.table-popover {
    .table-popover-img {
        display: block;
        width: 100%;
        height: auto;
    }
}
</style>
