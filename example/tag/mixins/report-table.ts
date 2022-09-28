import { Vue, Component, Mixins } from "vue-property-decorator";
import { ITableColumn, ITableConfig, BaseReportTable } from '../../../dist';


@Component
export default class ReportTable extends Mixins(BaseReportTable) {

    // 表格配置
    protected tableConfig: ITableConfig = {
        height: 'calc(100vh - 156px)',
        showGather: false,
    };

    // 固定列配置
    protected staticColumns: ITableColumn[] = [
        {
            key: 'selection',
            type: 'selection',
        },
        {
            label: 'ID',
            key: 'labelId',
            prop: 'labelId',
        },
        {
            label: '标签名称',
            key: 'labelName',
            prop: 'labelName',
        },
    ];


}
