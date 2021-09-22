import styled from "styled-components";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";
import { colorsPalettes } from "@similarweb/styles";

export const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

export const FiltersContainer = styled.div`
    padding: 10px;
    height: 32px;
    display: flex;
    grid-column-gap: 16px;
`;

export const BooleanSearchContainer = styled.div`
    width: 100%;
    padding-left: 15px;
`;

export const OrangeStyledPill = styled(StyledPill)`
    background-color: ${colorsPalettes.orange["400"]};
    text-transform: uppercase;
    font-size: 10px;
    margin-top: 4px;
`;
