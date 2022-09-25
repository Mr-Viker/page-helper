import { hasOwn } from "@/utils/jy-util"


// 记录生成器的类型
interface IRecordBuilder {
    name: string, // 生成器名称
    // 生成器参数
    params?: {
        renderMethodName?: string,
        [key: string]: any,
    },
    parent?: string, // 父级生成器
}

/**
 * 将使用的生成器记录在页面选项中 可以通过this.$options.builders获取
 * @param options Vue组件的$options
 * @param builder 生成器数据
 */
export function recordBuilder(options: any, builder: IRecordBuilder) {
    (options.builders || (options.builders = [])).unshift(builder);
}


/**
 * 是否存在指定名称的组件生成器
 * @param options Vue组件的$options
 * @param builder 生成器名称
 * @returns 
 */
export function hasBuilder(options: any, builderName: string) {
    return options.builders?.some(builder => builder.name === builderName);
}


/**
 * 定义渲染模板方法包装器
 * @param options 
 * @param params 
 * @param fn 
 */
export function defineRenderMethod(options: any, renderMethodName: string, fn: Function) {
    if(!hasOwn(options.methods, renderMethodName)) {
        (options.methods || (options.methods = {}))[renderMethodName] = fn;
    }
}


/**
 * 渲染子生成器列表 需要使用call调用(用到了this)
 * @param options Vue组件的$options
 * @param parentName 父生成器名称
 * @returns 子生成器渲染内容
 */
export function renderChildBuilders(options: any, parentName: string) {
    return options.builders.map(b => {
        if(b.parent === parentName && hasOwn(b.params, 'renderMethodName')) return this[b.params.renderMethodName]();
    })
}