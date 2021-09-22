/** @jsx jsx */
import React from 'react';

import { jsx, css } from '@emotion/react';

type Props = React.ComponentPropsWithRef<'div'>;

/**
 * Visually hides content while preserving it for assistive technologies.
 * @link https://github.com/twbs/bootstrap/blob/f61a0218b36d915db80dc23635a9078e98e2e3e0/scss/mixins/_visually-hidden.scss
 */
const VisuallyHidden = React.forwardRef(function VisuallyHidden(
  props: Props,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      css={css`
        position: absolute !important;
        border: 0 !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        word-wrap: normal !important;
      `}
      {...props}
      ref={ref}
    />
  );
});

export default VisuallyHidden;
