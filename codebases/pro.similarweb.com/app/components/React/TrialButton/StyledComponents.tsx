import { colorsPalettes } from "@similarweb/styles";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import styled from "styled-components";
import { ITrialButtonProps } from "./TrialButton";

const OutlinedWrapper = (props: ITrialButtonProps) => (
    <Button type="outlined" {...props}>
        {props.children}
    </Button>
);

// TODO: Move to ui-components
export const StyledTrialButtonOutlined = styled(OutlinedWrapper)`
    border-color: ${colorsPalettes.indigo[300]};
    line-height: normal;
    ${ButtonLabel} {
        font-weight: 700;
        color: ${colorsPalettes.indigo[300]};
        line-height: normal;
    }
    &:hover {
        border-color: ${colorsPalettes.indigo[400]};
        ${ButtonLabel} {
            color: ${colorsPalettes.indigo[400]};
        }
    }
`;
StyledTrialButtonOutlined.displayName = "StyledTrialButtonOutlined";
