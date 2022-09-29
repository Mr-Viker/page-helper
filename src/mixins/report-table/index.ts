import { Vue, Component } from "vue-property-decorator";
import { ITableColumn, ITableConfig } from '@/components/VReportTable/type';
import { isEmptyValue, isFunction, isEqual } from '@/utils/jy-util';
import clipboard from '@/utils/clipboard';
import { getTableCellFormatValue } from "@/components/VReportTable/utils";
import { mergeTableColumns } from "./util";


@Component
export default class ReportTable extends Vue {

    data(): {
        tableConfig: ITableConfig,
        sort: any,
        staticColumns: ITableColumn[],
        dynamicColumns: ITableColumn[],
        loading: boolean,
        excludeSummaryProps: string[],
        getDynamicColumnsApi?: Function,
    } {
        return {
            // 表格配置
            tableConfig: {
                class: 'report-table',
                height: 'calc(100vh - 36px - 56px - 40px - 8px - 48px - 8px)', // 默认有tagview+筛选组件(两行的高度规)+分页组件
                stripe: true,
                border: true,
                columns: [],
                // showTableIndex: true,
                showGather: true,
                totalProperty: '', // 显示合计行中的合计xx项的列的prop 默认在索引为0的列上渲染
                totalIndex: 0, // 显示合计行中的合计xx项的列的index 默认在索引为0的列上渲染
                // data: 相当于reports，所有row的数据列表
                gatherMethod: ({ columns, data }) => {
                    return columns.map((column, index) => {
                        const isShowTotalColumn = !isEmptyValue(this.tableConfig.totalProperty) ? column.property == this.tableConfig.totalProperty : index === this.tableConfig.totalIndex;
                        if(isShowTotalColumn) { return `合计: ${this.summary?.total || '-'}项`; }

                        if(this.summary?.hasOwnProperty(column.property) && !this.excludeSummaryProps?.includes(column.property)) {
                            return getTableCellFormatValue(this.summary, this.getCustomColumnConfig(column.property));
                        } else {
                            return '';
                        }
                    })
                },
                // 远程排序
                sortChange: ({ column, prop, order }) => {
                    if(order) {
                        this.sort.prop = prop;
                        this.sort.order = order;
                    } else {
                        this.sort.prop = '';
                        this.sort.order = '';
                    }
                    this.search();
                },
                scrollLoading: false, // 滚动加载状态
                hasDynamicColumns: true, // 是否需要请求接口获取动态列 默认有condition.pageUri就会获取 但是有种情况是有快筛(即有condition.pageUri)但是不需要动态列 此时可以设置该参数为false
            },
            sort: { prop: '', order: '' }, // 表格排序
            staticColumns: [], // 静态列
            dynamicColumns: [], // 动态列 - 用户自定义的列
            loading: false, // 表格列配置加载状态
            excludeSummaryProps: [], // 合计行不显示的列
        }
    }



    // 更新表格列配置
    // refreshDynamicColumns：是否重新请求自定义列
    async setTableColumns(refreshDynamicColumns: boolean = true, pageUri?: string) {
        this.loading = true;

        // 如果为true则重新获取动态列
        if(refreshDynamicColumns) { await this.getDynamicColumns(pageUri).catch(err => this.loading = false) }

        let columns = mergeTableColumns(this.staticColumns, this.dynamicColumns); // 合并静态列和动态列
        if(isFunction(this.filterGatherColumns)) columns = this.filterGatherColumns(columns); // 过滤汇总列
        columns = this.updateFormatColumnsByHide(columns); // 检测列显示性 过滤掉不显示的列

        this.$emit('hook:beforeSetTableColumns', columns);
        if(!isEqual(this.tableConfig.columns, columns)) {
            this.$set(this.tableConfig, 'columns', columns);
            this.checkSort(); // 如果列更新了 则检测排序字段的列是否还存在
        }
        this.updateTableSort(); // 更新列排序显示状态
        this.$emit('hook:afterSetTableColumns', columns);

        this.loading = false;
    }


    // 获取动态列配置数组
    async getDynamicColumns(pageUri?: string) {
        pageUri = pageUri || this.pageUri || this.condition?.pageUri;
        if(isEmptyValue(pageUri) || !this.tableConfig.hasDynamicColumns) return;

        const res = await this.getDynamicColumnsApi(pageUri);
        if(res.code === 0) {
            this.dynamicColumns = res.data.map(item => {
                return {
                    label: item.columnFormatName || item.columnName,
                    key: item.columnCode,
                    prop: item.columnCode,
                    width: item.columnWidth || 'auto',
                    sortable: item.enableSort ? 'custom' : false,
                    action: item.action, // 动作 1百分比
                    labelClassName: item.highlight ? `highlight${item.highlight}` : '', // 列表头类名
                    // renderHeader: handleRenderHeader, // 渲染表头
                    descr: item.descr, // 表头tooltips内容
                }
            });
        }
    }

    // 检测列显示性 过滤掉不显示的列
    // 和condition不同的是 表格列不是实时更新显示性的(需要比如点击查询按钮来主动触发) 而检索栏表单项是实时更新显示性的 所以不适合在VReportTable组件中使用v-if来判断显示性
    updateFormatColumnsByHide(columns: ITableColumn[]) {
        // @ts-ignore
        return columns.filter(col => isFunction(col.hide) ? !col.hide(this.condition?.form, col) : !col.hide);
    }


    // 检测排序字段 如果新表格列没有之前选中的排序列 则清空排序规则
    checkSort(columns?: ITableColumn[]) {
        if(isEmptyValue(columns)) columns = this.tableConfig.columns;

        const props = columns.map(column => column.prop);
        if(!props.includes(this.sort.prop)) {
            this.sort.prop = '';
            this.sort.order = '';
        }
    }

    // 更新列排序显示状态 - 点击快筛
    updateTableSort(wrapRef?: any) {
        // @ts-ignore
        this.$nextTick(() => (wrapRef || this).$refs.vReportTable?.$refs.table.store.commit('sort', {...this.sort, init: true, allowClear: true}));
    }

    // 滚动
    scrollTop(value: number = 0) {
        // @ts-ignore
        this.$nextTick(() => this.$refs.vReportTable?.scrollTop(value));
    }

    // 根据prop字段值获取mixins中相应的自定义的该列配置
    getCustomColumnConfig(prop: string): ITableColumn {
        return this.tableConfig.columns.find(col => col.prop === prop);
    }


    /*********************************** 列附加功能 start ****************************/

    // 复制
    onCopyClick({value, event}) {
        return clipboard(value, event);
    }

    /*********************************** 列附加功能 end ****************************/

}
