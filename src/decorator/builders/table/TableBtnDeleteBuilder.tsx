/**
 * 删除按钮生成器
 * 提供renderTableBtnDelete方法进行渲染 ex: {formatter: this.renderTableBtnDelete},
 */

import { createDecorator } from "vue-class-component";
import { evStop, hasOwn } from "@/utils/jy-util";
import { defineRenderMethod, recordBuilder } from "../utils";


// 删除按钮生成器参数
interface ITableBtnDeleteBuilderParams {
    renderMethodName?: string, // 渲染模板方法名
    disabled?: Function, // 按钮禁用方法
    // slotName?: string, // 插槽名称
}

export function TableBtnDeleteBuilder(params: ITableBtnDeleteBuilderParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderTableBtnDelete';
        recordBuilder(options, {name: 'TableBtnDeleteBuilder', params, parent: 'TableBuilder'});
        
        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function(row) {
            const h = this.$createElement;
            return (
                <el-popconfirm title="删除后将无法恢复，是否确认删除？" onOnConfirm={() => this.onTableBtnDeleteConfirm(row)}>
                    <el-button slot='reference' class="font-12" type="text" size="mini" 
                        loading={row.onTableBtnDeleteConfirming} disabled={params.disabled?.call(this, row)} >
                        删除
                    </el-button>
                </el-popconfirm>
            )
        })
    })
}
