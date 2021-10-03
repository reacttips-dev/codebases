import React from "react";
import { components } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StyledCommandKOptionRow } from "../../../styled/details/stylesDetails";

const CustomOption = (props) => {
  const { data } = props;
  const hotKeyChild =
    data.hotkey &&
    data.hotkey.map((key, index) => {
      return (
        <kbd key={index} className="mr-1">
          {key}
        </kbd>
      );
    });

  return (
    <components.Option {...props}>
      {data.type !== "open" && (
        <StyledCommandKOptionRow>
          <div>
            {data.prefixIcon && (
              <FontAwesomeIcon icon={data.prefixIcon} className="mr-2" />
            )}
            {data.label}
          </div>

          {data.hotkey && <div>{hotKeyChild}</div>}
        </StyledCommandKOptionRow>
      )}
    </components.Option>
  );
};

export default CustomOption;
