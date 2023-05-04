/**
 * Condition 表单工具类
 * FormDialog 表单工具类
 * 主要用于表单的配置、联动等
 */
import Vue from "vue";
import { IFormConfig, IChangeData, IChangeRequest, IFormConfigs } from "@/mixins/condition/type";
import {
    clearInvalidFormValue,
    gatherValue,
    hasOwn,
    isEmptyValue,
    isFunction,
    isObject,
    jyAllValue,
    deepClone,
    isEqual,
    EmptyStrValue, NullValue
} from "@/utils/jy-util";
import { prevPickerOptions, nextPickerOptions } from '@ewan/ewan-ui/packages/date-picker/src/picker/picker-options';


// 合并默认配置和自定义配置
// 合并规则：字段名相同：1. 基本类型则直接覆盖  2. 引用类型则递归属性合并
export function mergeConfig(defaultConfig: IFormConfig, customConfig: IFormConfig) {
    let defaultValue, customValue;
    const keys = Object.keys(defaultConfig);

    keys.map(key => {
        defaultValue = defaultConfig[key];
        customValue = customConfig[key];

        if(!hasOwn(customConfig, key)) {
            Vue.set(customConfig, key, defaultValue)
        } else if(defaultValue !== customValue && isObject(defaultValue) && isObject(customValue)) {
            mergeConfig(defaultValue, customValue);
        }
    })

    return customConfig;
}



/******************************* 表单项联动 start ********************************/

// 重新获取选项列表 - 当父级表单项改变时子级表单项需要重新获取选项列表调用
// data:组件change事件的event数据  requests:需要触发更新选项列表的子项参数
export function onFormItemChange(data: IChangeData, requests: IChangeRequest | IChangeRequest[]) {
    const { key, form, configs } = data;

    if(!Array.isArray(requests)) requests = [requests];

    const promises = requests.map(async child => {
        const { childKey, api, params, otherParentKeys = [] } = child;
        const childConfig = configs[childKey];

        // @ts-ignore
        if(isEmptyValue(childConfig) || (isFunction(childConfig.hide) ? childConfig.hide(form) : childConfig.hide)) return;

        // 如果父级包含了汇总值 则子级只能是汇总值
        // 建议使用form[key]来判断而不是data.value 因为考虑到在onChange方法中可能会改变选中值，如果value为非引用类型，则在onChange中肯定是改变form[key]而非直接改变data.value
        if(key && isSelectedGather(form[key]) || otherParentKeys.some(other => hasOwn(configs, other) && isSelectedGather(form[other]))) {
            Vue.set(form, childKey, getFormDefaultValue(childConfig, true));
            Vue.set(childConfig, 'disabled', hasOwn(child, 'disabled') ? isDisabled(child) : true);

        } else {
            // 如果没有设置子级不重置值或子级不是[汇总]则重置回默认值
            if(!isEmptyValue(form[childKey]) && !data.unresetValue && !child.unresetValue && !isSelectedGather(form[childKey])) {
                Vue.set(form, childKey, getFormDefaultValue(childConfig));
            }
            // 解决表单弹框中重新设置disabled会覆盖config.disabled写的方法
            !child.unresetDisabled && Vue.set(childConfig, 'disabled', isDisabled(child));
            Vue.set(childConfig, 'loading', true);
            const res = await (api)(clearInvalidFormValue(params))
              .catch(() => setFormatOptions(childConfig, [], childKey))
              .finally(() => Vue.set(childConfig, 'loading', false));
            if(res?.code === 0) {
                await setFormatOptions(childConfig, res.data, childKey);
            }
            return res;
        }
    })

    return promises;
}

// 判断是否是选中汇总
export function isSelectedGather(value: any) {
    return Array.isArray(value) ? (value.length == 1 && value[0] == gatherValue) : value == gatherValue;
}

// 根据表单项配置获取表单项默认值
export function getFormDefaultValue(config: IFormConfig, onlyJudgeGather = false) {
    if(isEmptyValue(config?.props) || (!config.props.hasGather && config.props.hideAll)) return config?.multiple ? [] : '';
    const { hideAll, hasGather } = config.props;

    const defaultValue = hasGather && (hideAll || onlyJudgeGather) ? gatherValue : jyAllValue;
    return config.multiple ? [defaultValue] : defaultValue;
}


// 设置表单项的选项列表 自动根据formItem的配置信息检测是否需要全选和汇总选项
export async function setFormatOptions(config: IFormConfig, options: any[], key?: string) {
    Vue.set(config, 'options', getFormatOptions(config, options));
}

// 根据表单配置返回格式化后的选项列表
export function getFormatOptions(config: IFormConfig = {}, options: any[] = []) {
    const { label = 'label', value = 'value', hideAll, hasGather, allLabel = `全部${config.label || ''}`, gatherLabel = '汇总', customFormatOptions } = config.props || {};

    // 隐藏[全部]选项 兼容旧版本的空字符串[全部]选项
    if(hideAll) {
        options = options.filter(option => ![jyAllValue, EmptyStrValue, NullValue].includes(option[value]));
    // 如果要显示[全选]选项 则检测options是否已包含 如果没有则推入
    } else if(options.every(option => ![jyAllValue, EmptyStrValue, NullValue].includes(option[value]))) {
        options = [ {[label]: allLabel, [value]: jyAllValue} ].concat(options);
    }

    // 添加[汇总]选项
    if(hasGather && options.every(option => option[value] !== gatherValue)) {
        options = [ {[label]: gatherLabel, [value]: gatherValue} ].concat(options);
    // } else if(!hasGather && options.some(option => option[value] === gatherValue)) {
    //     options = options.filter(option => option[value] !== gatherValue);
    }

    // normalizeOptions(options, label, value); // 标准化options的格式(字段名)
    if(isFunction(customFormatOptions)) options = customFormatOptions(options); // 提供一个给调用者最后一次处理options的hook
    return options;
}

// 标准化options的格式(字段名) 因为admin-form改成使用select-v2(虚拟滚动) 所以所有options的格式都要改成label->value
// export function normalizeOptions(options: any[], labelKey: string, valueKey: string) {
//     if(labelKey !== 'label' || valueKey !== 'value') {
//         options.forEach(option => {
//             option.label = option[labelKey];
//             option.value = option[valueKey];
//         })
//     }
// }


// 检测表单项是否存在且显示
export function checkIsShowConfig(config: IFormConfig , form: string) {
    return !isEmptyValue(config) && !isHide(config, form);
}


// 判断表单项是否隐藏
export function isHide(config: IFormConfig, form: any = {}) {
    // @ts-ignore
    return isFunction(config.hide) ? config.hide(form) : config.hide;
}

// 判断表单项是否禁用
export function isDisabled(config: IFormConfig, form: any = {}) {
    // @ts-ignore
    return isFunction(config.disabled) ? config.disabled(form) : !!config.disabled;
}


// 判断表单项是否是多选
export function isMultiple(config: IFormConfig) {
    return config.multiple || config.props?.multiple;
}


export interface ICommonCheckFormItemChangeParams {
    newForm: any, // 新表单内容
    oldForm: any, // 旧表单内容
    formConfigs: IFormConfigs, // 表单配置
    unresetValue?: boolean, // 触发表单项onChange时是否不重置表单项对应的值为默认值
    forceEmitOnChange?: boolean, // 是否不管表单值有没变化 强制触发onChange方法(如果有的话)
}

// 检测关联表单项 如果父项表单值改变了 则触发父项的onChange获取其子项的选项列表
export function commonCheckFormItemChange(checkParams: ICommonCheckFormItemChangeParams) {
    const { newForm, oldForm, formConfigs, unresetValue = true, forceEmitOnChange = false } = checkParams;

    for(let [key, config] of Object.entries(formConfigs)) {
        if(config.hide || !isFunction(config?.onChange)) continue;
        const isChange = forceEmitOnChange || !isEqual(newForm[key], oldForm[key]);
        isChange && config.onChange({ key, value: newForm[key], form: newForm, configs: formConfigs, unresetValue });
    }
}


export function getNewDatesBySavedQuickFilter(shortcutKey: number) {
    return prevPickerOptions.shortcuts.find(sc => sc.key === shortcutKey)?.onClick() || [];
}


/******************************* 表单项联动 end ********************************/


// 根据table组件的sort格式化成接口需要的表单字段
export function updateFormatFormByTableSort(form: any, sort: any = {}) {
    if(sort.prop && sort.order) {
        form.orderBy = sort.prop;
        form.sort = sort.order;
        const res = form.sort.match(/^(.*)ending/);
        if(res) form.sort = res[1];
    }
    return form;
}

// 根据pagination组件的pagination格式化成接口需要的表单字段
export function updateFormatFormByPagination(form: any, pagination: any) {
    if(pagination) {
        form.current = pagination.current;
        form.size = pagination.size;
    }
    return form;
}
