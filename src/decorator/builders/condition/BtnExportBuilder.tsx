/**
 * 导出按钮生成器
 * 提供renderBtnExport方法进行渲染
 */

import { createDecorator } from "vue-class-component";
import { hasOwn } from "@/utils/jy-util";
import { IExportExcel } from "@/mixins/condition/type";
import { defineRenderMethod, recordBuilder } from "../utils";


// 导出按钮生成器参数
interface IBtnExportBuilderParams {
    renderMethodName?: string, // 渲染模板方法名
    slotName?: string, // 插槽名称
    exportApi?: Function, // 导出接口方法
    opts?: IExportExcel, // 导出接口参数
}

export function BtnExportBuilder(params: IBtnExportBuilderParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderBtnExport';
        recordBuilder(options, {name: 'BtnExportBuilder', params, parent: 'ConditionBuilder'});

        defineRenderMethod(options, params.renderMethodName, function(exportApi: Function = params.exportApi, opts: IExportExcel = params.opts) {
            const h = this.$createElement;
            const slotName = params.slotName || (this.condition.showTopRow === false ? 'condition-form-action-postfix' : 'condition-page-action-postfix');
            return (
                <el-button slot={slotName} class='btn-export mgl-10' size="mini" icon="el-icon-printer" 
                    onClick={() => this.exportExcelWithPrompt(exportApi, opts)} 
                    loading={this.exporting}>
                    导出
                </el-button>
            )
        })
    })
}