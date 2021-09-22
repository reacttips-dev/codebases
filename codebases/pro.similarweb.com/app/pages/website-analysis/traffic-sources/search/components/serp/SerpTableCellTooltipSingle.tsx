import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";
import { ISiteSerpFeatures } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTableCellUtils";
import React from "react";
import {
    SerpIconComponent,
    SerpIconsComponentWithText,
} from "pages/website-analysis/traffic-sources/search/components/serp/SerpStyledComponents";
import { SERP_MAP } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTypes";
const Title = styled.div`
    ${setFont({ $size: 16, $color: rgba(colorsPalettes.carbon["500"], 0.8), $weight: 500 })};
    margin-bottom: 4px;
`;
const Subtitle = styled.div`
    ${setFont({ $size: 12, $color: rgba(colorsPalettes.carbon["500"], 0.6) })};
`;
const FeaturedTitle = styled.div`
    ${setFont({ $size: 14, $color: rgba(colorsPalettes.carbon["500"], 0.8) })};
    margin-bottom: 12px;
    margin-top: 16px;
`;
const Row = styled.div`
    margin-bottom: 8px;
`;
export const SerpTooltipContent: React.FC<{ serpFeatures: ISiteSerpFeatures }> = ({
    serpFeatures,
}) => {
    const hasFeaturedSerp = Object.keys(serpFeatures.featured).length > 0;
    const hasNonFeaturedSerp = serpFeatures.nonFeatured.length > 0;
    return (
        <FlexColumn>
            <Title>
                {i18nFilter()("serp.tooltip.title.forkeyword", {
                    keyword: serpFeatures.searchTerm,
                })}
            </Title>
            <Subtitle>
                {i18nFilter()("serp.tooltip.date", {
                    date: serpFeatures.date.format("MMM DD, YYYY"),
                })}
            </Subtitle>
            {hasFeaturedSerp && (
                <>
                    <FeaturedTitle>
                        {i18nFilter()("serp.tooltip.featured.in", {
                            name: serpFeatures.sites[0].name,
                        })}
                    </FeaturedTitle>
                    {Object.keys(serpFeatures.featured).map((serp) => {
                        return (
                            <Row>
                                <SerpIconsComponentWithText text={SERP_MAP[serp].name}>
                                    <SerpIconComponent
                                        background={colorsPalettes.blue["200"]}
                                        iconName={SERP_MAP[serp].icon}
                                    />
                                </SerpIconsComponentWithText>
                            </Row>
                        );
                    })}
                </>
            )}
            {hasNonFeaturedSerp && (
                <>
                    <FeaturedTitle>
                        {i18nFilter()(hasFeaturedSerp ? "serp.tooltip.featured.other" : "")}
                    </FeaturedTitle>
                    {serpFeatures.nonFeatured.map((serp) => {
                        return (
                            <Row>
                                <SerpIconsComponentWithText text={SERP_MAP[serp].name}>
                                    <SerpIconComponent iconName={SERP_MAP[serp].icon} />
                                </SerpIconsComponentWithText>
                            </Row>
                        );
                    })}
                </>
            )}
        </FlexColumn>
    );
};
export const SerpTableCellTooltipSingle: React.FC<any> = (props) => {
    return (
        <PopupHoverContainer
            config={{ enabled: true, width: 309, placement: "right" }}
            content={() => <SerpTooltipContent serpFeatures={props.serpFeatures} />}
        >
            {props.children}
        </PopupHoverContainer>
    );
};
