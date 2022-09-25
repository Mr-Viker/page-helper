/**
 * 表单项-上传文件生成器
 */

import { createDecorator } from "vue-class-component";
import { hasOwn } from "@/utils/jy-util";
import { defineRenderMethod, recordBuilder } from "../../utils";


// 导出按钮生成器参数
interface IParams {
    renderMethodName?: string, // 渲染模板方法名
}

export function FDUploadFileBuilder(params: IParams = {}) {
    return createDecorator((options) => {
        if(!hasOwn(params, 'renderMethodName')) params.renderMethodName = 'renderFDUploadFile';
        recordBuilder(options, {name: 'FDUploadFileBuilder', params, parent: 'FormDialogBuilder'});

        // 定义渲染模板方法
        defineRenderMethod(options, params.renderMethodName, function(scope: any, elUploadProps: any = {}) {
            const h = this.$createElement;
            return (
                <el-form-item class="form-item-container form-item-file" prop='file' label={scope.itemConfig.label} rules={scope.itemConfig.rules}>
                    <input class="hide" v-model={scope.form.file} />
                    <el-upload class="file-uploader" ref="elUpload"
                        props={{
                            action: '',
                            name: 'file',
                            multiple: false,
                            autoUpload: false,
                            onChange: this.onFileChange,
                            onRemove: this.onFileRemove,
                            ...elUploadProps,
                        }}>
                        <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
            )
        })

        // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        defineRenderMethod(options, 'onFileChange', function(file: any, fileList: any[]) {
            this.dialogConfig.importForm.file = file.raw;
            fileList.splice(0, fileList.length - 1);
        })

        // 文件列表移除文件时的钩子
        defineRenderMethod(options, 'onFileRemove', function() {
            this.dialogConfig.importForm.file = '';
        })
    })
}
