import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { SimilarSiteType } from "../../types/similar-sites";
import RightSidebarContext from "../../contexts/RightSidebarContext";
import { flagHasChanged } from "pages/workspace/sales/helpers";
import { usePrevious } from "components/hooks/usePrevious";
import {
    selectActiveCountriesIds,
    selectCompetitorsUpdating,
    selectNotRemovedSimilarSites,
} from "pages/workspace/sales/sub-modules/benchmarks/store/selectors";
import useSimilarSitesTrackingService from "../../hooks/useSimilarSitesTrackingService";
import { updateCompetitorsThunkAction } from "pages/workspace/sales/sub-modules/benchmarks/store/effects";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";
import SimilarSitesPanel from "./SimilarSitesPanel";
import {
    addCompetitorAction,
    removeCompetitorAction,
    undoUnsavedChangesAction,
} from "pages/workspace/sales/sub-modules/benchmarks/store/action-creators";

type SimilarSitesPanelContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

const SimilarSitesPanelContainer = (props: SimilarSitesPanelContainerProps) => {
    const { isSimilarSitesPanelOpen, toggleSimilarSitesPanel, website } = React.useContext(
        RightSidebarContext,
    );

    const {
        applying,
        similarSites,
        updateCompetitors,
        addSimilarSite,
        removeSimilarSite,
        undoUnsavedChanges,
        activeCountriesIds,
    } = props;

    const prevApplying = usePrevious(applying);
    const applied = flagHasChanged(prevApplying, applying);
    const trackingService = useSimilarSitesTrackingService(website?.domain);

    const closePanel = () => {
        toggleSimilarSitesPanel(false);
        undoUnsavedChanges();
    };

    const handleCancel = () => {
        trackingService.trackCancelClicked(similarSites.length);
        closePanel();
    };

    const handleApply = () => {
        trackingService.trackApplyClicked();
        updateCompetitors(website.domain);
    };

    const handleRemoveWebsite = (domain: string) => {
        trackingService.trackWebsiteRemoved(domain);
        removeSimilarSite(domain);
    };

    const handleAddWebsite = (website: BaseWebsiteType) => {
        const addedWebsite: SimilarSiteType = {
            ...website,
            added: true,
            similarity: 0,
        };

        trackingService.trackWebsiteAdded(website.domain);
        addSimilarSite(addedWebsite);
    };

    React.useEffect(() => {
        if (applied) {
            closePanel();
        }
    }, [applied]);

    return (
        <SimilarSitesPanel
            website={website}
            applying={applying}
            onApply={handleApply}
            onCancel={handleCancel}
            similarSites={similarSites}
            onAddWebsite={handleAddWebsite}
            onRemoveWebsite={handleRemoveWebsite}
            isPanelOpen={isSimilarSitesPanelOpen}
            selectedCountriesIds={activeCountriesIds}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    applying: selectCompetitorsUpdating(state),
    similarSites: selectNotRemovedSimilarSites(state),
    activeCountriesIds: selectActiveCountriesIds(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            updateCompetitors: updateCompetitorsThunkAction,
            addSimilarSite: addCompetitorAction,
            removeSimilarSite: removeCompetitorAction,
            undoUnsavedChanges: undoUnsavedChangesAction,
        },
        dispatch,
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SimilarSitesPanelContainer);
