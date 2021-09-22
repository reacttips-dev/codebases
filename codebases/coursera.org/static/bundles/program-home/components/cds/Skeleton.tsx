/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { placeholder, css as yuckyCSS } from '@coursera/coursera-ui';

type SkeletonProps = {
  width?: number | string;
  // css from the caller overwrites our inner css, and we can't use inline styles for some reason.
  bonusCSS?: Parameters<typeof css>[0];
};

const Skeleton = ({ width, bonusCSS }: SkeletonProps) => (
  <span
    {...yuckyCSS(placeholder.styles.shimmer)}
    role="presentation"
    css={css(
      {
        display: width ? 'inline-block' : 'block',
        width: width ? '100%' : undefined,
        maxWidth: width || undefined,
        // Tricks to make it line up correctly.
        verticalAlign: 'bottom',
        lineHeight: 1.25,
      },
      bonusCSS
    )}
  >
    &nbsp;
  </span>
);

export default Skeleton;
