import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Injector } from "common/ioc/Injector";
import {
    buildGroupedSerpFeatures,
    buildSerpFeaturesIcons,
} from "pages/website-analysis/traffic-sources/search/components/serp/SerpTableCellUtils";
import React from "react";
import { SerpTableCellTooltipSingle } from "./SerpTableCellTooltipSingle";
import { SerpIconsComponentWithText } from "./SerpStyledComponents";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { i18nFilter } from "filters/ngFilters";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";

export const SerpTableCellSingle: React.FC<any> = ({ row, tableOptions: { onSerpIconClick } }) => {
    if (row.serpFailed) {
        return (
            <PlainTooltip placement="top" tooltipContent={i18nFilter()("serp.error.tooltip")}>
                <div>N/A</div>
            </PlainTooltip>
        );
    }
    if (row.serpLoading) {
        return <PixelPlaceholderLoader width={79} height={16} />;
    }
    const chosenSites = Injector.get("chosenSites");
    const sites = chosenSites.sitelistForLegend();
    const { SearchTerm, SerpFeatures = [], SerpScrapeDate, SiteSerpFeatures = {} } = row;
    const serpFeatures = buildGroupedSerpFeatures(
        SerpFeatures,
        SiteSerpFeatures,
        sites,
        SerpScrapeDate,
        SearchTerm,
    );
    const hasFeaturedSerp = Object.keys(serpFeatures.featured).length > 0;
    const hasNonFeaturedSerp = serpFeatures.nonFeatured.length > 0;
    if (!hasFeaturedSerp && !hasNonFeaturedSerp) {
        return <span>-</span>;
    }
    const { icons, text } = buildSerpFeaturesIcons(serpFeatures, onSerpIconClick);
    return (
        <SerpTableCellTooltipSingle serpFeatures={serpFeatures}>
            <FlexRow>
                <SerpIconsComponentWithText text={text}>{icons}</SerpIconsComponentWithText>
            </FlexRow>
        </SerpTableCellTooltipSingle>
    );
};
