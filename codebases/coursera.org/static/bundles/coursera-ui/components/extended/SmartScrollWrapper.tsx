/* eslint-disable no-use-before-define */
import PropTypes from 'prop-types';

import React from 'react';
import { StyleSheet, css, color, spacing, zIndex } from '@coursera/coursera-ui';

import withScrollInfo from 'bundles/coursera-ui/components/hocs/withScrollInfo';

const DELTA = 50;
const NAVBAR_HEIGHT = 60;

/**
 *  A wrapper component to create medium nav style container
 * 1. When user scroll down, the container will go up as usual
 * 2. As soon as user starts to scroll up, we'll show the container
 * User can config what's the delta scroll distance they want to trigger the update
 * and the delta (takes priority) can be prop or function argument
 */
const SmartScrollWrapper = ({
  lastScrollPosition,
  isScrollingDown,
  children,
  containerHeight = NAVBAR_HEIGHT,
  zIndex: zIndexProp,
  alwaysHide,
  style = {},
}: $TSFixMe) => {
  const hideContainer = (lastScrollPosition >= containerHeight && isScrollingDown) || alwaysHide;
  const dynamicStyles = getStyles({ containerHeight, zIndexProp });
  const hideStyle = (hideContainer && dynamicStyles.hideContainer) || {};

  // mergedStyles is combination of component height and top offset
  const mergedStyles = {
    ...dynamicStyles.SmartScrollWrapper,
    ...hideStyle,
    ...style,
  };

  return (
    <div {...css(styles.SmartScrollWrapper)} style={mergedStyles}>
      {children}
    </div>
  );
};

SmartScrollWrapper.propTypes = {
  // Override the inline-styles of the root element
  style: PropTypes.object,

  // From withScrollInfo, get the top position of the wrapper component
  lastScrollPosition: PropTypes.number,

  // From withScrollInfo, get the scroll direction
  isScrollingDown: PropTypes.bool,

  children: PropTypes.node,
  // The height of the container, may be different if the window resizes
  // The parent container needs to pass the correct height
  containerHeight: PropTypes.number,

  // Make the wrapper always not visible
  alwaysHide: PropTypes.bool,

  // Customize zIndex when showing the content inside, defualt to zIndex.md,
  zIndex: PropTypes.number,

  // Disable the scrolling effect
  disableScrollEffect: PropTypes.bool,
};

SmartScrollWrapper.defaultProps = {
  containerHeight: NAVBAR_HEIGHT,
};

function getStyles({ containerHeight, zIndexProp }: $TSFixMe) {
  return {
    SmartScrollWrapper: {
      // height: containerHeight,
      zIndex: zIndexProp || zIndex.md,
    },
    hideContainer: {
      top: -containerHeight,
    },
  };
}

export default withScrollInfo({ delta: DELTA })(SmartScrollWrapper);

const styles = StyleSheet.create({
  SmartScrollWrapper: {
    minWidth: spacing.minWidth,
    backgroundColor: color.white,
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
    position: 'fixed',
    width: '100%',
    left: 0,
    right: 0,
    top: 0,
    transition: 'top 0.2s ease-in-out',
    zIndex: zIndex.lg,
  },
  container: {
    width: '100%',
  },
});
