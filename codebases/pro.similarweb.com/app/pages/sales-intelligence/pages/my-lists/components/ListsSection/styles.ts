import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledListItemContainer = styled.div<{ index: number }>`
    animation: slideUp ease-out 400ms ${({ index }) => index * 50}ms forwards;
    margin-bottom: 16px;
    opacity: 0;
    transform: translateY(20px);
    width: calc(50% - 26px / 2);

    &:nth-child(odd) {
        margin-right: 25px;
    }

    @keyframes slideUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

export const StyledListSectionBody = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
`;

export const StyledListSectionName = styled.h2`
    ${mixins.setFont({ $size: 20, $color: colorsPalettes.carbon["500"], $weight: 500 })};
    line-height: 24px;
    margin: 0;
`;

export const StyledListSectionLoaderHead = styled.div``;

export const StyledListSectionHead = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    min-height: 37px;

    ${StyledListSectionName} {
        flex-grow: 1;
    }
`;

export const StyledListSection = styled.div`
    &:not(:last-child) {
        margin-bottom: 64px;
    }
`;
