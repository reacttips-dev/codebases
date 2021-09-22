import * as React from "react";
import styled, { keyframes } from "styled-components";

export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
    border-radius: 50%;
    height: 24px;
    width: 24px;
    border: 2px solid #dedede;
    border-right-color: transparent;
    animation: ${rotate} 1s linear infinite;
`;
