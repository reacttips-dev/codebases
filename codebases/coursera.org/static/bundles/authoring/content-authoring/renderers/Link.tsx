import React from 'react';

import { SlateRenderNodeProps } from '../types';

export type LinkProps = SlateRenderNodeProps & {
  onClick: (key: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
};

// renderer for 'link' type nodes
const Link: React.FunctionComponent<LinkProps> = ({ node, attributes, onClick = () => {}, children }) => {
  let href = '';
  let title = '';

  if ('data' in node && node.data) {
    href = node.data.get('href');
    title = node.data.get('title') || '';
  }

  return (
    <a
      href={href}
      title={title}
      target="_blank"
      rel="noopener nofollow"
      onClick={(e) => onClick(node.key, e)}
      {...attributes}
    >
      {children}
    </a>
  );
};

export default Link;
