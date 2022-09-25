/**
 * 表单弹框生成器
 * 提供renderFormDialog方法进行渲染
 */

import { createDecorator } from "vue-class-component";
import BaseDrawer from "@/mixins/drawer";
import { hasOwn, isFunction } from "@/utils/jy-util";
import { defineRenderMethod, recordBuilder } from "../utils";


interface IDrawerBuilderParams {
    renderMethodName?: string, // 渲染模板方法名
}

export function DrawerBuilder(customMixin: any = BaseDrawer, params: IDrawerBuilderParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderDrawer';
        recordBuilder(options, {name: 'DrawerBuilder', params, parent: 'RenderBuilder'});

        options.mixins.push(customMixin);
        
        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function() {
            const h = this.$createElement;
            return (
                <v-drawer config={this.drawerConfig} on={this.drawerConfig.events} ref='vDrawer' scopedSlots={this.renderDrawerScopedSlots?.()} />
            )
        })
    });
}