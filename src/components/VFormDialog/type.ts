import { IFormConfig, IFormConfigs } from '@/mixins/condition/type';

export interface IDialogConfig {
    visible?: boolean, // 显示状态
    class?: string, // 类名
    width?: string, // 宽度 需要加单位
    type?: string, // 类型: create创建 edit编辑 ... 每个type对应一个 typeTitle typeForm onTypeConfirm
    createTitle?: string, // 标题 - 创建
    editTitle?: string, // 标题 - 编辑
    onClose?: Function, // 关闭回调
    closeText?: string, // 关闭按钮文案
    confirmText?: string, // 确认按钮文案
    onCreateConfirm?: Function, // 确认回调 - 创建
    onEditConfirm?: Function, // 确认回调 - 编辑
    createForm?: any, // 创建表单
    editForm?: any, // 编辑表单
    form?: any, // 表单（当创建和编辑的表单相同时）
    formConfigs?: IFormConfigs, // 表单配置
    columnCount?: number, // 一行有几个表单项
    loading?: boolean, // 是否正在加载中
    events?: Record<string, Function>, // 事件映射 FormDialogBuilder
    [key: string]: any,
}


// 自定义渲染方法参数
export interface IRenderFDParams {
    form: Record<string, any>, // 当前表单
    itemConfig: IFormConfig, // 当前表单项配置
    itemKey: string, // 当前表单项key
}