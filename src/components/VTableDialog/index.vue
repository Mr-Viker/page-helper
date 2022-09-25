<template>
    <el-dialog class='v-table-dialog' :custom-class="config.class" :title='title' :width="config.width" :visible="config.visible" @close='close' v-bind='$attrs' :close-on-click-modal='false'>

        <div class="dialog-bd" v-loading='config.loading'>
            <v-report-table :data='reports' :config='config.tableConfig' ref="vReportTable" v-if="config.tableConfig">
                <template v-for='(column, columnIndex) in config.tableConfig.columns'>
                    <template v-if="column.customSlot" :slot="`el-table-column-${column.key}`">
                        <slot :name="`el-table-column-${column.key}`" :column="column" :column-index='columnIndex' :data='reports'></slot>
                    </template>
                </template>
            </v-report-table>
        </div>

        <div slot="footer" class="dialog-ft">
            <el-pagination v-if="showPagination" @current-change="handleCurrentChange" :current-page="pagination.current" :page-size="pagination.size"
                :layout="pagination.layout" :total="pagination.total" small>
            </el-pagination>

            <template v-if="showButtonBar">
                <el-button size="small" @click="close">取消</el-button>
                <el-button size="small" type="primary" @click="confirm" :loading="config.submitting">确定</el-button>
            </template>
        </div>
    </el-dialog>
</template>


<script lang='ts'>
import { clearInvalidFormValue, isEmptyValue } from '@/utils/jy-util';
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";

import { ITableDialog } from "./type";


@Component({
    name: 'v-table-dialog',
})
export default class VTableDialog extends Vue {
    @Prop(Object) config!: ITableDialog; // 弹框配置对象

    private reports: Array<any> = []; // 报表列表

    // 分页
    private pagination: any = {
        current: 1,
        size: 10,
        total: 0,
        layout: 'prev, pager, next',
    };

    get title() { return this.config[`${this.config.type}Title`] || this.config.title; }
    get api() { return this.config[`${this.config.type}Api`] || this.config.api; }
    get form() { return this.config[`${this.config.type}Form`] || this.config.form; }
    get columns() { return this.config[`${this.config.type}Columns`] || this.config.columns; }
    get showPagination() { return this.config[`${this.config.type}ShowPagination`] || this.config.showPagination; }
    get showButtonBar() { return this.config[`${this.config.type}ShowButtonBar`] || this.config.showButtonBar; }


    @Watch('config.visible', {immediate: true})
    onWatchVisible(newVal: boolean) {
        if(this.showPagination) {
            this.pagination.current = 1;
            this.pagination.total = 0;
        }
        newVal && this.getTableData();
    }


    // 改变页码
    protected handleCurrentChange(current: number) {
        this.pagination.current = current;
        this.getTableData();
    }

    // 获取数据
    async getTableData() {
        if(this.config.loading) { return; } else { this.config.loading = true; }

        let formatForm = this.getTableFormatForm();
        const res = await (this.api)(formatForm).finally(() => this.config.loading = false);
        if(res.code === 0) {
            if(Array.isArray(res.data)) {
                this.reports = res.data;
            } else {
                this.reports = res.data.records;
                this.pagination.total = res.data.total;
            }
            this.config.tableConfig.columns = isEmptyValue(this.columns) ? res.data.headers.map(item => ({ label: item.name, key: item.key, prop: item.key, width: 'auto' }) ) : this.columns;
        }
        this.$emit(`get-${this.config.type}-reports`, this.reports);
    }

    // 生成处理好的表单用于请求接口
    private getTableFormatForm() : any {
        let form: any = clearInvalidFormValue({...this.form});
        // 分页
        if(this.showPagination) {
            form.current = this.pagination.current;
            form.size = this.pagination.size;
        }
        return form;
    }



    // 可通过config配置确认方法 也可在调用组件的地方@confirm
    confirm() {
        this.$emit(`${this.config.type}-confirm`);
    }

    // 可通过config配置关闭方法 也可在调用组件的地方@close 默认操作为自动关闭弹框且移除验证结果
    close() {
        this.$emit('close');
        this.config.visible = false;
    }

}
</script>


<style lang='scss' scoped>
.v-table-dialog {
    ::v-deep .el-dialog__header {
        padding-top: 16px;
        .el-dialog__headerbtn {
            top: 16px;
        }
    }


}
</style>