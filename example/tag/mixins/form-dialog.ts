import { Vue, Component, Mixins, Watch } from "vue-property-decorator";
import { BaseFormDialog, IDialogConfig, mergeConfig, defaultInputConfig, defaultRadioConfig, defaultSelectConfig } from '../../../dist';


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

        }
    };

    // 批量关联游戏分类弹框
    isBatchRelateAppCateDialog() { return this.dialogConfig.type === 'relate' }

}
