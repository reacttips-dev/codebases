import { ReactNode } from "react";
import { colorsPalettes } from "@similarweb/styles";
import dayjs, { Dayjs } from "dayjs";
import {
    SERP_MAP,
    serpFeatureSupported,
} from "pages/website-analysis/traffic-sources/search/components/serp/SerpTypes";
import { SerpIconComponent } from "./SerpStyledComponents";

export interface ISiteSerpFeatures {
    featured: { [serp: string]: Array<{ name: string; color: string }> };
    nonFeatured: string[];
    date: Dayjs;
    sites: Array<{ name: string; color: string }>;
    searchTerm: string;
}

export const buildGroupedSerpFeatures = (
    serpFeatures,
    siteSerpFeatures,
    sites: Array<{ name: string; color: string }>,
    serpScrapeDate,
    searchTerm,
): ISiteSerpFeatures => {
    const nonFeatured = [];
    const featured = {};
    // loop over all the serp features
    serpFeatures.filter(serpFeatureSupported).forEach((serp) => {
        let existed = false;
        // loop over the sites features to find which serp feature existed in each site
        sites.forEach(({ name, color }) => {
            const siteFeatures = siteSerpFeatures[name] ?? [];
            if (siteFeatures.includes(serp)) {
                existed = true;
                if (!featured[serp]) {
                    featured[serp] = [];
                }
                featured[serp].push({ name, color });
            }
        });
        if (!existed) {
            nonFeatured.push(serp);
        }
    });
    return {
        featured,
        nonFeatured,
        sites: sites,
        date: dayjs.utc(serpScrapeDate),
        searchTerm,
    };
};

export const buildSerpFeaturesIcons = (
    serpFeatures: ISiteSerpFeatures,
    onSerpIconClick?: (serp) => void,
): { icons: ReactNode[]; text: string } => {
    const numberOfSerpFeatures =
        Object.keys(serpFeatures.featured).length + serpFeatures.nonFeatured.length;
    let text = "";
    let icons = Object.keys(serpFeatures.featured)
        .map((serp, index) => {
            return (
                <SerpIconComponent
                    key={`featured-${index}`}
                    background={colorsPalettes.sky["200"]}
                    iconName={SERP_MAP[serp].icon}
                    onClick={() => onSerpIconClick(SERP_MAP[serp])}
                />
            );
        })
        .concat(
            serpFeatures.nonFeatured.map((serp, index) => {
                return (
                    <SerpIconComponent
                        key={`non-featured-${index}`}
                        iconName={SERP_MAP[serp].icon}
                        onClick={() => onSerpIconClick(SERP_MAP[serp])}
                    />
                );
            }),
        );
    if (numberOfSerpFeatures > 3) {
        icons = icons.slice(0, 2);
        text = `+${numberOfSerpFeatures - 2}`;
    }
    return {
        icons,
        text,
    };
};
