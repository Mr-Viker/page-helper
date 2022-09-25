/**
 * 页面生成器
 * 自动初始化页面 请求报表接口、自定义列等
 */

import { createDecorator } from "vue-class-component";
import BasePage from "@/mixins/base-page";
import { recordBuilder } from "../utils";


export function PageBuilder(customMixin: any = BasePage) {
    return createDecorator((options) => {
        recordBuilder(options, {name: 'PageBuilder'});

        options.mixins.push(customMixin);
    });
}
