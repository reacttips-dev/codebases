import React from "react";
import { components } from "react-select";

const menuHeaderStyle = {
  padding: "8px 12px 0px 12px",
  background: "transparent",
  color: "#858585",
  fontSize: "14px",
};

const CustomMenuList = (props) => {
  return (
    <components.MenuList {...props}>
      <div style={menuHeaderStyle}>Use hotkeys or search everywhere.</div>
      {props.children}
    </components.MenuList>
  );
};

export default CustomMenuList;
