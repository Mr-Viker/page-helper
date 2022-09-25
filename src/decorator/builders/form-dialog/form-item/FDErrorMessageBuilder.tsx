/**
 * 表单项-错误消息生成器
 * dialogConfig.formConfigs.errorMessage: {
 *    label: '错误消息',
 *    customSlot: true,
 *    value: '', // 后端返回的错误消息html
 * }
 */

import { createDecorator } from "vue-class-component";
import { hasOwn, isEmptyValue } from "@/utils/jy-util";
import { defineRenderMethod, recordBuilder } from "../../utils";


// 导出按钮生成器参数
interface IParams {
    renderMethodName?: string, // 渲染模板方法名
}

export function FDErrorMessageBuilder(params: IParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderFDErrorMessage';
        recordBuilder(options, {name: 'FDErrorMessageBuilder', params, parent: 'FormDialogBuilder'});

        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function(scope: any) {
            const h = this.$createElement;
            if(!isEmptyValue(this.dialogConfig.formConfigs.errorMessage.value)) {
                return (
                    <el-form-item class="form-item-container form-item-errorMessage" label={scope.itemConfig.label}>
                        <div class="text-danger" domPropsInnerHTML={this.dialogConfig.formConfigs.errorMessage.value}></div>
                    </el-form-item>
                )
            } else {
                return (<span></span>)
            }
        })
    })
}
