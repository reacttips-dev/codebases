import styled, { css } from "styled-components";
import { Collapsible } from "@similarweb/ui-components/dist/collapsible";
import { colorsPalettes, fonts, mixins, rgba } from "@similarweb/styles";

export const CATEGORY_INITIAL_EXPAND_TIMEOUT = 2000;
export const GROUP_INITIAL_EXPAND_TIMEOUT = 800;

export const StyledCategoryName = styled.h3`
    ${mixins.setFont({
        $size: 16,
        $weight: 500,
        $family: fonts.$dmSansFontFamily,
        $color: colorsPalettes.carbon["500"],
    })};
    line-height: normal;
    margin: 0;
    text-transform: capitalize;
`;

export const StyledIconContainer = styled.div`
    padding-right: 8px;
`;

export const StyledCategoryHeadInner = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

export const StyledCategoryHead = styled.div<{ expanded: boolean }>`
    ${({ expanded }) =>
        expanded &&
        css`
            box-shadow: 0 4px 10px ${rgba(colorsPalettes.carbon["500"], 0.04)};

            .SWReactIcons {
                transform: rotate(180deg);
            }
        `};
    background-color: ${colorsPalettes.carbon["0"]};
    cursor: pointer;
    padding: 16px;
    position: relative;
    transition: box-shadow 500ms ease-in-out, background-color 200ms ease-in-out;
    user-select: none;
    z-index: 1;

    &:hover {
        background-color: ${colorsPalettes.bluegrey["200"]};
    }

    .SWReactIcons {
        transition: transform 200ms ease-in-out;

        svg path {
            fill: ${colorsPalettes.carbon["200"]};
            transition: fill 200ms ease-in-out;
        }
    }

    &:hover {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon["400"]};
        }
    }
`;

export const StyledCollapsible = styled(Collapsible)`
    overflow: ${({ isActive }) => (isActive ? "visible" : "hidden")};
`;

export const StyledFiltersCategoryContainer = styled.div`
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
`;
