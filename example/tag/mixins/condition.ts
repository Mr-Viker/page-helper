import { Vue, Component, Mixins } from 'vue-property-decorator';
import moment from 'moment';
import { BaseCondition, ICondition, mergeConfig, defaultDateConfig, defaultInputConfig, defaultSelectConfig } from '../../../dist';


@Component
export default class Condition extends Mixins(BaseCondition) {

    // 整个筛选组件的配置
    protected condition: ICondition = {
        showTopRow: false,
        showDropdown: false,

        form: {
            date: [moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), 2],
        },

        formConfigs: {
            date: defaultDateConfig,
            labelName: mergeConfig(defaultInputConfig, {
                label: '标签名称',
                fixInTop: true,
            }),
        },

    };

}
