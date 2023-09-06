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
export type IFormType = 'date-picker' | 'select' | 'cascader' | 'radio' | 'input' | 'input-range'

export type IUsePickerOptions = 'prev' | 'next' | ''


// 选项配置
export interface IProps {
    label?: string,
    value?: string,
    [key: string]: any,
}