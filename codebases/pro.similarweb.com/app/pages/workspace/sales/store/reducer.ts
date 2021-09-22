import { combineReducers } from "redux";
import signalsReducer, {
    INITIAL_SIGNALS_STATE,
    SignalsState,
} from "../sub-modules/signals/store/reducer";
import opportunitiesReducer, {
    INITIAL_OPPORTUNITIES_STATE,
    OpportunitiesState,
} from "../sub-modules/opportunities-lists/store/reducer";
import feedReducer, { INITIAL_FEED_STATE, FeedState } from "../sub-modules/feed/store/reducer";
import benchmarksReducer, {
    INITIAL_BENCHMARKS_STATE,
    BenchmarksState,
} from "../sub-modules/benchmarks/store/reducer";
import commonReducer, {
    CommonState,
    INITIAL_COMMON_STATE,
} from "pages/workspace/sales/sub-modules/common/store/reducer";
import siteTrendsReducer, {
    INITIAL_SITE_TRENDS_STATE,
    siteTrendsState,
} from "../sub-modules/site-trends/store/reducer";

export type SalesWorkspaceState = {
    feed: FeedState;
    signals: SignalsState;
    opportunities: OpportunitiesState;
    benchmarks: BenchmarksState;
    common: CommonState;
    siteTrends: siteTrendsState;
};

export const INITIAL_SALES_WORKSPACE_STATE: SalesWorkspaceState = {
    feed: INITIAL_FEED_STATE,
    signals: INITIAL_SIGNALS_STATE,
    opportunities: INITIAL_OPPORTUNITIES_STATE,
    benchmarks: INITIAL_BENCHMARKS_STATE,
    common: INITIAL_COMMON_STATE,
    siteTrends: INITIAL_SITE_TRENDS_STATE,
};

export default combineReducers<SalesWorkspaceState>({
    feed: feedReducer,
    signals: signalsReducer,
    opportunities: opportunitiesReducer,
    benchmarks: benchmarksReducer,
    common: commonReducer,
    siteTrends: siteTrendsReducer,
});
