/**
 * Condition 表单配置模板类
 * FormDialog 表单配置模板类
 * 主要是筛选表单配置模板 分为两类：默认配置和业务便捷配置
 */
import { IFormConfig, IChangeData, IChangeRequest, IFormConfigs } from "@/mixins/condition/type";
import { gatherValue, hasOwn, isEmptyValue, isInvalidFormItemValue, jyAllValue, loopRemoveEmptyChildren, vdoingValue } from "@/utils/jy-util";


/***************************** 默认配置 start *******************************/

// select
export const defaultSelectConfig: IFormConfig = {
    formType: 'select',
    placeholder: '请选择',
    multiple: true,
    options: [],
    loading: false,
    useNew: true,
    reserveKeyword: true,
    mutexValues: [jyAllValue, gatherValue],
    useCheckAll: true,
}

// cascader
export const defaultCascaderConfig: IFormConfig = {
    formType: 'cascader',
    placeholder: '请选择',
    multiple: true,
    options: [],
    loading: false,
    useNew: true,
    showAllLevels: false,
    mutexValues: [jyAllValue, gatherValue],
    emitType: 1, // emit change的值 空|0表示默认(子节点) 1表示所有勾选的节点(包括父节点) 单选无效
    props: {
        emitPath: false, // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组
        multiple: true,
    },
}

// date-range
export const defaultDateConfig: IFormConfig = {
    formType: 'date-picker',
    type: 'daterange',
    usePickerOptions: 'prev',
    fixInTop: true, // 固定在表单行
    hideInDropdown: true, // 在下拉表单中隐藏该表单项
    keepAliveShortcut: true, // 保持左侧便捷操作激活状态
    clearable: false,
}

// time-picker
export const defaultTimeConfig: IFormConfig = {
    //@ts-ignore
    formType: 'time-picker',
    isRange: true,
    clearable: false,
}

// input
export const defaultInputConfig: IFormConfig = {
    formType: 'input',
    placeholder: '请输入',
}

// radio
export const defaultRadioConfig: IFormConfig = {
    formType: 'radio',
}

// input-range
export const defaultInputRangeConfig: IFormConfig = {
    formType: 'input-range',
    // keys: ['minValue', 'maxValue'],
    placeholders: ['最小值', '最大值'],
    genRules: (virtualRnageKey: string) => (form: any, configs: IFormConfigs) => {
        return [
            {
                validator: (rule, value, callback) => {
                    const minValue = form[configs[virtualRnageKey].keys[0]];
                    const maxValue = form[configs[virtualRnageKey].keys[1]];
                    // if(isEmptyValue(minValue) && isEmptyValue(maxValue)) return callback('最小值或最大值至少填一个');
                    if(!isEmptyValue(minValue) && !/^\d+$/.test(minValue)) return callback('最小值格式错误');
                    if(!isEmptyValue(maxValue) && !/^\d+$/.test(maxValue)) return callback('最大值格式错误');
                    if(!isEmptyValue(minValue) && !isEmptyValue(maxValue) && (parseFloat(minValue) > parseFloat(maxValue))) return callback('最小值不能大于最大值');
                    return callback();
                },
                trigger: 'change',
            },
        ]
    },
}


/***************************** 默认配置 end *******************************/
