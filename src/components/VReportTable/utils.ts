import { toPercent, toThousandDecimalFilter } from '@/filters';


// 获取值 根据列配置action动作来格式化
export function getTableCellFormatValue(row: any = {}, column: any = {}) {
    let value = '';
    switch(column.action) {
        // 百分比
        case '1':
            value = toPercent(row[column.prop]);
            break;
        // 千分计数 10000 => "10,000.00"
        case 'thousand':
            value = toThousandDecimalFilter(row[column.prop]);
            break;
        // 数值=>label的映射(非tag模式) { value => {label: xx} }
        case 'map':
            value = column.map[row[column.prop]]?.label;
            break;
        // [{label: xx, value: xx}]的映射(非tag模式) 
        case 'options':
            value = column.options?.find(option => option.value === row[column.prop])?.label;
            break;
        // 数组拼接成字符串展示
        case 'arrayToString':
            value = Array.isArray(row[column.prop]) ? row[column.prop].join(',') : row[column.prop];
            break;
        default:
            value = row[column.prop];
            break;
    }
    return value;
}
