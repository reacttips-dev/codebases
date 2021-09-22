import React from 'react';

import { SlateRenderNodeProps } from '../types';

type Props = SlateRenderNodeProps & {};

// renderer for 'list-item' type nodes
const ListItem: React.FunctionComponent<Props> = ({ attributes, children }) => {
  return <li {...attributes}>{children}</li>;
};

export default ListItem;
