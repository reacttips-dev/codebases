import React from "react";
import { components } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CustomControl = (props) => {
  return (
    <components.Control {...props}>
      <FontAwesomeIcon icon="search" className="mr-2" />
      {props.children}
    </components.Control>
  );
};

export default CustomControl;
