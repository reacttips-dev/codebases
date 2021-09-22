import styled from "styled-components";
import { StyledBaseFilterContainer } from "../../styles";

export const StyledInfoIcon = styled.div`
    cursor: pointer;
    margin-left: 8px;
`;

export const StyledCheckboxContainer = styled.div`
    align-items: center;
    display: flex;
`;

export const StyledCustomFilterContainer = styled(StyledBaseFilterContainer)`
    &:first-child {
        padding-top: 16px;
    }

    &:last-child {
        padding-bottom: 16px;
    }

    &:not(:first-child) {
        ${StyledCheckboxContainer} {
            margin-top: 16px;
        }
    }
`;
