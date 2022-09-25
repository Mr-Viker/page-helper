<template>
    <el-drawer custom-class='v-drawer' :visible="config.visible" v-bind="config.nativeProps" @close='onClose' v-loading='config.loading' ref="elDrawer">
    
        <div class="dialog-content">
            <div class="content-hd">
                <i class="el-icon-close icon-close pointer font-24" @click='onBtnCloseClick'></i>
                <slot name="content-hd-postfix"></slot>
                <input type="text" class="first-hide-input" />
            </div>
    
            <div class="content-bd">
                <el-tabs v-if="config.tabs.show" v-model='config.tabs.active' class="drawer-tabs" tab-position="left" type="card" v-on='config.tabs.events'>
                    <el-tab-pane :name='tab.name' v-for="tab in config.tabs.options" :key='tab.name'>
                        <template slot='label'><i :class="['iconfont', tab.icon]"></i><span>{{ tab.label }}</span></template>
                        <slot name="tabs-component" :tab='tab'>
                            <component :is="tab.component" v-bind='config.data' :ref='tab.name' v-if="config.tabs.active === tab.name"></component>
                        </slot>
                    </el-tab-pane>
                    )
                    })}
                </el-tabs>
            </div>
        </div>
    </el-drawer>
</template>

<script lang='tsx'>
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { IDrawerConfig } from "./type";


@Component({
    name: 'v-drawer',
})
export default class VDrawer extends Vue {
    @Prop(Object) config!: IDrawerConfig; // 弹框配置对象


    // 可通过config配置关闭方法 也可在调用组件的地方@close 默认操作为自动关闭弹框
    onClose() {
        this.$emit('close');
        this.config.visible = false;
    }

    // 点击关闭按钮 会自动触发close事件
    onBtnCloseClick() {
        // @ts-ignore
        this.$refs.elDrawer?.closeDrawer();
    }

}
</script>


<style lang='scss' scoped>
.v-drawer {

    .dialog-content {
        position: relative;
        flex: 1;


        .content-hd {
            padding: 10px 24px;
            background-color: #fff;
            height: 64px;
            display: flex;
            align-items: center;

            .icon-close {
                margin-right: 30px;
                vertical-align: top;
            }
        }


        .content-bd {
            background-color: #f6f7fb;
            height: calc(100vh - 64px);

            ::v-deep .drawer-tabs {
                height: 100%;

                .el-tabs__nav {
                    height: 100%;
                    background-color: #fff;
                    border: none;

                    .el-tabs__item {
                        border: none;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        height: auto;
                        line-height: normal;
                        .iconfont {
                            font-size: 22px;
                            margin-bottom: 6px;
                        }
                    }
                }

                .el-tabs__content {
                    height: 100%;
                    padding-top: 8px;
                    overflow-y: scroll;

                    .el-tab-pane {
                        height: 100%;
                        background-color: #fff;
                    }
                }

            }

        }

    }
}
</style>