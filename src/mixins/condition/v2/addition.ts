/**
 * Condition 附加类
 * 依赖mixins/condition/index.ts
 * 主要用于筛选表单与页面其他部分(如快筛、表格、导出等)的交互方法
 */
import { Vue, Component } from "vue-property-decorator";
import { prevPickerOptions, nextPickerOptions } from '@ewan/ewan-ui/packages/date-picker/src/picker/picker-options';
import {EXPORT_TYPE_LIST, isEmptyValue, isFunction, vdoingValue, isEqual, downloadByResBlob} from "@/utils/jy-util";
import moment from "moment";
import { ICondition, IExportExcel } from "@/mixins/condition/type";
import { funDownload } from "@/utils/download";
import { commonCheckFormItemChange, getNewDatesBySavedQuickFilter, isSelectedGather } from "./form-config/util";
import { ITableConfig } from "@/components/VReportTable/type";


@Component
export default class Addition extends Vue {

    /***************************** 快筛 start *******************************/

    // 点击快筛 需要检测关联表单项 如果父项表单值改变了 则需要触发父项的onChange获取其子项的选项列表
    // cacheForm: 快筛保存的表单 即viewData.condition
    checkFormItemChange(cacheForm: any, otherCheckParams: any = {}) {
        commonCheckFormItemChange({newForm: cacheForm, oldForm: this.condition.form, formConfigs: this.condition.formConfigs, unresetValue: true, ...otherCheckParams});
    }

    // 检测日期是否保存的是快捷操作 - 点击快筛时可能需要调用本方法
    // 如果日期值数组有第三个参数（即便捷操作参数）则需要赋值为当日点击该便捷操作后的日期（而不是保存的日期）
    // checkQuickFilterDate() {
    //     let { date } = this.condition.form;
    //     if(!isEmptyValue(date) && Array.isArray(date) && date.length > 2) {
    //         const config = this.condition.formConfigs.date;
    //         const pickerOptions = config.usePickerOptions == 'next' ? nextPickerOptions : (config.usePickerOptions == 'prev' ? prevPickerOptions : config.pickerOptions);
    //         if(!isEmptyValue(pickerOptions)) {
    //             const shortcut = pickerOptions.shortcuts.find(sc => sc.key === date[2]);
    //             this.condition.form.date = shortcut.onClick();
    //         }
    //     }
    // }

    // 兼容保存日期快捷操作字段为shortcutsType的视图
    compatibleQuickFilterDate({ field = 'date', shortcutsField = 'shortcutsType', startDate='startDate', endDate='endDate' } = {}){
        let shortcuts = this.condition.form[shortcutsField];
        console.log(shortcuts);
        if(isEmptyValue(shortcuts) || shortcuts === -1) {
            this.condition.form[field] = [this.condition.form[startDate] || '', this.condition.form[endDate] || '']
            console.log( this.condition.form[field]);
            console.log( this.condition.form);
        }else{
            const config = this.condition.formConfigs[field];
            const pickerOptions = config.usePickerOptions == 'next' ? nextPickerOptions : (config.usePickerOptions == 'prev' ? prevPickerOptions : config.pickerOptions);
            if(!isEmptyValue(pickerOptions)){
                // shortcuts = shortcuts > 7 ? 7 : shortcuts
                // this.condition.form[field] = pickerOptions.shortcuts[shortcuts].onClick()
                // const shortcut = pickerOptions.shortcuts.find(sc => sc.key === shortcuts);
                // this.condition.form[field] = shortcut.onClick()
                this.condition.form[field] = getNewDatesBySavedQuickFilter(shortcuts);
            }
        }
    }

    /***************************** 快筛 end *******************************/



    /***************************** 导出 start *******************************/

    public exporting: boolean = false; // 导出状态

    // 导出 - 需要弹框输入文件名称
    exportExcelWithPrompt(api: Function, options: IExportExcel = {}) {
        this.$prompt('', '导出文件名', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: `${this.$route.meta?.title}-${moment().format('YYYYMMDDHHmm')}`,
            inputPlaceholder: '请输入导出文件名称（1-48）',
            inputPattern: /^[\u4E00-\u9FA5\uf900-\ufa2d\w-]{1,48}$/,
            inputErrorMessage: '请正确填写导出文件名称',
            closeOnClickModal: false,
        }).then(({value, action}: any) => {
            options.fileName = value;
            this.exportExcelByApi(api, options);
        }).catch(() => {})
    }

    /**
     * 导出 需要传入请求导出数据的方法
     * @param api
     * @param exportColumns String 导出列
     * @param exportType String excel 直接导出excel | list 添加到下载队列 默认excel
     * @param fileName String 导出文件名
     */
    exportExcelByApi(api: Function, options: IExportExcel = {}) {
        this.exporting = true;

        // 获取请求参数（没有分页）
        let formatForm = this.getFormatForm(this.condition.form, {addPagination: false});
        // 如果设置了自动生成导出列=true则根据表格配置生成导出列参数exportColumns
        options.autoSetExportColumns && this.setExportColumnsByTableConfig(options, this.tableConfig);
        Object.assign(formatForm, options);

        api(formatForm)
        .then(res => {
            if (options.exportType === EXPORT_TYPE_LIST) {
                res.code === 0 ? this.$message.success('已添加到下载队列') : this.$message.error('导出失败，请联系管理员');
            } else {
                downloadByResBlob(res);
            }
        }).catch(err => {
            console.log('exportExcel error:', err);
            this.$message.error('导出失败，请联系管理员');
        }).finally(() => this.exporting = false)
    }


    // 根据表格配置设置导出列参数
    setExportColumnsByTableConfig(options: IExportExcel = {}, tableConfig: ITableConfig = {}) {
        options.exportColumns = [];
        tableConfig.columns?.map(column => !isEmptyValue(column.prop) && options.exportColumns.push(column.prop));
        return options;
    }

    /***************************** 导出 end *******************************/



    /***************************** 表单与表格的联动 start *********************/

    // 过滤掉表单项选择汇总对应的表格列 - 传入表格所有的列，返回过滤掉不显示(汇总)后的列数组 (即如果游戏组选择了汇总 则表格中游戏组该列则不显示)
    filterGatherColumns(columns: any[]) {
        const { form, formConfigs } = (this.condition as ICondition);
        const gatherColumns = []; // 获取汇总字段对应的列prop数组

        for(const [key, value] of Object.entries(form)) {
            if(isSelectedGather(value) && formConfigs[key]?.tableColumn) gatherColumns.push(formConfigs[key].tableColumn);
        }

        // 新增：统计维度 选了某(个|些)值后 其他值对应的列都不显示(即只显示选了值的列) 需要在每个option选项中有tableColumn属性
        for(const [key, config] of Object.entries(formConfigs)) {
            if(config.tableColumn === vdoingValue) {
                const { value = 'value' } = (config.props || {});
                const formValue = Array.isArray(form[key]) ? form[key] : [form[key]]; // 统一将值格式化成数组 方便判断
                config.options.forEach(option => !formValue.includes(option[value]) && gatherColumns.push(option.tableColumn))
            }
        }
        
        return columns.filter(column => !gatherColumns.includes(column.prop));
    }

    /***************************** 表单与表格的联动 end *********************/


}
