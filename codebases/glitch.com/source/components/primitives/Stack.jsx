import React from 'react';
import styled from 'styled-components';

// This component creates a vertical layout of elements with an 8px margin between them
// TODO: Move to shared-components library and make spacing configurable based on the design system spacing options
const StackDiv = styled.div`
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: ${(props) => `var(--space-${props.spacing || '1'})`};
  }
`;

export default function Stack({ children, ...props }) {
  return <StackDiv {...props}>{children}</StackDiv>;
}
