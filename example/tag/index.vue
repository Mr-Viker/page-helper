<template>
    <section class="tag-page v-page" v-loading='condition.submitting'>
        <div class="page-hd">
            <admin-condition v-bind="condition" @search='search' ref="adminCondition">
                <template slot="condition-form-action-postfix">
                    <el-button class="mgl-10" size="mini" @click="openFormDialog('create', {status: 1})">新建固定标签</el-button>
                    <el-button class="mgl-10" size="mini" :disabled="!batchRows.length" @click="onRelateAppCateClick">关联游戏</el-button>
                    <el-button class="mgl-10" size="mini" @click="openFormDialog('import')">导入</el-button>
                </template>
            </admin-condition>
        </div>

        <div class="page-bd page-section-bd has-simple-condition">
            <v-report-table :data='reports' :config='tableConfig' ref='vReportTable' @selection-change='onSelectionChange'>
                <!-- 操作 -->
                <el-table-column-auto slot='el-table-column-action' slot-scope="config" v-bind="config.column"
                    :class-name="`table-column-${config.columnIndex} cell-auto`" :autoFit='true' :key='config.column.key' :data='config.data'>
                    <template slot-scope="scope">
                        <el-button class="font-12 mgr-10" type="text" size="mini" icon='el-icon-edit' @click.stop="openFormDialog('edit', scope.row)">编辑</el-button>
                        <el-popconfirm title="确定要删除吗？" @onConfirm='onDelete(scope.row.labelId)'>
                            <el-button slot="reference" class="font-12" type="text" size="mini">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column-auto>
            </v-report-table>

            <div class="common-pagination-container">
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
                    :current-page="pagination.current" :page-size="pagination.size" :page-sizes="pagination.sizes"
                    :layout="pagination.layout" :total="pagination.total">
                </el-pagination>
            </div>

        </div>


        <!-- <TagInfo
            :visible="dialogType.includes('TagInfo')"
            :info="dialogInfo.TagInfo"
            @success="getReports"
            @close-dialog="closeDialog('TagInfo')"
        ></TagInfo> -->

       <v-form-dialog :config='dialogConfig' ref="vFormDialog" 
            @create-confirm='onCreateConfirm' @edit-confirm='onEditConfirm' @relate-confirm='onRelateConfirm' 
            @import-confirm='onImportConfirm' @close='resetDialog'>
            <!-- 模板 -->
            <el-form-item class="form-item-container form-item-template" slot="form-item-template" label="模板">
                <el-button size="mini" @click="onBtnDownloadClick">点击下载模板</el-button>
            </el-form-item>

            <!-- 导入 -->
            <el-form-item class="form-item-container form-item-file" slot="form-item-file" prop='file' :label="scope.itemConfig.label" 
                slot-scope="scope" :rules="scope.itemConfig.rules">
                <input class="hide" v-model="scope.form.file" />
                <el-upload class="file-uploader" ref="elUpload" v-bind="uploadConfig" :on-change='onFileChange' :on-remove='onFileRemove'>
                    <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
                </el-upload>
            </el-form-item>
       </v-form-dialog>
    </section>
</template>


<script lang='ts'>
import { Vue, Component, Mixins } from "vue-property-decorator";

import CommonPagination from '../../src/mixins/pagination';
import ReportTable from './mixins/report-table';
import Condition from './mixins/condition';
import FormDialog from './mixins/form-dialog';



import { commonInitFormItem } from "../../src/mixins/condition/v2/form-config/init";
import { formatFormToFormData } from "../../src/utils/jy-util";


@Component({
    name: 'tag',
})
export default class Tag extends Mixins(CommonPagination, ReportTable, Condition, FormDialog) {

    reports: any[] = []; // 报表列表


    created() {
        this.setTableColumns(false);
        this.search();
    }

    // 每次进入页面需要重新获取关联游戏分类，因为可能操作完游戏分类管理就回来本页面操作了
    activated() {
        commonInitFormItem(this.condition.formConfigs.appCategoryIds, {vm: this});
    }

    // 搜索
    search() {
        this.resetPagination();
        this.getReports();
    }

    // 获取报表数据
    async getReports() {
        if(this.condition.submitting) { return; } else { this.condition.submitting = true; }

        let formatForm = this.getFormatForm();
        // const res = await getLabelList(formatForm).finally(() => this.condition.submitting = false);
        // if(res.code === 0) {
        //     this.reports = res.data.records;
        //     this.pagination.total = res.data.total;
        // }
    }


    // 确认新增
    async onCreateConfirm() {
        // this.onDialogConfirm(addLabel, { callback: this.search });
    }

    // 确认编辑
    async onEditConfirm() {
        // this.onDialogConfirm(updateLabel, { callback: this.getReports });
    }

    // 删除
    async onDelete(labelId: number) {
        // const res = await deleteLabel(labelId);
        // if(res.code === 0) {
        //     this.getReports();
        // }
    }


    /********************** 关联游戏 start ************************/

    batchRows: any[] = []; // 勾选row数组

    // 更新勾选 data为所有勾选row数组
    onSelectionChange(data: any) {
        this.batchRows = data;
    }

    // 点击关联游戏按钮
    onRelateAppCateClick() {
        const labelIds = this.batchRows.map(row => row.labelId);
        this.openFormDialog('relate', {labelIds});
    }

    // 提交关联游戏表单
    onRelateConfirm() {
        // this.onDialogConfirm(batchRelateAppCates, {callback: this.getReports});
    }

    /********************** 关联游戏 end ************************/


    /*********************************** 导入 start ***********************************/

    
    // 下载模板
    onBtnDownloadClick() {
        // this.exportExcelByApi(downloadTagImportTemplate);
    }

    
    // 上传配置
    uploadConfig: any = {
        action: '',
        name: 'file',
        multiple: false,
        autoUpload: false,
    };

    // 确认导入
    onImportConfirm() {
        // this.onDialogConfirm(importTag, { callback: this.search, customForm: formatFormToFormData(this.getDialogForm()) });
    }

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onFileChange(file: any, fileList: any[]) {
        this.dialogConfig.importForm.file = file.raw;
        fileList.splice(0, fileList.length - 1);
    }

    // 文件列表移除文件时的钩子
    onFileRemove(file: any, fileList: any[]) {
        this.dialogConfig.importForm.file = '';
    }
    
    // 重置弹框
    resetDialog() {
        // @ts-ignore
        this.$refs.elUpload?.clearFiles();
    }

    /*********************************** 导入 end ***********************************/

}
</script>


<style lang='scss' scoped>
.tag-dialog {
     .form-item-file {
        height: auto;
        align-items: flex-start;
        flex: 0 0 100% !important;
    }
}
</style>
