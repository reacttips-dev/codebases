import { SerializedStyles, css } from '@emotion/react';

import { SpacingValue, GridSpacing, Breakpoint, Theme } from '@core/types';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const { classes, classNames } = generateEmotionClassNames('grid', [
  'item',
]);

const getSpacingCss = (spacing: SpacingValue) => css`
  margin: -${spacing / 2}px;
  width: calc(100% + ${spacing}px);

  & > ${classNames.item} {
    padding: ${spacing / 2}px;
  }
`;

const getSpacingCssForBreakpoint = (
  theme: Theme,
  breakpoint: Breakpoint,
  spacing: SpacingValue
) => css`
  ${theme.breakpoints.up(breakpoint)} {
    ${getSpacingCss(spacing)}
  }
`;

export default (theme: Theme, spacing: GridSpacing): SerializedStyles => {
  if (typeof spacing === 'number') {
    return getSpacingCss(spacing);
  }

  const styles: Array<SerializedStyles> = [];
  const breakpoints: Array<Breakpoint> = ['xs', 'sm', 'md', 'lg', 'xl'];

  breakpoints.forEach((breakpoint) => {
    const spacingForBreakpoint = spacing[breakpoint];

    if (spacingForBreakpoint) {
      styles.push(
        getSpacingCssForBreakpoint(theme, breakpoint, spacingForBreakpoint)
      );
    }
  });

  return css`
    ${styles}
  `;
};
