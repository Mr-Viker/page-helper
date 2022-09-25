/**
 * 表单项-下载模板生成器
 */

import { createDecorator } from "vue-class-component";
import { hasOwn } from "@/utils/jy-util";
import { defineRenderMethod, recordBuilder } from "../../utils";


// 导出按钮生成器参数
interface IParams {
    renderMethodName?: string, // 渲染模板方法名
    downloadApi?: Function, // 下载模板api
}

export function FDDownloadTemplateBuilder(params: IParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderFDDownloadTemplate';
        recordBuilder(options, {name: 'FDDownloadTemplateBuilder', params, parent: 'FormDialogBuilder'});

        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function(scope) {
            const h = this.$createElement;
            return (
                <el-form-item class="form-item-container form-item-template" label="模板">
                    <el-button size="mini" onClick={() => this.exportExcelByApi(params.downloadApi)}>点击下载模板</el-button>
                </el-form-item>
            )
        })
    })
}
