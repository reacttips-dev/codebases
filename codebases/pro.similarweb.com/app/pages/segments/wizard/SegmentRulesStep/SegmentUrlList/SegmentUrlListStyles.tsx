import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";
import { LoaderListItemsWrapper } from "components/Loaders/src/LoaderListItems";
import { subtitleFadeIn } from "components/Workspace/Wizard/src/steps/StyledComponents";

export const SegmentUrlListLoaderContainer = styled.div`
    width: 426px;
    height: 466px;
    & ${LoaderListItemsWrapper} {
        padding-top: 50px;
    }
`;

export const SegmentUrlListTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 17px 24px;

    h1 {
        font-size: 18px;
        color: ${colorsPalettes.carbon[400]};
        font-family: "Roboto";
        font-weight: 500;
        margin: 0;
        margin-right: 9px;
    }
`;

export const SegmentUrlListElementContainer = styled.div<{ hasBottomMargin: boolean }>`
    padding: 0 24px;
    margin-bottom: ${(props) => (props.hasBottomMargin ? "16px" : "0")};

    .DropdownButton {
        background-color: ${colorsPalettes.bluegrey[100]};
    }
`;

/**
 * Style for the filter button when no item is selected
 */
export const SegmentUrlListFilterButtonDefaultText = styled.div`
    color: ${colorsPalettes.carbon[500]};
    opacity: 0.4;
`;

/**
 * Style for the filter button when an item is selected
 */
export const SegmentUrlListFilterSelectedButtonText = styled.div`
    color: ${colorsPalettes.carbon[500]};
`;

export const SegmentUrlListItemContainer = styled.div`
    padding: 17px 15px;
    box-sizing: border-box;
    white-space: normal;
    word-break: break-all;
    hyphens: none;
    color: ${colorsPalettes.carbon[500]};
    font-family: Roboto;
    font-size: 14px;
    text-decoration: none;

    & + & {
        border-top: 1px solid ${colorsPalettes.bluegrey[200]};
    }

    & > span {
        &.keywordMatch,
        &.exactMatch {
            font-weight: bold;
        }

        &.shrinked {
            color: ${colorsPalettes.carbon[300]};
        }
    }
`;
