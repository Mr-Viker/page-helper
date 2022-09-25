/**
 * 表格生成器
 * 提供renderTable方法进行渲染
 */

import { createDecorator } from "vue-class-component";
import BaseReportTable from "@/mixins/report-table";
import { hasOwn } from "@/utils/jy-util";
import { noop } from "vue-class-component/lib/util";
import { defineRenderMethod, recordBuilder } from "../utils";


interface ITableBuilderParams {
    renderMethodName?: string, // 渲染模板方法名
    reportApi?: Function, // 请求报表数据接口方法
    useCustomHeight?: boolean, // 是否使用页面(mixin)自定义的表格高度 如果falsy则builder会自动添加一个自适应高度 true则不处理高度
}

export function TableBuilder(customMixin: any = BaseReportTable, params: ITableBuilderParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderTable';
        recordBuilder(options, {name: 'TableBuilder', params});

        options.mixins.push(customMixin, { 
            data() { 
                const tableConfig = params.useCustomHeight ? {} : { height: 'calc(100% - 48px - 8px)' };
                return { 
                    reportApi: params.reportApi || noop,
                    tableConfig, // 配合RenderBuilder的has-simple-condition|has-condition
                } 
            } 
        });

        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function() {
            const h = this.$createElement;
            return (
                <v-report-table data={this.reports} config={this.tableConfig} on={this.tableConfig.events} ref='vReportTable' 
                    scopedSlots={this.renderTableScopedSlots?.()}>
                </v-report-table>
            )
        })
    });
}