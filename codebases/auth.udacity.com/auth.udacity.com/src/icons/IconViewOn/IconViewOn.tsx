import React from "react";
import Icon from "../Icon/Icon";
import { IconWithoutChildrenProps } from "../types";

const IconViewOn: React.FC<IconWithoutChildrenProps> = (
  props: IconWithoutChildrenProps
): React.ReactElement => {
  return (
    <Icon {...props} title={props.title || "view on"}>
      <svg viewBox="0 0 32 32">
        <path d="M16 9c4.45 0 8.076 2.417 10.73 6.997a2 2 0 01-.088 2.145C23.96 21.998 20.357 24 16 24c-4.357 0-7.96-2.002-10.642-5.858a2 2 0 01-.088-2.145C7.924 11.417 11.55 9 16 9zm0 2c-3.682 0-6.682 2-9 6 2.318 3.333 5.318 5 9 5 3.682 0 6.682-1.667 9-5-2.318-4-5.318-6-9-6zm0 1a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    </Icon>
  );
};

export default IconViewOn;
