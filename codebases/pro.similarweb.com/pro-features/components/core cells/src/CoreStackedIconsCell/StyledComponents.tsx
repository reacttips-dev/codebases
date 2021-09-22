import { Flex } from "components/core cells/src/CoreWebsiteCell/StyledComponents";
import * as React from "react";
import styled, { css } from "styled-components";

export const Container = styled(Flex)`
    width: 100%;
`;

export const TextContainer = styled.span<{ items: number }>`
    margin-left: ${({ items }) => 5 + (items - 1) * -10}px;
`;
