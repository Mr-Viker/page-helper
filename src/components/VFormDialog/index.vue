<template>
    <el-dialog class='v-form-dialog' :custom-class="config.class" :title='title' :width="config.width" :visible="config.visible" 
        @close='close' v-bind='$attrs' :close-on-click-modal='false' append-to-body>

        <div class="dialog-bd" v-loading='config.loading'>
            <slot name="form-prefix"></slot>
            <slot>
                <admin-form v-if='form' :form='form' :configs='config.formConfigs' :dropdown='true' 
                    :class="'dialog-form-' + (config.columnCount || 1)" ref="adminForm"
                    @submit='confirm'>
                    <template v-for='(formConfig, key) in config.formConfigs'>
                        <template v-if="formConfig.customSlot" :slot="`form-item-${key}`">
                            <slot :name="`form-item-${key}`" :item-key='key' :item-config='formConfig' :form='form'></slot>
                        </template>
                    </template>
                </admin-form>
            </slot>
            <slot name="form-postfix"></slot>
        </div>

        <div slot="footer" class="dialog-ft flex-between" v-if="isShowFooter">
            <div class="ft-left"><slot name="ft-left"></slot></div>
            <div class="ft-btns">
                <el-button size="small" @click="close">{{config.closeText || '取消'}}</el-button>
                <el-button size="small" type="primary" @click="confirm" :loading="config.submitting">{{config.confirmText || '确定'}}</el-button>
            </div>
        </div>
    </el-dialog>
</template>


<script lang='ts'>
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { IDialogConfig } from "./type";
import { isFunction } from "@/utils/jy-util";


@Component({
    name: 'v-form-dialog',
})
export default class VFormDialog extends Vue {
    // @Prop(Boolean) visible!: boolean; // 弹框显示状态
    @Prop(Object) config!: IDialogConfig; // 弹框配置对象

    // protected cacheForm: any = {}; // 初始化时的forms vModel值 用于重置

    get title() { return this.config[`${this.config.type}Title`]; }

    get form() { return this.config[`${this.config.type}Form`] || this.config.form; }

    // 是否显示弹框底部按钮组
    get isShowFooter() {
        return isFunction(this.config.hideFooter) ? !this.config.hideFooter(this.form) : !this.config.hideFooter;
    }


    // 可通过config配置确认方法 也可在调用组件的地方@confirm
    confirm() {
        const adminForm: any = this.$refs.adminForm;

        if(adminForm) {
            adminForm.$refs.elForm.validate(valid => valid && this.$emit(`${this.config.type}-confirm`) );
        } else {
            this.$emit(`${this.config.type}-confirm`);
        }
    }

    // 可通过config配置关闭方法 也可在调用组件的地方@close 默认操作为自动关闭弹框且移除验证结果
    close() {
        this.$emit('close');
        this.config.visible = false;
        // this.clearValidate();
    }

    // 清空校验
    clearValidate() {
        // @ts-ignore
        this.$refs.adminForm?.$refs?.elForm.clearValidate();
    }

}
</script>


<style lang='scss' scoped>
.v-form-dialog {
    ::v-deep .el-dialog__header {
        padding-top: 16px;
        .el-dialog__headerbtn {
            top: 16px;
        }
    }

    ::v-deep .el-dialog__body {
        height: calc(100% - 50px - 66px);
        overflow-y: scroll;

        .admin-form {
            padding: 0;

            @for $i from 1 to 6 {
                &.dialog-form-#{$i} {
                    .form-item-container {
                        flex: 0 0 100%/$i;
                    }
                }
            }

            .el-form-item {
                .el-form-item__label {
                    font-size: 12px;
                    font-weight: bold;
                }

                .el-form-item__content {
                    flex: 1;
                    min-width: 0;
                }
            }

        }

        .file-form-cards {
            // margin-top: 40px;
            
            .form-card {
                border: 1px solid #D9D9D9;
                border-radius: 6px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 10px;
                margin-bottom: 10px;

                .card-hd {
                    // font-size: 40px;
                    color: #9a9a9a;
                    padding: 0 14px;
                }

                .card-bd {
                    flex: 1;
                    
                    .el-form-item {
                        // margin-bottom: 5px;
                        .el-form-item__label {
                            width: 60px;
                        }
                    }
                }
            }
        }
        
    }

}
</style>