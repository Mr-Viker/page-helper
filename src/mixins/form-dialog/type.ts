// 设置弹框表单方法的额外配置参数
export interface IUpdateDialogFormParams {
    triggerOnChange?: boolean, // 如果为true则表示会触发该表单项的onChange方法 但是不会去改变表单项对应的选中值
}

// 表单确认提交方法的额外配置参数
export interface IOnDialogConfirmParams {
    appendForm?: any, // 附加的表单内容 会合并默认的当前类型的表单内容 相同key以appendForm为准
    customForm?: any, // 自定义的提交表单内容 会覆盖默认的当前类型的表单内容 优先级最高
    callback?: Function, // 提交成功后的回调 这里是兼容v1版本 新版本更建议页面使用await调用该方法后自行处理
    callSearchOnSuccess?: boolean, // 是否在请求成功后调用search方法
}