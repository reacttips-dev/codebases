import { colorsPalettes } from "@similarweb/styles";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled, { css } from "styled-components";

export const LoaderMetric = styled.svg`
    width: 100%;
`;

LoaderMetric.displayName = "LoaderMetric";

export const Tabs = styled.div`
    display: flex;
    height: 111px;
    align-items: center;
    overflow: hidden;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    @media (max-width: 420px) {
        order: 2;
        overflow-x: visible;
        border-top: 1px solid rgba(0, 0, 0, 0.12);
    }
`;
Tabs.displayName = "Tabs";

export const StyledTab: any = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 20%;
    height: 100%;
    padding: 0 12px;
    border-right: ${(props: any) => (props.last ? "none" : "1px solid rgba(0, 0, 0, 0.12)")};
    cursor: pointer;
    @media (max-width: 420px) {
        width: 100%;
    }
    ${(props: any) =>
        props.active &&
        css`
            background-color: #f6fafe;
            :after {
                content: "";
                position: absolute;
                height: 3px;
                width: 100%;
                left: 0px;
                bottom: 0px;
                background-color: #4e8cf9;
                @media (max-width: 420px) {
                    order: 2;
                    width: 3px;
                    height: 100%;
                }
            }
        `}
`;
StyledTab.displayName = "StyledTab";

export const LoaderStyledTab = styled(StyledTab)`
    height: 46px;
`;

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

export const ChartLoaderContainer = styled.div`
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
ChartLoaderContainer.displayName = "ChartLoaderContainer";

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

export const LoaderWrapper: any = styled.div`
    display: flex;
    flex-direction: column;
    height: ${(props: any) => (props.height ? props.height + "px" : "100%")};
    width: 100%;
`;
LoaderWrapper.displayName = "LoaderWrapper";

export const Spacer = styled.div`
    margin-bottom: 10px;
`;
