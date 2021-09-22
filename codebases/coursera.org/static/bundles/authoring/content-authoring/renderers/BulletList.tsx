import React from 'react';

import { SlateRenderNodeProps } from '../types';

type Props = SlateRenderNodeProps & {};

// renderer for 'bullet-list' type nodes
const BulletList: React.FunctionComponent<Props> = ({ attributes, children }) => {
  return <ul {...attributes}>{children}</ul>;
};

export default BulletList;
