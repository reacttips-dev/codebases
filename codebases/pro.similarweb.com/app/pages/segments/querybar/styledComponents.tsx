import * as React from "react";
import styled, { css, createGlobalStyle } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { IconButton } from "@similarweb/ui-components/dist/button";
import {
    ItemContainer,
    SecondaryTextContainer,
} from "@similarweb/ui-components/dist/query-bar/src/Common/QueryBarItemStyles";
import {
    ImageItemContainer,
    LargeImageContainer,
} from "@similarweb/ui-components/dist/query-bar/src/Common/QueryBarImage/QueryBarItemImageStyles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const QueryBarContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
`;

export const QueryBarItemContainer = styled.div`
    display: flex;
    max-width: 320px;
    min-width: 128px;
    flex-shrink: 1;
    line-height: normal;

    ${ItemContainer} {
        ${LargeImageContainer} {
            border-radius: 3px;
        }

        ${SecondaryTextContainer} {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &:hover {
            ${ImageItemContainer} {
                border-color: ${colorsPalettes.blue[400]};
            }
        }
    }
`;

export const AddToGroupIconContainer = styled.div<{ marginLeft: number }>`
    margin-left: ${({ marginLeft }) => `${marginLeft}px`};
`;

export const CompareButtonContainer = styled.div`
    margin-left: 8px;
`;

export const DropdownContainer = styled.div`
    margin-left: 8px;
    width: 320px;
    max-height: 264px;

    & > div {
        pointer-events: none !important;
    }
`;

export const QueryBarButtonsContainer = styled(FlexRow)`
    align-items: center;
    margin: 0 8px;
`;

export const QueryBarIconButton = styled(IconButton)`
    pointer-events: all;
    margin-left: 8px;
`;

export const SubNavOutsideOverlay = styled.div<{
    subNavOffsetLeft?: string;
    subNavOffsetHeight?: string;
}>`
    &:before,
    &:after {
        content: "";
        display: block;
        background: rgba(42, 62, 82, 0.8);
        position: fixed;
        z-index: 1020;
    }
    &:before {
        width: ${({ subNavOffsetLeft }) => subNavOffsetLeft};
        height: 100%;
        top: 0;
        left: 0;
    }
    &:after {
        width: calc(100% - ${({ subNavOffsetLeft }) => subNavOffsetLeft});
        height: calc(100vh);
        top: ${({ subNavOffsetHeight }) => subNavOffsetHeight};
        right: 0;
        bottom: 0;
        left: ${({ subNavOffsetLeft }) => subNavOffsetLeft};
        background: linear-gradient(rgba(42, 62, 82, 0.96), rgba(42, 62, 82, 0.8) 4%);
    }
`;
SubNavOutsideOverlay.defaultProps = {
    subNavOffsetLeft: "300px",
    subNavOffsetHeight: "60px",
};

export const PopupTargetContainer = styled.div`
    position: relative;
`;

export const QueryBarAutocompleteContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 400px;
    z-index: 1400;
`;

const flexFixed = css`
    flex: none;
`;
const flexAutoScrollContainer = css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    & > * {
        ${flexFixed}
    }
`;

export const QueryBarAutocomplete = styled(Autocomplete)`
    & > div:first-child {
        padding: 7px 0;
        margin-top: -7px;
        transform: translateY(0);
    }

    .ListItemsContainer {
        max-height: 360px;
        padding-top: 8px;
        ${flexAutoScrollContainer}

        &:before {
            transform: none;
            ${flexFixed}
        }

        .ListItemsTabs {
            flex: auto;
            padding-top: 12px;
            ${flexAutoScrollContainer}

            & > ul:first-child {
                ${flexFixed}
            }
            & > div.selected {
                flex: auto;
                ${flexAutoScrollContainer}
            }
        }

        .ListItemsScrollContainer {
            position: relative;
            flex: auto !important;
            ${flexAutoScrollContainer}
        }
    }
`;

export const QueryBarDropdownContainerStyles = createGlobalStyle`
    .DropdownContent-container.QueryBarDropdownContent {
        margin-top: -7px;

        .DropdownContent-searchIcon {
            padding-bottom: 16px;
        }
        
        .DropdownContent-searchContainer {
            margin: 17px 10px 0 10px;

            .DropdownContent-search {
                padding: 2px 5px 18px 1px;
            }
        }
    }
`;

export const QueryBarInfoCardContainerStyles = createGlobalStyle`
    .Popup-Container-infoCard.QueryBarInfoCardContainer {
        margin-top: 8px;
    }
`;

export const DropdownEmptyContentContainer = styled(FlexRow)`
    padding: 20px 12px;
    align-items: flex-start;
    justify-content: center;
    font-size: 12px;
    line-height: 16px;

    > * {
        margin: 4px;
    }

    .SWReactIcons {
        width: 16px;
        height: 16px;
    }
`;
