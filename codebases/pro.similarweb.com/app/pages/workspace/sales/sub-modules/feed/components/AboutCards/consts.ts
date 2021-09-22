import { colorsPalettes } from "@similarweb/styles";

export const RED = "#FF442D";
export const GREEN = "#4FBF40";
export const BLACK: string = colorsPalettes.carbon["500"];

export enum TopTabs {
    topCountriesByShare = 0,
    topCountriesByGrowth = 1,
}

export enum AdTabs {
    topAdNetworks = 0,
    newAdNetworks = 1,
}

export const NO_DATA = "N/A";

export const AD_NETWORKS_TOPICS = ["display_ads", "paid_search", "referrals"];
