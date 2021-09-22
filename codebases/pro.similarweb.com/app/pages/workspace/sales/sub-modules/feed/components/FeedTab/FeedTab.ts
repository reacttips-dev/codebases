import { connect } from "react-redux";
import { RootState } from "single-spa/store/types";
import { View } from "./View";
import { bindActionCreators } from "redux";
import {
    selectFetchingFeeds,
    selectTopCountries,
    selectAdNetworks,
    selectSiteInfo,
    selectNews,
    selectTechnologies,
    selectGroupedFeeds,
} from "../../store/selectors";
import {
    selectBenchmarksAreEmpty,
    selectBenchmarksQuota,
    selectSettings,
} from "../../../benchmarks/store/selectors";
import { selectTopBenchmarkFetching } from "../../../benchmarks/store/selectors";
import { selectActiveWebsite } from "../../../opportunities-lists/store/selectors";
import { clearTechnologies } from "../../store/action-creators";
import { ThunkDispatchCommon } from "single-spa/store/types";

const mapStateToProps = (state: RootState) => ({
    feedsFetching: selectFetchingFeeds(state),
    feedsGroupedByMonth: selectGroupedFeeds(state),
    topCountries: selectTopCountries(state),
    adNetworks: selectAdNetworks(state),
    siteInfo: selectSiteInfo(state),
    benchmarkFetching: selectTopBenchmarkFetching(state),
    news: selectNews(state),
    settings: selectSettings(state),
    benchmarksQuota: selectBenchmarksQuota(state),
    benchmarksAreEmpty: selectBenchmarksAreEmpty(state),
    technologies: selectTechnologies(state),
    activeWebsite: selectActiveWebsite(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            clearTechnologies: clearTechnologies,
        },
        dispatch,
    );
};

export type FeedTabContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export const FeedTab = connect(mapStateToProps, null)(View);
