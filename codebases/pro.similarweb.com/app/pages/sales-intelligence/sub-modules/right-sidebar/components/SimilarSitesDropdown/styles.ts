import styled from "styled-components";
import { AutocompleteStyled } from "components/AutocompleteWebsites/styles";

export const StyledSitesDropdownContainer = styled.div`
    align-items: center;
    display: flex;
    padding-right: 16px;
    position: relative;

    ${AutocompleteStyled} {
        left: unset;
        right: 10px;
        transform: translateY(12px);

        .ListItem {
            font-size: 14px;
        }
    }
`;
