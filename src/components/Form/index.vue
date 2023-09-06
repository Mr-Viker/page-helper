<template>
    <el-form :class="['admin-form', dropdown ? 'dropdown-form' : 'top-form']" :model="form" ref="elForm" :id="id" @submit.native.prevent>
        <template v-for='(config, key) in renderConfigs'>
            <slot :name="`form-item-${key}`" :item-key='key' :item-config='config' v-if="showFormItem(config)">

                <el-form-item :class="['form-item-container', `form-item-${key}`, `form-item-${config.formType}`]"
                    :key='key' :prop="key" :rules="rules(config)" :for="`${id}-${key}`">
                    <span slot="label" v-if='config.label'>{{config.label}}:</span>

                    <!-- select -->
                    <template v-if="config.formType == 'select'">
                        <el-select-v2 class="ewan-select" v-model="form[key]" @change='onChange($event, key)' :id="`${id}-${key}`"
                            v-bind="bindProps(config)" :clearable="clearable(config)" :disabled="disabled(config)" filterable
                            v-on="config.nativeComponentEvent" :options="config.options">
<!--                            <el-option v-for="option in config.options"-->
<!--                                :label="option[label(config)]"-->
<!--                                :value="option[value(config)]"-->
<!--                                :key="option[value(config)]"-->
<!--                                >-->
<!--                            </el-option>-->
                        </el-select-v2>
                    </template>

                    <!-- radio -->
                    <template v-if="config.formType == 'radio'">
                        <el-radio-group v-model="form[key]" @change='onChange($event, key)' v-bind="bindProps(config)" :disabled="disabled(config)" :id="`${id}-${key}`"
                            v-on="config.nativeComponentEvent" >
                            <el-radio-button v-for='option in config.options' :label="option[value(config)]" :key="option[value(config)]" :disabled="option.disabled">
                                {{option[label(config)]}}
                            </el-radio-button>
                        </el-radio-group>
                    </template>

                    <!-- input -->
                    <template v-if="config.formType == 'input'">
                        <el-input class="ewan-input" v-model.trim="form[key]" @change='onChange($event, key)' :id="`${id}-${key}`"
                            v-bind="bindProps(config)" :clearable="clearable(config)" :disabled="disabled(config)"
                            @keydown.native.enter.prevent.stop="$emit('submit')"
                            v-on="config.nativeComponentEvent"
                            >
                        </el-input>
                    </template>

                    <!-- 范围input -->
                    <template v-if="config.formType == 'input-range'">
                        <div class="input-range-container">
                            <el-input class="ewan-input" v-model.trim="form[config.keys[0]]" :placeholder='config.placeholders[0]' :id="`${id}-${key}`"
                                v-bind="bindProps(config)" @change='onRangeChange($event, key)' :clearable="clearable(config)" :disabled="disabled(config)"
                                @keydown.native.enter.prevent.stop="$emit('submit')"
                                v-on="config.nativeComponentEvent"
                                >
                            </el-input>
                            <span class="mgl-5 mgr-5">{{config.hasOwnProperty('rangeSeparator') ? config.rangeSeparator : '-'}}</span>
                            <el-input class="ewan-input" v-model.trim="form[config.keys[1]]" :placeholder='config.placeholders[1]'
                                v-bind="bindProps(config)" @change='onRangeChange($event, key)' :clearable="clearable(config)" :disabled="disabled(config)"
                                @keydown.native.enter.prevent.stop="$emit('submit')"
                                v-on="config.nativeComponentEvent"
                                >
                            </el-input>
                            <!-- <i v-if="!dropdown" @mousedown.prevent @click="clearInputRange(config, key)" class="el-input__icon el-icon-circle-close el-input__clear icon-input-range-clear"></i> -->
                        </div>
                    </template>

                    <!-- date-picker -->
                    <template v-if="config.formType == 'date-picker'">
                        <el-date-picker v-if="config.type == 'daterange'" v-model="form[key]" @change='onChange($event, key)' type="daterange"
                            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            value-format="yyyy-MM-dd" size='mini' unlink-panels
                            v-bind="bindProps(config)" :disabled="disabled(config)"
                            v-on="config.nativeComponentEvent"
                            >
                        </el-date-picker>
                        <el-date-picker v-else v-model="form[key]" @change='onChange($event, key)' placeholder="选择日期" size='mini'
                            v-bind="bindProps(config)" :disabled="disabled(config)"
                            v-on="config.nativeComponentEvent" >
                        </el-date-picker>
                    </template>

                    <!-- date-picker-range -->
                    <template v-if="config.formType == 'date-picker-range'">
                        <el-date-picker v-model="form[config.keys[0]]" :placeholder='config.placeholders[0]' @change='onRangeChange($event, key)' size='mini'
                            v-bind="bindProps(config)" :disabled="disabled(config)" v-on="config.nativeComponentEvent">
                        </el-date-picker>
                        <span class="mgl-5 mgr-5">{{config.hasOwnProperty('rangeSeparator') ? config.rangeSeparator : '-'}}</span>
                        <el-date-picker v-model="form[config.keys[1]]" :placeholder='config.placeholders[1]' @change='onRangeChange($event, key)' size='mini'
                            v-bind="bindProps(config)" :disabled="disabled(config)" v-on="config.nativeComponentEvent">
                        </el-date-picker>
                    </template>

                    <!-- cascader -->
                    <template v-if="config.formType == 'cascader'">
                        <el-cascader class="ewan-cascader" v-model="form[key]" :options="config.options" v-bind="bindProps(config)" :popper-class='key' :input-id="`${id}-${key}`"
                            @change='onChange($event, key)' :clearable="clearable(config)" :disabled="disabled(config)" filterable v-on="config.nativeComponentEvent">
                        </el-cascader>
                    </template>

                </el-form-item>

            </slot>
        </template>
    </el-form>
</template>


<script>
import { isEmpty, hasOwn } from '@/utils/util';
import Tools from "@/utils/tools";

export default {
    name: 'AdminForm',

    props: {
        form: { required: true, type: Object }, // 表单
        configs: { required: true, type: Object }, // 表单配置
        dropdown: { type: Boolean, default: false }, // 是否是下拉表单
        maxCountInTopForm: { type: Number, default: 8 }, // 顶部表单最多显示多少个
        id: { type: String, default: 'admin-form' }, // 表单ID
    },

    data() {
        return {
            renderConfigs: {}, // 实际渲染的表单配置 顶部表单和下拉表单不同
        }
    },

    watch: {
        // 监听form表单 如果有更新 则检测并更新renderConfigs
        form: {
            handler(newVal, oldVal) {
                for(let [key, config] of Object.entries(this.configs)) {
                    this.updateRenderConfigs(key, config);
                }
            },
            immediate: true,
            deep: true,
        }
    },


    methods: {
        label(config) { return config.props && config.props.label || 'label' },
        value(config) { return config.props && config.props.value || 'value' },
        clearable(config) { return config.hasOwnProperty('clearable') ? config.clearable : true },
        rules(config) { return Tools.isFunction(config.rules) ? config.rules(this.form, this.configs) : config.rules },
        disabled(config) { return Tools.isFunction(config.disabled) ? config.disabled(this.form, this.configs) : config.disabled },

        // 格式化option，添加value label
        // formatOptions(config){
        //     return config.options.map(option => ({
        //         ...option,
        //         value:option[this.value(config)],
        //         label:option[this.label(config)],
        //     }))
        // },
        // 表单项的显示性
        // 之所以没有放在上面的watch form中做hide的判断，是因为某些页面(如计划列表页)有多个子页面 切换子页面只改变hide的话没有改变form则不会触发watch的检测 所以hide单独拿出来
        showFormItem(config) { return Tools.isFunction(config.hide) ? !config.hide(this.form) : !config.hide },

        // 要传给子组件的属性
        bindProps(config) {
            let props = {};
            const ignore = [ 'formType', 'options', 'fixInTop', 'hide', 'hideInDropdown', 'rules', 'onChange', 'onChildChange', 'sort', 'placeholders', 'keys', 'nativeComponentEvent' ];
            for(let [key, value] of Object.entries(config)) {
                if(!ignore.includes(key)) props[key] = value;
            }
            return props;
        },

        // 检测并更新renderConfigs
        updateRenderConfigs(key, config) {
            // 主要防止某些特殊情况下更新了整个配置项但并不触发下面的set
            if(config !== this.renderConfigs[key]) this.$set(this.renderConfigs, key, config);

            // 下拉表单 只需要判断是否是下拉隐藏就好了
            if(this.dropdown) {
                // 如果下拉表单没有该字段 且该字段不是下拉隐藏的 则推入到下拉表单
                if( !hasOwn(this.renderConfigs, key) && !config.hideInDropdown) this.$set(this.renderConfigs, key, config);
                if( hasOwn(this.renderConfigs, key) && config.hideInDropdown ) this.$delete(this.renderConfigs, key);

            // 顶部表单 需要判断是否是一直显示/表单是否有值来控制显示性
            } else {
                // 如果顶部表单没有该字段 且该字段是固定显示的or值不为空且顶部表单长度没超过最大数量 则推入到顶部表单
                if( !hasOwn(this.renderConfigs, key) && (config.fixInTop || (!this.isEmptyValue(key) && this.canSafeAddToTopForm())) ) this.$set(this.renderConfigs, key, config);

                // 如果顶部表单有该字段 该字段不是固定显示且值为空或者超出最大数量 则从顶部表单删除
                if( hasOwn(this.renderConfigs, key) && !config.fixInTop && (this.isEmptyValue(key) || !this.canSafeAddToTopForm()) ) this.$delete(this.renderConfigs, key);
            }
        },

        // 判断顶部表单是否超过最大数量限制
        canSafeAddToTopForm() {
            return Object.keys(this.renderConfigs).length < this.maxCountInTopForm;
        },

        // 有更新的时候调用更新函数
        onChange(value, key) {
            if(!hasOwn(this.configs, key)) return;
            const config = this.configs[key];
            config.onChange && config.onChange({ value, key, form: this.form, configs: this.configs });
        },

        // 判断key对应的值是否是空的 会自动根据formType来判断
        isEmptyValue(key) {
            const config = this.configs[key];
            if(config.formType === 'input-range') {
                const value0 = this.form[config.keys[0]];
                const value1 = this.form[config.keys[1]];
                return isEmpty(value0) && isEmpty(value1);
            }
            return isEmpty(this.form[key]);
        },


        /************************* input-range **********************/

        // input-range 更新
        onRangeChange(value, key) {
            const config = this.configs[key];
            this.onChange([this.form[config.keys[0]], this.form[config.keys[1]]], key);
        },

        // 清空input-range的值 同时为了方便表单提交 则自动更新form中相应的两个值
        // clearInputRange(config, key) {
        //     this.form[config.keys[0]] = this.form[config.keys[1]] = '';
        //     this.onChange([this.form[config.keys[0]], this.form[config.keys[1]]], key);
        // }

    },

}
</script>


<style lang='scss' scoped>
.admin-form {
    display: flex;

    ::v-deep .el-form-item {
        margin-bottom: 0;
        height: 24px;

        .el-form-item__label {
            line-height: 24px;
            white-space: nowrap;
            font-weight: normal;
        }

        .el-form-item__content {
            line-height: 22px;
        }


        // el-date-picker
        .el-date-editor {
            max-width: 210px;
            height: 24px;
            padding: 0 10px;

            .el-input__icon {
                line-height: 24px;
            }
            // .el-range__close-icon {
            //     display: none;
            // }
        }


        .input-range-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 210px;

            .mgl-5 {
                margin-left: 5px;
            }
            .mgr-5 {
                margin-right: 5px;
            }

            .icon-input-range-clear {
                cursor: pointer;
                line-height: 24px;
            }
        }

    }

}



.top-form {
    flex-wrap: nowrap;

    ::v-deep .el-form-item {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #e5e9ed;
        border-radius: 12px;
        margin-right: 16px;
        padding: 0 10px;

        &.form-item-radio {
            background-color: #fff;
            padding: 0;
        }

        .el-form-item__label {
            padding: 0;
        }

        // el-select
        .el-select {
            .el-select__tags {
                max-width: 100% !important;
                .selected-labels {
                    margin-left: 5px;
                }
            }
            .el-select__input {
                margin-left: 5px;
            }
        }

        // el-cascader
        .el-cascader {
            .el-cascader__tags {
                width: 100%;
                .selected-labels {
                    margin-left: 5px;
                }
            }
            .el-cascader__search-input {
                background-color: #e5e9ed;
                margin-left: 5px;
            }
            .el-input__inner {
                background-color: #e5e9ed;
            }
        }

        // el-date-picker
        .el-date-editor {
            max-width: 190px;
            padding: 0 !important;

            &.el-date-editor--month {
                .el-input__inner {
                    padding-left: 30px;
                }
            }

            .el-range-input {
                background-color: #e5e9ed;
                border: none;
            }
            .el-range__icon {
                font-size: 15px;
            }
            .el-range-separator {
                line-height: 24px;
            }
        }

        // el-radio-group
        .el-radio-group {
            white-space: nowrap;

            .el-radio-button--mini .el-radio-button__inner {
                padding: 5px 20px;
                font-size: 12px;
            }
        }


        // common
        .el-input__inner {
            background-color: #e5e9ed;
            border: none;
            padding: 0 5px;
        }

        .el-input__suffix {
            display: none;
            right: 0;
            .el-input__icon {
                width: 15px;
            }
        }

        &:hover {
            .el-select__tags {
                max-width: calc(100% - 15px) !important;
            }
            .el-cascader__tags {
                width: calc(100% - 15px) !important;
            }
            .el-input__suffix {
                display: inline-block;
            }
        }

        // .icon-clear {
        //     position: absolute;
        //     z-index: auto;
        //     top: 5px;
        //     right: 0;
        //     color: #8290A3;
        //     cursor: pointer;
        // }

    }

}



.dropdown-form {
    flex-wrap: wrap;
    padding: 16px 24px;

    ::v-deep .el-form-item {
        flex: 0 0 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 16px;

        .el-form-item__label {
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .el-form-item__content {
            min-width: 210px;
        }

    }

}
</style>
