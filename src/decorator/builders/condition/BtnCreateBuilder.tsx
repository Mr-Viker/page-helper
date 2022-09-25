/**
 * 新建按钮生成器
 * 提供renderBtnCreate方法进行渲染
 */

import { createDecorator } from "vue-class-component";
import { hasOwn } from "@/utils/jy-util";
import { defineRenderMethod, recordBuilder } from "../utils";


// 新建按钮生成器参数
interface IBtnCreateBuilderParams {
    renderMethodName?: string, // 渲染模板方法名
    formDialogType?: string, // 要打开的表单弹框类型
    slotName?: string, // 插槽名称
    defaultForm?: any, // 创建时默认表单内容
}

export function BtnCreateBuilder(params: IBtnCreateBuilderParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderBtnCreate';
        if(!hasOwn(params, 'formDialogType')) params.formDialogType = 'create';
        recordBuilder(options, {name: 'BtnCreateBuilder', params, parent: 'ConditionBuilder'});

        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function() {
            const h = this.$createElement;
            const slotName = params.slotName || (this.condition.showTopRow === false ? 'condition-form-action-postfix' : 'condition-page-action-postfix');
            return (
                <el-button slot={slotName} class='btn-create' size="mini" onClick={() => this.openFormDialog(params.formDialogType, params.defaultForm)}>创建</el-button>
            )
        })
    })
}
