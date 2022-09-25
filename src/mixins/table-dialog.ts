import { Vue, Component } from "vue-property-decorator";
import { ITableDialog } from '@/components/VTableDialog/type';
import { isEmptyValue } from "@/utils/jy-util";


@Component
export default class TableDialog extends Vue {

    // 弹框配置
    protected tableDialogConfig: ITableDialog = {
        visible: false,
        width: '800px',
        loading: false,
        submitting: false,

        type: 'default',
        title: '查看',
        api: null,
        form: {},
        columns: [], // 类型对应的列
        showPagination: false,
        showButtonBar: false,

        tableConfig: {
            stripe: true,
            border: true,
            columns: [], // 表格真正渲染的列 会自动根据当前弹框类型获取相应的xxColumns
        }
    };


    /******************************* 弹框操作 start ********************************/

    // 打开弹框
    openTableDialog(type: string = 'default', row: any = {}, cb?: Function) {
        this.setTableFormByRow(type, row);
        this.toggleTableDialog(true);
        cb && cb(row);
    }

    // 赋值给请求列表的表单
    protected setTableFormByRow(type: string, row: any) {
        this.setTableDialogType(type);
        let form = this.getTableForm();
        if(isEmptyValue(form)) return;

        for(let [key, value] of Object.entries(form)) {
            form[key] = row.hasOwnProperty(key) ? row[key] : '';
        }
    }

    protected setTableDialogType(type: string) {
        this.tableDialogConfig.type = type;
    }

    // 获取相应类型的表单
    protected getTableForm() {
        return this.tableDialogConfig[`${this.tableDialogConfig.type}Form`] || this.tableDialogConfig.form;
    }
    
    // 设置表单
    protected setTableForm(data: any) {
        const key = this.tableDialogConfig.type ? `${this.tableDialogConfig.type}Form` : 'form';
        this.tableDialogConfig[key] = data;
    }

    // 显示弹框
    toggleTableDialog(visible = true) {
        this.tableDialogConfig.visible = visible;
    }
    
    /******************************* 弹框操作 end ********************************/
    
}