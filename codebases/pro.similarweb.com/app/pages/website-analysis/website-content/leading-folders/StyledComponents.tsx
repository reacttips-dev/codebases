import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";
import { FlexRow } from "../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import {
    LineSwitcherItem,
    Switcher,
    ISwitcherProps,
} from "@similarweb/ui-components/dist/switcher";
import { ScorableTab } from "@similarweb/ui-components/dist/tabs";
import { TabsCarousel } from "@similarweb/ui-components/dist/tabs/";

export const FolderAnalysisContainer: any = styled.div`
    display: flex;
    flex-direction: column;
    height: ${(props: any) => (props.height ? props.height + "px" : "auto")};
`;
FolderAnalysisContainer.displayName = "FolderAnalysisContainer";

export const ChartAndInfo = styled.div`
    display: flex;
    flex-direction: row;
    height: calc(100% - 111px - 68px);
    @media (max-width: 420px) {
        order: 1;
        flex-direction: column;
    }
`;
ChartAndInfo.displayName = "ChartAndInfo";

export const ChartContainer = styled.div`
    width: calc(100% - 300px);
    height: 100%;
    padding: 40px 34px 28px 26px;
    [data-highcharts-chart] {
        height: calc(100% - 20px); // minus padding-bottom
    }
    @media (max-width: 420px) {
        order: 2;
        width: 100%;
        height: 340px;
    }
`;
ChartContainer.displayName = "ChartContainer";

export const SimpleChartContainer = styled.div`
    width: calc(100% - 60px);
    height: 360px;
    padding: 20px 34px 28px 26px;
    .highcharts-plot-line-label {
        z-index: 1;
        bottom: 28px;
        top: auto !important;
    }
    .highcharts-plot-line-label:first-of-type,
    .highcharts-plot-line-label:last-of-type {
        z-index: 2;
    }
    [data-highcharts-chart] {
        height: calc(100% - 20px); // minus padding-bottom
    }
    @media (max-width: 420px) {
        order: 2;
        width: 100%;
        height: 360px;
    }
    .gran-switch {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 5px;
        span:last-of-type {
            button {
                border-right: 1px solid ${colorsPalettes.carbon["50"]};
            }
        }
    }
`;
SimpleChartContainer.displayName = "SimpleChartContainer";

export const InfoContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 100%;
    padding-left: 28px;
    padding-right: 28px;
    justify-content: center;
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    :before,
    :after {
        left: -1px;
        top: 50%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    :before {
        border-color: rgba(220, 222, 223, 0);
        border-left-color: ${colorsPalettes.carbon["100"]};
        border-width: 12px;
        margin-top: -12px;
    }
    :after {
        border-color: rgba(255, 255, 255, 0);
        border-left-color: ${colorsPalettes.carbon["0"]};
        border-width: 11px;
        margin-top: -11px;
    }
    @media (max-width: 420px) {
        order: 1;
        width: 100%;
        height: 70px;
        border-left: none;
        :before {
            display: none;
        }
        :after {
            display: none;
        }
    }
`;
InfoContainer.displayName = "InfoContainer";

const PointTitle = styled.div`
    font-size: 16px;
    color: ${colorsPalettes.carbon["500"]};
`;
PointTitle.displayName = "PointTitle";

export const NoChange: any = styled(FlexRow)`
    justify-content: center;
`;
NoChange.displayName = "NoChange";

export const LineSwitcherStyled = styled(Switcher)<ISwitcherProps>`
    position: relative;
    top: -7px;
    text-align: right;
`;

export const LineSwitcherItemStyled = styled(LineSwitcherItem)`
    padding: 0 6px;
`;

export const StyledScorableTab = styled(ScorableTab)`
    width: 100%;

    @media (max-width: 1680px) {
        width: 190px;
    }
    &:last-of-type {
        border-right: 1px solid ${colorsPalettes.carbon["50"]};
    }
    &.scorable-tab {
        padding: 16px 14px;
        .value {
            font-size: 24px;
        }
        @media (max-width: 1440px) {
            padding: 12px 14px;
            .value {
                font-size: 18px;
            }
        }
        @media (max-width: 1280px) {
            padding: 8px;
            .value {
                font-size: 16px;
            }
            .ChangeValue {
                margin-left: 4px;
            }
        }
    }
`;

export const StyledTabsCarousel = styled(TabsCarousel)`
    .carouselItemWrapper {
        flex: 1 1 0;
        overflow: hidden;
        @media (max-width: 1680px) {
            flex: unset;
            overflow: unset;
        }
    }
`;

export const MTDLabel = styled.span`
    margin: 0 16px 0 8px;
`;

export const MTDTitle = styled(FlexRow)`
    cursor: pointer;
`;
