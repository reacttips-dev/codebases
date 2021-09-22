import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import { FlexRow, FlexColumn } from "../StyledFlex/src/StyledFlex";
import styled from "styled-components";

const br1 = "800px";

export const ChartAndInfo: any = styled(FlexRow).attrs({
    "data-automation-graph-with-info": true,
})`
    height: 318px;
    padding: 24px 24px;
    > div:first-child {
        width: calc(100% - 250px);
        @media (max-width: ${br1}) {
            width: 100%;
        }
    }
    @media (max-width: ${br1}) {
        flex-direction: column;
    }
`;
ChartAndInfo.displayName = "ChartAndInfo";

export const CenterInfo: any = styled(FlexColumn).attrs({
    "data-automation-graph-info": true,
})`
    position: relative;
    align-items: center;
    margin-left: 24px;
    width: 278px;
    padding-left: 24px;
    border-left: 1px solid ${colorsPalettes.carbon["100"]};
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
        border-left-color: ${colorsPalettes.carbon["200"]};
        border-width: 12px;
        margin-top: -12px;
    }
    :after {
        border-color: rgba(255, 255, 255, 0);
        border-left-color: ${colorsPalettes.carbon["0"]};
        border-width: 11px;
        margin-top: -11px;
    }
    @media (max-width: ${br1}) {
        position: relative;
        width: calc(100% + 24px);
        left: -24px;
        flex-basis: 80px;
        border-top: 1px solid #e0e0e0;
        border-left: none;
        margin-top: 24px;
        margin-left: 0px;
        padding-top: 24px;
        padding-left: 24px;
        :before {
            display: none;
        }
        :after {
            display: none;
        }
    }
`;
CenterInfo.displayName = "CenterInfo";

export const NoChange: any = styled(FlexRow)`
    justify-content: center;
`;
NoChange.displayName = "NoChange";

export const RightAlignedButton = styled.div`
    align-self: flex-end;
`;
RightAlignedButton.displayName = "RightAlignedButton";
