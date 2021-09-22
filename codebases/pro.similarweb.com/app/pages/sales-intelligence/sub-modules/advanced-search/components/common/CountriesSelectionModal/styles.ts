import styled from "styled-components";
import { colorsPalettes, fonts, mixins, rgba } from "@similarweb/styles";
import { ChipItemWrapper } from "@similarweb/ui-components/dist/chip/src/elements";
import ChipItemsContainer from "../ChipItemsContainer/ChipItemsContainer";
import CommonRadioSelect from "../../common/CommonRadioSelect/CommonRadioSelect";

export const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, width: 592 },
};

export const DROPDOWN_BODY_HEIGHT = 48 * 6;

export const StyledButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px;

    & > *:not(:first-child) {
        margin-left: 4px;
    }
`;

export const StyledWarningText = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
    margin: 0 0 0 8px;
`;

export const StyledWarningBox = styled.div`
    background-color: ${rgba(colorsPalettes.carbon["500"], 0.06)};
    display: flex;
    padding: 16px;
    margin-top: 12px;
    border-radius: 6px;

    .SWReactIcons {
        flex-shrink: 0;

        & svg path {
            fill: ${colorsPalettes.carbon["500"]};
        }
    }
`;

export const StyledDDContainer = styled.div<{ hasMargin: boolean }>`
    margin: ${({ hasMargin }) => (hasMargin ? 4 : 0)}px;
`;

export const StyledChipSeparator = styled.span`
    ${mixins.setFont({ $color: colorsPalettes.carbon["200"], $size: 14 })};
    margin-left: 12px;
    margin-right: 12px;
    text-transform: uppercase;
`;

export const StyledChipItemsContainer = styled(ChipItemsContainer)`
    padding: 0 4px;

    & ${ChipItemWrapper} {
        margin: 4px 0;
    }
`;

export const StyledSelectionWrapper = styled.div<{ hasBorder: boolean; hasPadding: boolean }>`
    border: 1px solid
        ${({ hasBorder }) => (hasBorder ? colorsPalettes.carbon["100"] : "transparent")};
    padding: ${({ hasPadding }) => (hasPadding ? 4 : 0)}px;

    &.hidden {
        display: none;
    }
`;

export const StyledRadioContainer = styled(CommonRadioSelect)`
    align-items: center;
    display: flex;
    margin-bottom: 24px;
`;

export const StyledMainContainer = styled.div`
    flex-grow: 1;
    padding: 5px 24px 8px;
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

export const StyledHeader = styled.div`
    padding: 20px 24px;
`;

export const StyledModalContent = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 416px;
`;
