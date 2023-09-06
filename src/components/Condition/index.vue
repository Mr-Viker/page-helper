<template>
    <div class="admin-condition" v-clickoutside:el-popper="onClose">
        <!-- 顶部行 -->
        <slot name="condition-top-row" v-if="showTopRow">
            <div class="condition-top-row">
                
                <!-- 页面tab -->
                <slot name="condition-tab"></slot>

                <!-- 快筛 -->
                <slot name="condition-filter">
                    <admin-quick-filter v-if="showQuickFilter" class="condition-filter" :page-uri='pageUri' ref="adminQuickFilter"
                        :auto-save='autoSave' :save-params='saveParams' :auto-update-date='autoUpdateDate'
                        @save-view="$emit('quick-filter-save', $event)" @change="onQuickFilterChange"
                        >
                    </admin-quick-filter>
                </slot>

                <!-- 页面操作区 -->
                <slot name="condition-page-action">
                    <slot name="condition-page-action-prefix"></slot>
                    <!-- 自定义列 -->
                    <slot name="condition-custom-column">
                        <el-button v-if="showCustomColumn" class="btn-mini" icon='el-icon-menu' @click='customColumnDialogVisible = true'
                            v-stat='ADMIN_TA_MAP.CONDITION.BTN_CUSTOM'>自定义列</el-button>
                    </slot>
                    <slot name="condition-page-action-postfix"></slot>
                </slot>

            </div>
        </slot>

        <!-- 底部行 -->
        <slot name="condition-bottom-row">
            <div class="condition-bottom-row">

                <!-- 表单 -->
                <slot name="condition-form">
                    <div class="condition-form">
                        <slot name="condition-form-prefix"></slot>
                        <admin-form :form='form' :configs='formConfigs' :maxCountInTopForm='maxCountInTopForm' id="top-form" ref="adminForm" @submit='search'></admin-form>
                        <!-- 搜索重置按钮组 -->
                        <span class="condition-form-action-btns align-left" v-if="alignSearch === 'left'">
                            <el-button v-if="showSearch" class="btn-primary btn-mini" type="primary" size="mini" icon="el-icon-search" 
                                @click='search' :loading="submitting" v-stat='ADMIN_TA_MAP.CONDITION.SEARCH'>查询</el-button>
                            <el-popconfirm v-if="showReset" title="是否重置筛选条件？" @onConfirm='reset' v-stat:onConfirm='ADMIN_TA_MAP.CONDITION.RESET'>
                                <i slot="reference" class="iconfont iconqingkong1 icon-reset" title="重置筛选条件"></i>
                            </el-popconfirm>
                        </span>
                        <slot name="condition-form-postfix"></slot>
                    </div>
                </slot>
                

                <!-- 表单操作区 -->
                <slot name="condition-form-action">
                    <div class="condition-form-action" v-if="showFormAction">

                        <slot name="condition-form-action-prefix"></slot>

                        <!-- 下拉按钮 -->
                        <el-button v-if="showDropdown" class="condition-form-action-dropdown" type="text" :icon="dropdownVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" 
                            @click="dropdownVisible = !dropdownVisible" v-stat='ADMIN_TA_MAP.CONDITION.FILTER_ALL'>
                            所有筛选
                            <span class="badge">{{selectedFormItemCount}}</span>
                        </el-button>

                        <!-- 搜索重置按钮组 -->
                        <span class="condition-form-action-btns align-right" v-if="alignSearch === 'right'">
                            <el-button v-if="showSearch" class="btn-primary btn-mini" type="primary" size="mini" icon="el-icon-search" 
                                @click='search' :loading="submitting" v-stat='ADMIN_TA_MAP.CONDITION.SEARCH'>查询</el-button>
                            <el-popconfirm v-if="showReset" title="是否重置筛选条件？" @onConfirm='reset'>
                                <i slot="reference" class="iconfont iconqingkong1 icon-reset" title="重置筛选条件" v-stat='ADMIN_TA_MAP.CONDITION.RESET'></i>
                            </el-popconfirm>
                        </span>

                        <slot name="condition-form-action-postfix"></slot>

                    </div>
                </slot>
                
            </div>
        </slot>

        
        <!-- 下拉表单 -->
        <el-collapse-transition v-if="showDropdown">
            <div class="condition-dropdown-form" v-show='dropdownVisible'>
                <admin-form :form='form' :configs='formConfigs' :dropdown='true' id="dropdown-form" ref="dropdownAdminForm" @submit='search'></admin-form>
                <div class="dropdown-form-action" @click="onClose" v-stat='ADMIN_TA_MAP.CONDITION.FILTER_CLOSE'>
                    <el-button class="btn-hide-dropdown" icon='iconfont iconkuaishai_shouqi icon-up' size="mini" type="text">收起</el-button>
                </div>
            </div>
        </el-collapse-transition>
        
        <!-- 自定义列弹框 -->
        <admin-custom-column-dialog v-if="showTopRow && showCustomColumn" :visible='customColumnDialogVisible' ref="adminCustomColumnDialog"
            :page-uri='pageUri' :type-map='typeMap'
            @confirm="onCustomColumnConfirm" @close='customColumnDialogVisible = false'
            :selected-quick-filter='selectedQuickFilter'
            >
        </admin-custom-column-dialog>
    </div>
</template>


<script>
import Clickoutside from '@/utils/clickoutside';
import AdminQuickFilter from "@/components/QuickFilter";
import AdminForm from "@/components/Form";
import AdminCustomColumnDialog from "@/components/CustomColumnDialog";

import { isEmpty, deepClone, hasOwn } from '@/utils/util';


export default {
    name: 'AdminCondition',
    
    components: { AdminQuickFilter, AdminForm, AdminCustomColumnDialog },

    directives: { Clickoutside },
    
    props: {
        showTopRow: { type: Boolean, default: true }, // 顶部行显示性
        showQuickFilter: { type: Boolean, default: true }, // 快筛功能显示性
        showCustomColumn: { type: Boolean, default: true }, // 自定义列功能显示性
        showFormAction: { type: Boolean, default: true }, // 底部行右侧表单操作区显示性
        showDropdown: { type: Boolean, default: true }, // 下拉菜单功能显示性
        showSearch: { type: Boolean, default: true }, // 查询按钮显示性
        showReset: { type: Boolean, default: true }, // 重置表单按钮显示性
        alignSearch: { type: String, default: 'right' }, // 查询按钮&&重置表单按钮显示位置
        
        pageUri: { type: String }, // 页面唯一标识 用于视图相关接口请求
        form: { required: true, type: Object }, // 表单
        formConfigs: { required: true, type: Object }, // 表单配置
        maxCountInTopForm: { type: Number }, // 顶部表单最多显示多少个
        typeMap: { type: Object }, // 自定义列类型映射
        submitting: { type: Boolean }, // 表单提交状态
        EmitChangeOnReset: { type: Boolean, default: true }, // 重置表单时是否触发表单项的更新方法(onChange)

        autoSave: { type: Boolean, default: false }, // 是否自动保存快筛
        saveParams: { type: Object }, // 自动保存快筛的参数, 当autoSave=true时必传
        
        autoUpdateDate: { type: Array }, // 是否自动根据日期快捷操作来更新日期，是则将需要更新的字段传入
        // syncFormByQuickFilter: { type: Boolean, default: true }, // 点击快筛是否自动同步表单内容
    },

    data() {
        return {
            dropdownVisible: false, // 下拉表单显示性
            cacheForm: {}, // 缓存的干净的表单默认值 用于重置

            customColumnDialogVisible: false, // 自定义列弹框显示性
            selectedQuickFilter: {}, // 选中快筛项，自定义列需同步check状态
        }
    },

    computed: {
        // 已选筛选表单项数量
        // Viker TODO: 需要考虑input-range特殊情况
        selectedFormItemCount() {
            let count = 0;
            for(let [key, value] of Object.entries(this.form)) {
                if(hasOwn(this.formConfigs, key) && !isEmpty(value)) count++;
            }
            return count;
        },
    },

    
    created() {
        this.cacheForm = deepClone(this.form);
    },


    methods: {
        // 搜索
        search() {
            this.dropdownVisible = false;
            this.$emit('search', this.form);
            this.$refs.adminQuickFilter && this.$refs.adminQuickFilter.checkSelected({form: this.form});
        },

        // 重置表单 会触发表单项的更新回调(如果有的话)
        reset(refresh = true) {
            for(let [key, value] of Object.entries(this.cacheForm)) {
                this.form[key] = value;
                this.EmitChangeOnReset && this.$refs.adminForm.onChange(this.form[key], key);
            }
            refresh && this.search();
            this.$emit('reset', this.form);
        },


        /******************* quick fitler start *********************/

        // 切换选中快筛时触发
        onQuickFilterChange(tag) {
            this.selectedQuickFilter = tag;

            if(!isEmpty(this.selectedQuickFilter)) {
                // if(this.syncFormByQuickFilter && hasOwn(this.selectedQuickFilter, 'conditions')) this.updateForm(JSON.parse(this.selectedQuickFilter.conditions));
                this.$emit('quick-filter-change', this.selectedQuickFilter);
            }
        },

        // 更新表单
        // updateForm(data) {
        //     for(let [key, value] of Object.entries(data)) {
        //         this.form[key] = value;
        //     }
        // },

        /******************* quick fitler end *********************/


        /******************* custom column start *********************/

        // 自定义列更新后触发
        onCustomColumnConfirm(checkedProps) {
            this.$emit('custom-column-confirm', checkedProps);
            this.$refs.adminQuickFilter && this.$refs.adminQuickFilter.checkSelected({checkedProps});
        },

        /******************* custom column end *********************/


        /******************* public method *********************/

        // 保存视图 父组件可调用本方法来进行接口保存 也可自行实现
        // params: {name: string, conditions: any, showColumns: any}
        async saveView(params) {
            return await this.$refs.adminQuickFilter.saveView(params);
        },

        onClose() {
            this.dropdownVisible = false;
        }

    }

}
</script>


<style lang='scss' scoped>
.admin-condition {
    position: relative;
    padding: 16px 24px;
    background-color: #fff;
    
    .condition-top-row {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        .condition-filter {
            flex: 1;
            margin-right: 24px;
        }
    }


    .condition-bottom-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .condition-form {
            flex: 1;
            // max-width: calc(100vw - 250px);
            overflow: hidden;
            display: flex;
            align-items: center;
            height: 24px;
        }

        .condition-form-action {
            display: flex;
            height: 24px;

            .condition-form-action-dropdown {
                color: #333333;
                padding: 0;
                .badge {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background: #FD5451;
                    border-radius: 12px;
                    color: #fff;
                    font-size: 12px;
                    margin-left: 4px;
                    // vertical-align: text-bottom;
                    line-height: 16px;
                }
            }

        }
        
        .condition-form-action-btns {
            display: flex;
            align-items: center;
            height: 24px;
            margin-left: 10px;

            .icon-reset {
                margin-left: 10px;
                color: #666D7D;
                cursor: pointer;
                font-size: 24px;
                vertical-align: middle;
            }
        }
        
    }


    .condition-dropdown-form {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        z-index: 20;
        background-color: #fff;
        border-top: 1px solid #E7E8E9;
        box-shadow: 0px 4px 12px 0px rgba(27, 119, 252, 0.05);

        .dropdown-form-action {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            border-top: 1px solid #E7E8E9;
            cursor: pointer;

            .btn-hide-dropdown {
                font-size: 14px;
                color: #333333;

                ::v-deep .icon-up {
                    margin-right: 8px;
                    color: #767E91;
                    vertical-align: text-bottom;
                }
            }
        }
    }

    .btn-mini {
        padding: 4px 20px;
        border-radius: 3px;
    }

    .btn-primary {
        font-size: 14px;
        background-color: #0486fe;
        border-color: #0486fe;
    }
    
}
</style>
