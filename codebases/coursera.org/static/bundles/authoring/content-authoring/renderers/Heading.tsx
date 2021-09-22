import React from 'react';
import { getAttributes } from '../utils/slateUtils';

import { SlateRenderNodeProps } from '../types';

type Props = SlateRenderNodeProps;

// renderer for 'heading' type nodes
const Heading: React.FunctionComponent<Props> = ({ node, children, attributes }) => {
  const { level } = getAttributes(node);

  switch (level) {
    case '1':
      return <h1 {...attributes}>{children}</h1>;
    case '2':
      return <h2 {...attributes}>{children}</h2>;
    case '3':
    default:
      return <h3 {...attributes}>{children}</h3>;
  }
};

export default Heading;
