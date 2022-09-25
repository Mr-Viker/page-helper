/**
 * Condition 基础类
 * 主要为admin-condition的配置内容及初始化，筛选表单内部的方法如请求前格式化及表单项的联动等
 */
import { Vue, Component, Mixins } from "vue-property-decorator";
import moment from "moment";
import { ICondition, IConvdate, IFormConfig, IFormConfigs, IGetFormatFormOptions } from "@/mixins/condition/type";
import Addition from "./addition";
import { clearInvalidFormValue, hasOwn, isEmptyValue, deepClone } from '@/utils/jy-util';
import { isMultiple, mergeConfig, setFormatOptions, updateFormatFormByPagination, updateFormatFormByTableSort } from "./form-config/util";
import { commonInitBaseForm } from "./form-config/init";


@Component
export default class Condition extends Mixins(Addition) {

    protected CONDITION_VERSION: number = 2; // 版本号 方便未来基于版本拓展

    // 配置参数
    protected condition: ICondition = {
        ref: 'adminCondition',
        // showTopRow: false, // 显示顶部行
        // showQuickFilter: false, // 显示快筛
        // showCustomColumn: false, // 显示自定义列入口
        // showDropdown: false, // 显示下拉表单入口

        autoUpdateDate: ['date'], // 点击快筛自动根据保存的便捷操作来更新日期的日期字段

        form: {}, // 表单
        defaultForm: {}, // 默认表单 一般情况可直接忽略该字段 某些特殊情况(从route中获取参数作为默认值)下需要用到

        submitting: false, // 提交表单状态(加载状态)
        complete: false, // 全部加载完成状态
        error: false, // 加载失败
        initing: false, // 初始化状态 - 某些页面需要和submitting状态分开判断

        formConfigs: {}, // 表单配置
        // 传给表单属性
        formProps: {
            validate: true,
        },
    };

    protected autoGenerateForm: boolean = true; // 是否自动根据formConfigs生成表单字段 如果页面自身想手动生成 则覆盖该值为false即可
    protected autoInitBaseForm: boolean = true; // 是否自动初始化基础表单(获取选项列表等) 如果页面自身想手动初始化 则覆盖该值为false即可



    created() {
        this.autoGenerateForm && this.generateFormByConfig(); // 生成表单内容
        this.autoInitBaseForm && this.initBaseForm(); // 初始化选项列表
    }



    /******************************* 初始化表单选项列表 start ********************************/

    // 根据表单配置自动生成表单默认内容
    private generateFormByConfig() {
        let defaultForm: any = {};
        for(let [key, config] of Object.entries(this.condition.formConfigs)) {
            if(config.formType === 'date-picker' && config.type === 'daterange') {
                defaultForm[key] = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), 0];
            } else if(config.formType === 'input-range') {
                defaultForm[config.keys[0]] = defaultForm[config.keys[1]] = '';
            } else {
                defaultForm[key] = isMultiple(config) ? [] : '';
            }
        }
        const mergeForm = mergeConfig(defaultForm, this.condition.form);
        this.condition.defaultForm = deepClone(mergeForm);
    }


    // 初始化表单 主要是根据配置获取各个表单项的options
    initBaseForm() {
        return commonInitBaseForm(this.condition.formConfigs, { vm: this, form: this.condition.form });
    }


    // 初始化传入的筛选表单参数 - 一般情况下用不到 适用于带参数跳转页面时调用
    initFormDefaultValue(params: any, resetOldForm: boolean = true) {
        if(isEmptyValue(params)) return;

        resetOldForm && this.resetFormByDefaultForm();

        for(let [key, value] of Object.entries(params)) {
            if(this.condition.form.hasOwnProperty(key)) {
                this.condition.form[key] = value;
            }
        }
    }

    // 重置表单为默认表单
    protected resetFormByDefaultForm() {
        if(isEmptyValue(this.condition.defaultForm)) return;
        this.condition.form = deepClone(this.condition.defaultForm);
    }

    /******************************* 初始化表单选项列表 end ********************************/



    /***************************** 查询时统一处理请求参数 start *********************/

    // 生成处理好的表单用于请求接口 1.删除无效值的字段  2.自动根据表单配置来更新表单值  3.自动将日期数组转化为后端需要的两个日期字段 及会根据传入的参数来判断是否需要添加排序和分页
    getFormatForm(originForm?: any, options: IGetFormatFormOptions = {}) : any {
        // 初步生成提交表单
        let form = deepClone(originForm || this.condition.form)
        let { addPagination = true, updateByConfig = true, convdates = [{originKey: 'date', beginKeys: ['startDate', 'beginDate'], endKeys: ['endDate']}] } = options;

        updateByConfig && this.updateFormatFormByFormConfigs(form, this.condition.formConfigs); // 根据表单配置更新表单
        this.updateFormatFormByConvdates(form, convdates); // 日期
        this.updateFormatFormByTableSort(form); // 排序
        addPagination && this.updateFormatFormByPagination(form); // 分页

        // 删除无效值的字段
        return clearInvalidFormValue(form);
    }

    // 根据配置更新将要提交的表单 1.将字符串转成数组
    private updateFormatFormByFormConfigs(form: any, formConfigs: IFormConfigs): any {
        for(let [key, value] of Object.entries(form)) {
            if(hasOwn(formConfigs, key) && formConfigs[key].submitToArray && !Array.isArray(value)) form[key] = [value];
            if(hasOwn(formConfigs, key) && formConfigs[key].submitToNumber && !isEmptyValue(value)) form[key] = Number(value);
        }
    }

    // 根据配置更新将要提交的表单 将日期数组转化为后端需要的两个日期字段
    private updateFormatFormByConvdates(form: any, convdates: IConvdate[]) {
        convdates.map(convdate => {
            if(hasOwn(form, convdate.originKey) && Array.isArray(form[convdate.originKey])) {
                convdate.beginKeys.map(beginKey => form[beginKey] = form[convdate.originKey][0]);
                convdate.endKeys.map(endKey => form[endKey] = form[convdate.originKey][1]);
                this.$delete(form, convdate.originKey);
            }
        })
    }

    // 根据表格排序更新将要提交的表单
    private updateFormatFormByTableSort(form: any) {
        return updateFormatFormByTableSort(form, this.sort);
    }

    // 根据分页更新将要提交的表单
    private updateFormatFormByPagination(form: any) {
        return updateFormatFormByPagination(form, this.pagination);
    }

    /***************************** 查询时统一处理请求参数 end *********************/

}
