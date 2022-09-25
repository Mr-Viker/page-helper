/**
 * 配合VDrawer组件使用
 */
import { Vue, Component, Mixins } from "vue-property-decorator";
import { IDrawerConfig } from "@/components/VDrawer/type";


@Component
export default class Drawer extends Vue {

    // drawer配置
    drawerConfig: IDrawerConfig = {
        visible: false, // drawer显示性
        loading: false, // 加载状态
        // drawer原生属性
        nativeProps: {
            destroyOnClose: true, // 控制是否在关闭 Drawer 之后将子元素全部销毁
            withHeader: false, // 是否显示 header 栏
            size: '1200px', // 宽度
        },
        data: {}, // 需要传入给drawer的数据
        events: {}, // drawer事件监听器

        tabs: {
            show: true, // 是否显示tab
            active: '', // 当前激活的tab
            options: [], // tab选项数组
            events: {}, // tabs事件监听器
        },
    };
    

    /**
     * 打开drawer
     * 步骤：1.显示drawer 2.触发回调
     * @param row 要赋值给drawer表单的数据
     * @param cb 打开后的回调
     */
    openVDrawer(row: any = {}, callback?: Function) {
        this.setVDrawerData(row);
        this.toggleVDrawer(true);
        callback && callback(row);
    }

    /**
     * 全量设置整个drawer表单内容
     * @param data 表单内容
     */
    setVDrawerData(row: any) {
        this.drawerConfig.data = { row, conditionForm: this.condition.form, conditionFormatForm: this.getFormatForm() };
    }

    /**
     * 切换drawer的显示性 如果有tabs则重置回第一个
     * @param visible drawer显示性
     */
    toggleVDrawer(visible: boolean = true) {
        this.drawerConfig.visible = visible;
        if(visible && this.drawerConfig.tabs.show) this.drawerConfig.tabs.active = this.drawerConfig.tabs.options[0]?.name;
    }
    
}