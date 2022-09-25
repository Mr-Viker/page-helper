import Vue from 'vue';
import { funDownload } from './download';


export const jyAllValue = 'all'; // jy全选值
export const gatherValue = -1; // 汇总值
export const NONEValue = 'NONE'; // 不限|无
export const EmptyStrValue = ''; // 空字符串
export const CustomValue = 'custom'; // 自定义值-一般用于前端逻辑处理
export const vdoingValue = 'vdoing'; // 统计维度

export const EXPORT_TYPE_EXCEL = 'excel'; // 导出类型 直接下载excel还是加入下载队列
export const EXPORT_TYPE_LIST = 'list'; // 导出类型 直接下载excel还是加入下载队列


// 深拷贝
export function deepClone<T>(source: T): T {
    if (!source || typeof source !== 'object') {
        throw new Error('[deepClone] error arguments')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj as T;
}



// 如果有空值字段则清除 - 用于请求前
export function clearInvalidFormValue(form: { [key:string]: any }): any {
    if(isEmptyValue(form)) return form;
    for(let [key, value] of Object.entries(form)) {
        if(isInvalidFormItemValue(value)) Vue.delete(form, key);
    }
    return form;
}


// 判断表单项的值是否是无效(即全部)的 ([] [jyAllValue] jyAllValue '' [''])
export function isInvalidFormItemValue(value: any) {
    const isAllValue = Array.isArray(value)
                            ? value.length === 1 && (value[0] === jyAllValue || isEmptyValue(value[0]))
                            : value === jyAllValue;
    return isAllValue || isEmptyValue(value);
}



// 判断是否是空值 undefined null '' [] {}
export function isEmptyValue(value: any) {
    let type = Object.prototype.toString.call(value);
    type = type.substring(1, type.length - 1).split(' ')[1];
    if(type === 'Null' || type === 'Undefined'
        || (type === 'String' && value === '')
        || (type === 'Array' && value.length <= 0)
        || (type === 'Object' && Object.keys(value).length <= 0)) {
            return true;
    }
    return false;
}

// 判断两个数组是否相等 如果数组项是引用类型(对象or数组) 则会判断是否指向的是同一地址(而不是遍历对象来判断每个key-value是否相等)
export function isEqualForArray(arr1: any[], arr2: any[]): boolean {
    if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    return arr1.length == arr2.length && arr1.every(item1 => arr2.includes(item1)) && arr2.every(item2 => arr1.includes(item2));
}


export const isEqual = function(value1: any, value2: any) {
    if (Array.isArray(value1) && Array.isArray(value2)) {
        return arrayEquals(value1, value2);
    }
    return looseEqual(value1, value2);
};

export const looseEqual = function(a: any, b: any) {
    const isObjectA = isObject(a);
    const isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
        return JSON.stringify(a) === JSON.stringify(b);
    } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b);
    } else {
        return false;
    }
};

export const arrayEquals = function(arrayA: any, arrayB: any) {
    arrayA = arrayA || [];
    arrayB = arrayB || [];

    if (arrayA.length !== arrayB.length) {
        return false;
    }

    for (let i = 0; i < arrayA.length; i++) {
        if (!looseEqual(arrayA[i], arrayB[i])) {
            return false;
        }
    }

    return true;
};


// 互斥处理
// vModel: 表单项  value: 选中值数组(需要检测的数组)  mutexValues: 互斥值
export function checkMutex(vModel: any[], values: any[], mutexValues: any[] = [0, 'NONE']) {
    if( values.length > 1 && values.some(item => mutexValues.includes(item)) ) {
        vModel.splice(0, values.length - 1);
    }
}


// 获取某个父级组件引用
export function getParentComponent(componentName: string) {
    //@ts-ignore
    var parent = this.$parent || this.$root;
    //@ts-ignore
    var name = parent.$options.componentName || parent.$options.name;

    while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
            //@ts-ignore
            name = parent.$options.componentName || parent.$options.name;
        }
    }

    return parent;
}


// 是否是引用类型
export function isReferType(value: any) {
    return Array.isArray(value) || Object.prototype.toString.call(value) == '[object Object]';
}

// 是否是对象类型
export function isObject(value: any) {
    return Object.prototype.toString.call(value) == '[object Object]';
}

// 是否是方法
export function isFunction(functionToCheck: any) {
    return Object.prototype.toString.call(functionToCheck) === '[object Function]';
};

// 是否是字符串
export function isString(value: any) {
    return Object.prototype.toString.call(value) === '[object String]';
};

// 是否是布尔类型
export function isBoolean(value: any) {
    return Object.prototype.toString.call(value) == '[object Boolean]';
}

// 是否包含指定属性
export function hasOwn(obj: any, key: string) {
    return isObject(obj) && Object.prototype.hasOwnProperty.call(obj, key);
}

export function isJSON(str: unknown) {
    if (typeof str === 'string') {
        try {
            const obj = JSON.parse(str);
            return !!(typeof obj == 'object' && obj);
        } catch (e) {
            return false;
        }
    }
    return false;
}

// 生成指定长度的从1递增的数组
export function getArrayByLength(length: number) {
    return [...(new Array(length + 1).keys())].slice(1);
}


export const TYPE_IMAGE = 'image';
export const TYPE_VIDEO = 'video';
export const TYPE_EXCEL = 'excel';

// 获取File的宽高时长信息
export function getFileInfo(file: File): any {
    return new Promise((resolve, reject) => {
        let info: any = {};
        const dataUrl = URL.createObjectURL(file);
        const type = getFileType(file);

        switch(type) {
            case TYPE_IMAGE:
                let image = new Image();
                image.onload = (e: any) => {
                    const { naturalWidth, naturalHeight } = e.path[0];
                    info = { width: naturalWidth, height: naturalHeight, type, detailType: file.type };
                    URL.revokeObjectURL(dataUrl);
                    resolve(info);
                }
                image.src = dataUrl;
                break;

            case TYPE_VIDEO:
                let video = document.createElement('video');
                video.addEventListener('loadedmetadata', (e: any) => {
                    const { videoWidth, videoHeight, duration } = e.path[0];
                    info = { width: videoWidth, height: videoHeight, duration, type, detailType: file.type };
                    URL.revokeObjectURL(dataUrl);
                    resolve(info);
                });
                video.src = dataUrl;
                break;

            default:
                reject(info);
                break;
        }
    })
}

// 获取文件类型
export function getFileType(file: File) {
    if(isEmptyValue(file)) return;
    const fileTypes = {
        [TYPE_IMAGE]: ['image/png', 'image/jpg', 'image/jpeg'],
        [TYPE_VIDEO]: ['video/mp4', 'video/avi', 'video/mpg', 'video/mpeg', 'image/gif'],
        [TYPE_EXCEL]: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    };
    for(let [key, value] of Object.entries(fileTypes)) {
        if(value.includes(file.type)) return key;
    }
}



// 将正常的表单格式化成formdata类型的表单
export function formatFormToFormData(form: {[key: string]: any}) {
    let formData = new FormData();
    for(let [key, value] of Object.entries(form)) {
        formData.append(key, value);
    }
    return formData;
}



// 在不改变对象地址的情况下清空对象
export function resetToEmptyObj(obj: any) {
    if(isEmptyValue(obj)) return;
    for(let key of Object.keys(obj)) Vue.delete(obj, key);
}


// 百分比转换成等值的数字
export function parsePercentToNumber(value: string): number {
    if(isEmptyValue(value)) return 0;
    if(/^\d+(\.\d+)?$/.test(value)) return parseFloat(value);
    return parseFloat(value) / 100 || 0;
}


/**
 * 根据key获取value 支持.嵌套
 * @param obj 对象
 * @param key 需要获取值对应的key
 * @param defaultValue 无法获取指定key的值时返回的默认值
 * @returns
 */
export function getValueByDotKey(obj: any, key: string, defaultValue: any = '-') {
    if(!isObject(obj) || !key || isEmptyValue(obj)) return defaultValue;
    if(hasOwn(obj, key)) return obj[key];

    const keys = key.split('.');
    for(let k of keys) {
        if(!isObject(obj) || !hasOwn(obj, k)) return defaultValue;
        obj = obj[k];
    }
    return obj;
}

// sleep
export async function sleep(time: number) {
    return await new Promise(resolve => setTimeout(resolve, time));
}


// 滚动到第一个错误表单项
export function scrollToError() {
    Vue.nextTick(() => {
        // @ts-ignore
        const elErrorFormItem = document.querySelector('div.el-form-item.is-error');
        elErrorFormItem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
}


// 获取指定页面下的指定按钮权限
export function hasPermission(routeName: string, btnPermissionName: string) {
    if(isEmptyValue(this?.$store)) {
        console.error('[hasPermission] please invoke the function as call');
        return;
    }
    const route = this?.$store?.state.permission.flatRoutes.find(route => route.name === routeName);
    return !!route?.props?.btn_status[btnPermissionName];
}


// 去除多余的children: []的属性
export function loopRemoveEmptyChildren(arr: any[] = [], childrenKey: string = 'children') {
    return arr.map(item => {
        if(hasOwn(item, childrenKey)) {
            if(isEmptyValue(item[childrenKey])) Vue.delete(item, childrenKey);
            loopRemoveEmptyChildren(item[childrenKey], childrenKey);
        }
        return item;
    })
}

// 便捷阻止事件冒泡
export function evStop(ev: Event) {
    ev.stopPropagation();
    return true;
}

// 便捷阻止事件默认行为
export function evPrevent(ev: Event) {
    ev.preventDefault();
    return true;
}


// 下载|导出
export async function exportExcel(api: Function, form: any = {}, cb?: Function) {
    const res = await api(form).catch(err => this.$message.error('导出失败，请联系管理员'));
    return downloadByResBlob(res, cb);
}

// 下载|导出回调 根据接口返回的文件流下载
export async function downloadByResBlob(res: any, cb?: Function) {
    const { data, status, headers, request } = res;
    if (status === 200 && headers['content-disposition']) {
        const fileDisposition = headers['content-disposition'].match(/filename=([a-zA-Z0-9%_]*)\.([a-zA-Z]*)/);
        if (fileDisposition && fileDisposition.length >= 3) {
            const fileName = decodeURIComponent(fileDisposition[1]);
            const fileType = fileDisposition[2];
            funDownload({
                content: request.response,
                fileName: `${fileName}.${fileType}`,
                fileType: fileType,
            }, cb);
        }
    }
}



// 根据对象数组中对象的某个属性值生成key=>item的映射map
export function getMapByObjArrs(arr: any[], key: string) {
    const map = {};
    arr.map(obj => map[obj[key]] = obj);
    return map;
}