import { swSettings } from "common/services/swSettings";

class KeywordService {
    static get moduleAuthorized() {
        return !swSettings.components.KeywordAnalysisOP.isDisabled;
    }

    static get hasMobileWebSearchPermission() {
        return swSettings.components.MobileWebSearch.isAllowed;
    }

    static get hasKeywordAdsPermission() {
        return swSettings.components.KeywordAnalysisOP.isAllowed;
    }

    static get hasKeywordsGeneratorPermission() {
        return swSettings.components.KeywordsGenerator.isAllowed;
    }

    static hasMobileWebData(duration, country) {
        return (
            swSettings.allowedDuration(duration, "MobileWebSearch") &&
            swSettings.allowedCountry(country, "MobileWebSearch")
        );
    }

    static canNavigate(toState) {
        let canNavigate = true;
        if (!KeywordService.moduleAuthorized) {
            canNavigate = /keywordanalysis\.(?:unauthorized)/i.test(toState.name);
        }
        if (!canNavigate) {
            canNavigate = /findaffiliates_bykeywords/i.test(toState.name);
        }

        return canNavigate;
    }
}
export const keywordService = KeywordService;
