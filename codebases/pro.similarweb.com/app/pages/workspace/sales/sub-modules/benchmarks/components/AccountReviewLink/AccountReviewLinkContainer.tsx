import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { RootState } from "store/types";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import { TopicType } from "../../types/topics";
import { TOPICS_TRANSLATION_KEY } from "../../constants";
import { BenchmarkResultType } from "../../types/benchmarks";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useRightSidebarTrackingService from "pages/sales-intelligence/hooks/useRightSidebarTrackingService";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import { selectedCountryByOpportunityList } from "pages/workspace/sales/store/selectors";
import { selectBenchmarks, selectTopicFromSettings } from "../../store/selectors";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import AccountReviewLink from "./AccountReviewLink";

type AccountReviewLinkContainerProps = {
    country: number;
    chosenTopicCode: TopicType["code"];
    benchmarkResults: BenchmarkResultType[];
} & WithSWNavigatorProps;

const AccountReviewLinkContainer = (props: AccountReviewLinkContainerProps) => {
    const translate = useTranslation();
    const { navigator, chosenTopicCode, country, benchmarkResults } = props;
    const { website } = React.useContext(RightSidebarContext);
    const salesSettingsHelper = useSalesSettingsHelper();
    const sidebarTrackingService = useRightSidebarTrackingService();
    const isSiUser = salesSettingsHelper.isSiUser();
    const toStateKey = isSiUser
        ? "accountreview_website_overview_websiteperformance"
        : "websites-worldwideOverview";

    const buildLink = () => {
        return navigator.href(toStateKey, {
            key: website?.domain,
            country,
            isWWW: "*",
            duration: "3m",
            webSource: "Total",
        });
    };

    const trackLinkClick = () => {
        sidebarTrackingService.trackBenchmarksAccReviewClicked(
            translate(`${TOPICS_TRANSLATION_KEY}.${chosenTopicCode}`),
        );
    };

    if (benchmarkResults.length === 0) {
        return null;
    }

    return <AccountReviewLink link={buildLink()} onLinkClick={trackLinkClick} />;
};

const mapStateToProps = (state: RootState) => ({
    country: selectedCountryByOpportunityList(state), // TODO: Copied. Seems to be wrong. Re-check.
    chosenTopicCode: selectTopicFromSettings(state),
    benchmarkResults: selectBenchmarks(state),
});

export default compose(
    connect(mapStateToProps, null),
    withSWNavigator,
)(AccountReviewLinkContainer) as React.FC<{}>;
