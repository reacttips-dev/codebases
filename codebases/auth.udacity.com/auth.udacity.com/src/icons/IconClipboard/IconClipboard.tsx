import React from "react";
import Icon from "../Icon/Icon";
import { IconWithoutChildrenProps } from "../types";

const IconClipboard: React.FC<IconWithoutChildrenProps> = (
  props: IconWithoutChildrenProps
): React.ReactElement => {
  return (
    <Icon {...props} title={props.title || "clipboard"}>
      <svg viewBox="0 0 32 32">
        <path d="M19.003 6c1.104 0 1.992.89 1.997 2h2a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V10a2 2 0 012-2h2l.005-.14A2.007 2.007 0 0112.997 6h6.006zM11 10H9v14h14V10h-2l-.005.14A2.007 2.007 0 0119.003 12h-6.006A1.998 1.998 0 0111 10zm6 9a1 1 0 010 2h-5a1 1 0 010-2h5zm3-4a1 1 0 010 2h-8a1 1 0 010-2h8zm-.998-7h-6.005c.008 0 .003.005.003.01v1.98c0 .007 0 .01-.002.01h6.005c-.008 0-.003-.005-.003-.01V8.01c0-.007 0-.01.002-.01z" />
      </svg>
    </Icon>
  );
};

export default IconClipboard;
