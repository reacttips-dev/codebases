import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactCountryIcons } from "@similarweb/icons";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const StyledAdNetworkItemInner = styled(FlexRow)`
    align-items: center;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    box-sizing: border-box;
    justify-content: space-between;
    width: 100%;
`;

export const StyledAdNetworkListItem = styled.div<{ expanded: boolean; expandable: boolean }>`
    ${({ expanded }) =>
        expanded &&
        css`
            border-radius: 4px;
            box-shadow: 0 0 8px 0 rgba(14, 30, 62, 0.16);
        `};
    border-left: 4px solid
        ${({ expanded }) => (expanded ? colorsPalettes.blue["400"] : "transparent")};
    box-sizing: border-box;
    padding: 0 24px 0 20px;

    &:first-child {
        ${StyledAdNetworkItemInner} {
            border-top: ${({ expanded }) =>
                expanded ? "none" : "1px solid " + colorsPalettes.carbon["50"]};
        }
    }

    ${StyledAdNetworkItemInner} {
        ${({ expanded }) =>
            expanded &&
            css`
                border-bottom: none;
            `};
        cursor: ${({ expandable }) => (expandable ? "pointer" : "default")};
        padding: ${({ expandable }) => (expandable ? "8px 16px 7px 6px" : "9px 16px 9px 6px")};
    }

    &.single-item {
        border-radius: 4px;
        border-color: ${colorsPalettes.blue["400"]};
        box-shadow: 0 0 8px 0 rgba(14, 30, 62, 0.16);

        ${StyledAdNetworkItemInner} {
            border-bottom: none;
            border-top: none;
            cursor: default;
            padding-top: 15px;
        }
    }

    &.single-not-expandable {
        padding-bottom: 24px;
    }

    & .toggle-icon {
        margin-right: 8px;
        opacity: ${({ expandable }) => (expandable ? 1 : 0)};
    }
`;

export const StyledAdNetworkName = styled.span`
    color: ${colorsPalettes.carbon["500"]};
    font-size: 14px;
    line-height: 1;
`;

export const StyledAdNetworkNameContainer = styled(FlexRow)`
    align-items: center;
    flex-grow: 1;
`;

export const StyledAdNetworkVisits = styled.span`
    color: ${colorsPalettes.carbon["500"]};
    flex-shrink: 1;
    font-size: 14px;
    text-align: right;
`;

export const StyledInfoIconContainer = styled.div`
    cursor: pointer;
    margin-left: 5px;
`;

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
    width: 130px;

    ${SWReactCountryIcons} {
        height: 24px;
        flex-shrink: 0;
        width: 24px;
    }
`;

export const StyledSimpleColumnHead = styled.div`
    flex-grow: 1;
    margin-left: 13px;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledSimpleColumn = styled(StyledSimpleColumnHead)`
    color: ${colorsPalettes.carbon["500"]};
    font-size: 14px;
    padding-right: 3px;
`;
