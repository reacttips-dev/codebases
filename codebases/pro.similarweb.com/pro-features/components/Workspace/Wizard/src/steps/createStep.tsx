import { Box } from "@similarweb/ui-components/dist/box";
import * as React from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { DefaultLegendItem } from "../DefaultLegendItem";

export const StepContainerStyle = styled(Box)`
    display: flex;
    align-self: flex-start;
    justify-content: center;
    width: auto;
    height: auto;
    font-family: Roboto;
`;

StepContainerStyle.displayName = "StepContainerStyle";

export const createWizardStep = (
    label,
    renderStepComponent,
    StepContainerComponent = StepContainerStyle,
    LegendItem = DefaultLegendItem,
) => ({
    LegendItem: (p) => <LegendItem {...p} label={label} />,
    StepComponent: (p) => <StepContainerComponent>{renderStepComponent(p)}</StepContainerComponent>,
});
