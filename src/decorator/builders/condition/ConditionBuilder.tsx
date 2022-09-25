/**
 * 检索栏生成器
 * 提供renderCondition方法进行渲染
 */

import { createDecorator } from "vue-class-component";
import BaseCondition from "@/mixins/condition/v2";
import { hasOwn } from "@/utils/jy-util";
import { defineRenderMethod, hasBuilder, recordBuilder, renderChildBuilders } from "../utils";


// 检索栏生成器参数
interface IConditionBuilderParams {
    renderMethodName?: string, // 渲染模板方法名
}


export function CondititionBuilder(customMixin: any = BaseCondition, params: IConditionBuilderParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderCondition';
        recordBuilder(options, {name: 'ConditionBuilder', params});
        
        options.mixins.push(customMixin);

        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function() {
            const h = this.$createElement;
            if(!this.queryView) this.queryView = {}
            return (
                <admin-condition ref="adminCondition" props={this.condition} on={{ search: this.search, ...this.queryView, ...this.condition.events }}
                    scopedSlots={this.renderConditionScopedSlots?.()}>
                    {/* 渲染父生成器名称为ConditionBuilder的生成器列表(如FormDialog) */}
                    {renderChildBuilders.call(this, options, 'ConditionBuilder')}
                </admin-condition>
            )
        });
    });
}


// renderConditionScopedSlots方法返回值 即Condition组件的所有slot name
export interface IRenderConditionScopedSlotsReturn {
    'condition-top-row'?: any, // 顶部行

    'condition-tab'?: any, // 页面tab
    'condition-filter'?: any, // 快筛
    
    'condition-page-action'?: any, // 页面操作区
    'condition-page-action-prefix'?: any, // 页面操作区前
    'condition-custom-column'?: any, // 自定义列
    'condition-page-action-postfix'?: any, // 页面操作区后

    'condition-bottom-row'?: any, // 底部行

    'condition-form'?: any, // 表单
    'condition-form-prefix'?: any, // 表单前
    'condition-form-postfix'?: any, // 表单后

    'condition-form-action'?: any, // 表单操作区
    'condition-form-action-prefix'?: any, // 表单操作区前
    'condition-form-action-postfix'?: any, // 表单操作区后
}