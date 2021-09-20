import React from "react";
import classNames from "classnames";

const PREFIX = "vds-code";

/** Code Props */
export interface CodeProps {
  /** Code to be displayed */
  children: React.ReactNode;
}

/** Code displays short strings of code snippets inline with body text. */

const Code: React.FC<CodeProps> = ({ children }: CodeProps) => {
  const className = classNames(PREFIX);

  return <code className={className}>{children}</code>;
};

export default Code;
