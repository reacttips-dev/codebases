import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { StyledItemContainer } from "../Item/styles";

export const StyledLink = styled.div`
    button {
        div:first-child {
            text-transform: none;
            font-weight: 400;
        }
    }
`;

export const StyledHeaderBenchmarkAbout = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

export const StyledTitleBenchmarkAbout = styled.div`
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #2a3e52;
`;

export const StyledBenchmarkAbout = styled.div`
    ${StyledItemContainer} {
        margin-bottom: 0;
    }
`;

export const StyledBenchmarkAboutLoader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 191px;
    background-color: ${colorsPalettes.carbon["0"]};
    border-radius: 6px;
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.midnight["600"], 0.08)};
`;
