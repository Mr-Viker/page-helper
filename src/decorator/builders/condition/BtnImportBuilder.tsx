/**
 * 导入按钮生成器
 * 提供renderBtnImport方法进行渲染
 */

import { createDecorator } from "vue-class-component";
import { hasOwn } from "@/utils/jy-util";
import { IExportExcel } from "@/mixins/condition/type";
import { defineRenderMethod, recordBuilder } from "../utils";


// 导入按钮生成器参数
interface IBtnImportBuilderParams {
    renderMethodName?: string, // 渲染模板方法名
    formDialogType?: string, // 要打开的表单弹框类型
    slotName?: string, // 插槽名称
}

export function BtnImportBuilder(params: IBtnImportBuilderParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderBtnImport';
        if(!hasOwn(params, 'formDialogType')) params.formDialogType = 'import';
        recordBuilder(options, {name: 'BtnImportBuilder', params, parent: 'ConditionBuilder'});

        defineRenderMethod(options, params.renderMethodName, function() {
            const h = this.$createElement;
            const slotName = params.slotName || (this.condition.showTopRow === false ? 'condition-form-action-postfix' : 'condition-page-action-postfix');
            return (
                <el-button slot={slotName} class='btn-import mgl-10' size="mini" icon="el-icon-document-add" onClick={() => this.openFormDialog(params.formDialogType)}>
                    导入
                </el-button>
            )
        })
    })
}