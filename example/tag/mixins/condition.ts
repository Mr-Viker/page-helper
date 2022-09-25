import { Vue, Component, Mixins } from 'vue-property-decorator';
import moment from 'moment';

import BaseCondition from '../../../src/mixins/condition/v2';
import { IChangeData, ICondition } from '../../../src/mixins/condition/type';
import { mergeConfig, onFormItemChange } from '../../../src/mixins/condition/v2/form-config/util';
import { defaultDateConfig, defaultInputConfig, defaultSelectConfig } from '../../../src/mixins/condition/v2/form-config/template';
import {customType} from '../data/config'


@Component
export default class Condition extends Mixins(BaseCondition) {

    // 整个筛选组件的配置
    protected condition: ICondition = {
        showTopRow: false,
        // showDropdown: false,

        form: {
            date: [moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), 2],
        },

        formConfigs: {
            date: defaultDateConfig,
            appCategoryIds: mergeConfig(defaultSelectConfig, {
                label: '关联游戏分类',
                fixInTop: true,
                multiple: false,
                submitToArray: true,
                props: {
                    // getOptions: { module: 'material', action: 'getIndependentAppCateList', state: 'independentAppCateList' },
                    label: 'appCategoryName',
                    value: 'appCategoryId',
                }
            }),
            labelName: mergeConfig(defaultInputConfig, {
                label: '标签名称',
                fixInTop: true,
            }),
            customType: mergeConfig(defaultSelectConfig,{
                label: '标签类型',
                fixInTop: true,
                multiple: false,
                options: Object.entries(customType).map(v => v[1]),

            }),
            // parentCategoryId: mergeConfig(defaultSelectConfig, {
            //     label: '一级分类',
            //     fixInTop: true,
            //     multiple: false,
            //     props: {
            //         label: 'categoryName',
            //         value: 'labelCategoryId',
            //         getOptions: { api: getLabelCategoryCombox, params: { categoryLevel: categoryLevel.level1.value } },
            //     },
            //     onChange: (data: IChangeData) => {
            //         onFormItemChange(data, {
            //             childKey: 'labelCategoryId',
            //             api: getLabelCategoryCombox,
            //             params: {
            //                 categoryLevel: categoryLevel.level2.value,
            //                 parentId: data.value,
            //             },
            //         });
            //     },
            // }),
            labelCategoryIds: mergeConfig(defaultSelectConfig, {
                label: '二级分类',
                fixInTop: true,
                multiple: false,
                submitToArray: true,
                props: {
                    label: 'categoryName',
                    value: 'labelCategoryId',
                },
            }),
        },

    };

}
