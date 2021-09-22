import styled from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { colorsPalettes, rgba } from "@similarweb/styles";

const handleBackgroundColor = ({
    isLoading,
    isDisabled,
}: {
    isLoading: boolean;
    isDisabled: boolean;
}): string => {
    if (isLoading) {
        return colorsPalettes.navigation.ACTIVE_TILE_CLICKED;
    }

    if (isDisabled) {
        return rgba(colorsPalettes.carbon[0], 0.4);
    }

    return colorsPalettes.carbon[0];
};

export const StyledSubmitButton = styled.div<{ isDisabled: boolean; isLoading: boolean }>`
    .Button {
        pointer-events: ${({ isLoading }) => (isLoading ? "none" : "all")};
        background-color: ${({ isDisabled, isLoading }) =>
            handleBackgroundColor({ isDisabled, isLoading })};
        & > div {
            color: ${colorsPalettes.blue[400]};
        }
        &:hover {
            background-color: ${({ isDisabled }) =>
                isDisabled
                    ? rgba(colorsPalettes.carbon[0], 0.4)
                    : rgba(colorsPalettes.carbon[0], 0.8)};
        }
        &:before {
            background: ${colorsPalettes.carbon[0]};
        }
    }
`;

export const StyledAccountButton = styled(IconButton)<{ isDisabled: boolean }>`
    .SWReactIcons svg use {
        fill: ${({ isDisabled }) =>
            isDisabled ? colorsPalettes.carbon[200] : colorsPalettes.blue[400]};
    }

    &:hover {
        .SWReactIcons svg use {
            fill: ${colorsPalettes.blue[500]};
        }
        cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
    }

    .SWReactIcons svg {
        height: 16px;
        width: 16px;
    }
`;
