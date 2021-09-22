import React from 'react';

type Props = {
  attributes: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
};

// renderer for 'underline' type nodes
const Underline: React.FunctionComponent<Props> = ({ attributes, children }) => {
  return <u {...attributes}>{children}</u>;
};
export default Underline;
