import React from "react";
import { StyledDropdownHeader } from "./styles";
import { DropdownHeaderItemProps } from "./types";

const DropdownHeaderItem = ({ children }: DropdownHeaderItemProps): JSX.Element => (
    <StyledDropdownHeader>{children}</StyledDropdownHeader>
);

export default DropdownHeaderItem;
