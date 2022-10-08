// 表单配置
export interface IConfigs {
    [key: string]: IConfig,
}

// 表单项配置
export interface IConfig {
    formType?: IFormType,
    label?: string,
    placeholder?: string,
    options?: any[],
    props?: IProps,
    useNew?: boolean,
    mutexValues?: any[],
    usePickerOptions?: IUsePickerOptions,
    fixInTop?: boolean,
    hide?: boolean | Function,
    hideInDropdown?: boolean,
    keys?: string[],
    placeholders?: string[],
    rangeSeparator?: string,
    onChange?: Function,
    useCheckAll?: boolean,
    nativeComponentEvent?: any, // 传入到表单控件的事件监听器
    nativeComponentProps?: any, // 传入到表单控件的属性
    [key: string]: any,
}

// 控件类型
export type IFormType = 'date-picker' | 'select' | 'cascader' | 'radio' | 'input' | 'input-range' | 'time-picker'

export type IUsePickerOptions = 'prev' | 'next' | ''


// 选项配置
export interface IProps {
    label?: string,
    value?: string,
    [key: string]: any,
}


/***************************** 基础配置 start *********************************/

// 筛选配置
export interface ICondition {
    ref?: string, // 组件引用 保存快筛时可能需要用到组件的saveView

    showTopRow?: boolean, // 顶部行显示性，包括快筛、自定义列等
    showQuickFilter?: boolean, // 快筛功能显示性，当showTopRow=false时失效
    showCustomColumn?: boolean, // 自定义列功能显示性，当showTopRow=false时失效
    showFormAction?: boolean, // 底部行右侧表单操作区显示性，包括下拉表单、查询按钮、重置按钮等
    showDropdown?: boolean, // 下拉表单功能显示性，当showFormAction=false时失效
    showSearch?: boolean, // 查询按钮显示性，当showFormAction=false时失效
    showReset?: boolean, // 重置表单按钮显示性，当showFormAction=false时失效
    alignSearch?: 'left' | 'right', // 查询按钮&&重置表单按钮显示位置
    
    form?: any, // 表单
    defaultForm?: any, // 默认表单 可用于重置表单
    formConfigs?: IFormConfigs, // 表单配置
    submitting?: boolean, // 表单提交状态
    complete?: boolean, // 全部加载完成状态
    error?: boolean, // 加载失败
    initing?: boolean, // 初始化状态 - 某些页面需要和submitting状态分开判断
    EmitChangeOnReset?: boolean, // 重置表单时是否触发表单项的更新方法(onChange)
    formProps?: IFormProps, // 传给表单的属性

    pageUri?: string, // 页面唯一标识 用于视图相关接口请求
    typeMap?: any, // 自定义列类型映射

    autoSave?: boolean, // 是否自动保存快筛
    saveParams?: any, // 自动保存快筛的参数, 当autoSave=true时必传
    autoUpdateDate?: string[], // 是否自动根据日期快捷操作来更新日期，是则将需要更新的字段传入
    
    events?: Record<string, Function>, // 事件映射 ConditionBuilder
    [key: string]: any,
}


// 传给表单的属性
export interface IFormProps {
    validate?: boolean, // 是否在点击查询按钮时进行表单校验
    [key: string]: any,
}


// 表单配置
export interface IFormConfigs {
    [key: string]: IFormConfig,
}

// 表单项配置
export interface IFormConfig extends IConfig {
    multiple?: boolean, // 多选
    sort?: number, // 排序
    props?: IConfigProps, // 选项配置
    // onChildChange?: Function, // 某些表单项在基础的配置中定义了onChange 但是在页面中又不想替换该处理方法 则可以使用onChildChange
    initWithIgnoreHide?: boolean, // 不管是否隐藏都要初始化表单项
    onInited?: Function, // 初始化完成后的回调 此时已有options列表
    tableColumn?: string, // 对应的表格列-过滤汇总列需要用到
    submitToArray?: boolean, // 提交的时候是否需要将该字段对应的表单内容格式化成数组
    submitToNumber?: boolean, // 提交的时候是否需要将该字段对应的表单内容格式化成数字
    cacheOptions?: any[], // 缓存的初始化获取的选项列表
    customSlot?: boolean, // 是否自定义渲染元素 - FormDialog特有
    [key: string]: any,
}


// 选项配置
export interface IConfigProps extends IProps {
    hideAll?: boolean, // 是否隐藏[全部]选项
    hasGather?: boolean, // 是否有[汇总]选项
    allLabel?: string, // [全部]选项的标签文本
    gatherLabel?: string, // [汇总]选项的标签文本
    getOptions?: IGetOptions, // 获取选项列表的方式
    clearOnOpen?: boolean, // 打开弹框时是否清除选项列表 - 只能应用在表单弹框组件
    resetOnOpen?: boolean, // 打开弹框时是否重置选项列表(需要cache) - 只能应用在表单弹框组件
    reinitOnOpen?: boolean, // 打开弹框时是否重新初始化选项列表 - 只能应用在表单弹框组件
    history?: boolean, // 是否开启历史模式 开启后需要根据历史记录排序选项列表
    cache?: boolean, // 是否缓存初始化时的选项列表
    [key: string]: any,
}

// 选项列表配置
export interface IGetOptions {
    module?: string, // action和state所在的模块 - 使用action的时候需要
    action?: string, // 调用vuex baseApi的action来获取选项列表
    state?: string, // 和上面的action配套使用，通过vuex state获取
    method?: string, // 调用自己定义的method获取
    api?: Function, // 通过调用api直接获取
    params?: any, // 传入请求的参数
    dataPath?: string, // 接口返回数据的路径 默认为'data'
}

/***************************** 基础配置 end *********************************/








/***************************** 额外功能配置 start *********************************/

// 表单项onChange的data
export interface IChangeData {
    key?: string, // 键
    value?: any, // 值
    form?: any, // 表单
    configs?: IFormConfigs, // 表单配置
    unresetValue?: boolean, // 是否不重置表单值，默认false:改变 true为不改变
    [key: string]: any,
}

// 表单项onChange需要请求的request参数
export interface IChangeRequest {
    childKey?: string, // 要更新选项列表的表单字段
    api?: Function,  // 请求api
    params?: any, // 请求参数
    unresetValue?: boolean, // 是否不重置表单值
    otherParentKeys?: string[], // 其他父级表单项的key 主要用于有两个父级同时控制子级的情况
    disabled?: boolean, // 手动设置disabled
    unresetDisabled?: boolean, // 是否不重新设置disabled
    [key: string]: any,
}


// 导出excel参数
export interface IExportExcel { 
    exportColumns?: any[], // 导出列
    autoSetExportColumns?: boolean, // 是否自动根据tableConfig设置导出列参数exportColumns 这样就不用传入exportColumns参数了
    exportType?: 'excel' | 'list',  // 类型 excel or 放入下载队列
    fileName?: string, // 文件名
    [key: string]: any,
}


// 格式化表单配置参数
export interface IGetFormatFormOptions { 
    addPagination?: boolean, // 是否添加分页参数
    updateByConfig?: boolean, // 是否需要根据表单配置来更新提交的表单
    // 转换日期数组成两个日期参数的配置
    convdates?: IConvdate[],
    [key: string]: any,
}


// 转换日期范围数组成接口需要的日期字段配置参数
export interface IConvdate {
    originKey: string, // 数组源key
    beginKeys: string[], // 要转换成的起始日期key数组
    endKeys: string[], // 要转换成的结束日期key数组
}

/***************************** 额外功能配置 end *********************************/
