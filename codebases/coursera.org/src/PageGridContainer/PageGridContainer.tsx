/** @jsx jsx */
import React from 'react';

import { Container } from '@material-ui/core';

import { jsx } from '@emotion/react';

import Grid, { GridProps } from '@core/Grid';
import { useTheme } from '@core/theme';
import { Breakpoint, OverrideProps, OverridableComponent } from '@core/types';

import getPageGridContainerCss from './getPageGridContainerCss';

type BaseProps = {
  /**
   * Determine the max-width of the container.
   * @default lg
   */
  maxWidth?: Extract<Breakpoint, 'lg' | 'xl'>;
  /**
   * Grid item children for the container.
   */
  children:
    | Array<React.ReactElement<GridProps>>
    | React.ReactElement<GridProps>;
};

export interface PageGridContainerTypeMap<D extends React.ElementType = 'div'> {
  props: BaseProps;
  defaultComponent: D;
}

export type Props<
  D extends React.ElementType = PageGridContainerTypeMap['defaultComponent']
> = OverrideProps<PageGridContainerTypeMap<D>, D> & {
  component?: React.ElementType;
};

/**
 * The breakpoint system and fluid grid ensure layout adaptation based on the screen size and device.
 * It provides consistency in component placement, achieving cohesion within the layout and across the experience.
 *
 * See [Props](__storybookUrl__/layout-pagegridcontainer--default#props)
 */
const PageGridContainer: OverridableComponent<PageGridContainerTypeMap> = React.forwardRef(
  function PageGridContainer(props: Props, ref: React.Ref<HTMLDivElement>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, ...rest } = props;

    const theme = useTheme();
    const css = getPageGridContainerCss(theme);

    return (
      <Container ref={ref} disableGutters css={css} {...rest}>
        <Grid container spacing={{ xs: 8, sm: 16, md: 32 }}>
          {props.children}
        </Grid>
      </Container>
    );
  }
);

PageGridContainer.defaultProps = {
  maxWidth: 'lg',
};

export default PageGridContainer;
