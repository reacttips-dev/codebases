/** @jsx jsx */
import React from 'react';

import {
  Grid as MuiGrid,
  GridContentAlignment,
  GridItemsAlignment,
  GridDirection,
  GridJustification,
  GridWrap,
  GridSize,
} from '@material-ui/core';

import { jsx } from '@emotion/react';

import { useTheme } from '@core/theme';
import { GridSpacing, OverrideProps, OverridableComponent } from '@core/types';
import { useDeprecatedProp } from '@core/utils';

import getGridCss, { classes } from './getGridCss';

type BaseProps = {
  /**
   * Defines the `align-content` style property. It's applied for all screen sizes.
   * @default stretch
   */
  alignContent?: GridContentAlignment;
  /**
   * Defines the `align-items` style property. It's applied for all screen sizes.
   * @default stretch
   */
  alignItems?: GridItemsAlignment;
  /**
   * If true, the component will behave as a flexbox container. Required when wrapping child grids with item prop set to true.
   * @default false
   */
  container?: boolean;
  /**
   * Defines the `flex-direction` style property. It is applied for all screen sizes.
   * @default row
   */
  direction?: GridDirection;
  /**
   * If true, the component will behave as a flexbox item. Item must be wrapped in a grid with the container prop set to true.
   * @default false
   */
  item?: boolean;
  /**
   * @deprecated Use justifyContent instead, the prop was renamed.
   */
  justify?: GridJustification;
  /**
   * Defines the `justify-content` style property. It is applied for all screen sizes.
   * @default flex-start
   */
  justifyContent?: GridJustification;
  /**
   * Defines the space between the type `item` component. It can only be used on a type `container` component.
   */
  spacing?: GridSpacing;
  /**
   * Defines the number of grids the component is going to use. It's applied for the lg breakpoint and wider screens if not overridden.
   * @default false
   */
  lg?: boolean | GridSize;
  /**
   * Defines the number of grids the component is going to use. It's applied for the md breakpoint and wider screens if not overridden.
   * @default false
   */
  md?: boolean | GridSize;
  /**
   * Defines the number of grids the component is going to use. It's applied for the sm breakpoint and wider screens if not overridden.
   * @default false
   */
  sm?: boolean | GridSize;
  /**
   * Defines the number of grids the component is going to use. It's applied for the xl breakpoint and wider screens.
   * @default false
   */
  xl?: boolean | GridSize;
  /**
   * Defines the number of grids the component is going to use. It's applied for all the screen sizes with the lowest priority.
   * @default false
   */
  xs?: boolean | GridSize;
  /**
   * Defines the `flex-wrap` style property. It's applied for all screen sizes.
   * @default wrap
   */
  wrap?: GridWrap;
  /**
   * If true, it sets `min-width: 0` on the item.
   * @default false
   */
  zeroMinWidth?: boolean;
};

export interface GridTypeMap<D extends React.ElementType = 'div'> {
  props: BaseProps;
  defaultComponent: D;
}

export type Props<
  D extends React.ElementType = GridTypeMap['defaultComponent']
> = OverrideProps<GridTypeMap<D>, D> & { component?: React.ElementType };

/**
 * Responsive layout grid component adapts to screen size and orientation, ensuring consistency across layouts.
 *
 * See [Props](__storybookUrl__/layout-grid--default#props)
 */
const Grid: OverridableComponent<GridTypeMap> = React.forwardRef(function Grid(
  props: Props,
  ref: React.Ref<HTMLDivElement>
) {
  const { spacing, justify, justifyContent, ...rest } = props;

  const theme = useTheme();
  const computedJustifyContent = useDeprecatedProp<typeof justifyContent>(
    justifyContent,
    justify,
    'justify is deprecated. Use justifyContent instead, the prop was renamed.'
  );

  const css = spacing ? getGridCss(theme, spacing) : undefined;

  return (
    <MuiGrid
      ref={ref}
      classes={classes}
      css={css}
      justifyContent={computedJustifyContent}
      {...rest}
    />
  );
});

export default Grid;
