<template>
    <span ref="elSpan">{{showText}}</span>
</template>


<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";


@Component({
    name: 'format-text-span',
})
export default class FormatTextSpan extends Vue {
    @Prop(String) value!: string; // 必选 文本值
    @Prop(Number) parentWidth!: number; // 可选 父元素宽度 用于监听拖拽及获取父元素宽度 如果不传默认显示全部文本 相当于普通的span
    @Prop(Array) ignoreSiblingIndex!: number[]; // 可选 特殊情况下(比如兄弟元素会动态创建销毁)声明用于排除计算元素宽度的兄弟元素索引数组 主要解决watch value触发时兄弟元素还未销毁 还可以获取到宽度
    // @Prop(Boolean) delay!: boolean; // 可选 是否延迟更新


    public showText: string = ''; // 实际展示的文本
    private context: any = document.createElement('canvas').getContext('2d'); // 用于计算文本宽度


    mounted() {
        const unwatchValue = this.$watch(() => this.value, this.updateShowText, {immediate: true}); // 文本值有变化时更新
        const unwatchWidth = this.$watch(() => this.parentWidth, this.updateShowText); // 父元素宽度有变化时更新
        this.$on('hook:beforeDestroy', () => {
            unwatchValue();
            unwatchWidth();
        })
    }


    // 更新显示文本 原则：没传父元素宽度表示全部展示 传了父元素宽度则通过计算文本元素内容宽度和文本宽度来得出真正展示的文本值
    updateShowText() {
        if(!this.parentWidth) return this.showText = this.value;

        const elSpan: any = this.$refs.elSpan;
        this.setContextFont(elSpan);
        const totalTextWidth = this.getTextWidth(this.value); // 文本宽度
        const contentWidth = this.getContentWidth(elSpan); // 获取元素内容宽度

        // 如果文本宽度小于等于元素内容宽度 则直接显示完整的文本 否则需要截取文本适应元素的宽度 
        if(totalTextWidth <= contentWidth) return this.showText = this.value;

        const ellipsis = '...';
        const len = this.value.length;
        let showText = ''; // 实际展示文本
        // 二分 左右等长
        for(let i = Math.floor(len / 2); i > 0; i--) {
            showText = this.value.substring(0, i) + ellipsis + this.value.substring(len - i);
            if(this.getTextWidth(showText) <= contentWidth) break;
        }
        return this.showText = showText;
    }

    // 设置canvas context font
    setContextFont(el: HTMLElement) {
        const style = window.getComputedStyle(el);
        this.context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    }


    // 获取文本实际宽度 el: 文本外层元素
    getTextWidth(text:string = '') {
        return this.context.measureText(text).width;
    }


    // 获取元素内容宽度 如果元素自身有宽度 则直接获取(需要减去padding) 否则通过父元素减去兄弟元素的宽度(注意padding和margin)
    getContentWidth(el: HTMLElement) {
        if(el.clientWidth) return el.clientWidth - this.getPaddingByEl(el);

        const parent = el.parentElement;
        let otherWidth = 0;
        Array.prototype.forEach.call(parent.children, (child, index) => {
            if(child != el && !this.ignoreSiblingIndex?.includes(index)) otherWidth += child.offsetWidth + this.getMarginByEl(child);
        });
        // @ts-ignore
        // parent.children.forEach((child, index) => {
        //     if(child != el && !this.ignoreSiblingIndex?.includes(index)) otherWidth += child.offsetWidth + this.getMarginByEl(child);
        // })
        // const pw = this.parentWidth ? this.parentWidth - 1 : parent.clientWidth;
        return this.parentWidth - 1 - this.getPaddingByEl(parent) - otherWidth; // 1是td border-right的宽度
    }

    // 获取元素的左右padding
    getPaddingByEl(el: HTMLElement) {
        return parseInt(window.getComputedStyle(el).paddingLeft) + parseInt(window.getComputedStyle(el).paddingRight);
    }

    // 获取元素的左右margin
    getMarginByEl(el: HTMLElement) {
        return parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
    }
}
</script>


<style lang='scss' scoped>
</style>