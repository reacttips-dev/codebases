import { SwNavigator } from "common/services/swNavigator";
import { ETrackerAssetType } from "services/competitiveTracker/types";
import styled from "styled-components";

export interface ICompetitiveTrackingSectionProps {
    currentPage: string;
    params: { trackerId?: string };
    navigator: SwNavigator;
}

export const GroupItemContainer = styled.div`
    padding: 0 8px;
`;

export const TRACKING_HOME_PAGE = "companyresearch_competitivetracking_home";
export const TRACKING_WIZARD_PAGE = "companyresearch_competitivetracking_wizard";
export const TRACKING_TRACKER_PAGE = "companyResearch_competitiveTracking_tracker";

export interface ITrackerAsset {
    id: string;
    displayText: string;
    image: string;
    type: ETrackerAssetType;
    name?: string;
}
