import * as React from "react";
import { StyledNoTouchPanelColumn } from "./StyledComponents";

const NoTouchPanelColumn = ({ children, className }: any) => (
    <StyledNoTouchPanelColumn className={className}>{children}</StyledNoTouchPanelColumn>
);

export default NoTouchPanelColumn;
