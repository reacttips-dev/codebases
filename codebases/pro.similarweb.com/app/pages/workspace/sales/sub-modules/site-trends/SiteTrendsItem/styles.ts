import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const StyledSiteTrendsItem = styled.div`
    width: 100%;
    border-radius: 6px;
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.midnight["600"], 0.08)};
    background-color: ${colorsPalettes.carbon[0]};
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    box-sizing: border-box;
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 50px;
    }
`;

export const StyledSiteTrendsItemHeader = styled.div`
    border-bottom: 1px solid #e5e7ea;
    padding: 24px;
    margin-bottom: 5px;
`;

export const StyledSiteTrendsItemHeaderTitle = styled.div`
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 7px;
`;

export const StyledSiteTrendsItemHeaderSubTitle = styled.div`
    display: flex;
    line-height: 16px;
`;

export const StyledCountryIcon = styled.div`
    width: 16px;
    height: 16px;
`;

export const StyledSiteTrendsSubtitle = styled.div`
    display: flex;
    align-items: center;

    .SWReactIcons {
        width: 16px;
        height: 16px;
    }
    :first-child {
        margin-right: 15px;
    }

    & > div {
        margin-right: 4px;
    }
`;
