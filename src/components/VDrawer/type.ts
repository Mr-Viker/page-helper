export interface IDrawerConfig {
    visible?: boolean, // 显示状态
    loading?: boolean, // 是否正在加载中
    nativeProps?: any, // drawer原生属性
    data?: Record<string, any>, // 传入的数据 一般结构为{row: {}, conditionForm: {}}
    events?: Record<string, Function>, // 事件映射

    tabs?: {
        show?: boolean, // 是否显示tab
        active?: string, // 当前激活的tab
        options?: any[], // tab选项数组
        events?: Record<string, Function>, // tabs事件监听器
    }
    
    [key: string]: any,
}