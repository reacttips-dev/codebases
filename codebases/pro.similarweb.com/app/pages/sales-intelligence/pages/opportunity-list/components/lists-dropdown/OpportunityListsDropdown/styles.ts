import React from "react";
import styled, { StyledComponent } from "styled-components";
import OpportunityListsDropdown, {
    OpportunityListsDropdownProps,
} from "./OpportunityListsDropdown";

export const StyledOpportunityListsDropdown = styled(OpportunityListsDropdown)`
    min-width: 175px;
    position: relative;
` as StyledComponent<React.FC<Omit<OpportunityListsDropdownProps, "className">>, any>;
