/**
 * FormDialog 基础类
 * 主要为v-form-dialog的配置内容及初始化，表单内部的方法如请求前格式化及表单项的联动等
 * 注：因为和Condition共同基于admin-form组件，所以这里可以直接复用Condition下有关初始化、表单联动、设置表单项选项列表等功能
 */
import { Vue, Component, Mixins, Watch } from "vue-property-decorator";
import { IDialogConfig } from "@/components/VFormDialog/type";
import { commonInitBaseForm, commonInitFormItem } from "@/mixins/condition/v2/form-config/init";
import { clearInvalidFormValue, hasOwn, isEmptyValue, isReferType, deepClone } from "@/utils/jy-util";
import { commonCheckFormItemChange, getFormDefaultValue } from "@/mixins/condition/v2/form-config/util";
import { IOnDialogConfirmParams, IUpdateDialogFormParams } from "../type";

 
@Component
export default class FormDialog extends Vue {

    protected FORM_DIALOG_VERSION: number = 2; // 版本号 方便未来基于版本拓展
    
    // 弹框配置 注：使用v-form-dialog组件时必须加上ref='vFormDialog'
    protected dialogConfig: IDialogConfig = {
        visible: false, // 弹框显示性
        loading: false, // 加载状态
        submitting: false, // 提交状态
        columnCount: 2, // 列数
        width: '800px',
        type: 'create', // 当前表单类型
        createTitle: '创建', // [编辑]类型时显示的弹窗名称 
        editTitle: '编辑', // [编辑]类型时显示的弹窗名称
        formConfigs: {}, // 表单配置
    };

    protected initedFormDialog: boolean = false; // 表单弹框是否初始化完成


    /******************************* 初始化表单选项列表 start ********************************/

    // 首次打开时初始化
    @Watch('dialogConfig.visible', {immediate: true})
    async onWatchVisible(newVal: boolean) {
        if(newVal && !this.initedFormDialog) {
            this.initedFormDialog = true;
            this.dialogConfig.loading = true;
            await Promise.all(this.initDialogBaseForm()).finally(() => this.dialogConfig.loading = false);
            this.$emit('hook:afterInitDialogBaseForm');
        }
        this.$emit('hook:FormDialog.visible.change', newVal);
    }

    // 初始化表单 主要是根据配置获取各个表单项的options
    initDialogBaseForm() {
        return commonInitBaseForm(this.dialogConfig.formConfigs, { vm: this, form: this.getDialogForm() });
    }
    
    /******************************* 初始化表单选项列表 end ********************************/


    
    /******************************* 弹框操作 start ********************************/

    /**
     * 打开弹框
     * 步骤：1.设置弹框类型 2.设置表单内容 3.检测表单配置是否需要更新选项列表 4.显示弹框 5.触发回调
     * @param type 要设置的弹框类型
     * @param row 要赋值给弹框表单的数据
     * @param cb 打开后的回调
     */
    openFormDialog(type: string = 'create', row: any = {}, callback?: Function) {
        this.setDialogType(type);
        this.updateDialogForm(row);
        this.checkUpdateDialogOptions();
        this.toggleDialog(true);
        callback && callback(row);
    }
    
    /**
     * 设置弹框类型
     * @param type 弹框类型
     */
    protected setDialogType(type: string) {
        this.dialogConfig.type = type;
    }

    /**
     * 获取当前的弹框类型
     * @returns 当前弹框类型
     */
    protected getDialogType() {
        return this.dialogConfig.type;
    }

    /**
     * 设置当前类型的弹框表单数据
     * key以form的为准 如果row中该key有值则赋值给form 否则将该key对应的默认值赋值给form
     * @param row 要赋值给弹框表单的数据
     * @param otherParams 额外配置参数
     * @returns 
     */
    protected updateDialogForm(row: any = {}, otherParams: IUpdateDialogFormParams = {}) {
        let form = this.getDialogForm();
        if(isEmptyValue(form)) return;

        const { triggerOnChange = false } = otherParams;

        for(let [key, value] of Object.entries(form)) {
            form[key] = hasOwn(row, key) ? (isReferType(row[key]) ? deepClone(row[key]) : row[key]) : getFormDefaultValue(this.dialogConfig.formConfigs[key]);
        }
        triggerOnChange && commonCheckFormItemChange({newForm: form, oldForm: {}, formConfigs: this.dialogConfig.formConfigs, unresetValue: true});
        this.clearValidate();
    }

    /**
     * 获取相应类型的表单 默认为当前类型
     * @param type 表单的类型
     * @returns 弹框表单
     */
    protected getDialogForm(type?: string) {
        if(!type) type = this.getDialogType();
        const formKey = `${type}Form` || 'form';
        return this.dialogConfig[formKey];
    }
    
    /**
     * 全量设置整个弹框表单内容
     * @param data 表单内容
     */
    protected setDialogForm(form: any) {
        const formKey = `${this.getDialogType()}Form` || 'form';
        this.dialogConfig[formKey] = form;
    }
    
    // 生成处理好的表单用于请求接口 1.删除无效值的字段
    getDialogFormatForm(originForm?: any): any {
        // 初步生成提交表单
        let form = deepClone(originForm || this.getDialogForm());
        // 删除无效值的字段
        return clearInvalidFormValue(form);
    }
    

    /**
     * 检测是否有需要更新表单项的选项列表
     */
    protected checkUpdateDialogOptions() {
        for(let [key, config] of Object.entries(this.dialogConfig.formConfigs)) {
            const { clearOnOpen, resetOnOpen, reinitOnOpen } = config.props || {};
            if(clearOnOpen) config.options = [];
            if(resetOnOpen) config.options = Array.isArray(config.cacheOptions) ? [...config.cacheOptions] : [];
            if(reinitOnOpen) commonInitFormItem(config, {vm: this});
        }
    }

        
    /**
     * 切换弹框的显示性
     * @param visible 弹框显示性
     */
    toggleDialog(visible = true) {
        this.dialogConfig.visible = visible;
    }

    /**
     * 清空校验消息
     * @param refKey v-form-dialog组件的ref key
     */
    protected clearValidate(refKey: string = 'vFormDialog') {
        const vFormDialog: any = this.$refs[refKey];
        if(!vFormDialog) return console.warn('[v-form-dialog][clearValidate]: 建议在组件<v-form-dialog>加上属性ref="vFormDialog"');
        this.$nextTick(() => vFormDialog?.clearValidate());
    }
    

    /**
     * 点击提交按钮 确认提交表单的底层逻辑封装
     * @param api 请求接口
     * @param otherParams 额外配置参数
     * @returns 接口返回的结果
     */
    async onDialogConfirm(api: Function, otherParams: IOnDialogConfirmParams = {}) {
        if(this.dialogConfig.submitting) { return; } else { this.dialogConfig.submitting = true; }
        
        const { callback, appendForm, customForm, callSearchOnSuccess } = otherParams;
        const form = !isEmptyValue(customForm) ? customForm : isEmptyValue(appendForm) ? this.getDialogForm() : {...this.getDialogForm(), ...appendForm};
        const res = await (api)(form).finally(() => this.dialogConfig.submitting = false);

        if(res.code === 0) {
            this.$message.success('操作成功');
            this.toggleDialog(false);
            // 这里是兼容v1的callback写法 v2更建议页面使用await调用onDialogConfirm后自行处理
            callback ? callback(res) : (callSearchOnSuccess ? this.search() : '');
        }
        
        return res;
    }
    
    /******************************* 弹框操作 end ********************************/
    

    
    /******************************* 弹框便捷方法 start ********************************/

    isCreateDialog() { return this.getDialogType() === 'create' }
    isEditDialog() { return this.getDialogType() === 'edit' }
    isImportDialog() { return this.getDialogType() === 'import' }
    isDetailDialog() { return this.getDialogType() === 'detail' }
    
    /******************************* 弹框便捷方法 end ********************************/

}