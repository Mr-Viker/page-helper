/**
 * render生成器
 * 类型：包含检索栏、表格、分页
 * 提供render方法进行渲染
 */

import { createDecorator } from "vue-class-component";
import { hasOwn } from "@/utils/jy-util";
import { hasBuilder, recordBuilder, renderChildBuilders } from "../utils";


export function RenderBuilder() {
    return createDecorator((options) => {
        recordBuilder(options, {name: 'RenderBuilder'});

        defineRenderTemplate(options);
    });
}


// 渲染模板
function defineRenderTemplate(options: any) {
    if(!hasOwn(options, 'render')) {
        options.render = function() {
            const h = this.$createElement;
            return (
                <section class={`${this.$options.name}-page v-page`}>
                    {this.renderCondition()}

                    <div class={['page-section-bd', this.condition.showTopRow === false ? 'has-simple-condition' : 'has-condition']} v-loading={this.condition.submitting}>
                        {this.renderTable()}
                        {this.renderPagination()}
                    </div>

                    {/* 渲染父生成器名称为RenderBuilder的生成器列表(如FormDialog) */}
                    {renderChildBuilders.call(this, options, 'RenderBuilder')}
                    {/* 暴露一个页面自定义附加组件的hook */}
                    {this.renderCustomPageComponent?.()}
                </section>
            )
        }
    }
}