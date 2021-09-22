import PropTypes from 'prop-types';
import React from 'react';
import { css, StyleSheet, color, spacing } from '@coursera/coursera-ui';
import _t from 'i18n!nls/coursera-ui';
import { pure } from 'recompose';

const pulsateKeyFrames = {
  '0%': {
    transform: 'scale(.1)',
    opacity: 0,
  },

  '40%': {
    opacity: 1,
  },

  '100%': {
    transform: 'scale(1)',
    opacity: 0,
  },
};

const styles = StyleSheet.create({
  SvgLoaderSignal: {
    position: 'relative',
  },
  loader: {
    textIndent: '-9999em',
    borderStyle: 'solid',
    margin: `${spacing.md} 0 0 ${spacing.md}`,
    opacity: 0,
    position: 'absolute',
    top: `-${spacing.md}`,
    left: `-${spacing.md}`,
    animationName: [pulsateKeyFrames],
    animationDuration: '1s',
    animationIterationCount: 'infinite',
  },
});

// TODO(Audrey): WIP
let SvgLoaderSignal = ({
  htmlAttributes = {},
  style = {},
  isThemeDark,
  size = 32,
  fill = color.primary,
  borderWidth = '0.2em',
}: $TSFixMe) => {
  let fillAlt = fill;
  if (isThemeDark) {
    fillAlt = color.white;
  }

  return (
    <div {...htmlAttributes} {...css(styles.SvgLoaderSignal)} style={{ width: size, height: size, ...style }}>
      <div
        {...css(styles.loader)}
        style={{
          width: size,
          height: size,
          borderRadius: size,
          borderColor: fillAlt,
          borderWidth,
        }}
      >
        {_t('Loading...')}
      </div>
    </div>
  );
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type '({ ht... Remove this comment to see the full error message
SvgLoaderSignal.propTypes = {
  /**
   * Override the inline-styles of the root element
   */
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /**
   * Additional control for the root element, can add data-e2e, ariaLabel...
   */
  htmlAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /**
   * Whether component has dark bg parent element
   */
  isThemeDark: PropTypes.bool,

  size: PropTypes.number,
  fill: PropTypes.string,
  borderWidth: PropTypes.number,
};

// @ts-expect-error ts-migrate(2322) FIXME: Type 'ComponentType<{ htmlAttributes?: {} | undefi... Remove this comment to see the full error message
SvgLoaderSignal = pure(SvgLoaderSignal);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type '({ ... Remove this comment to see the full error message
SvgLoaderSignal.displayName = 'SvgLoaderSignal';

export default SvgLoaderSignal;
