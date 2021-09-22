import { colorsSets } from "@similarweb/styles";
import { EMarketingChannelsType } from "components/React/MarketingChannelsDistribution/types";

const trafficSourcesColors = colorsSets.c.toArray();

export const constants = {
    [EMarketingChannelsType.DIRECT]: {
        API_RESULTS_NAME: "Direct",
        SINGLE_MODE_KEY: "marketing.channels.distribution.direct.single",
        COMPARE_MODE_KEY: "marketing.channels.distribution.direct.compare",
        DISPLAY_NAME_KEY: "marketing.channels.distribution.direct.display.name",
        COLOR: trafficSourcesColors[0],
    },
    [EMarketingChannelsType.EMAIL]: {
        API_RESULTS_NAME: "Mail",
        SINGLE_MODE_KEY: "marketing.channels.distribution.mail.single",
        COMPARE_MODE_KEY: "marketing.channels.distribution.mail.compare",
        DISPLAY_NAME_KEY: "marketing.channels.distribution.mail.display.name",
        COLOR: trafficSourcesColors[1],
    },
    [EMarketingChannelsType.REFERRALS]: {
        API_RESULTS_NAME: "Referrals",
        SINGLE_MODE_KEY: "marketing.channels.distribution.referrals.single",
        COMPARE_MODE_KEY: "marketing.channels.distribution.referrals.compare",
        DISPLAY_NAME_KEY: "marketing.channels.distribution.referrals.display.name",
        COLOR: trafficSourcesColors[2],
    },
    [EMarketingChannelsType.SOCIAL]: {
        API_RESULTS_NAME: "Social",
        SINGLE_MODE_KEY: "marketing.channels.distribution.social.single",
        COMPARE_MODE_KEY: "marketing.channels.distribution.social.compare",
        DISPLAY_NAME_KEY: "marketing.channels.distribution.social.display.name",
        COLOR: trafficSourcesColors[3],
    },
    [EMarketingChannelsType.ORGANIC_SEARCH]: {
        API_RESULTS_NAME: "Organic Search",
        SINGLE_MODE_KEY: "marketing.channels.distribution.organic.single",
        COMPARE_MODE_KEY: "marketing.channels.distribution.organic.compare",
        DISPLAY_NAME_KEY: "marketing.channels.distribution.organic.display.name",
        COLOR: trafficSourcesColors[4],
    },
    [EMarketingChannelsType.PAID_SEARCH]: {
        API_RESULTS_NAME: "Paid Search",
        SINGLE_MODE_KEY: "marketing.channels.distribution.paid.single",
        COMPARE_MODE_KEY: "marketing.channels.distribution.paid.compare",
        DISPLAY_NAME_KEY: "marketing.channels.distribution.paid.display.name",
        COLOR: trafficSourcesColors[5],
    },
    [EMarketingChannelsType.DISPLAY_ADS]: {
        API_RESULTS_NAME: "Paid Referrals",
        SINGLE_MODE_KEY: "marketing.channels.distribution.paid.referrals.single",
        COMPARE_MODE_KEY: "marketing.channels.distribution.paid.referrals.compare",
        DISPLAY_NAME_KEY: "marketing.channels.distribution.paid.referrals.display.name",
        COLOR: trafficSourcesColors[6],
    },
};
