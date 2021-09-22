import { colorsPalettes, colorsSets } from "@similarweb/styles";
import {
    $mainColors,
    $trafficSourcesColors,
    $trafficSourcesColorsList,
} from "@similarweb/styles/src/style-guide-colors";
const trafficSourcesColors = colorsSets.c.toArray();
export const CHART_COLORS = {
    benchmark: colorsSets.b3.toArray()[0],
    main: colorsSets.c.toArray(),
    DeduplicatedAudience: ["#4f8df9", "#8cd2ff", "#ff9a47"],
    mobileWeb: colorsSets.b1.toArray(),
    loadingColor: "#eeeeee",
    audienceOverview: colorsSets.c.toArray(),
    compareMainColors: colorsSets.c.toArray(),
    maleFemaleColors: colorsSets.b1.toArray(),
    trafficSourcesColors,
    newReturningUsersColors: {
        NewUsers: colorsSets.b1.toArray()[0],
        ReturningUsers: colorsSets.b1.toArray()[1],
    },
    trafficSourcesColorsBySourceMMX: {
        Direct: trafficSourcesColors[0],
        Email: trafficSourcesColors[1],
        Mail: trafficSourcesColors[1],
        Referrals: trafficSourcesColors[2],
        Social: trafficSourcesColors[3],
        Search: trafficSourcesColors[4],
        "Organic Search": trafficSourcesColors[4],
        OrganicSearch: trafficSourcesColors[4],
        PaidSearch: trafficSourcesColors[5],
        "Paid Search": trafficSourcesColors[5],
        "Display Ads": trafficSourcesColors[6],
        DisplayAds: trafficSourcesColors[6],
        PaidReferrals: trafficSourcesColors[6],
        "Paid Referrals": trafficSourcesColors[6],
        "Internal Referrals": trafficSourcesColors[7],
        InternalReferrals: trafficSourcesColors[7],
    },
    //taken form /Shared/config.js
    chartMainColors: colorsSets.c.toArray(),
    mobileDesktopColors: [...colorsSets.b1.toArray(), "inherit"],
    // legacyColors: ['#007bff', '#fc32c5', '#34c3a2', '#9070dd', '#ff0000', '#fb9949', '#f8b537'],
    // gradual: ['#EB5E5C', '#FE9F49', '#FBD252', '#9EE6DE', '#53C5B9'],
    periodOverPeriod: {
        MobileWeb: [colorsPalettes.blue[400], colorsPalettes.orange[400]],
        MobileWebCombined: [colorsPalettes.blue[200], colorsPalettes.orange[200]],
        Desktop: [colorsPalettes.blue[400], colorsPalettes.orange[400]],
        Total: [colorsPalettes.blue[400], colorsPalettes.orange[400]],
    },
    map: colorsPalettes.blue["500"],
    blue: [colorsPalettes.blue[400]],
    //pieChart: ['#006699', '#8e70e0', '#71ca2f', '#ff6600', '#00b5f0', '#ff33cc', '#fb9949']
    //pieChart: ['#51a9e7', '#a68ade', '#60c5a1', '#fb9949', '#f96060', '#f8b537', '#7CC924']
};
