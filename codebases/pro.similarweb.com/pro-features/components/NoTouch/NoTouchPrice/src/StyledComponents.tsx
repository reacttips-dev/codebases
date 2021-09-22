import * as React from "react";
import styled from "styled-components";

export const StyledNoTouchPrice: any = styled.p`
    align-self: stretch;
    height: 32px;
    margin: 20px 0 0;
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
    sup {
        display: inline-block;
        top: auto;
        margin-right: 4px;
        font-size: 16px;
        color: rgba(42, 62, 82, 0.4);
        vertical-align: super;
    }
    small {
        display: inline-block;
        margin-left: 4px;
        font-size: 14px;
        font-weight: 400;
        color: #aab2ba;
        vertical-align: baseline;
    }
`;
StyledNoTouchPrice.displayName = "StyledNoTouchPrice";
