import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import {
    SegmentsWarningBannerContainer,
    SegmentsWarningBannerContent,
} from "pages/segments/wizard/SegmentWizard/SegmentWizardStyles";

export const SegmentsAnalysisContainer = styled.div`
    padding: 40px;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    align-items: center;
`;
SegmentsAnalysisContainer.displayName = "SegmentsAnalysisContainer";

export const StyledSegmentsWarningBannerContainer = styled(SegmentsWarningBannerContainer)`
    padding: 14px 0px;
    justify-content: center;
    width: 100%;
    & + & {
        margin-top: 10px;
    }
    ${SegmentsWarningBannerContent} {
        margin-left: 25px;
    }
`;

export const StyledSegmentsWarningBannerContent = styled(SegmentsWarningBannerContent)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1368px;
    text-align: left;
`;

export const SegmentsWarningBannerActionsSection = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin: -8.5px 0 -8.5px 8px;
    white-space: nowrap;
`;

export const SegmentsWarningCloseButton = styled(IconButton).attrs({
    type: "flat",
    iconName: "close",
    iconSize: "xs",
})`
    margin-left: 8px;

    .SWReactIcons > svg {
        width: 100%;
        height: 100%;
    }
`;

export const SegmentTypeBadge = styled.span`
    display: inline;
    padding: 5px 4px 3px;
    color: ${colorsPalettes.carbon[400]};
    background: ${colorsPalettes.carbon[50]};
    border-radius: 4px;
    font-size: 8px;
    line-height: 8px;
    text-transform: uppercase;
`;
