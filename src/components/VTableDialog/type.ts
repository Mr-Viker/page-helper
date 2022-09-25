import { ITableConfig } from '../VReportTable/type';

export interface ITableDialog {
    visible?: boolean, // 显示状态
    width?: string, // 宽度 需要加单位
    class?: string, // 类名
    loading?: boolean, // 是否正在加载中
    submitting?: boolean, // 是否正在提交
    
    type?: string, // 弹框类型 default:查看 ... 每个type对应一个 typeTitle typeForm typeApi typeColumns typeShowPagination
    title?: string, // 弹框标题
    api?: Function, // 获取数据列表的接口
    form?: any, // 请求参数
    columns?: any[], // 类型对应的列
    showPagination?: boolean, // 是否显示分页
    showButtonBar?: boolean, // 是否显示底部按钮组
    
    tableConfig?: ITableConfig, // 表格配置
    [key: string]: any,
}