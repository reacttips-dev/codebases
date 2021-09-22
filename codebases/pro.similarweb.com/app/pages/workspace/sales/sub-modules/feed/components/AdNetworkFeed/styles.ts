import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { StyledFeedContainer } from "../styles";

export const StyledAdNetworkFeedContainer = styled(StyledFeedContainer)`
    &.no-bottom-padding {
        padding-bottom: 0;
    }
`;

export const StyledAdNetworksListContainer = styled.div``;

export const StyledAdNetworksListHead = styled(FlexRow)`
    align-items: center;
    justify-content: space-between;
    line-height: 1;
    margin: 22px 24px 0 24px;
    padding-bottom: 15px;
`;

export const StyledAdNetworksListBody = styled.div`
    margin-top: 15px;
`;

export const StyledAdNetworkColumnTitle = styled.div`
    color: ${colorsPalettes.carbon["300"]};
    font-size: 12px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    &.innerTitle {
        flex: 1;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

export const TittleContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    div {
        color: #2a3e52;
        font-size: 16px;
        font-weight: 500;
        font-family: Roboto;
    }
`;

export const AdNetworkFeedEmptyStateStyled = styled.div`
    color: ${colorsPalettes.midnight["500"]};
    padding-top: 48px;
    padding-bottom: 24px;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
`;
