import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { IAutocompleteStyledProps } from "./types";

// The props are necessary for a responsive design.
export const AutocompleteStyled = styled(Autocomplete)<IAutocompleteStyledProps>`
    width: ${({ width }) => (width ? `${width}px` : "248px")};
    max-height: 380px;
    position: ${({ position }) => (position ? position : "absolute")};
    z-index: 1030;
    left: 0;
    top: ${({ top = -4 }) => `${top}px`};
    .ListItemsContainer {
        box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.24);
    }
`;

export const StyledSecondColumn = styled.div`
    text-align: center;
    flex: 2;
`;

export const StyledItemWrapper = styled.div`
    display: flex;
    align-items: center;

    &.active {
        background-color: ${colorsPalettes.bluegrey["200"]};
    }

    &.disabled {
        opacity: 0.5;
        pointer-events: none;
    }
`;

export const NoDataWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const NoDataIcon = styled(SWReactIcons)`
    height: 24px;
    width: 24px;
    margin: 16px 0 8px;
`;

export const NoDataText = styled.div`
    font-size: 16px;
    margin-bottom: 40px;
    max-width: 44%;
    color: ${colorsPalettes.midnight[100]};
    text-align: center;
`;
