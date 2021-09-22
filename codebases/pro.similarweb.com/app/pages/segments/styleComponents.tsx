import styled, { createGlobalStyle } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { SimpleLegend } from "@similarweb/ui-components/dist/simple-legend";
import React from "react";

export const SegmentsBackButtonContainer = styled.div`
    height: 100%;
    flex: none;
    display: flex;
    align-items: center;
    padding: 0 16px;
    margin-right: 16px;
    border-right: 1px solid ${colorsPalettes.carbon["50"]};
`;
export const SegmentsBackButton = styled(IconButton).attrs({
    type: "flat",
    iconName: "arrow-left",
})``;

export const SegmentsQueryBarContainer: any = styled.div`
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-size: 24px;
    line-height: 32px;
    font-weight: 500;
    color: ${colorsPalettes.carbon["500"]};
`;
SegmentsQueryBarContainer.displayName = "SegmentsQueryBarContainer";

export const SegmentsUpsellButton = styled(IconButton).attrs({
    iconName: "locked",
    type: "upsell",
    iconSize: "xs",
    placement: "left",
})`
    svg path {
        fill-opacity: 1;
    }
`;

export const SegmentsTableStyles = createGlobalStyle`
    .segmentRowDisabled:after {
        display: block;
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #fff;
        opacity: 0.75;
    }
`;
