import React from 'react';
import styled from 'styled-components';

// This component creates a horizontal row of elements with an 8px margin between them
// TODO: Move to shared-components library and make spacing configurable based on the design system spacing options
const RowDiv = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 8px;
  }
`;

export default function Row({ children, ...props }) {
  return <RowDiv {...props}>{children}</RowDiv>;
}
