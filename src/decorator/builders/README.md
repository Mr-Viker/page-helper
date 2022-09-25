## Usage


```tsx
[Demo.tsx]
import { Component, Vue } from 'vue-property-decorator';

import Condition from "./mixins/condition";
import ReportTable from "./mixins/report-table";
import FormDialog from "./mixins/form-dialog";
import { BtnCreateBuilder, BtnExportBuilder, CondititionBuilder, FormDialogBuilder, PageBuilder, PaginationBuilder, QueryViewBuilder, RenderBuilder, TableBtnEditBuilder, TableBuilder } from '@/decorator/builders';
import { landingIcpList } from '@/api/landing-icp';
import { exportNGCps } from '@/api/ad-report';


@Component({ name: 'content-summary-report' })
@CondititionBuilder(Condition)
@QueryViewBuilder()
@BtnExportBuilder({exportApi: exportNGCps, opts: { exportType: 'list' }})
@BtnCreateBuilder()
@TableBuilder(ReportTable, { reportApi: landingIcpList })
@TableBtnEditBuilder()
@PaginationBuilder()
@FormDialogBuilder(FormDialog)
@RenderBuilder()
@PageBuilder()
export default class Demo extends Vue {}
```