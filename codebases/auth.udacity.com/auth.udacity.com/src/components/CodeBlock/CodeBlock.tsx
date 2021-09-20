import React from "react";
import classNames from "classnames";

const PREFIX = "vds-codeblock";

/** CodeBlock Props */

export interface CodeBlockProps {
  /** Code to be displayed (must be escaped) */
  children: React.ReactNode;

  /** Display line numbers */
  numbered?: boolean;
}

/** CodeBlocks display preformatted blocks of code longer than a line or single expression. */

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  numbered
}: CodeBlockProps) => {
  const className = classNames(PREFIX, numbered && `${PREFIX}--numbered`);

  return (
    <pre className={className}>
      {numbered ? (
        children &&
        typeof children === "string" &&
        children.split("\n").map((line, key) => <code key={key}>{line}</code>)
      ) : (
        <code>{children}</code>
      )}
    </pre>
  );
};

export default CodeBlock;
