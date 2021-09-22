import isNumber from "lodash/isNumber";
import { swSettings } from "common/services/swSettings";

export const isNumberDecrease = (value, duration) => {
    let isDecrease = null;
    const is28d = duration === "28d";
    if (!is28d) {
        isDecrease =
            isNumber(value) && value < 0 ? true : isNumber(value) && value > 0 ? false : null;
    }
    return isDecrease;
};

export const isCreativesCountrySupported = (country) =>
    swSettings.components.WebsiteAdsIntelDisplay?.allowedCountries?.find((c) => c.id == country);

export const displayAdsOverviewConfig = {
    TOTAL_ADS: {
        title: "display.ads.overview.total.ads.title",
        tooltip: "display.ads.overview.total.ads.tooltip",
    },
    CAMPAIGN_PAGES: {
        title: "display.ads.overview.campaign.pages.title",
        tooltip: "display.ads.overview.campaign.pages.tooltip",
    },
    DETECTED_ADS: {
        title: "display.ads.overview.detected.ads.title",
        tooltip: "display.ads.overview.detected.ads.tooltip",
    },
};
