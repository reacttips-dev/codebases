import React from 'react';

import { SlateRenderNodeProps } from '../types';

type Props = SlateRenderNodeProps & {};

// renderer for 'paragraph' type nodes
const Paragraph: React.FunctionComponent<Props> = ({ attributes, children }) => {
  return <p {...attributes}>{children}</p>;
};

export default Paragraph;
