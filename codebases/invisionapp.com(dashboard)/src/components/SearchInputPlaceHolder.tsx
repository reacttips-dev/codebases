import React from "react";
import styled from "styled-components";

import { Text } from "@invisionapp/helios";

const StyledText = styled(Text)`
  position: absolute;
  line-height: 28px;
  letter-spacing: 0;
  white-space: nowrap;
  margin-left: 2px;
`;

const PlaceHolder = () => {
  const handleMouseDown = (e: MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <StyledText
      order="body"
      size="larger"
      color="text-lightest"
      onMouseDown={handleMouseDown}
      data-testid="global-search-input-placeholder"
    >
      Search documents and spaces
    </StyledText>
  );
};

export default PlaceHolder;
