import { Vue, Component } from "vue-property-decorator";
import { isFunction } from '@ewan/ewan-ui/src/utils/types';

@Component
export default class Pagination extends Vue {

    // 分页
    protected pagination: any = {
        current: 1,
        size: 20,
        total: 0,
        sizes: [10, 20, 30, 50, 100, 200],
        layout: 'total, prev, pager, next, jumper, sizes',
    };

    protected getReportsMethodName: string = 'getReports'; // 请求报表列表数据方法名


    // 重置
    protected resetPagination() {
        this.pagination.current = 1;
        this.pagination.total = 0;
        // this.reports = [];
        isFunction(this.scrollTop) && this.scrollTop(0);
    }

    // 改变页码
    protected handleCurrentChange(current: number) {
        this.pagination.current = current;
        this[this.getReportsMethodName] && this[this.getReportsMethodName]();
        isFunction(this.scrollTop) && this.scrollTop(0);
    }

    // 改变数量
    protected handleSizeChange(size: number) {
        this.pagination.size = size;
        this.pagination.current = 1;
        this[this.getReportsMethodName] && this[this.getReportsMethodName]();
        isFunction(this.scrollTop) && this.scrollTop(0);
    }

}
