import {
    SET_SECONDARY_BAR_TYPE,
    TOGGLE_SECONDARY_BAR,
} from "action_types/secondary_bar_action_types";

export type SecondaryBarType =
    | "MarketResearch"
    | "DigitalMarketing"
    | "WebsiteResearch"
    | "Dashboards"
    | "MarketingWorkspace"
    | "SalesWorkspace"
    | "InvestorsWorkspace"
    | "AppResearch"
    | "ConversionAnalysis"
    | "CustomInsights"
    | "SalesIntelligence"
    | "SalesIntelligenceHome"
    | "SalesIntelligenceLists"
    | "SalesIntelligenceFind"
    | "SalesIntelligenceAccountReview"
    | "SalesIntelligenceAppReview"
    | "None";

export interface ISecondaryBarReducer {
    /**
     * Indicates whether the navbar is opened or not
     */
    isSecondaryBarOpened: boolean;

    /**
     * Indicates which nav bar is currently displayed
     */
    secondaryBarType: SecondaryBarType;
}

function getDefaultState(): ISecondaryBarReducer {
    return {
        secondaryBarType: "None",
        isSecondaryBarOpened: true,
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function secondaryBar(state: ISecondaryBarReducer = getDefaultState(), action) {
    switch (action.type) {
        case TOGGLE_SECONDARY_BAR:
            return {
                ...state,
                isSecondaryBarOpened: action.isSecondaryBarOpened,
            };

        case SET_SECONDARY_BAR_TYPE:
            return {
                ...state,
                secondaryBarType: action.secondaryBarType,
            };

        default:
            return state;
    }
}

export default secondaryBar;
