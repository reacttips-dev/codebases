import React from "react";
import styled from "styled-components";

import { Text } from "@invisionapp/helios";
import { ISearchInputHint } from "../types/ISearchInputHint";

const StyledText = styled(Text)`
  opacity: 0.7;
  line-height: 28px;
  letter-spacing: 0;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  min-width: 170px;
  margin-left: 4px;
`;

const handleMouseDown = (e: MouseEvent): void => {
  // Prevent blur/click events when clicking on the hint text as we want to keep the search box active.
  // Note that mouseDown happens before the click event, which is why its captured here before the click
  // handler on the outter wrapper for the GlobalSearch is fired.
  e.stopPropagation();
  e.preventDefault();
};

const SearchInputHint = ({ hintText }: ISearchInputHint) => {
  return (
    <StyledText
      data-testid="global-search-input-hint"
      order="body"
      size="larger"
      color="text-lightest"
      onMouseDown={handleMouseDown}
    >
      {hintText}
    </StyledText>
  );
};

export default SearchInputHint;
