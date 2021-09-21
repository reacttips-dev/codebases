import { css } from 'emotion';
import React from 'react';
import {
  LG_SCREEN_MIN,
  MD_SCREEN_MAX,
  MD_SCREEN_MIN,
  SM_SCREEN_MAX,
} from '../../modules/Styleguide';
import { default as If } from '../If';

import {
  AlignItems,
  AlignItemsProp,
  BorderRadius,
  BorderStyles,
  BorderWidth,
  BoxDisplayStyles,
  BoxProps,
  DisplayProp,
  JustifyContentProp,
  ShapeProp,
  VisuallyHiddenStyles,
} from './Box.d';

// TODO: bottomBorder should be cleaned up and tested before we use it!
//       Maybe it doesn't belong on Box? Mabye it belongs on a Section component

// Radius Calculations --------------------------------------------------
// Unfortunately, if you add a radius and border to a div, the inner radius of
//   the border isn't reflected so it looks like there is no radius in the inner
//   border. To adjust for this, we need to do some calculation that calculates
// . the border based on the width (borderWidth * 1.9). This approach was found here:
//     http://blog.teamtreehouse.com/css-tip-better-rounded-borders
const cornerRaidus = 10;
const pillRadius = 23;

const getCalculatedBorderRadiusFromBorderWidth = (
  borderWidth: BorderWidth,
  borderRadius: BorderRadius
): BorderRadius => {
  let newBorderRadius: BorderRadius = borderRadius;
  if (borderWidth) {
    if (borderRadius) {
      if (borderRadius < borderWidth * 1.9) {
        newBorderRadius = borderWidth * 1.9;
      }
    }
  }
  return newBorderRadius;
};
const getBorderRadiusStyleForSquareShape = (
  borderWidth: BorderWidth
): BorderStyles => ({
  borderRadius: 0,
});

const getBorderRadiusStyleForRoundedShape = (
  borderWidth: BorderWidth
): BorderStyles => ({
  borderRadius: getCalculatedBorderRadiusFromBorderWidth(
    borderWidth,
    cornerRaidus
  ),
});

const getBorderRadiusStyleForPillShape = (
  borderWidth: BorderWidth
): BorderStyles => ({
  borderRadius: getCalculatedBorderRadiusFromBorderWidth(
    borderWidth,
    pillRadius
  ),
});

const getBorderRadiusStyleForCircleShape = (
  borderWidth: BorderWidth
): BorderStyles => ({
  borderRadius: '50%',
});

const getBorderRadiusStyleForRoundedTopShape = (
  borderWidth: BorderWidth
): BorderStyles => {
  const calculatedBorderRadius: BorderRadius = getCalculatedBorderRadiusFromBorderWidth(
    borderWidth,
    cornerRaidus
  );
  return {
    borderRadius: `${calculatedBorderRadius}px ${calculatedBorderRadius}px 0 0`,
  };
};
const getBorderRadiusStyleForRoundedRightShape = (
  borderWidth: BorderWidth
): BorderStyles => {
  const calculatedBorderRadius: BorderRadius = getCalculatedBorderRadiusFromBorderWidth(
    borderWidth,
    cornerRaidus
  );
  return {
    borderRadius: `0 ${calculatedBorderRadius}px ${calculatedBorderRadius}px 0`,
  };
};
const getBorderRadiusStyleForRoundedBottomShape = (
  borderWidth: BorderWidth
): BorderStyles => {
  const calculatedBorderRadius: BorderRadius = getCalculatedBorderRadiusFromBorderWidth(
    borderWidth,
    cornerRaidus
  );

  return {
    borderRadius: `0 0 ${calculatedBorderRadius}px ${calculatedBorderRadius}px`,
  };
};
const getBorderRadiusStyleForRoundedLeftShape = (
  borderWidth: BorderWidth
): BorderStyles => {
  const calculatedBorderRadius: BorderRadius = getCalculatedBorderRadiusFromBorderWidth(
    borderWidth,
    cornerRaidus
  );
  return {
    borderRadius: `${calculatedBorderRadius}px 0 0 ${calculatedBorderRadius}px`,
  };
};

const getBorderRadiusStylesForShape = (
  shape: ShapeProp,
  borderWidth: BorderWidth
): BorderStyles => {
  switch (shape) {
    case 'square':
      return getBorderRadiusStyleForSquareShape(borderWidth);
    case 'rounded':
      return getBorderRadiusStyleForRoundedShape(borderWidth);
    case 'pill':
      return getBorderRadiusStyleForPillShape(borderWidth);
    case 'circle':
      return getBorderRadiusStyleForCircleShape(borderWidth);
    case 'roundedTop':
      return getBorderRadiusStyleForRoundedTopShape(borderWidth);
    case 'roundedRight':
      return getBorderRadiusStyleForRoundedRightShape(borderWidth);
    case 'roundedBottom':
      return getBorderRadiusStyleForRoundedBottomShape(borderWidth);
    case 'roundedLeft':
      return getBorderRadiusStyleForRoundedLeftShape(borderWidth);
    case 'none':
      return {};
    default:
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
  }
};

const visuallyHiddenStyles: VisuallyHiddenStyles = {
  position: 'absolute',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  height: 1,
  width: 1,
  margin: -1,
  padding: 0,
  border: 0,
};

const getDisplayStyleFromDisplayProp = (
  display: DisplayProp
): BoxDisplayStyles => {
  // https://css-tricks.com/places-its-tempting-to-use-display-none-but-dont/
  switch (display) {
    case 'none':
      return { display: 'none' };
    case 'flex':
      return { display: 'flex' };
    case 'inlineFlex':
      return { display: 'inline-flex' };
    case 'block':
      return { display: 'block' };
    case 'inlineBlock':
      return { display: 'inline-block' };
    case 'visuallyHidden':
      return visuallyHiddenStyles;
    default:
      const exhaustiveCheck: never = display;
      return exhaustiveCheck;
  }
};
// END Radius Calculations --------------------------------------------------

const defaultProps = {
  className: '',
  alignContent: 'stretch',
  alignItems: 'stretch',
  alignSelf: 'auto',
  color: 'transparent',
  direction: 'row',
  flex: 'shrink',
  justifyContent: 'start',
  wrap: false,
  reverseWrap: false,
  minHeight: 'auto', // TODO: Should this be the default
  minWidth: 'auto', // TODO: Should this be the default
  maxHeight: 'auto', // TODO: Should this be the default
  maxWidth: 'auto', // TODO: Should this be the default
  shape: 'none',
  borderStyle: 'solid',
  borderWidth: 0,
  borderColor: 'transparent',
  overflow: 'visible',
  isHidingAtSmScreen: false,
  isHidingAtMdScreen: false,
  isHidingAtLgScreen: false,
  dangerouslySetInlineStyle: {},
};

/**
 * @deprecated Use Styled Components if possible
 */
const Box = ({
  alignContent,
  alignItems,
  alignSelf,
  children,
  color,
  direction,
  display,
  smDisplay,
  mdDisplay,
  lgDisplay,
  flex,
  height,
  smHeight,
  mdHeight,
  lgHeight,
  width,
  smWidth,
  mdWidth,
  lgWidth,
  justifyContent,
  margin,
  smMargin,
  mdMargin,
  lgMargin,
  marginBottom,
  smMarginBottom,
  mdMarginBottom,
  lgMarginBottom,
  marginLeft,
  smMarginLeft,
  mdMarginLeft,
  lgMarginLeft,
  marginRight,
  smMarginRight,
  mdMarginRight,
  lgMarginRight,
  marginTop,
  smMarginTop,
  mdMarginTop,
  lgMarginTop,
  position,
  wrap,
  reverseWrap,
  top,
  bottom,
  left,
  right,
  padding,
  smPadding,
  mdPadding,
  lgPadding,
  paddingBottom,
  smPaddingBottom,
  mdPaddingBottom,
  lgPaddingBottom,
  paddingLeft,
  smPaddingLeft,
  mdPaddingLeft,
  lgPaddingLeft,
  paddingRight,
  smPaddingRight,
  mdPaddingRight,
  lgPaddingRight,
  paddingTop,
  smPaddingTop,
  mdPaddingTop,
  lgPaddingTop,
  minHeight, // TODO: Should there be the default
  minWidth, // TODO: Should there be the default
  smMinWidth,
  mdMinWidth,
  lgMinWidth,
  smMinHeight,
  mdMinHeight,
  lgMinHeight,
  smMaxWidth,
  mdMaxWidth,
  lgMaxWidth,
  smMaxHeight,
  mdMaxHeight,
  lgMaxHeight,
  maxHeight, // TODO: Should there be the default
  maxWidth, // TODO: Should there be the default
  shape,
  borderStyle,
  borderWidth,
  borderColor,
  overflow,
  isFlexChildAndExpandsToAvailableSpace,
  dangerouslySetInlineStyle,
  testId,
  isHidingAtSmScreen,
  isHidingAtMdScreen,
  isHidingAtLgScreen,
  className: classNameProp,
  ...props
}: BoxProps) => {
  // TODO: Need to rearange ordering. For example, size specific should be preferred over gerneral
  const smStyles: React.CSSProperties = {
    marginBottom: smMarginBottom || marginBottom || smMargin || margin || 0,
    marginLeft: smMarginLeft || marginLeft || smMargin || margin || 0,
    marginRight: smMarginRight || marginRight || smMargin || margin || 0,
    marginTop: smMarginTop || marginTop || smMargin || margin || 0,
    paddingBottom:
      paddingBottom || smPaddingBottom || smPadding || padding || 0,
    paddingLeft: paddingLeft || smPaddingLeft || smPadding || padding || 0,
    paddingRight: paddingRight || smPaddingRight || smPadding || padding || 0,
    paddingTop: paddingTop || smPaddingTop || smPadding || padding || 0,
    ...(isHidingAtSmScreen
      ? getDisplayStyleFromDisplayProp('none')
      : getDisplayStyleFromDisplayProp(display || smDisplay || 'block')),
  };
  const mdStyles: React.CSSProperties = {
    marginBottom: marginBottom || mdMarginBottom || margin || mdMargin || 0,
    marginLeft: marginLeft || mdMarginLeft || margin || mdMargin || 0,
    marginRight: marginRight || mdMarginRight || margin || mdMargin || 0,
    marginTop: marginTop || mdMarginTop || margin || mdMargin || 0,
    paddingBottom:
      paddingBottom || mdPaddingBottom || padding || mdPadding || 0,
    paddingLeft: paddingLeft || mdPaddingLeft || padding || mdPadding || 0,
    paddingRight: paddingRight || mdPaddingRight || padding || mdPadding || 0,
    paddingTop: paddingTop || mdPaddingTop || padding || mdPadding || 0,
    ...(isHidingAtMdScreen
      ? getDisplayStyleFromDisplayProp('none')
      : getDisplayStyleFromDisplayProp(display || mdDisplay || 'block')),
  };
  const lgStyles: React.CSSProperties = {
    marginBottom: marginBottom || lgMarginBottom || margin || lgMargin || 0,
    marginLeft: marginLeft || lgMarginLeft || margin || lgMargin || 0,
    marginRight: marginRight || lgMarginRight || margin || lgMargin || 0,
    marginTop: marginTop || lgMarginTop || margin || lgMargin || 0,
    paddingBottom:
      paddingBottom || lgPaddingBottom || padding || lgPadding || 0,
    paddingLeft: paddingLeft || lgPaddingLeft || padding || lgPadding || 0,
    paddingRight: paddingRight || lgPaddingRight || padding || lgPadding || 0,
    paddingTop: paddingTop || lgPaddingTop || padding || lgPadding || 0,
    ...(isHidingAtLgScreen
      ? getDisplayStyleFromDisplayProp('none')
      : getDisplayStyleFromDisplayProp(display || lgDisplay || 'block')),
  };
  const getJustifyContentStringForProp = (
    justifyContentProp: JustifyContentProp
  ) => {
    switch (justifyContentProp) {
      case 'center':
        return justifyContent;
      case 'start':
        return `flex-start`;
      case 'end':
        return `flex-end`;
      case 'between':
        return `space-between`;
      case 'around':
        return `space-around`;
      case 'evenly':
        console.warn(
          '<Box/> WARNING: `evenly` was passed to justifyContent but is not supported by all browser'
        );
        return `space-evenly`;
      default:
        const exhaustiveCheck: never = justifyContentProp;
        return exhaustiveCheck;
    }
  };
  const getAlignItemsStringForProp = (
    alignItemsProp: AlignItemsProp
  ): AlignItems => {
    switch (alignItemsProp) {
      case 'start':
        return `flex-start`;
      case 'end':
        return `flex-end`;
      case 'stretch':
        return 'stretch';
      case 'center':
        return 'center';
      case 'baseline':
        return 'baseline';
      default:
        const exhaustiveCheck: never = alignItemsProp;
        return exhaustiveCheck;
    }
  };
  const allStyles: React.CSSProperties = {
    lineHeight: 1, // This is needed to reset our global styles
    alignContent,
    alignItems: getAlignItemsStringForProp(alignItems),
    alignSelf,
    borderStyle: borderWidth === 0 ? 'none' : borderStyle,
    borderWidth,
    borderColor,
    flexDirection: direction,
    justifyContent: getJustifyContentStringForProp(justifyContent),
    backgroundColor: color,
    minHeight,
    minWidth,
    maxHeight,
    maxWidth,
    position,
    flexWrap: reverseWrap ? 'wrap-reverse' : wrap ? 'wrap' : 'nowrap',
    ...getBorderRadiusStylesForShape(shape, borderWidth),
  };
  if (overflow === 'scrollY') {
    allStyles.overflowY = 'scroll';
    // This removes the vertical scrollbar
    // https://stackoverflow.com/questions/16670931/hide-scroll-bar-but-while-still-being-able-to-scroll
    allStyles.paddingRight = 17;
    allStyles.boxSizing = 'content-box';
  } else if (overflow === 'scrollX') {
    allStyles.overflowX = 'scroll';
  } else {
    allStyles.overflow = overflow;
  }

  if (isFlexChildAndExpandsToAvailableSpace) {
    allStyles.flex = 1;
  }

  // Review
  if (flex === 'grow') {
    allStyles.flexGrow = 1;
  } else if (flex === 'shrink') {
    allStyles.flexShrink = 1;
  } else if (flex === 'none') {
    allStyles.flexGrow = 0;
    allStyles.flexShrink = 0;
  }

  if (height) {
    allStyles.height = height;
  }
  if (height || smHeight || mdHeight || lgHeight) {
    smStyles.height = smHeight || height || 0;
    mdStyles.height = mdHeight || height || 0;
    lgStyles.height = lgHeight || height || 0;
  }
  if (minHeight || smMinHeight || mdMinHeight || lgMinHeight) {
    smStyles.minHeight = smMinHeight || minHeight || 0;
    mdStyles.minHeight = mdMinHeight || minHeight || 0;
    lgStyles.minHeight = lgMinHeight || minHeight || 0;
  }
  if (maxHeight || smMaxHeight || mdMaxHeight || lgMaxHeight) {
    smStyles.maxHeight = smMaxHeight || maxHeight || 0;
    mdStyles.maxHeight = mdMaxHeight || maxHeight || 0;
    lgStyles.maxHeight = lgMaxHeight || maxHeight || 0;
  }
  if (maxWidth || smMaxWidth || mdMaxWidth || lgMaxWidth) {
    smStyles.maxWidth = smMaxWidth || maxWidth || 0;
    mdStyles.maxWidth = mdMaxWidth || maxWidth || 0;
    lgStyles.maxWidth = lgMaxWidth || maxWidth || 0;
  }
  if (maxHeight || smMaxHeight || mdMaxHeight || lgMaxHeight) {
    smStyles.maxHeight = smMaxHeight || maxHeight || 0;
    mdStyles.maxHeight = mdMaxHeight || maxHeight || 0;
    lgStyles.maxHeight = lgMaxHeight || maxHeight || 0;
  }
  if (maxWidth || smMaxWidth || mdMaxWidth || lgMaxWidth) {
    smStyles.maxWidth = smMaxWidth || maxWidth || 0;
    mdStyles.maxWidth = mdMaxWidth || maxWidth || 0;
    lgStyles.maxWidth = lgMaxWidth || maxWidth || 0;
  }

  if (width) {
    allStyles.width = width;
  }
  if (width || smWidth || mdWidth || lgWidth) {
    smStyles.width = smWidth || width || 0;
    mdStyles.width = mdWidth || width || 0;
    lgStyles.width = lgWidth || width || 0;
  }
  if (minWidth || smMinWidth || mdMinWidth || lgMinWidth) {
    smStyles.minWidth = smMinWidth || minWidth || 0;
    mdStyles.minWidth = mdMinWidth || minWidth || 0;
    lgStyles.minWidth = lgMinWidth || minWidth || 0;
  }
  if (top) {
    allStyles.top = 0;
  }
  if (bottom) {
    allStyles.bottom = 0;
  }
  if (left) {
    allStyles.left = 0;
  }
  if (right) {
    allStyles.right = 0;
  }

  const className = css({
    [`@media (max-width: ${SM_SCREEN_MAX}px)`]: {
      ...allStyles,
      ...smStyles,
      ...dangerouslySetInlineStyle,
    },
    [`@media (min-width: ${MD_SCREEN_MIN}px) and (max-width: ${MD_SCREEN_MAX}px)`]: {
      ...allStyles,
      ...mdStyles,
      ...dangerouslySetInlineStyle,
    },
    [`@media (min-width: ${LG_SCREEN_MIN}px)`]: {
      ...allStyles,
      ...lgStyles,
      ...dangerouslySetInlineStyle,
    },
  });

  return (
    <React.Fragment>
      <div
        {...props}
        className={`${className} ${classNameProp}`}
        data-testid={testId}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

Box.defaultProps = defaultProps;

export { Box as default, Box };
