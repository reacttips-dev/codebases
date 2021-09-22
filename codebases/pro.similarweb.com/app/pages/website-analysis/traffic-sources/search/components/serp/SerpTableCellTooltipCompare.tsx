import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";

import React from "react";

import { Legend } from "@similarweb/ui-components/dist/legend";
import { Labels } from "@similarweb/ui-components/dist/legend/src/Legend";
import { ISiteSerpFeatures } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTableCellUtils";
import { SerpIconComponent } from "./SerpStyledComponents";
import { SerpIconsStacked } from "./SerpStyledComponents";
import { SERP_MAP } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTypes";
const Title = styled.div`
    ${setFont({ $size: 16, $color: rgba(colorsPalettes.carbon["500"], 0.8), $weight: 500 })};
    margin-bottom: 4px;
`;
const Subtitle = styled.div`
    ${setFont({ $size: 12, $color: rgba(colorsPalettes.carbon["500"], 0.6) })};
    margin-bottom: 16px;
`;
const Row = styled(FlexRow)`
    align-items: center;
    margin-bottom: 8px;
`;

const CustomLegendItem = styled.div`
    display: flex;
    margin-right: 12px;
`;

const CustomLegend = (props) => {
    return (
        <Legend
            {...props}
            dataLabel={Labels.Bullet}
            render={({ bullet, text, icons, value, subValue, onClick, isDisabled }) => {
                return (
                    <CustomLegendItem>
                        {bullet}
                        {text}
                        {icons}
                    </CustomLegendItem>
                );
            }}
        />
    );
};
const TableHeader = styled.div`
    flex-grow: 1;
    flex-basis: 50%;
`;
const SerpName = styled.div`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon["500"] })};
`;
const SerpIconStackedContainer = styled.div`
    flex-grow: 1;
    flex-basis: 50%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;
const LegendContainer = styled.div`
    flex-grow: 1;
    flex-basis: 50%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`;
export const SerpTooltipCompareContent: React.FC<{ serpFeatures: ISiteSerpFeatures }> = ({
    serpFeatures,
}) => {
    const maxIconsInGroup = Object.entries(serpFeatures.featured).reduce((max, [serp, sites]) => {
        return Math.max(max, sites.length);
    }, 1);
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
            <Row>
                <TableHeader style={{ flexShrink: 0 }}>
                    {i18nFilter()("serp.tooltip.compare.feature")}
                </TableHeader>
                <TableHeader>{i18nFilter()("serp.tooltip.compare.featured.websites")}</TableHeader>
            </Row>
            {Object.entries(serpFeatures.featured).map(([serp, sites], index) => {
                return (
                    <Row key={`featured-${index}`}>
                        <SerpIconStackedContainer>
                            <SerpIconsStacked numOfChildes={maxIconsInGroup}>
                                {sites.map(({ color }, index) => {
                                    return (
                                        <SerpIconComponent
                                            key={`featured-${index}`}
                                            background={color}
                                            iconName={SERP_MAP[serp].icon}
                                        />
                                    );
                                })}
                            </SerpIconsStacked>
                            <SerpName>{SERP_MAP[serp].name}</SerpName>
                        </SerpIconStackedContainer>
                        <LegendContainer>
                            {sites.map(({ name, color }, index) => {
                                return (
                                    <CustomLegend
                                        key={`site-${index}`}
                                        text={name}
                                        isChecked={true}
                                        size={1}
                                        labelColor={color}
                                    />
                                );
                            })}
                        </LegendContainer>
                    </Row>
                );
            })}
            {serpFeatures.nonFeatured.map((serp, index) => {
                return (
                    <Row key={`non-featured-${index}`}>
                        <SerpIconsStacked numOfChildes={maxIconsInGroup}>
                            <SerpIconComponent iconName={SERP_MAP[serp].icon} />
                        </SerpIconsStacked>
                        <SerpName>{SERP_MAP[serp].name}</SerpName>
                    </Row>
                );
            })}
        </FlexColumn>
    );
};

export const SerpTableCellTooltipCompare: React.FC<{ serpFeatures: ISiteSerpFeatures }> = (
    props,
) => {
    return (
        <PopupHoverContainer
            config={{ enabled: true, width: 430, placement: "right" }}
            content={() => <SerpTooltipCompareContent serpFeatures={props.serpFeatures} />}
        >
            {props.children}
        </PopupHoverContainer>
    );
};
