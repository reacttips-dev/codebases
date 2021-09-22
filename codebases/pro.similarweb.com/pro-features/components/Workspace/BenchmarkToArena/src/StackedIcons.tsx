import * as React from "react";

import styled, { css } from "styled-components";
import { IItemIconProps } from "@similarweb/ui-components/dist/item-icon";
import {
    SimpleLegend,
    SimpleLegendItemIconContainer,
} from "@similarweb/ui-components/dist/simple-legend";

const IconContainer = styled(SimpleLegendItemIconContainer)<
    { index: number; size?: number } & IItemIconProps
>`
    ${({ index }) =>
        index &&
        css`
            transform: translateX(-${index * 10}px);
        `};
    ${({ size }) =>
        size &&
        css`
            width: ${size}px;
            height: ${size}px;
        `};
`;

export default ({ icons, size = 32 }) => {
    return icons.map((icon, index) => (
        <IconContainer size={size} key={index} index={index} iconSrc={icon} iconName="" />
    ));
};
