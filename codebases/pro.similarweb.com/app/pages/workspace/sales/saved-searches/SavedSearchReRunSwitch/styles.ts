import styled, { css } from "styled-components";
import { rgba, colorsPalettes } from "@similarweb/styles";
import SavedSearchReRunSwitch from "./SavedSearchReRunSwitch";
import { StyledSaveSearchAutoRerunText } from "pages/lead-generator/lead-generator-wizard/components/SaveSearch/StyledSaveSearchComponent";

export const StyledSavedSearchReRunSwitch = styled(SavedSearchReRunSwitch)`
    align-items: center;
    display: flex;

    ${StyledSaveSearchAutoRerunText} {
        ${({ disabled }) =>
            disabled &&
            css`
                color: ${rgba(colorsPalettes.carbon[500], 0.4)};
            `}
    }
`;
