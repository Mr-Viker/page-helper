/**
 * 请求状态装饰器
 * class decorator: target: constructor  recommend use target.prototype
 * method decorator: target: raw vue   recommend use this
 */

import { isEmptyValue } from "@/utils/jy-util";
import Vue from "vue";


// export的装饰器对象
const ConditionStatus: { Add?: Function, Update?: Function, Rest?: Function, Validate?: Function } = {};


/**
 * 重置状态
 * @param obj 要重置状态的对象
 */
 function resetStatus(obj: any) {
    obj.submitting = obj.complete = obj.error = false;
    obj.initing = true;
}



/**
 * 给类添加请求状态属性 [class]
 * 注：如果有使用condition mixins了就不需要手动加了 baseCondition已经自动加了
 * 因为vue class和普通的js class不同 所以尽量不要用Add注解来加属性
 * @returns 
 */
ConditionStatus.Add = () => {
    return (target: any) => {
        if(isEmptyValue(target.prototype.condition)) target.prototype.condition = {};
        resetStatus(target.prototype.condition);
    }
}


/**
 * 重置所有状态 [method]
 * @returns 
 */
 ConditionStatus.Rest = () => {
    return (target: Vue, key: string, descriptor: any) => {
        const original = descriptor.value;

        descriptor.value = function(...args: any[]) {
            resetStatus(this.condition);
            return original.apply(this, args);
        }
    }
}


/**
 * 给请求方法(getList)更新请求状态 [method]
 * @param autoCheckComplete 是否自动检测全部加载完成 值为true时被装饰的方法必须要return接口返回的result
 * @returns 
 */
ConditionStatus.Update = (autoCheckComplete: boolean = false) => {
    return (target: Vue, key: string, descriptor: any) => {
        const original = descriptor.value;

        descriptor.value = async function(...args: any[]) {
            try {
                if (this.condition.submitting) { return } else { this.condition.submitting = true }
                const res = await original.apply(this, args);
                // 检测是否全部加载完成
                if (autoCheckComplete && !isEmptyValue(res) && res.code === 0 && res.data.current >= res.data.pages) this.condition.complete = true;
                return res;

            } catch (error) {
                console.log('ConditionStatus.Update catch: ', error);
                this.condition.error = true;
            } finally {
                this.condition.submitting = false;
                if(this.condition.initing) this.condition.initing = false;
            }
        }
    }
}


/**
 * 验证
 * 如果还未生成dom则直接调用 不走验证逻辑
 * 注：如果需要初始化的请求就验证 必须在mounted调用 而不能在created调用(此时dom还未渲染) 
 * 可能出现的情况 有些表单项只在`adminForm`出现 有些表单项只在`dropdownAdminForm`出现 所以需要使用两个表单组件的验证
 * @returns 
 */
ConditionStatus.Validate = (refWrapper?: string) => {
    return (target: Vue, key: string, descriptor: any) => {
        const original = descriptor.value;

        descriptor.value = async function(...args: any[]) {
            const wrapper = refWrapper ? this.$refs[refWrapper] : this; // 某些特殊页面会有admin-condition的包装组件 比如计划列表页
            const elAdminForm = wrapper?.$refs.adminCondition?.$refs.adminForm?.$refs.elForm; // 底部固定表单行
            const elDropdownAdminForm = wrapper?.$refs.adminCondition?.$refs.dropdownAdminForm?.$refs.elForm; // 下拉表单行
            
            let totalErr = [];
            [elAdminForm, elDropdownAdminForm].forEach(component => {
                if(!isEmptyValue(component)) component.validate((valid: boolean, err: any[]) => { if(!valid) totalErr = err });
            })

            if(!isEmptyValue(totalErr)) return this.$message.warning(Object.values(totalErr)[0][0]?.message);
            return await original.apply(this, args);
        }
    }
}



export default ConditionStatus;