import { ETrackerAssetType } from "services/competitiveTracker/types";
import { i18nFilter } from "filters/ngFilters";
import { SwNavigator } from "common/services/swNavigator";
import { SwLog } from "@similarweb/sw-log";
import { I18NFilter } from "filters/ngFilters.types";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const i18n = i18nFilter();

export enum ETrackerWizardStep {
    SelectMainAsset = 0,
    SelectCompetitors = 1,
    SelectMarketCriteria = 2,
    SelectTrackerName = 3,
}

export const wizardLabels = [
    i18n("competitive.tracker.wizard.legends.define.property"),
    i18n("competitive.tracker.wizard.legends.define.property.select.competitors"),
    i18n("competitive.tracker.wizard.legends.market"),
];

/**
 * Maps each of the wizard steps to a corresponding tracking guid
 * used for tracking user actions.
 */
export const WizardStepToPageTrackingGuid = {
    [ETrackerWizardStep.SelectMainAsset]: "competitive.tracking.wizard.main.asset.next",
    [ETrackerWizardStep.SelectCompetitors]: "competitive.tracking.wizard.select.competition.next",
    [ETrackerWizardStep.SelectMarketCriteria]: "competitive.tracking.wizard.market.criteria.next",
    [ETrackerWizardStep.SelectTrackerName]: "competitive.tracking.wizard.create.tracker",
};

export const assetsIcon = {
    [ETrackerAssetType.Website]: "globe",
    [ETrackerAssetType.Segment]: "segment-share",
    [ETrackerAssetType.Company]: "company",
};

export interface ITrackerWizardServices {
    translate: I18NFilter;
    navigator: SwNavigator;
    logger: SwLog;
    tracking: typeof TrackWithGuidService;
}
