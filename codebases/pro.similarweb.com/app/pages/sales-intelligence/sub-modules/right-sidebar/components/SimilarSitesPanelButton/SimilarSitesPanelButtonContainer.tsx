import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import { SimilarSitesPanelButton } from "./SimilarSitesPanelButton";
import {
    selectCompetitors,
    selectCompetitorsFetching,
} from "pages/workspace/sales/sub-modules/benchmarks/store/selectors";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import useSimilarSitesTrackingService from "pages/sales-intelligence/sub-modules/right-sidebar/hooks/useSimilarSitesTrackingService";

type ConnectedProps = ReturnType<typeof mapStateToProps>;
type SimilarSitesPanelProps = { domain: string };

const SimilarSitesPanelWrapped = ({
    similarSites,
    similarSitesFetching,
    domain,
}: ConnectedProps & SimilarSitesPanelProps) => {
    const { website, toggleSimilarSitesPanel } = React.useContext(RightSidebarContext);
    const trackingService = useSimilarSitesTrackingService(website?.domain);

    const onButtonClick = () => {
        trackingService.trackPanelOpenedViaToolbar(similarSites.length);
        toggleSimilarSitesPanel(true);
    };

    return (
        <SimilarSitesPanelButton
            domain={domain}
            onClick={onButtonClick}
            isLoading={similarSitesFetching}
            numberOfSites={similarSites.length}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    similarSites: selectCompetitors(state),
    similarSitesFetching: selectCompetitorsFetching(state),
});

export const SimilarSitesPanelButtonContainer = connect(
    mapStateToProps,
    null,
)(SimilarSitesPanelWrapped) as React.FC<{
    domain: string;
    onClick(): void;
    numberOfSites: number;
    isLoading: boolean;
}>;
