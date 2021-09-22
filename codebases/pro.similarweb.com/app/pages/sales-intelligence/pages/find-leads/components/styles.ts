import { ChipItemWrapper } from "@similarweb/ui-components/dist/chip/src/elements";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const SearchWrapper = styled.div`
    margin-top: 8px;
`;

export const TopStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px;
    padding-bottom: 2px;
    background-color: ${colorsPalettes.carbon[0]};
`;

export const TopStyledLeft = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`;
export const ChipWrap = styled.div`
    padding-left: 8px;
    margin-bottom: 10px;
    &:first-child {
        padding-left: 0;
    }
    ${ChipItemWrapper} {
        margin-right: 0;
    }
`;

export const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;
export const BtnText = styled.div`
    text-align: center;
    font-family: "Roboto", Tahoma, sans-serif;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    color: ${colorsPalettes.carbon["0"]};
    padding-left: 5px;
`;

export const StyledWrapperUseCaseHomepage = styled.div`
    & > div {
        height: auto;
    }
`;
