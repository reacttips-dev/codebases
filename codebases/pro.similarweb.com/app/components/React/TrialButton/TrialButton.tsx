import { Button, IButtonProps } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { StyledTrialButtonOutlined } from "./StyledComponents";

type TrialButtonType = "solid" | "outlined";

export type ITrialButtonProps = Partial<IButtonProps> & {
    children?: any;
    type?: TrialButtonType;
};

const TrialButton = (props: ITrialButtonProps) => {
    const { children, type = "solid" } = props;

    return type !== "solid" ? (
        <StyledTrialButtonOutlined {...props}>{children}</StyledTrialButtonOutlined>
    ) : (
        <Button type="trial" {...props}>
            {children}
        </Button>
    );
};

export default TrialButton;
