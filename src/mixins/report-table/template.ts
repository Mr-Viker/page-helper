/**
 * Table 表格配置模板类
 * 主要是表格配置模板 分为两类：默认配置和业务便捷配置
 */

import { ITableColumn } from "@/components/VReportTable/type";


/***************************** 默认配置 start *******************************/

// 勾选框
export const selectionColumnConfig: ITableColumn = {
    label: '',
    key: 'selection',
    type: 'selection',
    fixed: true,
    width: 'auto',
}

// 开关
export const switchColumnConfig: ITableColumn = {
    label: '',
    key: 'switch',
    type: 'switch',
    vModelName: '',
    activeValue: 1,
    inactiveValue: 0,
    fixed: true,
    width: 'auto',
}

// 操作
export const actionColumnConfig: ITableColumn = {
    label: '操作',
    key: 'action',
    prop: 'action',
    width: 'auto',
}

/***************************** 默认配置 end *******************************/
