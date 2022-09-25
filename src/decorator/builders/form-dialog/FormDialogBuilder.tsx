/**
 * 表单弹框生成器
 * 提供renderFormDialog方法进行渲染
 */

import { createDecorator } from "vue-class-component";
import BaseFormDialog from "@/mixins/form-dialog/v2";
import { hasOwn, isFunction } from "@/utils/jy-util";
import { defineRenderMethod, recordBuilder } from "../utils";


interface IFormDialogBuilderParams {
    renderMethodName?: string, // 渲染模板方法名
}

export function FormDialogBuilder(customMixin: any = BaseFormDialog, params: IFormDialogBuilderParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderFormDialog';
        recordBuilder(options, {name: 'FormDialogBuilder', params, parent: 'RenderBuilder'});

        options.mixins.push(customMixin);
        
        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function() {
            const h = this.$createElement;
            return (
                <v-form-dialog config={this.dialogConfig} on={this.dialogConfig.events} ref='vFormDialog' scopedSlots={this.renderFormDialogScopedSlots?.()}></v-form-dialog>
            )
        })
    });
}