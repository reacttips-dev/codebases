import { LazyModule, LazyAction, createLazyComponent } from 'owa-bundling';

export { CACHE_SIZE } from './store/schema/meetingInsightsCache';
export { getMeetingInsightsStore } from './store/store';
export * from './selectors/meetingInsightsSelectors';
export { default as getInsightsTraceId } from './selectors/getInsightsTraceId';
export { default as InsightsRenderLoggingHelper } from './components/InsightsRenderLoggingHelper';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MeetingInsights" */ './lazyIndex')
);

export const lazyFetchMeetingInsights = new LazyAction(lazyModule, m => m.fetchMeetingInsights);
export const lazyOpenFileInsight = new LazyAction(lazyModule, m => m.openFileInsight);
export const lazyOpenEmailInsight = new LazyAction(lazyModule, m => m.openEmailInsight);

export const lazyLogInsightsRenderAndLayout = new LazyAction(
    lazyModule,
    m => m.logInsightsRenderAndLayout
);
export const lazyLogInsightsCacheHitMissRate = new LazyAction(
    lazyModule,
    m => m.logInsightsCacheHitMissRate
);
export const lazyLogFileInsightClicked = new LazyAction(lazyModule, m => m.logFileInsightClicked);
export const lazyLogEmailInsightClicked = new LazyAction(lazyModule, m => m.logEmailInsightClicked);
export const lazyLogInsightSummaryClicked = new LazyAction(
    lazyModule,
    m => m.logInsightSummaryClicked
);
export const InsightDocList = createLazyComponent(lazyModule, m => m.InsightDocList);
export const InsightDocSummary = createLazyComponent(lazyModule, m => m.InsightDocSummary);
