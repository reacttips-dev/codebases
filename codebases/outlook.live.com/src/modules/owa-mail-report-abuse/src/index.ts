import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ReportAbuse" */ './lazyIndex')
);

export let lazyShowReportAbuseDialog = new LazyAction(lazyModule, m => m.showReportAbuseDialog);
export let lazyOnReportAbuseOptionSelected = new LazyAction(
    lazyModule,
    m => m.onReportAbuseOptionSelected
);
