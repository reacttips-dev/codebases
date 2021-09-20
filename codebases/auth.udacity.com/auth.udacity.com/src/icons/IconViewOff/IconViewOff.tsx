import React from "react";
import Icon from "../Icon/Icon";
import { IconWithoutChildrenProps } from "../types";

const IconViewOff: React.FC<IconWithoutChildrenProps> = (
  props: IconWithoutChildrenProps
): React.ReactElement => {
  return (
    <Icon {...props} title={props.title || "view off"}>
      <svg viewBox="0 0 32 32">
        <path d="M26.73 15.997a2 2 0 01-.088 2.145C23.96 21.998 20.357 24 16 24c-1.165 0-2.276-.143-3.33-.427l1.69-1.69c.53.078 1.077.117 1.64.117 3.682 0 6.682-1.667 9-5-.756-1.304-1.584-2.395-2.484-3.274l1.414-1.412c1.027 1.006 1.962 2.237 2.8 3.683zM23.071 8.93a1 1 0 010 1.414L10.343 23.071a1 1 0 01-1.414-1.414L21.657 8.929a1 1 0 011.414 0zM16 9c.86 0 1.69.09 2.488.27l-1.758 1.757A9.817 9.817 0 0016 11c-3.682 0-6.682 2-9 6 .535.77 1.107 1.45 1.715 2.042L7.3 20.456a15.978 15.978 0 01-1.943-2.314 2 2 0 01-.088-2.145C7.924 11.417 11.55 9 16 9zm.252 10.992l3.74-3.74a4 4 0 01-3.74 3.74zm-.503-7.984l-3.741 3.74a4 4 0 013.741-3.74z" />
      </svg>
    </Icon>
  );
};

export default IconViewOff;
