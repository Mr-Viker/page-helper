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


    // 渲染tabs
    renderTabs() {
        return (
            <el-tabs v-model={this.config.tabs.active} class="drawer-tabs" tab-position="left" type="card" on={this.config.tabs.events}>
                {this.config.tabs.options.map(tab => {
                    const TabComp = tab.component; // tab组件
                    return (
                        <el-tab-pane name={tab.name} key={tab.name}>
                            <template slot='label'><i class={['iconfont', tab.icon]}></i><span>{tab.label}</span></template>
                            <slot name="tabs-component" tab={tab}>
                                {this.config.tabs.active === tab.name && (<TabComp props={this.config.data} ref={tab.name} />)}
                            </slot>
                        </el-tab-pane>
                    )
                })}
            </el-tabs>
        )
    }

    render() {
        return (
            <el-drawer custom-class='v-drawer' 
                props={{visible: this.config.visible, ...this.config.nativeProps}} 
                onClose={this.onClose} 
                v-loading={this.config.loading} 
                ref="elDrawer">

                <div class="dialog-content">
                    <div class="content-hd">
                        <i class="el-icon-close icon-close pointer font-24" onClick={this.onBtnCloseClick}></i>
                        <slot name="content-hd-postfix"></slot>
                        <input type="text" class="first-hide-input" />
                    </div>

                    <div class="content-bd">
                        {this.config.tabs.show && this.renderTabs()}
                    </div>
                </div>
            </el-drawer>
        )
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