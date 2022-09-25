/**
 * 分页生成器
 * 提供renderPagination方法进行渲染
 */

import { createDecorator } from "vue-class-component";
import BasePagination from "@/mixins/pagination";
import { hasOwn } from "@/utils/jy-util";
import { defineRenderMethod, recordBuilder } from "../utils";


interface IPaginationBuilderParams {
    renderMethodName?: string, // 渲染模板方法名
}

export function PaginationBuilder(customMixin: any = BasePagination, params: IPaginationBuilderParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderPagination';
        recordBuilder(options, {name: 'PaginationBuilder', params});

        options.mixins.push(customMixin);

        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function() {
            const h = this.$createElement;
            return (
                <div class="common-pagination-container">
                    <el-pagination currentPage={this.pagination.current} pageSize={this.pagination.size} pageSizes={this.pagination.sizes}
                        layout={this.pagination.layout} total={this.pagination.total} ref='elPagination'
                        on={{
                            'current-change': this.handleCurrentChange,
                            'size-change': this.handleSizeChange,
                        }}>
                    </el-pagination>
                </div>
            )
        })
    });
}