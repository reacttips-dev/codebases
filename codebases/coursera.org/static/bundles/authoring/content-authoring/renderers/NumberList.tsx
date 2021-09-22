import React from 'react';

import { SlateRenderNodeProps } from '../types';

type Props = SlateRenderNodeProps & {};

// renderer for 'number-list' type nodes
const NumberList: React.FunctionComponent<Props> = ({ attributes, children }) => {
  return <ol {...attributes}>{children}</ol>;
};

export default NumberList;
