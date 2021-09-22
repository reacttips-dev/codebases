import React from 'react';

import SvgIcon, { IconProps } from '@core/SvgIcon';
import { useTheme } from '@core/theme';
import useId from '@core/utils/useId';

type SVGPaths =
  | React.ReactFragment
  | ((props: { iconColor?: string; id?: string }) => React.ReactFragment);

type SvgPathsSizeMap = { small?: SVGPaths; medium?: SVGPaths; large: SVGPaths };

export type SvgPathsMap = {
  ltr: SvgPathsSizeMap;
  rtl?: SvgPathsSizeMap;
};

/**
 * Private module reserved for unit testing.
 * Named uppercase to signal this is a React Component. See https://reactjs.org/docs/hooks-rules.html
 */
export const SvgIconWithPaths = (
  props: IconProps,
  ref: React.Ref<SVGSVGElement>,
  paths: SvgPathsMap,
  shouldFlipForRTL?: boolean
): React.ReactElement => {
  const theme = useTheme();
  const id = useId();

  let pathsForDirection = paths.ltr;

  if (theme.direction === 'rtl' && paths.rtl) {
    pathsForDirection = paths.rtl;
  }

  const pathsForSize = pathsForDirection[props.size || 'medium'];

  return (
    <SvgIcon ref={ref} shouldFlipForRTL={shouldFlipForRTL} {...props} id={id}>
      {typeof pathsForSize === 'function'
        ? pathsForSize({ id: id })
        : pathsForSize}
    </SvgIcon>
  );
};

/**
 * Private module reserved for @coursera/cds-core package.
 */
export const createLargeSvgIcon = (
  displayName: string,
  paths: { large: SVGPaths },
  shouldFlipForRTL?: boolean
): React.ComponentType<IconProps> => {
  const Component = (props: IconProps, ref: React.Ref<SVGSVGElement>) =>
    SvgIconWithPaths(
      { ...props, size: 'large' },
      ref,
      { ltr: paths },
      shouldFlipForRTL
    );

  Component.displayName = displayName;
  return React.forwardRef(Component);
};

/**
 * Private module reserved for @coursera/cds-core package.
 */
const createSvgIcon = (
  displayName: string,
  paths: SvgPathsMap,
  shouldFlipForRTL?: boolean
): React.ComponentType<IconProps> => {
  const Component = (props: IconProps, ref: React.Ref<SVGSVGElement>) =>
    SvgIconWithPaths(props, ref, paths, shouldFlipForRTL);
  Component.displayName = displayName;
  return React.forwardRef(Component);
};

export default createSvgIcon;
