import styled from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { FlexRow, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const StyledBox = styled(Box).attrs<{ height: string; width: string }>((props) => ({
    width: props.width,
}))`
    height: ${({ height }) => height};
    display: flex;
    flex-direction: column;
`;

export const CtaWrapper = styled(RightFlexRow)`
    border-top: 1px solid ${colorsPalettes.carbon[100]};
`;

export const CtaButton = styled(Button)`
    margin: 5px 8px 5px 8px;
`;

export const SectionWrapper: any = styled(FlexRow)<{ justifyContent: string }>`
    margin-bottom: 24px;
`;
