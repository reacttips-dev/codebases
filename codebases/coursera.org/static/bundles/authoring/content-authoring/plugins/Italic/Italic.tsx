import React from 'react';

type Props = {
  attributes: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
};

// renderer for 'italics' type nodes
const Italic: React.FunctionComponent<Props> = ({ attributes, children }) => {
  return <em {...attributes}>{children}</em>;
};
export default Italic;
