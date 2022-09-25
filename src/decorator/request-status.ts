/**
 * 请求状态装饰器
 * class scope: target: constructor  recommend use target.prototype
 * method scope: target: raw vue   recommend use this
 */


/**
 * 给请求方法(通常为getList)添加请求状态控制
 * @scope method
 * @param updateKey 作为加载状态的key 挂载在this对象下
 * @returns 
 */
export function RequestStatus(updateKey: string) {
    return (target: Vue, key: string, descriptor: any) => {
        target[updateKey] = false;
        
        const original = descriptor.value;
        descriptor.value = async function(...args: any[]) {
            try {
                if (this[updateKey]) { return } else { this[updateKey] = true }
                return await original.apply(this, args);

            } catch (error) {
                console.log('RequestStatus catch: ', error);
            } finally {
                this[updateKey] = false;
            }
        }
    }
}


/**
 * 延迟调用方法
 * @scope method
 * @param time 延迟调用时间
 * @param timerKey 定时器key
 * @returns 
 */
export function Delay(time: number = 300, timerKey: string = '_timer') {
    return (target: Vue, key: string, descriptor: any) => {
        target[timerKey] = null;
        
        const original = descriptor.value;
        descriptor.value = async function(...args: any[]) {
            this[timerKey] && clearTimeout(this[timerKey]);
            this[timerKey] = setTimeout(() => original.apply(this, args), time);
        }
    }
}
