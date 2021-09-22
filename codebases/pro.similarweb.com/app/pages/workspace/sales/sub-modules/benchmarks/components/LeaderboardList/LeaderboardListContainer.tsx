import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import { selectSimilarWebsites } from "../../../opportunities-lists/store/selectors";
import useLeaderboardService from "../../hooks/useLeaderboardService";
import { BaseWebsiteType } from "../../types/common";
import LeaderboardList from "./LeaderboardList";
import LeaderboardListLoader from "../LeaderboardListLoader/LeaderboardListLoader";

type LeaderboardListContainerProps = {
    similarWebsites: BaseWebsiteType[];
};

const LeaderboardListContainer = (props: LeaderboardListContainerProps) => {
    const {
        isLoading,
        onAddCompetitor,
        onRemoveCompetitor,
        onUpdateCompetitor,
        benchmarkItemService,
    } = React.useContext(BenchmarkItemContext);
    const { similarWebsites } = props;
    const leaderboardService = useLeaderboardService();
    if (isLoading) {
        return <LeaderboardListLoader />;
    }

    return (
        <LeaderboardList
            isLoading={isLoading}
            onAddWebsite={onAddCompetitor}
            similarWebsites={similarWebsites}
            onUpdateWebsite={onUpdateCompetitor}
            onRemoveWebsite={onRemoveCompetitor}
            metricFormatter={benchmarkItemService.defaultFormatter}
            metric={benchmarkItemService.bResult.metric}
            country={benchmarkItemService.bResult.country}
            websites={leaderboardService.websitesList}
            prospectDomain={benchmarkItemService.prospect.domain}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    similarWebsites: selectSimilarWebsites(state),
});

export default connect(mapStateToProps)(LeaderboardListContainer) as React.FC<{}>;
