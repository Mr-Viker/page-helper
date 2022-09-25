/**
 * 新建按钮生成器
 * 提供renderTableBtnEdit方法进行渲染 ex: {formatter: this.renderTableBtnEdit},
 */

import { createDecorator } from "vue-class-component";
import { evStop, hasOwn } from "@/utils/jy-util";
import { defineRenderMethod, recordBuilder } from "../utils";


// 导出按钮生成器参数
interface ITableBtnEditBuilderParams {
    renderMethodName?: string, // 渲染模板方法名
    formDialogType?: string, // 要打开的表单弹框类型
    // slotName?: string, // 插槽名称
}

export function TableBtnEditBuilder(params: ITableBtnEditBuilderParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderTableBtnEdit';
        if(!hasOwn(params, 'formDialogType')) params.formDialogType = 'edit';
        recordBuilder(options, {name: 'TableBtnEditBuilder', params, parent: 'TableBuilder'});

        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function(row) {
            const h = this.$createElement;
            return (
                <el-button class="font-12 mgr-10" type="text" size="mini" icon='el-icon-edit' onClick={ev => evStop(ev) && this.openFormDialog(params.formDialogType, row)}>编辑</el-button>
            )
        })
    })
}
