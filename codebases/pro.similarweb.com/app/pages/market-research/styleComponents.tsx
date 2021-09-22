import styled from "styled-components";
import PrimaryHomepageItemTile from "@similarweb/ui-components/dist/homepages/primary/src/PrimaryHomepageItemTile";
import { PrimaryHomepageItemTileIcon } from "@similarweb/ui-components/dist/homepages/primary/src/StyledComponents";
import { colorsPalettes } from "@similarweb/styles";

export const PrimaryHomepageItemTileStyled = styled(PrimaryHomepageItemTile)<{ isLocked: boolean }>`
    ${PrimaryHomepageItemTileIcon} {
        svg path {
            fill: ${({ isLocked }) =>
                isLocked ? colorsPalettes.mint["400"] : colorsPalettes.blue["400"]};
            fill-opacity: 1;
        }
    }
    &:hover {
        ${PrimaryHomepageItemTileIcon} {
            svg path {
                fill: ${({ isLocked }) =>
                    isLocked ? colorsPalettes.mint["400"] : colorsPalettes.blue["400"]};
            }
        }
    }
`;
