import React from 'react';
import PropTypes from 'prop-types';

import Pressable from '../Pressable';
import Hoverable from '../Hoverable';

import Button from './Button';

const noop = () => null;

/**
 * @deprecated Use  `NewButton` instead
 */
const ButtonWithHoverAndPress = ({
  onPress,
  onHoverStart,
  onHoverEnd,
  colorTheme,
  type,
  renderIcon,
  isProcessing,
  text,
  shape,
  size,
  isFullWidth,
  isDisabled,
  typeAttribute,
  isEventBubblingAllowed,
  isTextFirst,
  height,
}) => (
  <Pressable
    onPress={isDisabled ? () => null : onPress}
    fullWidth={isFullWidth}
    isEventBubblingAllowed={isEventBubblingAllowed}
    isDefaultBehaviorAllowed={isEventBubblingAllowed} // TODO: Should we extend button to handle both `preventDefault` and `stopPropgration`?
  >
    {({ isPressed }) => (
      <Hoverable
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        fullWidth={isFullWidth}
      >
        {({ isHovering }) => (
          <Button
            isHovered={isHovering}
            isActive={isPressed}
            colorTheme={colorTheme}
            type={type}
            renderIcon={renderIcon}
            isProcessing={isProcessing}
            text={text}
            shape={shape}
            height={height}
            size={size}
            isFullWidth={isFullWidth}
            isDisabled={isDisabled}
            typeAttribute={typeAttribute}
            isTextFirst={isTextFirst}
          />
        )}
      </Hoverable>
    )}
  </Pressable>
);

ButtonWithHoverAndPress.defaultProps = {
  onPress: noop,
  onHoverStart: noop,
  onHoverEnd: noop,
  isDisabled: false,
  isProcessing: false,
  size: 'md',
  type: 'unelevated',
  colorTheme: 'default',
  renderIcon: null,
  shape: 'pill',
  isFullWidth: false,
  typeAttribute: 'button',
  isEventBubblingAllowed: false,
  isTextFirst: false,
  height: null,
};

ButtonWithHoverAndPress.propTypes = {
  colorTheme: PropTypes.oneOf([
    'primary',
    'default',
    'red',
    'black',
    'green',
    'white',
  ]),
  type: PropTypes.oneOf(['unelevated', 'text', 'outlined']),
  renderIcon: PropTypes.func,
  onPress: PropTypes.func,
  onHoverStart: PropTypes.func,
  onHoverEnd: PropTypes.func,
  isProcessing: PropTypes.bool,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  shape: PropTypes.oneOf(['square', 'rounded', 'pill', 'circle']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  isFullWidth: PropTypes.bool,
  isDisabled: PropTypes.bool,
  typeAttribute: PropTypes.oneOf(['submit', 'button', 'reset']),
  isEventBubblingAllowed: PropTypes.bool,
  isTextFirst: PropTypes.bool,
  height: PropTypes.number,
};

// eslint-disable-next-line import/no-default-export
export { ButtonWithHoverAndPress as default };
