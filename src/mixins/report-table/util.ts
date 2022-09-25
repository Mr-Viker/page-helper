import { ITableColumn } from "@/components/VReportTable/type";
import { getMapByObjArrs, isString } from "@/utils/jy-util";
import { mergeConfig } from "../condition/v2/form-config/util";


/**
 * 快速生成列配置数组 遍历参数对象 每一个键值对为一个列配置
 * @param params 快捷配置对象 {prop: label | ITableColumn}
 * @returns 表格列配置数组
 */
interface ICreateTableColumnsParams {
    [prop: string]: string | ITableColumn,
}
export const createTableColumns = (params: ICreateTableColumnsParams): ITableColumn[] => {
    const columns: ITableColumn[] = [];

    for(let [prop, column] of Object.entries(params)) {
        if(isString(column)) column = { label: column as string };
        columns.push({ prop, key: prop, width: 'auto', ...column as ITableColumn });
    }
    
    return columns;
}



/**
 * 合并静态列和动态列 如果静态列中有写动态列额外配置 则合并到动态列配置对象数组中
 * @param staticColumns 静态列
 * @param dynamicColumns 动态列
 * @returns 合并后的表格列
 */
export function mergeTableColumns(staticColumns: ITableColumn[], dynamicColumns: ITableColumn[]) {
    const extraConfigs: ITableColumn[] = []; // 写在静态列的用来给动态列添加额外属性的列配置对象数组
    const pureStaticColumns: ITableColumn[] = []; // 纯净的静态列配置对象数组

    staticColumns.map(col => col.isDynamicColumnExtraConfig ? extraConfigs.push(col) : pureStaticColumns.push(col));
    if(extraConfigs.length) {
        const dynamicColumnsMap = getMapByObjArrs(dynamicColumns, 'prop');
        extraConfigs.map(config => dynamicColumnsMap[config.prop] && mergeConfig(config, dynamicColumnsMap[config.prop]));
    }

    return pureStaticColumns.concat(dynamicColumns);
}