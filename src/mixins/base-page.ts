/**
 * 页面基类 提供search方法、reports等数据可以直接配合xxBuilder装饰器进行快速生成页面
 * 类型：包含检索栏、表格、分页
 */

import { Component, Vue } from 'vue-property-decorator';
import ConditionStatus from '@/mixins/condition/v2/decorator';


@Component
export default class BasePage extends Vue {

    reports: any[] = []; // 表格数据
    summary: any = {}; // 表格顶部合计行


    created() {
        this.setTableColumns(); // 初始化表格列 如果有condition.pageUri && tableConfig.hasDynamicColumns=true则会获取自定义列
        this.search();
    }


    // 搜索 
    @ConditionStatus.Validate()
    search() {
        this.reset();
        this.getReports();
    }

    // 重置分页及检测列
    @ConditionStatus.Rest()
    reset() {
        this.resetPagination();
        this.setTableColumns(false);
    }


    // 获取表格数据
    @ConditionStatus.Update()
    async getReports() {
        let formatForm = this.getFormatForm();
        const res = await (this.reportApi)(formatForm);
        if(res.code === 0) {
            this.reports = res.data.records;
            this.pagination.total = res.data.total;
            this.summary = res.data.footer?.length > 0 ? res.data.footer[0] : [];
        }
    }
    
}