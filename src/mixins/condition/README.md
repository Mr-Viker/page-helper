## Condition
> 基于admin-condition组件封装的公共业务逻辑类  
> 
> 主要内容：筛选组件显示内容配置、表单项配置、自动初始化表单选项列表、表单联动、导出等功能

<br/>



### 前言
> 繁琐的表单选项请求(可能有多达七八个表单项下拉列表的获取)、表单项间的联动处理、表单提交前的格式化数据、多页面相似的导出功能等等...  
> 开发中，大多数页面都会面临这些麻烦的琐事，如果每个页面都写这些逻辑，不仅效率低下，而且功能的修改，可能要改多个文件等等...  
> 如果有一个文件，能将这些都通通处理好，只需要简单的按照配置即可轻易完成这些功能，是不是就能极大地提高开发效率呢？  
> 
> condition.ts 正是基于这样的业务背景产生的  
> 最初，它做得还算不错，简单的配置即可免去了大量重复性的工作。并且基于大部分页面都需要的表单项附带了一份配置对象。  
> 但随着业务的复杂，condition.ts也越来越庞大，附加了太多功能的它已经越来越不友好，并且附带的表单配置对象确实也在一定程度上加重了继承的负担。  
> 
> condition v2 由此产生  
> 简单、轻便是它与v1最大的不同  
> 没有附带的配置对象列表，不需要再加上sort字段进行排序，只需要简单的基于[defaultXxConfig](v2/form-config/template.ts)配置下formConfigs即可...  
> 并且无缝兼容1.0版本(只需要改引入路径即可: `@/mixins/condition` -> `@mixins/condition/v1`)  
> 现在 让我们开始熟悉condition v2吧。  

<br/>



### 目录
<pre>
├─ v1 // 第一版
│   └─ index.ts // 入口 主要内容：兼容旧页面的配置方法
│  
├─ v2 //第二版
│   └─ form-config // 表单配置
│        ├─ template.ts // 配置模板 主要内容：公共默认模板和业务便捷模板
│        └─ util.ts // 表单工具类 主要内容：表单项合并、表单项联动、历史记录功能
│   ├─ addition.ts // 筛选组件附加功能 主要内容：快筛、表格、导出等与筛选组件相关的其他功能 按需自取
│   └─ index.ts // 入口 主要内容：筛选组件配置、表单初始化、表单提交
│  
├─ type.ts // 类型说明文件
└─ README.md
</pre>

<br/>



### 使用教程
> condition v2和旧版的v1绝大部分功能是相通的。事实上，可以将v2看成是v1的拆解版，并基于v1进行了一定的升级。

<br/>

> 绝大多数情况下，在页面的condition.ts中继承`@/mixins/condition/v2`后，只需要简单的配置formConfigs即可完成大部分功能。  
> 你可能会想，自己配置formConfigs下的每一个表单项，那不是很繁琐吗？  
> 确实，如果每个都需要自己写会是一件非常繁琐的事情，这也是v2/form-config目录的由来。  
> 
> [v2/form-config/template.ts](v2/form-config/template.ts)下已经将select、cascader、date-range、input的通用配置全部写好了(defaultSelectConfig、defaultCascaderConfig、defaultDateConfig、defaultInputConfig)。  
> 甚至，考虑到大部分页面通用的业务表单项，它还提供了业务便捷配置(appGroupIdsConfig、appIdsConfig...)。  
> 只需要简单的引用，并在默认配置的基础上自定义页面特殊配置即可(可覆盖默认配置)。  
> 放心，关于合并的规则，一切都由[v2/form-config/util.ts](v2/form-config/util.ts)文件提供的`mergeConfig`方法来解决了。  
> 并且，conditon会自动基于你的formConfigs来生成表单默认内容(可通过设置`autoGenerateForm=false`来手动生成)。  

> 也就是说，你要做的步骤只有两步：  
> 1. 引入`@/mixins/condition/v2`  
> 2. 配置formConfigs  

<pre>
import BaseCondition from '@/mixins/condition/v2';  

export default class Condition extends Mixins(BaseCondition) {

    protected condition: ICondition = {
        formConfigs: {
            date: mergeConfig(defaultDateConfig, { sort: 10 }),
            appGroupIds: appGroupIdsConfig,
            appGroupId: mergeConfig(appGroupIdsConfig, { multiple: false, hide: true }),
            appIds: appIdsConfig,
            agentIds: agentIdsConfig,
            channelIds: channelIdsConfig,
            positionIds: positionIdsConfig,
            optimizerGroupIds: optimizerGroupIdsConfig,
            userIds: userIdsConfig,
            accountIds: accountIdsConfig,
            demo: mergeConfig(defaultSelectConfig, {
                onChange: (data: IChangeData) => {...}
            })
        },
    };

}
</pre>

> 剩下的，就交给condition v2自动处理吧。
