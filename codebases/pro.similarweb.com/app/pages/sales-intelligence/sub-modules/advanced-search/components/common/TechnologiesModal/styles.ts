import styled from "styled-components";
import { colorsPalettes, fonts, mixins } from "@similarweb/styles";
import { ChipItemWrapper } from "@similarweb/ui-components/dist/chip/src/elements";

export const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, width: 594 },
};

export const StyledButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px;

    & > *:not(:first-child) {
        margin-left: 4px;
    }
`;

export const StyledDDContainer = styled.div<{ hasMargin: boolean }>`
    margin: ${({ hasMargin }) => (hasMargin ? 4 : 0)}px;
`;

export const StyledSelectionContainer = styled.div<{ hasBorder: boolean; hasPadding: boolean }>`
    border: 1px solid
        ${({ hasBorder }) => (hasBorder ? colorsPalettes.carbon["100"] : "transparent")};
    margin-top: 24px;
    padding: ${({ hasPadding }) => (hasPadding ? 4 : 0)}px;
`;

export const StyledChipsContainer = styled.div`
    padding: 0 4px;

    & ${ChipItemWrapper} {
        margin: 4px 0;
    }
`;

export const StyledSubtitle = styled.p`
    ${mixins.setFont({ $size: 13, $color: colorsPalettes.carbon["400"] })};
    line-height: 16px;
    margin: 8px 0 0;
`;

export const StyledTitle = styled.h2`
    ${mixins.setFont({
        $size: 20,
        $color: colorsPalettes.carbon["500"],
        $family: fonts.$dmSansFontFamily,
        $weight: 500,
    })};
    line-height: 24px;
    margin: 0;
`;

export const StyledMainContainer = styled.div`
    flex-grow: 1;
    padding: 12px 24px 16px;
`;

export const StyledHeader = styled.div`
    padding: 20px 24px;
`;

export const StyledModalContent = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 416px;
`;
