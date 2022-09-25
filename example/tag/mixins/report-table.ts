import { Vue, Component, Mixins } from "vue-property-decorator";
import { ITableColumn, ITableConfig } from '../../../src/components/VReportTable/type';

import BaseReportTable from '../../../src/mixins/report-table';

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
            width: 'auto',
        },
        {
            label: 'ID',
            key: 'labelId',
            prop: 'labelId',
            width: '60',
        },
        {
            label: '标签名称',
            key: 'labelName',
            prop: 'labelName',
            width: 'auto',
        },
        {
            label: '标签类型',
            key: 'dispCustomType',
            prop: 'dispCustomType',
            width: '0',
        },
        {
            label: '关联游戏分类',
            key: 'appCategoryNames',
            prop: 'appCategoryNames',
            width: '0',
            action: 'arrayToString',
        },
        {
            label: '所属二级分类',
            key: 'labelCategoryNames',
            prop: 'labelCategoryNames',
            width: '0',
            action: 'arrayToString',
        },
        // {
        //     label: '所属一级分类',
        //     key: 'parentCategoryName',
        //     prop: 'parentCategoryName',
        //     width: '0',
        // },
        {
            label: '关联素材数',
            key: 'materialNum',
            prop: 'materialNum',
            sortable:'custom',
            width: '0',
        },
        {
            label: '创建时间',
            key: 'createTime',
            prop: 'createTime',
            width: '0',
        },

        {
            label: '状态',
            key: 'status',
            prop: 'status',
            width: '0',
            tag: 'tag',
            map: [
                { label: '禁用', type: 'danger' },
                { label: '启用', type: 'primary' },
            ]
        },
        {
            label: '操作',
            key: 'action',
            prop: 'action',
            width: '120px',
        },
    ];


}
