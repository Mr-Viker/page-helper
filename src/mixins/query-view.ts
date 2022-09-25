import { Vue, Component } from "vue-property-decorator";
import { isFunction, isJSON } from '@/utils/jy-util';


@Component
export default class QueryView extends Vue {

    data() {
        return {
            queryView: {
                'quick-filter-save': (name: string) => {
                    // 兼容计划和其他页面
                    // @ts-ignore
                    const adminCondition: any = this.$refs.adCondition?.$refs.adminCondition || this.$refs.adminCondition;

                    adminCondition && adminCondition.saveView({
                        conditions: JSON.stringify(this.condition.form),
                        showColumns: this.dynamicColumns ? JSON.stringify(this.dynamicColumns) : '*',
                        orderBy: this.sort ? JSON.stringify(this.sort) : '*',
                    });
                },

                // 选中快筛 修改功能时注意累计趋势是否需要同步 因为累计趋势快筛不同 重写了该方法
                // 提供3个hook，用于以后页面快筛有更新(比如form字段更新appId => appIds)时提供给页面自身处理方法的切面
                'quick-filter-change': async (viewData: any) => {
                    this.$emit('hook:beforeQueryFilterChange', viewData);

                    if(isJSON(viewData.showColumns)) {
                        this.dynamicColumns = JSON.parse(viewData.showColumns);
                        // 为了兼容重构前头条的快筛
                        this.dynamicColumns.map(column => {
                            if(!column.prop) column.prop = column.columnCode;
                        });
                    }

                    if(isJSON(viewData.orderBy)) this.sort = JSON.parse(viewData.orderBy);

                    let form = JSON.parse(viewData.conditions);
                    // 为了兼容重构前头条的快筛
                    if(!form.hasOwnProperty('date') 
                        && form.hasOwnProperty('beginDate') && form.hasOwnProperty('endDate') && form.hasOwnProperty('shortcutsType')) {
                            const shortcuts = form.shortcutsType - 1;
                            form.date = [form.beginDate, form.endDate, shortcuts >= 0 ? shortcuts : 0];
                    }

                    this.$emit('hook:onQueryFilterChange', form);

                    this.checkFormItemChange(form); // 检测表单值是否改变 改变则触发onChange联动
                    this.condition.form = form;
                    // this.checkQuickFilterDate(); // 检测日期是否保存的是快捷操作
+
                    isFunction(this.resetPagination) && this.resetPagination(); // 重置当前页
                    if(isFunction(this.getReports)) await this.getReports();
                    if(isFunction(this.setTableColumns)) await this.setTableColumns(false); // 更新表格展示快筛保存的列
                    // this.updateTableSort(); // 更新列排序显示状态

                    this.$emit('hook:afterQueryFilterChange', this.condition.form);
                },

                // 自定义列排序完成后要重新获取一次表格动态列
                'custom-column-confirm': () => {
                    this.setTableColumns();
                }
            }
        }
    }

}
