import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactCountryIcons } from "@similarweb/icons";
// import { ShadowedFeedContainer } from "../styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const StyledAdNetworkDetails = styled.div``;

export const StyledDetailsHead = styled(FlexRow)`
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
`;

export const StyledDetailsNameContainer = styled(FlexRow)`
    align-items: center;

    > span {
        color: ${colorsPalettes.carbon["500"]};
        font-size: 14px;
        margin-left: 14px;
    }
`;

export const StyledCountriesList = styled.div`
    padding: 16px 5px 24px 10px;
`;

export const StyledCountryRow = styled(FlexRow)`
    align-items: center;
    justify-content: space-between;
    line-height: 15px;

    &:not(:first-child) {
        margin-top: 24px;
    }
`;

export const StyledCountryName = styled.span`
    margin-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledCountryColumn = styled(FlexRow)`
    align-items: center;
    font-size: 14px;
    flex: 1;

    ${SWReactCountryIcons} {
        height: 24px;
        flex-shrink: 0;
        width: 24px;
    }
`;

export const StyledSimpleColumnHead = styled.div`
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledSimpleColumn = styled(StyledSimpleColumnHead)`
    color: ${colorsPalettes.carbon["500"]};
    font-size: 14px;
    flex: 1;
    text-align: center;
    width: 100%;
`;
