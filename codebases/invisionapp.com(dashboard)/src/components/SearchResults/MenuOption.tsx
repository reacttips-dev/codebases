import React from "react";
import styled from "styled-components";
import { Flex } from "@invisionapp/helios";
import { Reply } from "@invisionapp/helios/icons";

import { IMenuOption } from "../../types/SearchResults/IMenuOption";
import { useGlobalSearchUiContext } from "../GlobalSearchUiProvider";

// Helios does not have an icon for the Enter key so we generate one by inverting the Reply icon vertically
const EnterKeyIcon = styled(Reply)`
  transform: scaleY(-1);
`;

const StyledMenuOption = styled(Flex)<IMenuOption>`
  padding: 8px 24px;
  line-height: 20px;
  letter-spacing: 0;
  cursor: default;
  background-color: ${(props) => (props.isSelected ? "#f8f8fa" : "inherit")};

  &:hover {
    cursor: pointer;
  }
`;

const MenuOption = ({
  isSelected,
  children,
  className,
  onClick,
  index,
}: IMenuOption) => {
  // UX/PM want to treat hovered items the same way we handle selecting items via the keyboard.
  // As such, we use the mouse enter/leave events to enforce the selected menu option,
  // rather than simply using css rules to apply a different style to the hovered element.
  const { setSelectedSearchOption } = useGlobalSearchUiContext();

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setSelectedSearchOption(index);
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setSelectedSearchOption(-1);
  };

  return (
    // @ts-ignore: ignore no overload error check for styled divs with custom props.
    <StyledMenuOption
      isSelected={isSelected}
      justifyContent="space-between"
      alignContent="center"
      alignItems="center"
      className={className}
      data-testid={`global-search-ui-menu-option`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isSelected && (
        <EnterKeyIcon
          data-testid={`global-search-ui-menu-option-enter-key-icon`}
        />
      )}
    </StyledMenuOption>
  );
};

export default MenuOption;
