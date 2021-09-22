import React from 'react';
import { SlateRenderNodeProps } from '../types';

type Props = SlateRenderNodeProps & {};

// renderer for 'text' type nodes
const Text: React.FunctionComponent<Props> = ({ attributes, children }) => {
  return <span {...attributes}>{children}</span>;
};

export default Text;
