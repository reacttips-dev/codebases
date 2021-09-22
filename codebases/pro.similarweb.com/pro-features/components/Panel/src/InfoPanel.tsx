import * as React from "react";
import styled from "styled-components";

export const InfoPanel = styled.div`
    font-family: "Roboto";
    font-size: 16px;
    padding: 16px;
    border-radius: 6px;
    background-color: #ffffff;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;
export const SuccessPanel = styled(InfoPanel)`
    border: 1px solid #4fbf40;
    color: #4fbf40;
`;
