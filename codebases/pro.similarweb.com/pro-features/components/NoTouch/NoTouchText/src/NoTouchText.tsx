import * as React from "react";
import { StyledNoTouchText } from "./StyledComponents";

const NoTouchText = ({ children, className }: any) => (
    <StyledNoTouchText className={className}>{children}</StyledNoTouchText>
);

export default NoTouchText;
