import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StylesInitialMultiSelector = styled.div`
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    background: ${colorsPalettes.bluegrey[100]};
    box-sizing: border-box;
    padding: 0 16px;
    border-top: 1px solid ${colorsPalettes.carbon[50]};
    position: sticky;
    z-index: 9;
    top: 0;
`;

export const StyledActiveMultiSelector = styled.div`
    width: 100%;
    height: 56px;
    display: flex;
    justify-content: space-between;
    background: ${colorsPalettes.blue[400]};
    padding: 0 24px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    color: ${colorsPalettes.carbon[0]};
    align-items: center;
    font-size: 14px;
    position: sticky;
    z-index: 10;
    top: 0;
`;

export const StyledCloseButton = styled.div`
    width: 14px;
    height: 14px;
    cursor: pointer;

    .SWReactIcons {
        width: 14px;
        height: 14px;
        & svg path {
            fill: ${colorsPalettes.carbon[0]};
            stroke: ${colorsPalettes.carbon[0]};
        }
    }
`;

export const StyledAccountOptions = styled.div`
    display: flex;
    align-items: center;

    & > div {
        margin-right: 20px;
    }
    & > div:nth-child(3) {
        margin-right: 0;
    }
`;

export const StyledExcelOptions = styled.div`
    display: flex;
    align-items: center;

    & > * {
        margin-right: 20px;
    }
`;

export const StyledTitleOptions = styled.div`
    display: flex;
    font-size: 14px;
    font-family: "DM Sans";
    font-weight: 500;
    text-transform: capitalize;
    align-items: center;

    .SWReactIcons svg {
        height: 16px;
        width: 16px;
    }
`;

export const StyledTitleAccountOptions = styled(StyledTitleOptions)`
    .SWReactIcons {
        margin-right: 6px;
        padding-top: 3px;
        & svg use {
            fill: ${colorsPalettes.carbon[0]};
        }
    }
`;

export const StyledTitleDeleteOptions = styled(StyledTitleOptions)`
    .SWReactIcons svg {
        height: 17px;
        width: 16px;
    }

    .SWReactIcons {
        margin-right: 6px;
        padding-top: 3px;
        & svg path {
            fill: ${colorsPalettes.carbon[0]};
        }
    }
`;

export const StyledOpportunitiesList = styled.div`
    align-self: flex-start;
`;

export const StyledTitleExcelOptions = styled(StyledTitleOptions)`
    .SWReactIcons {
        margin-right: 5px;
        padding-top: 5px;
        & svg path {
            fill: ${colorsPalettes.carbon[0]};
        }
    }
`;

export const StyledTitleOverLimitSubscription = styled.div`
    font-weight: 500;
`;
