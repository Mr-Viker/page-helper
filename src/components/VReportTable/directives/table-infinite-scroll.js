import {
    isHtmlElement,
    isFunction,
    isUndefined,
    isDefined
} from '@ewan/ewan-ui/src/utils/types';

const attributes = {
    delay: {
      type: Number,
      default: 200
    },
    distance: {
      type: Number,
      default: 200
    },
    disabled: {
      type: Boolean,
      default: false
    },
    immediate: {
      type: Boolean,
      default: false
    }
};

const getScrollOptions = (el, vm) => {
    if (!isHtmlElement(el)) return {};
  
    return Object.entries(attributes).reduce((map, [key, option]) => {
        const { type, default: defaultValue } = option;
        let value = el.getAttribute(`infinite-scroll-${key}`);
        value = isUndefined(vm[value]) ? value : vm[value];
        switch (type) {
            case Number:
                value = isUndefined(value) || value == null ? defaultValue : Number(value);
                value = Number.isNaN(value) ? defaultValue : value;
                break;
            case Boolean:
                value = isDefined(value) ? value === 'false' ? false : Boolean(value) : defaultValue;
                break;
            default:
                value = type(value);
        }
        map[key] = value;
        return map;
    }, {});
};



export default {
    inserted(el, binding, vnode) {
        if(!binding.arg) return;
        
        const cb = binding.value;
        const vm = vnode.context;
        const elScroll = el.querySelector('.el-table__body-wrapper');
        const { immediate, delay, distance } = getScrollOptions(el, vm);
        let timer;
        let oldScrollTop = 0;

        if(!isFunction(cb)) return;
        immediate && cb();

        elScroll && elScroll.addEventListener('scroll', ev => {
            const target = ev.target;
            const { disabled } = getScrollOptions(el, vm);
            if(disabled) {
                oldScrollTop = target.scrollTop;
                return;
            }

            // 向下滚动且距离底部在目标距离阈值内则加载
            if(target.scrollTop > oldScrollTop && target.scrollHeight - target.clientHeight - target.scrollTop <= distance) {
                clearTimeout(timer);
                timer = setTimeout(() => cb(), delay);
            }
            
            oldScrollTop = target.scrollTop;
        })
        
    },

}