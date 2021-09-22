import React from 'react';

import classNames from 'classnames';
import { SlateRenderNodeProps } from '../types';

import 'css!./__styles__/PersonalizationTag';

type Props = SlateRenderNodeProps & {
  isFocused?: boolean;
};

// Determines how the tag node is rendered in the editor
const PersonalizationTag: React.FunctionComponent<Props> = ({ node, attributes, isFocused }) => {
  const tagValue = node.data.get('tagValue');
  return (
    <span className={classNames('slate-personalization-tag', { 'c-focused': isFocused })} {...attributes}>
      {tagValue}
    </span>
  );
};

export default PersonalizationTag;
