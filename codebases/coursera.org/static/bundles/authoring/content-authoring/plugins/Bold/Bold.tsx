import React from 'react';

type Props = {
  attributes: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
};

// renderer for 'bold' type nodes
const Bold = ({ attributes, children }: Props) => {
  return <strong {...attributes}>{children}</strong>;
};
export default Bold;
