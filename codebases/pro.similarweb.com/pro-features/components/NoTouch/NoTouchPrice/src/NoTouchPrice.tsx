import * as React from "react";
import { StyledNoTouchPrice } from "./StyledComponents";

const NoTouchPrice = ({ children, className }: any) => (
    <StyledNoTouchPrice className={className}>
        <sup>$</sup>
        {children}
        <small>/Month</small>
    </StyledNoTouchPrice>
);

export default NoTouchPrice;
