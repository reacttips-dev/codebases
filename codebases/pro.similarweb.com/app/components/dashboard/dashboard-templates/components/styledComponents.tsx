import { colorsPalettes } from "@similarweb/styles";
import { mixins } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import * as React from "react";
import styled from "styled-components";

export const AutocompleteWrapper = styled.div`
    height: 210px;
    z-index: 1000;
    position: relative;
    margin-top: 11px;
    .autoCompleteContainer {
        padding: 7px 0 10px 0;
    }
`;

export const StepFooter = styled.div`
    border-top: 1px solid ${colorsPalettes.midnight["50"]};
    padding: 15px 24px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;
export const StepHeader = styled.div`
    color: ${colorsPalettes.carbon["500"]};
    font-size: 20px;
    letter-spacing: 0.25px;
    line-height: 19px;
    margin-bottom: 9px;
    font-weight: 500;
`;

export const StepSubHeader = styled.div`
    color: ${colorsPalettes.carbon["500"]};
    font-size: 15px;
    letter-spacing: 0.25px;
    line-height: 25px;
    margin-bottom: 0px;
    font-weight: 400;
`;
export const StepParagraph = styled.div`
    margin: 0 0 14px;
`;

export const StepText = styled.span`
    ${setFont({ $size: 14, $weight: 300, $color: "rgba(42,62,82,0.8)" })};
    letter-spacing: 0.17px;
    line-height: 22px;
`;
export const StepsContainer = styled.div`
    height: 100%;
`;
export const StepsContent = styled.div`
    display: flex;
    margin-bottom: 15px;
    height: 100%;
`;
export const StepsContentPane = styled.div`
    width: 44%;
    flex-grow: 1;
    padding: 2px 36px;
`;
export const StepsContentPaneLeft = styled(StepsContentPane)`
    border-right: 1px solid ${colorsPalettes.carbon["50"]};
    height: 100%;
`;
export const StepsContentPaneRight = styled(StepsContentPane)`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
export const StepsContentPaneRightTop = styled.div``;
export const StepsContentPaneRightBottom = styled.div`
    padding: 19px 0 12px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    svg:first-child {
        margin: auto;
    }
    height: 100%;
`;
export const DashboardWizardCountryWrap = styled.div`
    max-width: 294px;
    height: calc(100% - 291px);
    display: flex;
    align-items: center;
    .country {
        padding-bottom: 15%;
    }
    .DropdownButton {
        width: 282px;
        background-color: #fff;
        padding-left: 10px;
        margin-top: 11px;
    }
    .DropdownButton--opened {
        color: rgba(42, 62, 82, 0.8);
    }
    i {
        padding-right: 10px;
    }
`;

export const DashboardWizardPreviewImage = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export const DashboardWizardPreviewImageHeader = styled.div`
    height: 64px;
    display: flex;
    align-items: center;
    padding-left: 24px;
    ${mixins.setFont({ $size: 16, $weight: 500, $color: colorsPalettes.carbon["500"] })};
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    flex-grow: 0;
`;

export const DashboardWizardPreviewImageFooter = styled.div`
    height: 68px;
    border-top: 1px solid ${colorsPalettes.carbon["50"]};
    flex-grow: 0;
`;

export const StepList = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
`;

export const StepListItem = styled.li`
    padding: 0;
    ${setFont({ $weight: 300, $size: 14, $color: "rgba(42,62,82,0.8)" })};
    text-indent: 10px;
    margin: 5px 0;
    &:before {
        content: "-";
        position: relative;
        left: -3px;
    }
`;
