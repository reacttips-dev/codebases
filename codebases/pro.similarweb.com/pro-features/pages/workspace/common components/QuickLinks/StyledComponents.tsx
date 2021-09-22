import { colorsPalettes, rgba } from "@similarweb/styles";
import styled from "styled-components";

const BG_CORNFLOWER_BLUE = "#5998fa";
const BG_CORNFLOWER_BLUE_HOVER = "#497bce";
const BG_COLORSPALETTES_500 = colorsPalettes.carbon[500];
const HEIGHT = "113px";
const WIDTH = "368px";
const BORDER_RADIUS = "6px";

export const QuickLinkBox = styled.div`
    display: flex;
    height: ${HEIGHT};
    width: ${WIDTH};
    border-radius: ${BORDER_RADIUS};
    cursor: pointer;
    background-color: ${rgba(BG_COLORSPALETTES_500, 0.04)};
    box-sizing: border-box;
    :hover {
        background-color: ${rgba(BG_COLORSPALETTES_500, 0.1)};
    }
`;

export const SearchQuickLinkWrapper = styled.div`
    display: flex;
    height: ${HEIGHT};
    width: ${WIDTH};
    border-radius: ${BORDER_RADIUS};
    cursor: pointer;
    background-color: ${BG_CORNFLOWER_BLUE};
    box-sizing: border-box;
    &:hover {
        background-color: ${BG_CORNFLOWER_BLUE_HOVER};
    }
`;
