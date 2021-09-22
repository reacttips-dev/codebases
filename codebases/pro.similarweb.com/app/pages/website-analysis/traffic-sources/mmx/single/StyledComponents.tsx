import { colorsPalettes, mixins } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import * as React from "react";
import styled from "styled-components";

export const StyledBox = styled(Box).attrs<{ height: number; width: number | string }>({
    width: ({ width }) => width,
})<{ height: number; width: number | string }>`
    height: ${({ height }) => height}px;
    display: flex;
    flex-direction: column;
`;
StyledBox.displayName = "StyledBox";

export const Separator = styled.hr`
    border-top-color: ${colorsPalettes.carbon[50]};
    margin: 0;
`;
Separator.displayName = "Separator";

export const Title = styled.div`
    padding: 24px 24px 22px 24px;
    ${mixins.setFont({ $size: 20, $color: colorsPalettes.carbon[500], $weight: 500 })};
`;
Title.displayName = "Title";
