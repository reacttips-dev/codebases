import styled from "styled-components";
import { ButtonPrimary } from "@similarweb/ui-components/dist/button/src/button-types/ButtonPrimary";
import { colorsPalettes } from "@similarweb/styles";
import { StyledCommonTransitionedElement } from "../../styles";

export const PANEL_SUBMIT_TRANSITION_PREFIX = "filters-panel-submit-section";

export const StyledPanelSubmitSectionInner = styled.div`
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px;

    .Button:last-child {
        margin-left: 16px;
    }

    // & > ${ButtonPrimary} {
    //     background-color: ${colorsPalettes.blue["400"]};
    // }
`;

export const StyledPanelSubmitSection = styled(StyledCommonTransitionedElement)`
    background-color: ${colorsPalettes.carbon["0"]};
    border-top: 1px solid ${colorsPalettes.carbon["50"]};
    bottom: 0;
    left: 0;
    position: absolute;
    width: 100%;
`;
