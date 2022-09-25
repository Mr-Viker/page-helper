/**
 * 快筛生成器
 */

import { createDecorator } from "vue-class-component";
import BaseQueryView from "@/mixins/query-view";
import { recordBuilder } from "../utils";


export function QueryViewBuilder(customMixin: any = BaseQueryView) {
    return createDecorator((options) => {
        recordBuilder(options, {name: 'QueryViewBuilder', parent: 'ConditionBuilder'});

        options.mixins.push(customMixin);
    });
}
