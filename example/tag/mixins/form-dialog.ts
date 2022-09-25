import { Vue, Component, Mixins, Watch } from "vue-property-decorator";

import BaseFormDialog from '../../../src/mixins/form-dialog/v2';
import { IDialogConfig } from '../../../src/components/VFormDialog/type';
import { mergeConfig } from "../../../src/mixins/condition/v2/form-config/util";
import { defaultInputConfig, defaultRadioConfig, defaultSelectConfig } from "../../../src/mixins/condition/v2/form-config/template";
import { customType, status } from "../data/config";
import { isEmptyValue, getFileType } from "../../../src/utils/jy-util";



@Component
export default class FormDialog extends Mixins(BaseFormDialog) {

    // 弹框配置
    dialogConfig: IDialogConfig = {
        class: 'tag-dialog',
        width: '600px',
        columnCount: 1,

        createTitle: '新建固定标签',
        createForm: {
            labelName: '', //标签名称
            labelCategoryIds: [], //二级分类
            status: '', //状态
            appCategoryIds: [], // 关联游戏
        },

        editForm: {
            labelId: '',
            labelName: '', //标签名称
            labelCategoryIds: [], //二级分类
            status: '', //状态
            customType: '', //标签类型
            appCategoryIds: [], // 关联游戏
        },
        
        relateTitle: '设置关联游戏',
        relateForm: {
            labelIds: [],
            appCategoryIds: [],
        },

        importTitle: '导入标签',
        importForm: {
            file: '',
        },

        formConfigs: {
            labelName: mergeConfig(defaultInputConfig, {
                label: '标签名称',
                rules: [ { required: true, message: '不能为空' } ],
                disabled: this.isEditDialog,
                hide: form => this.isBatchRelateAppCateDialog() || this.isImportDialog(),
            }),
            labelCategoryIds: mergeConfig(defaultSelectConfig, {
                label: '所属二级分类',
                props: {
                    label: 'categoryName',
                    value: 'labelCategoryId',
                    hideAll: true,
                    reinitOnOpen: true,
                },
                rules: [ { type: 'array', required: true, message: '不能为空' } ],
                hide: form => this.isBatchRelateAppCateDialog() || this.isImportDialog(),
            }),
            customType: mergeConfig(defaultRadioConfig, {
                label: '标签类型',
                props: { hideAll: true },
                options: Object.values(customType),
                hide: form => !this.isEditDialog(),
            }),
            status: mergeConfig(defaultRadioConfig, {
                label: '状态',
                props: { hideAll: true },
                options: Object.values(status),
                hide: form => this.isBatchRelateAppCateDialog() || this.isImportDialog(),
            }),
            appCategoryIds: mergeConfig(defaultSelectConfig, {
                label: '关联游戏',
                props: {
                    getOptions: { module: 'material', action: 'getIndependentAppCateList', state: 'independentAppCateList' },
                    label: 'appCategoryName',
                    value: 'appCategoryId',
                    hideAll: true,
                    reinitOnOpen: true,
                },
                rules: [ { type: 'array', required: true, message: '不能为空' } ],
                hide: form => this.isImportDialog(),
            }),

            template: {
                label: '模板',
                customSlot: true,
                hide: form => !this.isImportDialog(),
            },
            file: {
                label: '导入',
                customSlot: true,
                rules: [ 
                    { required: true, message: '不能为空' },
                    { validator: (rule, value, callback) => getFileType(value) !== 'excel' ? callback('不允许的文件类型') : callback() },
                ],
                hide: form => !this.isImportDialog(),
            },
        }
    };

    // 批量关联游戏分类弹框
    isBatchRelateAppCateDialog() { return this.dialogConfig.type === 'relate' }
    
}