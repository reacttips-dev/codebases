import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba, fonts } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Box } from "@similarweb/ui-components/dist/box";
import { Button } from "@similarweb/ui-components/dist/button";
import { Spinner } from "components/Loaders/src/Spinner";
import React from "react";
import styled from "styled-components";
import { Tab } from "@similarweb/ui-components/dist/tabs";

export const SeeMoreButton = styled(Button)``;

export const NoDataTitle = styled.div`
    ${setFont({ $size: "16px", $color: colorsPalettes.carbon[500] })};
    margin-top: 10px;
`;

export const NoDataSubTitle = styled.div`
    ${setFont({ $size: "12px", $color: rgba(colorsPalettes.carbon[500], 0.6) })};
    text-align: center;
`;

export const NoDataContainer = styled.div<{ paddingTop?: string; paddingBottom?: string }>`
    ${({ paddingTop = "0" }) => `padding-top: ${paddingTop}`};
    ${({ paddingBottom = "0" }) => `padding-bottom: ${paddingBottom}`};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const SubTitleContainer = styled.div`
    display: flex;
    padding-bottom: 8px;
`;

export const Subtitle = styled.label<{ fontSize?: number }>`
    margin-top: auto;
    margin-bottom: auto;
    font-family: Roboto;
    ${({ fontSize = 14 }) =>
        setFont({ $size: fontSize, $color: rgba(colorsPalettes.carbon[500], 1) })};
`;

export const Text = styled.label<{ fontSize?: number; fontWeight?: number; opacity?: number }>`
    display: inline-block;
    overflow: hidden;
    margin: auto 8px auto 0;
    white-space: nowrap;
    cursor: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight}`};
    ${({ fontSize = 14, opacity = 0.8 }) =>
        setFont({ $size: fontSize, $color: rgba(colorsPalettes.carbon[500], opacity) })};
`;

export const TrafficShareText = styled(Text)`
    margin: auto 0px auto 0;
    text-overflow: clip;
`;

export const TableHeaderText = styled(Text)`
    margin: 0;
    align-self: flex-end;
    padding-bottom: 4px;
`;
export const TableHeaderVolumeText = styled(TableHeaderText)`
    padding-top: 13px;
`;

export const Link = styled(Text)`
    ${({ fontSize = 14 }) =>
        setFont({ $size: fontSize, $color: rgba(colorsPalettes.blue[400], 0.8) })};
    cursor: pointer;
`;

export const VolumeText = styled(TableHeaderText)`
    vertical-align: middle;
`;

export const MetricTitleText = styled(Text)`
    padding-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${({ fontSize = 20 }) =>
        setFont({ $size: fontSize, $color: colorsPalettes.carbon[500], $weight: 500 })};
`;

export const MetricsRowHeader = styled(Text)`
    margin: 24px 0 16px 0;
    font-weight: 500;
    line-height: 30px;
    ${setFont({ $size: 20, $color: rgba(colorsPalettes.carbon[500], 1) })};
`;

export const CpcText = styled(Text)`
    font-family: ${fonts.$dmSansFontFamily};
    line-height: 30px;
    padding-top: 91px;
`;

export const Icon = styled(SWReactIcons)<{ marginLeft?: string; marginRight?: string }>`
    ${({ marginLeft = "5px" }) => `margin-left:${marginLeft}`}
    ${({ marginRight = "5px" }) => `margin-right:${marginRight}`}
`;

const MetricContainerWrapper = styled(Box)<{
    width?: string;
    height?: string;
    minHeight?: string;
    padding?: string;
    overflow?: string;
}>`
    ${({ width = "33.3%" }) => `width:${width}`};
    ${({ height = "189px" }) => `height:${height}`};
    ${({ minHeight }) => minHeight && `min-height: ${minHeight};`};
    ${({ padding = "24px" }) => `padding:${padding}`};
    background-color: white;
    @media (max-width: 1400px) {
        ${({ padding = "16px" }) => `padding:${padding}`};
    }
    ${({ overflow = "hidden" }) => `overflow:${overflow}`};
`;

export const MetricContainer = ({ children, ...rest }) => {
    return (
        <MetricContainerWrapper {...rest}>
            <div style={{ position: "relative", height: "100%" }}>{children}</div>
        </MetricContainerWrapper>
    );
};

export const MetricsSpace = styled.div`
    margin: 0 11px 0 11px;
    @media (max-width: 1500px) {
        margin: 0 8.5px 0 8.5px;
    }
`;

export const MetricContainerWithoutShadow = styled.div<{ width?: string; height?: string }>`
    ${({ width = "33.3%" }) => `width:${width}`}
    ${({ height = "189px" }) => `height:${height}`}
      background-color: white;
    padding: 15px 24px 15px 24px;
    border: 1px solid ${rgba(colorsPalettes.midnight[600], 0.08)};
    @media (max-width: 1400px) {
        padding: 16px;
    }
`;

export const FlexWithSpace = styled.div<{
    width?: string;
    height?: string;
    paddingBottom?: string;
    paddingTop?: string;
}>`
    display: flex;
    justify-content: space-between;
    ${({ width }) => width && `width: ${width}`};
    ${({ height }) => height && `height:${height}`};
    ${({ paddingBottom }) => paddingBottom && `padding-bottom:${paddingBottom}`};
    ${({ paddingTop }) => paddingTop && `padding-top:${paddingTop}`};
`;

export const CategoriesTableContainer = styled(FlexWithSpace)`
    height: 16px;
    padding: 6px 8px;
`;

export const TableRowContainer = styled(FlexWithSpace)`
    padding: 0 8px;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
`;

export const TopCategoriesTableRowContainer = styled(TableRowContainer)`
    height: 36px;
    padding: 3px 8px 0 8px;
    display: grid;
    grid-template-columns: 45% 25% 30%;
`;
export const CompetitorsTableRowContainer = styled(TableRowContainer)`
    padding: 5px 0px 5px 8px;
    @media (max-width: 1350px) {
        width: 250px;
    }
    @media print {
        width: 100%;
    }
`;

export const MetricsRow = styled(FlexWithSpace)<{ marginTop?: string }>`
    ${({ marginTop = "0" }) => `margin-top: ${marginTop}`};
`;

export const MetricsRowContainer = styled.div<{ isPrintAndPdfHidden?: boolean }>`
    @media print {
        page-break-inside: avoid;
        ${({ isPrintAndPdfHidden = false }) => isPrintAndPdfHidden && `display: none`};
    }
`;

export const ArrowRightIcon = styled.div`
    margin-top: auto;
    margin-bottom: auto;
    position: absolute;
    right: 5px;
    top: 13px;
    visibility: hidden;
`;

export const CategoriesTableHeaderContainer = styled(CategoriesTableContainer)`
    display: grid;
    grid-template-columns: 67% 33%;
`;

export const CountriesTableHeaderContainer = styled(CategoriesTableContainer)``;

export const CountryIcon = styled.div`
    height: 12px;
    width: 12px;
    margin: 12px 8px 0 2px;
`;

export const CountriesTableRowContainer = styled.div`
    height: 40px;
    display: flex;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    justify-content: space-between;
    padding-left: 4px;
`;

export const CategoriesText = styled(Text)`
    width: 180px;
    text-overflow: ellipsis;
    @media (max-width: 1350px) {
        width: 164px;
    }
    @media (min-width: 1600px) and (max-width: 1800px) {
        width: 220px;
    }
    @media (min-width: 1800px) {
        width: 250px;
    }
`;

export const CategoriesTableRowContainer = styled.div<{ selectedRow?: number; index?: number }>`
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 29px;
    display: grid;
    grid-template-columns: 65% 35%;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    padding: 6px 0px 4px 10px;
    justify-content: space-between;
    &:nth-child(${({ selectedRow = 0 }) => selectedRow !== undefined && selectedRow + 2}) {
        background-color: ${colorsPalettes.sky[100]};
        border-left: 3px solid ${colorsPalettes.blue[400]};
    }
    &:hover {
        ${({ selectedRow, index }) =>
            selectedRow !== index && `background-color: ${colorsPalettes.carbon[25]};`}
        ${ArrowRightIcon} {
            visibility: visible;
        }
    }
`;

export const LoadingSpinner = styled(Spinner)<{ top?: string }>`
    margin: 0 auto;
    position: relative;
    top: ${({ top }) => (top ? top : "40px")};
    width: 55px;
    height: 55px;
`;

export const TrendCellContainer = styled.div`
    width: 65px;
    padding-top: 6px;
`;

export const TopCountriesTrendCellContainer = styled(TrendCellContainer)`
    width: 125px;
`;

export const TopCountriesCountryContainer = styled.div`
    width: 49%;
    display: flex;
`;

export const ProgressContainer = styled(Text)`
    ${({ fontSize = 13, opacity = 0.8 }) =>
        setFont({ $size: fontSize, $color: rgba(colorsPalettes.carbon[500], opacity) })};
`;

export const SeeMoreContainer = styled.div<{ textAlign?: string }>`
    ${({ textAlign = "center" }) => `text-align:${textAlign}`};
    margin-bottom: 16px;
`;

export const GridContainer = styled(CompetitorsTableRowContainer)<{
    isFirst: boolean;
    isCenter?: boolean;
}>`
    @media (max-width: 1350px) {
        width: 100%;
    }
    ${({ isFirst }) => isFirst && `border-top: none`};
    align-items: center;
    padding: 0 20px 0 20px;
    box-sizing: border-box;
    .Loader--line {
        width: 75%;
        height: 10px;
        margin-bottom: 0px;
        margin-left: 20px;
    }
    ${({ isCenter }) => isCenter && `justify-content: center;`};
`;

export const LoaderContainer = styled.div`
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 90%;
`;

export const ColLoader: any = styled.div<{ width?: string }>`
    margin-right: ${({ isLast }: any) => (isLast ? "0px" : "30px")};
    ${({ width }) => `width: ${width}`};
    padding-bottom: 10px;
    padding-top: 7px;
    box-sizing: border-box;
`;

export const CategoriesDomainContainer = styled.div`
    width: 61%;
    height: 16px;
`;

export const CategoriesShareContainer = styled(FlexWithSpace)`
    justify-content: flex-end;
    height: 16px;
`;

export const TrafficShareContainer = styled(FlexWithSpace)`
    height: 36px;
    width: 120px;
    @media (max-width: 1500px) {
        width: 115px;
    }
    @media print {
        width: 120px;
    }
`;

export const PositionContainer = styled(TrafficShareContainer)`
    width: 60px;
    @media (max-width: 1500px) {
        width: 60px;
    }
`;

export const TrafficShareTopCategoriesContainer = styled(FlexWithSpace)`
    height: 16px;
`;

export const ProgressShareContainer = styled.div`
    width: 80px;
    display: flex;
    justify-content: end;
`;

export const KeywordsCompetitorsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const SeeMoreWithCount = styled.div`
    display: none;
    @media (min-width: 1441px) {
        display: block;
    }
`;
export const SeeMoreWithoutCount = styled.div`
    display: none;
    @media (max-width: 1440px) {
        display: block;
    }
`;

export const PhraseMatchContainer = styled(KeywordsCompetitorsContainer)``;
export const AdsContainer = styled(KeywordsCompetitorsContainer)``;
export const TrendingKeywordsContainer = styled(KeywordsCompetitorsContainer)``;
export const RelevancyScoreContainer = styled.div`
    width: 62px;
`;

export const ScoreContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const RelatedKeywordsRow = styled.div`
    display: grid;
    grid-template-columns: 60% 25% 15%;
    width: 100%;
`;

export const TopCategoriesContainer = styled.div`
    display: flex;
    height: 100%;
`;

export const TopCategoriesContainerLeft = styled.div`
    width: 47%;
    height: auto;
    @media (max-width: 1400px) {
        width: 51%;
    }
`;
export const TopCountriesContainer = styled.div`
    width: 100%;
    height: auto;
`;

export const TopCategoriesContainerRight = styled.div`
    width: 45.8%;
    height: auto;
`;

export const TopCategoriesRightRow = styled.div`
    display: grid;
    grid-template-columns: 45% 25% 30%;
    width: 100%;
`;

export const AlignEndContainer = styled(Text)`
    display: line-block;
    text-align: end;
    width: 100%;
`;

export const AdsTable = styled.div`
    overflow: hidden;
    height: 100%;
`;

export const AdsRow = styled.div<{ atype?: string }>`
    display: flex;
    margin-top: 18px;
    height: 130px;
    align-items: center;
    ${({ atype }) =>
        `border: ${atype === "text" ? `1px solid ${colorsPalettes.midnight["50"]}` : "none"}`};
    a {
        cursor: pointer;
    }
    overflow: hidden;
    &::-webkit-scrollbar {
        width: 7px;
    }
    &::-webkit-scrollbar-button {
        display: none;
    }
    &::-webkit-scrollbar-track {
        background: #{map-get($color_palette_carbon, 50)};
    }
    &::-webkit-scrollbar-thumb {
        background-color: darkgrey;
    }
`;

export const CoreKeywordCellContainer = styled.div`
    display: flex;
`;

export const CoreShareCellContainer = styled.div`
    justify-content: flex-end;
    display: flex;
`;

export const CoreCpcCellContainer = styled.div<{ paddingRight?: string }>`
    justify-content: flex-end;
    display: flex;
    padding-right: ${({ paddingRight }) => (paddingRight ? `${paddingRight}` : "10px")};
    height: 20px;
    margin-top: auto;
    margin-bottom: auto;
`;
export const MetricsSpaceCouple = styled.div`
    margin: 0 12px 0 12px;
`;
export const KeywordsIdeasTableHeader = styled(FlexWithSpace)`
    padding: 0 8px;
`;

const CompetitorsLayout = styled.div`
    width: 70%;
    @media (max-width: 1600px) {
        width: 50%;
    }
    @media (max-width: 1400px) {
        width: 45%;
    }
`;

export const DomainContainer = styled(CompetitorsLayout)`
    height: 36px;
    display: flex;
    padding-left: 10px;
`;

export const CategoriesTableDomainContainer = styled(DomainContainer)`
    height: 16px;
    padding-left: 0;
`;

export const CoreWebsiteCellContainer = styled(CompetitorsLayout)`
    display: flex;
`;

export const TopCountriesSeeMoreWrapper = styled.div`
    padding-top: 12px;
`;
export const WideCoreWebsiteCellContainer = styled.div`
    width: 80%;
    @media (max-width: 1600px) {
        width: 70%;
    }
    @media (max-width: 1400px) {
        width: 60%;
    }
`;

export const WideDomainContainer = styled(WideCoreWebsiteCellContainer)`
    height: 36px;
    display: flex;
    padding-left: 10px;
`;

export const NoDataIcon = styled(SWReactIcons)`
    svg {
        width: 194px;
        height: 90px;
    }
`;

export const StyledTab = styled(Tab)`
    min-width: 200px;
`;
