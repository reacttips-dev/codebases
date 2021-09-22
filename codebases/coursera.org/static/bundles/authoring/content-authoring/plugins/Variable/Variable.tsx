import React from 'react';

type Props = {
  attributes: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
  enableMonospace: boolean;
};

// renderer for 'var' type nodes
const Variable: React.FunctionComponent<Props> = ({ attributes, children, enableMonospace }) => {
  if (enableMonospace) {
    return <var {...attributes}>{children}</var>;
  } else {
    return <span>{children}</span>;
  }
};
export default Variable;
