import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { FooterButton } from "components/MultiCategoriesChipDown/src/MultiCategoryChipdownStyles";
import { StyledDropdownHeader } from "./DropdownHeaderItem/styles";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders/src/PlaceholderLoaders";

export const StyledDropdownContainer = styled.div`
    &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        .DropdownButton-text {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    .DropdownContent-container {
        width: auto;
        z-index: 1054;
    }
    .DropdownButton {
        border: 0;
        font-size: 16px;
        background-color: ${colorsPalettes.carbon["0"]};

        &-text {
            text-indent: 10px;
            padding-right: 15px;
        }

        &--triangle {
            position: relative;
            right: 0;
            top: unset;
        }

        &:active {
            color: ${rgba(colorsPalettes.carbon[500], 0.5)};
            .DropdownButton--triangle {
                color: ${colorsPalettes.carbon["500"]};
            }
        }

        &:hover {
            box-shadow: none;
        }
    }
    .ScrollArea-content {
        overflow: unset;
    }
    ${StyledDropdownHeader} {
        position: sticky;
        top: 0;
        z-index: 1;
    }
    ${FooterButton} {
        text-transform: uppercase;
    }
`;

interface StyledIconProps {
    marginRight?: number;
}

export const StyledIcon = styled.div<StyledIconProps>`
    width: 24px;
    height: 24px;
    margin-right: ${({ marginRight }) => (marginRight ? `${marginRight}px` : `${marginRight}px`)};
`;

export const StyledTitle = styled.span`
    color: ${colorsPalettes.carbon["500"]};
`;

export const StyledPrefix = styled.span``;

export const PlaceholderLoaderStyle = styled(PixelPlaceholderLoader)`
    margin-left: 10px;
`;
