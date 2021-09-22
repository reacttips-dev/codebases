import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import { CompetitiveTrackingStartPage } from "pages/competitive-tracking/startpage/CompetitiveTrackingStartPage";
import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import { CompetitiveTrackersOverview } from "pages/competitive-tracking/homepage/CompetitiveTrackersOverview";
import { PageWrapper } from "../common/styles/CompetitiveTrackingStyles";
import { connect } from "react-redux";

export const CompetitiveTrackingHomepageInner = ({ segmentsModule }) => {
    const trackers = CompetitiveTrackerService.get();
    const hasTrackers = Boolean(trackers.length);
    return hasTrackers ? (
        <CompetitiveTrackersOverview segmentsModule={segmentsModule} />
    ) : (
        <PageWrapper>
            <CompetitiveTrackingStartPage />
        </PageWrapper>
    );
};

const mapStateToProps = (state) => {
    const { segmentsModule = {} } = state;
    return {
        segmentsModule,
    };
};

export const CompetitiveTrackingHomepage = connect(mapStateToProps)(
    CompetitiveTrackingHomepageInner,
);
SWReactRootComponent(CompetitiveTrackingHomepage, "CompetitiveTrackingHomepage");
