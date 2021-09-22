import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import {
    SliderHeader,
    SliderTitle,
    SliderDescription,
} from "@similarweb/ui-components/dist/slider/src/elements";

export const StyledRangeFilterContainer = styled.div`
    &:not(:last-child) {
        margin-bottom: 28px;
    }
`;

export const StyledRangeFilter = styled.div<{ isInInitialState: boolean }>`
    padding: 0 16px 2px;

    ${SliderHeader} {
        margin-bottom: 13px;
    }

    ${SliderTitle} {
        ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12 })};
        letter-spacing: normal;
        line-height: 17px;
        user-select: none;
    }

    ${SliderDescription} {
        ${mixins.setFont({ $weight: 500, $size: 14 })};
        color: ${({ isInInitialState }) =>
            isInInitialState ? colorsPalettes.carbon["200"] : colorsPalettes.blue["400"]};
        line-height: 17px;
        user-select: none;
    }
`;
