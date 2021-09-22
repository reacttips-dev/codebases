import styled, { css } from "styled-components";
import { StyledBaseFilterContainer, StyledHorizontalRadioSelect } from "../../styles";

export const StyledDDContainer = styled.div`
    padding-top: 8px;
    position: relative;
`;

export const StyledChipItemsContainer = styled.div``;

export const StyledFilterContainer = styled(StyledBaseFilterContainer)<{
    isDDVisible: boolean;
    areSelectedItemsVisible: boolean;
}>`
    ${({ isDDVisible, areSelectedItemsVisible }) =>
        isDDVisible &&
        css`
            ${StyledHorizontalRadioSelect} {
                padding-bottom: ${areSelectedItemsVisible ? 12 : 8}px;
            }
        `};
`;
