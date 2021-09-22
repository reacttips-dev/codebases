import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Injector } from "common/ioc/Injector";
import React from "react";
import { buildGroupedSerpFeatures } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTableCellUtils";
import { SerpTableCellTooltipCompare } from "./SerpTableCellTooltipCompare";
import { SerpTableCellTooltipSingle } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTableCellTooltipSingle";
import { SERP_MAP } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTypes";
import {
    SerpIconComponent,
    SerpIconsStacked,
    SerpIconsGrouped,
} from "pages/website-analysis/traffic-sources/search/components/serp/SerpStyledComponents";
import { i18nFilter } from "filters/ngFilters";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";

export const SerpTableCellCompare: React.FC<any> = ({ row, tableOptions: { onSerpIconClick } }) => {
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
    const isCompare = chosenSites.isCompare();
    const sites = chosenSites.sitelistForLegend();
    const { SearchTerm, Serp, SerpFeatures = [], SerpScrapeDate, SiteSerpFeatures = {} } = row;
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
    // in this case, When there are no site that has this serp, we want to show the tooltip like in "single" mode
    const TooltipComponent = hasFeaturedSerp
        ? SerpTableCellTooltipCompare
        : SerpTableCellTooltipSingle;
    const featured = Object.entries(serpFeatures.featured).slice(0, 5);
    const nonFeatured = serpFeatures.nonFeatured.slice(0, Math.min(5, 5 - featured.length));
    const restFeatures =
        Object.entries(serpFeatures.featured).length +
        serpFeatures.nonFeatured.length -
        featured.length -
        nonFeatured.length;
    return (
        <TooltipComponent serpFeatures={serpFeatures}>
            <FlexRow alignItems="center">
                {featured.slice(0, Math.min(featured.length, 5)).map(([serp, sites], index) => {
                    return (
                        <SerpIconsStacked key={`group-${index}`}>
                            {sites.map(({ color }, index) => {
                                return (
                                    <SerpIconComponent
                                        key={`featured-${index}`}
                                        background={color}
                                        iconName={SERP_MAP[serp].icon}
                                        onClick={() => onSerpIconClick(SERP_MAP[serp])}
                                    />
                                );
                            })}
                        </SerpIconsStacked>
                    );
                })}
                <SerpIconsGrouped>
                    {nonFeatured.map((serp, index) => {
                        return (
                            <SerpIconComponent
                                key={`non-featured-${index}`}
                                iconName={SERP_MAP[serp].icon}
                                onClick={() => onSerpIconClick(SERP_MAP[serp])}
                            />
                        );
                    })}
                </SerpIconsGrouped>
                {restFeatures > 0 && `+${restFeatures}`}
            </FlexRow>
        </TooltipComponent>
    );
};
