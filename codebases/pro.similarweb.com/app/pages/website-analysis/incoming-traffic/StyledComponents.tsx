import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { Banner } from "@similarweb/ui-components/dist/banner";
import { IconButton } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import styled, { css } from "styled-components";
import StyledBoxSubtitle from "../../../../.pro-features/styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { SearchContainer } from "pages/workspace/StyledComponent";
import { CenteredFlexRow, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { BooleanSearchWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";
import { BooleanSearchActionListStyled } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearchStyled";

// TODO: liorb - stop using this component. add the margin to the base component
export const SubTitleReferrals = styled(StyledBoxSubtitle)`
    margin-top: 6px;
    ${mixins.setFont({ $size: 14 })}
`;

export const CloseIconButton = styled(IconButton)`
    margin-left: 10px;
`;

export const ToggleIconButton = styled(IconButton)`
    margin-left: -8px;
`;

export const ReferralsPage = styled.div`
    margin-bottom: 50px;
`;

export const TrafficOverTime = styled.div`
    display: flex;
    padding: 19px 20px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;
export const TrafficOverTimeLeft = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: flex-start;
`;
export const TrafficOverTimeBaseWrap = styled.div`
    position: relative;
`;

export const TrafficShareWithTooltipContainer = styled.div`
    width: 20rem;
    @media (max-width: 1400px) {
        width: 16rem;
    }
    @media (max-width: 1250px) {
        width: 12rem;
    }
`;

export const TrafficOverTimeWebSiteWrap = styled(TrafficOverTimeBaseWrap)`
    margin-left: 43px;
    width: 215px;
`;
export const TrafficOverTimeShareWrap = styled(TrafficOverTimeBaseWrap)`
    margin-left: 0;
    width: 130px;
`;

export const PhrasesOverTimeWebSiteWrap = styled(TrafficOverTimeBaseWrap)`
    margin-left: 43px;
    .search-keyword {
        a {
            max-width: 270px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            @media (max-width: 1425px) {
                max-width: 160px;
            }
        }
    }
`;

export const PhrasesOverTimeShareWrap = styled(TrafficOverTimeBaseWrap)`
    margin-left: 96px;
    width: 200px;
`;

export const PhrasesOverTimeCompareShareWrap = styled(TrafficOverTimeBaseWrap)`
    margin-left: 8px;
    width: 200px;
`;

export const TrafficOverTimeTitle = styled.div`
    position: absolute;
    top: -20px;
    ${mixins.setFont({ $size: 12, $weight: 500, $color: rgba(colorsPalettes.carbon[500], 0.6) })};
`;
export const TrafficOverTimeChangeWrap = styled(TrafficOverTimeBaseWrap)`
    margin-left: 40px;
`;
export const TrafficOverTimeChangeWrapShare = styled(TrafficOverTimeChangeWrap)`
    width: 25%;
`;
export const TrafficOverTimeIndex = styled.div`
    margin-left: 60px;
`;

export const OutgoingTrafficOverTimeIndex = styled.div`
    margin-left: 12px;
`;

export const SocialTrafficOverTimeIndex = styled.div`
    padding: 12px;
    width: 65px;
    text-align: center;
`;

export const PhrasesOverTimeIndex = styled.div`
    margin-left: 14px;
`;

export const TrafficOverTimeChart = styled.div`
    padding: 24px;
    height: 330px;
`;

export const TrafficOverTimeChartTitle = styled.div`
    ${mixins.setFont({ $size: 16, $weight: 500, $color: colorsPalettes.carbon[500] })};
    margin-bottom: 20px;
`;
const marginBottom = css`
    margin-bottom: 15px;
`;
export const TrafficOverTimeChartToolTip = styled.div`
    padding: 10px 15px 5px;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.carbon[200], 0.5)};
    border-radius: 5px;
    strong {
        ${mixins.setFont({
            $color: rgba(colorsPalettes.carbon[500], 0.8),
            $weight: 500,
            $size: 14,
        })};
        display: block;
        ${marginBottom}
    }
`;
export const TrafficOverTimeChartToolTipBottom = styled.div`
    margin-top: 11px;
    display: flex;
    justify-content: space-between;
`;
export const StackLabel = styled.b`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $size: 14, $weight: 400 })};
`;
export const TrafficOverTimeChartToolTipRowWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${marginBottom}
`;
export const TrafficOverTimeChartToolTipRow = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $size: 14 })};
`;
export const TrafficOverTimeChartToolTipColor = styled(TrafficOverTimeChartToolTipRow)<{
    color: string;
}>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
    margin-right: 8px;
`;
export const TrafficOverTimeChartToolTipName = styled(TrafficOverTimeChartToolTipRow)`
    flex-grow: 1;
`;
export const TrafficOverTimeChartToolTipChange = styled(TrafficOverTimeChartToolTipRow)`
    ${mixins.setFont({ $color: rgba(colorsPalettes.carbon[500], 0.8), $weight: 300, $size: 14 })};
`;

export const EducationBanner = styled(Banner)`
    margin-bottom: 20px;
    height: 72px;
    svg use {
        fill: ${colorsPalettes.carbon[0]};
    }
`;

export const CenteredWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

export const NoEngagementScore = styled.div`
    padding-left: 10px;
`;

export const LowTrafficCompareWrapper = styled.div`
    padding-left: 2px;
`;

export const Number = styled.span`
    margin-right: 4px;
    ${mixins.setFont({ $size: 32, $color: colorsPalettes.carbon[500], $weight: 300 })};}
`;

export const Text = styled.span`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    max-width: 90px;
    margin-left: 8px;
    line-height: 19px;
`;

export const Separator = styled.hr`
    border-top-color: ${colorsPalettes.carbon[50]};
    margin: 0;
`;

export const TotalItem = styled.div`
    height: 41px;
    flex-grow: 1;
    text-transform: capitalize;
    padding-left: 15px;
    display: flex;
    align-items: center;
    border-right: 1px solid ${colorsPalettes.carbon[50]};
    justify-content: center;
    &:last-of-type {
        border-right: 0;
    }
`;

export const SectionContainer = styled.div`
    padding: 0 24px;
`;

export const SearchContainerWrapper = styled(FlexRow)`
    padding: 5px 16px;
    min-height: 56px;
    height: auto;
    display: flex;
    align-items: center;
    font-size: 14px;
    justify-content: space-between;
    border-top: 1px solid ${colorsPalettes.carbon[100]};

    ${BooleanSearchWrapper} {
        flex-grow: 1;
        input {
            margin: 8px;
        }
        .boolean-search {
            ${BooleanSearchActionListStyled} {
                top: 36px;
            }
        }
    }
`;

export const Container = styled.div`
    display: flex;
    align-items: center;
    ${SearchContainerWrapper} {
        flex-grow: 1;
    }
`;

export const SectionWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
export const Filters = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;
export const FiltersGrow = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
`;
export const FiltersBottom = styled.div`
    align-items: center;
    display: flex;
`;
export const FiltersTop = styled.div`
    display: flex;
`;
export const Filter = styled.div`
    width: auto;
    margin: 0 8px 16px 0;
`;

export const Section = styled.div<{ margin?: number }>`
    padding: 0 12px;
    display: flex;
    align-items: center;
    ${({ margin }) =>
        margin &&
        css`
            margin: ${margin}px 0;
        `};
    width: 100%;
`;

export const EnrichedRowHeaderTrafficShare = styled.span`
    .min-value {
        margin-right: 10px;
    }
`;

export const TrafficOverTimeShareWithAbsWrap = styled(TrafficOverTimeBaseWrap)`
    margin-left: 0;
    width: 200px;
`;

export const AbsValueWrapper = styled.span`
    font-size: 14px;
`;

export const TrafficOverTimeWebSiteWrapForAbsNums = styled(TrafficOverTimeWebSiteWrap)`
    margin-right: 20px;
`;

export const LoaderWrapper = styled(CenteredFlexRow)`
    min-height: 530px;
`;

export const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
    align-self: flex-start;
    margin-top: 4px;
`;
