import React from 'react';
import PropTypes from 'prop-types';

import Box from '../../shared/Box';
import IconIndex from '../../shared/Icon/components/index';
import styles from './IconBadge.sass';

const getPaddingValue = (width, padding) => {
  if (padding || padding === 0) return padding;
  if (width > 30) return '16%';
  if (width >= 24) return 6;
  if (width >= 18) return 4;
  return 2;
};

const getBackgroundColorHex = backgroundColor => {
  switch (backgroundColor) {
    case 'blue':
      return '#5000b9';
    case 'green':
      return '#1CEE4E';
    case 'gray':
      return '#c9cbcd';
    case 'darkGray':
      return '#7f8287';
    case 'black':
      return '#292F36';
    case 'purple':
      return '#5000b9';
    case 'transparent':
      return 'transparent';
    default:
      return '';
  }
};

const IconBadge = ({
  backgroundColor,
  height,
  dropshadow,
  iconColor,
  padding,
  shape,
  type,
  width,
  ariaHidden = false,
}) => (
  <Box
    alignItems="center"
    width={width}
    height={height || width}
    padding={getPaddingValue(width, padding)}
    color={getBackgroundColorHex(backgroundColor)}
    dangerouslySetInlineStyle={{
      boxShadow: dropshadow ? '1px 2px 1px 0px #DFE0E1' : '',
      borderRadius: shape === 'square' ? '2px' : '100%',
    }}
    display="flex"
    justifyContent="center"
    shape={shape}
    aria-hidden={ariaHidden}
  >
    {IconIndex[type]({
      className: styles.svgHeightWidth,
      fillColor: iconColor,
    })}
  </Box>
);

IconBadge.defaultProps = {
  backgroundColor: 'blue',
  height: null,
  dropshadow: false,
  iconColor: '#fff',
  padding: null,
  shape: 'circle',
  width: 20,
};

IconBadge.propTypes = {
  backgroundColor: PropTypes.oneOf([
    'blue',
    'green',
    'gray',
    'darkGray',
    'black',
    'transparent',
    'purple',
  ]),
  dropshadow: PropTypes.bool,
  iconColor: PropTypes.string,
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  shape: PropTypes.oneOf(['circle', 'square']),
  type: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export { IconBadge as default, IconBadge };
