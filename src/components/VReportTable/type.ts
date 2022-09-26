// 报表表格配置
export interface ITableConfig {
    // data?: Array<any>, // 数据源
    class?: string, // 样式类名
    height?: string | number, // 高度 固定header时必须
    border?: boolean, // 边框
    stripe?: boolean, // 条纹
    hideHeader?: boolean, // 是否隐藏表头
    onSelect?: Function, // 选中某行
    onSelectAll?: Function, // 全选
    columns?: ITableColumn[], // 每列配置项的列表
    // slots?: Array<ITableSlot>, // 要插入到table的slot
    formatter?: Function, // 格式化cell方法
    showSummary?: boolean, // 是否显示合计行
    summaryMethod?: Function, // 合计行显示方法
    showGather?: boolean, // 是否显示顶部合计行
    gatherMethod?: Function, // 顶部合计行显示方法
    sortChange?: Function, //远程排序方法
    defaultSort?: ITableSort, // 默认排序
    infiniteScroll?: boolean, // 是否启用滚动加载
    // keepSingle?: boolean, // 是否保存单例 不根据列变化而重新渲染整个table
    tableId?: string | number, // 表格ID 改变会导致表格重新渲染
    totalProperty?: string, // 显示合计行中的合计xx项的列的prop 默认在索引为0的列上渲染
    totalIndex?: number, // 显示合计行中的合计xx项的列的index 默认在索引为0的列上渲染
    scrollLoading?: boolean, // 滚动加载状态
    hasDynamicColumns?: boolean, // 是否需要请求接口获取动态列 
    events?: Record<string, Function>, // 事件映射 TableBuilder
    nativeProps?: any, // el-table原生props
    [key: string]: any,
}

// 每一列的配置项
export interface ITableColumn {
    key?: string, // 用于vfor 有时可能action column 没有prop
    label?: string, // 该列显示的header名称
    prop?: string, // 该列对应数据源的key
    fixed?: boolean | string, // 是否固定 固定在左/右
    width?: string, // 宽度
    type?: string, // 该列的类型 可选：selection index action
    sortable?: boolean | string, // 是否可排序
    showOverflowTooltip?: boolean, // 是否过长显示tooltip
    slots?: Array<ITableSlot>, // 要插入到column的slot
    tag?: string, // 要渲染的类型
    buttons?: Array<ITableButton>, // 操作按钮组
    action?: string, // 动作 1百分比 thousand千分计数显示 type options arrayToString
    labelClassName?: number, // 表头类名
    customSlot?: boolean, // 弹框调用者是否需要自定义slot - 将table封装在弹框时可能用到 一般情况下用不到 详见VTableDialog.vue
    hide?: boolean | Function, // 是否显示该列
    vModelName?: string, // 如果是switch开关则需要 v-model的field
    activeValue?: number | string, // switch开关的开值
    inactiveValue?: number | string, // switch开关的关值
    isDynamicColumnExtraConfig?: boolean, // 是否是动态列额外配置 如果是则合并到动态列 根据自定义列勾选状态显示
    [key: string]: any,
}

// slot
export interface ITableSlot {
    name?: string,
    template?: any,
}

export interface ITableSort {
    prop?: string,
    order?: string,
}


export interface ITableButton{
    actionName?: string, // 操作名 主要用于$emit的事件名
    text?: string, // 按钮文案
}