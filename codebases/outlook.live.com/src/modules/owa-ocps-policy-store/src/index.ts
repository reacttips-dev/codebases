import { LazyModule, LazyAction } from 'owa-bundling';
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OcpsPolicyStore" */ './lazyIndex')
);

export let lazyIsFeedbackPolicyEnabled = new LazyAction(lazyModule, m => m.isFeedbackPolicyEnabled);
export let lazyIsNpsSurveyPolicyEnabled = new LazyAction(
    lazyModule,
    m => m.isNpsSurveyPolicyEnabled
);
export let lazyIsOutlookRecommendationEnabled = new LazyAction(
    lazyModule,
    m => m.isOutlookRecommendationEnabled
);
