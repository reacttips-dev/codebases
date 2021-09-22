import styled, { css } from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { StyledDropdownContent } from "pages/workspace/sales/components/custom-dropdown/DropdownContent/styles";

export const StyledCreateListInputLabel = styled.div`
    ${mixins.setFont({ $color: rgba(colorsPalettes.carbon["500"], 0.6), $size: 12 })};
    margin-bottom: 6px;
`;

export const StyledCreateListInputContainer = styled.div`
    margin-bottom: 24px;
`;

export const StyledCreateListSubmitSection = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;

    .Button:last-child {
        margin-left: 8px;
    }
`;

export const StyledCreateListForm = styled.div`
    padding: 12px;
`;

export const StyledAddToListDropdownItemText = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
    flex-grow: 1;
    margin-left: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledAddToListDropdownItem = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    cursor: pointer;
    display: flex;
    padding: 12px 16px;
    transition: background-color 250ms ease-in-out;

    &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &.visited {
        background-color: ${colorsPalettes.bluegrey["100"]} !important;
    }

    &:hover {
        background-color: ${rgba(colorsPalettes.carbon["500"], 0.05)};
    }

    .SWReactIcons {
        flex-shrink: 0;

        &[data-automation-icon-name="list-icon"] svg path {
            fill: ${colorsPalettes.carbon["500"]};
        }
    }
`;

export const StyledCreateListItem = styled.div<{ clickable: boolean }>`
    position: relative;

    ${({ clickable }) =>
        !clickable &&
        css`
            ${StyledAddToListDropdownItem} {
                cursor: default;
                &:hover {
                    background-color: ${colorsPalettes.carbon["0"]};
                }
            }
        `};

    &:after {
        background-color: ${colorsPalettes.carbon["100"]};
        bottom: -1px;
        content: "";
        height: 1px;
        left: 8px;
        position: absolute;
        width: calc(100% - 16px);
        z-index: 10; // Override the dropdown content's value
    }
`;

export const StyledAddToListDropdownContent = styled(StyledDropdownContent)`
    box-shadow: 0 2px 16px ${rgba(colorsPalettes.black["0"], 0.21)};
    width: 320px;
    z-index: 9; // Just enough to override the table column z-index
`;

export const StyledAddToListDropdownButton = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
    ${mixins.setFont({ $color: colorsPalettes.carbon["0"], $size: 16 })};

    .SWReactIcons {
        display: flex;
        margin-left: 8px;

        path {
            fill: ${colorsPalettes.carbon["0"]};
        }
    }
`;

export const StyledAddToListDropdown = styled.div`
    position: relative;
`;

export const StyledName = styled.div`
    padding: 3px 0;
`;
