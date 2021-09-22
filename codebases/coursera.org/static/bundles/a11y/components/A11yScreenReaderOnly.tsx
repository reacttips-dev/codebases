/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import 'css!./__styles__/A11yScreenReaderOnly';

import type { HTMLAttributes } from 'enzyme';

type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';

type Props = HTMLAttributes & {
  tagName: TagName;
  children?: React.ReactNode;
};

const A11yScreenReaderOnly: React.SFC<Props> = (props) => {
  const { children, tagName, ...rest } = props;
  const Tag = tagName;

  return (
    // @ts-ignore
    <Tag className="rc-A11yScreenReaderOnly" {...rest}>
      {children}
    </Tag>
  );
};

type WrapperProps = {
  ariaLabel?: string | null;
  children?: React.ReactNode;
};

const wrapperStyles = {
  root: css({
    position: 'relative',
    overflow: 'hidden',
  }),
  ariaLabel: css({
    position: 'absolute',
    top: 0,
    left: 0,
    clip: 'rect(0, 0, 0, 0)',
    border: 'none',
    textTransform: 'none',
  }),
};

export const A11yScreenReaderWrapper: React.FC<WrapperProps> = ({ ariaLabel, children }) => {
  return (
    <div css={wrapperStyles.root}>
      <div css={wrapperStyles.ariaLabel}>{ariaLabel}</div>
      <div aria-hidden={true}>{children}</div>
    </div>
  );
};

export default A11yScreenReaderOnly;
