/**
 * Condition 表单初始化类
 * FormDialog 表单初始化类
 * 主要用于表单选项列表的加载
 * 将初始化的方法从index.ts中抽象出来进行解耦，方便未来form-dialog复用
 */

import Vue from "vue";
import { clearInvalidFormValue, getValueByDotKey, isEmptyValue, isFunction } from "@/utils/jy-util";
import { IFormConfig, IFormConfigs, IGetOptions } from "../../type";
import { isHide, setFormatOptions } from "./util";


// 初始化表单时的配置参数
export interface IInitFormParams {
    vm?: Vue, // 如果获取选项列表的方式为非直接api调用 则需要传页面实例来调用
    form?: any, // 当前表单 目前只用于判断初始化时表单项是否隐藏
}

/**
 * 初始化表单 主要是根据配置获取各个表单项的options
 * @param formConfigs 表单配置对象
 * @param initParams 初始化额外参数对象
 * @returns 初始化选项列表的promises
 */
export function commonInitBaseForm(formConfigs: IFormConfigs, initParams: IInitFormParams = {}) {
    let promises = [];
    for(let [key, config] of Object.entries(formConfigs)) {
        if(!config.initWithIgnoreHide && isHide(config, initParams.form)) continue; //如果表单项没有设置强制初始化&隐藏则会跳过初始化
        promises.push(commonInitFormItem(config, {...initParams, key}));
    }
    return promises;
}


// 初始化表单项时的配置参数
export interface IInitFormItemParams extends IInitFormParams {
    key?: string, // 表单项key 选填 如果不需要历史记录可以不传
}

/**
 * 初始化表单项 主要是初始化表单项的选项列表 并在初始化完成后调用onInited回调方法
 * @param config 表单配置项
 * @param initFormItemParams 初始化额外参数对象
 * @returns 
 */
export async function commonInitFormItem(config: IFormConfig, initFormItemParams: IInitFormItemParams = {}) {
    const options = await useGetOptions(config, initFormItemParams.vm);

    if(options && Array.isArray(options)) {
        await setFormatOptions(config, options, initFormItemParams.key);
        config.props?.cache && Vue.set(config, 'cacheOptions', [...config.options]);
    }
    
    config.onInited && config.onInited(config); // 提供一个初始化完成后可以处理表单项配置的hook
}


/**
 * 使用config.getOptions配置对象来调用相应的方式获取options
 * @param config 表单配置项
 * @param initFormItemParams 初始化额外参数对象
 * @returns 
 */
export async function useGetOptions(config: IFormConfig, vm: Vue) {
    const { getOptions } = config.props || {};
    let options = config.options;
    if(isEmptyValue(getOptions)) return options;
    
    Vue.set(config, 'loading', true);
    const params = clearInvalidFormValue(isFunction(getOptions.params) ? getOptions.params(vm) : getOptions.params);
    // api
    if(getOptions.api) {
        let res = await (getOptions.api)(params).finally(() => Vue.set(config, 'loading', false));
        if(res.code === 0) options = getValueByDotKey(res, (getOptions.dataPath || 'data'), []);

    // self method
    } else if(getOptions.method) {
        options = await vm[getOptions.method](params).finally(() => Vue.set(config, 'loading', false));

    // action
    } else if(getOptions.action) {
        // 为了兼容v1 所以加个判断：如果有配置store的module表示是v2
        if(getOptions.module) {
            await vm.$store.dispatch(`${getOptions.module}/${getOptions.action}`, params).finally(() => Vue.set(config, 'loading', false));
            options = vm.$store.state[getOptions.module][getOptions.state];
        } else {
            await vm[getOptions.action](params).finally(() => Vue.set(config, 'loading', false));
            options = vm[getOptions.state];
        }
    } else {
        Vue.set(config, 'loading', false);
    }

    return options;
}