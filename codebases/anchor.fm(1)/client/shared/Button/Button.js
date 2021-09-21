import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import { Spinner } from '../Spinner';
import ButtonText from './components/ButtonText';
import ButtonOutlined from './components/ButtonOutlined';
import ButtonUnelevated from './components/ButtonUnelevated';

const noop = () => null;
// TODO:
//   Maybe seperate Button and the Button types.
//   So we'd have <ButtonRaised>, <ButtonUneelvated/>, etc

const COLORS = {
  purple: {
    rgb: {
      r: 123,
      g: 64,
      b: 250,
    },
    hex: '#6732B9',
  },
  darkPurple: {
    rgb: {
      r: 103,
      g: 50,
      b: 185,
    },
    hex: '#6732B9',
  },
};
const SIZE = {
  xs: {
    paddingY: 12,
    paddingX: 15,
    textFontSize: 14,
  },
  sm: {
    paddingY: 14,
    paddingX: 20,
    textFontSize: 16,
  },
  md: {
    paddingY: 16,
    paddingX: 25,
    textFontSize: 18,
  },
  lg: {
    paddingY: 20,
    paddingX: 30,
    textFontSize: 20,
  },
  xl: {
    paddingY: 24,
    paddingX: 35,
    textFontSize: 22,
  },
};

const THEMES = {
  green: {
    unelevatedButton: {
      defaultBackgroundColor: '#1cee4e',
      disabledContentColor: '#292f36',
      disabledBackgroundColor: '#1cee4e', // TODO: This is a placeholder for now
      hoverBackgroundColor: '#10d53e',
      focusedBackgroundColor: '#10d53e',
      activeBackgroundColor: '#0eb434',
      defaultContentColor: '#292f36',
      hoverContentColor: '#292f36',
      focusedContentColor: '#292f36',
      activeContentColor: '#292f36',
    },
  },
  black: {
    unelevatedButton: {
      defaultBackgroundColor: '#292f36',
      disabledContentColor: '#ffffff',
      disabledBackgroundColor: '#292f36', // TODO: This is a placeholder for now
      hoverBackgroundColor: '#181c20',
      focusedBackgroundColor: '#181c20',
      activeBackgroundColor: '#040506',
      defaultContentColor: '#ffffff',
      hoverContentColor: '#ffffff',
      focusedContentColor: '#ffffff',
      activeContentColor: '#ffffff',
    },
  },
  red: {
    unelevatedButton: {
      defaultBackgroundColor: '#fd6767',
      disabledContentColor: '#ffffff',
      disabledBackgroundColor: 'rgba(253, 103, 103, .5)',
      hoverBackgroundColor: '#E14040',
      focusedBackgroundColor: '#E14040',
      activeBackgroundColor: '#BE1E1E',
      defaultContentColor: '#ffffff',
      hoverContentColor: '#ffffff',
      focusedContentColor: '#ffffff',
      activeContentColor: '#ffffff',
    },
  },
  white: {
    outlinedButton: {
      defaultBackgroundColor: 'transparent',
      disabledContentColor: 'rgba(255, 255, 255, 0.5)',
      disabledBackgroundColor: 'transparent', // TODO: This is a placeholder for now
      hoverBackgroundColor: 'rgba(255, 255, 255, 0.05)',
      focusedBackgroundColor: 'transparent',
      activeBackgroundColor: 'rgba(255, 255, 255, 0.2)',
      defaultContentColor: '#ffffff',
      hoverContentColor: '#ffffff',
      focusedContentColor: '#ffffff',
      activeContentColor: '#ffffff',
      borderColor: '#ffffff',
    },
  },
  primary: {
    outlinedButton: {
      disabledContentColor: 'rgba(137,64,250, 0.5)',
      disabledBackgroundColor: 'transparent', // TODO: This is a placeholder for now
      hoverBackgroundColor: 'rgba(223, 224, 225, 0.3)',
      focusedBackgroundColor: 'rgba(223, 224, 225, 0.3)',
      activeBackgroundColor: '#DFE0E1',
      defaultContentColor: '#5000b9',
      hoverContentColor: '#5000b9',
      focusedContentColor: '#5000b9',
      activeContentColor: '#5000b9',
    },
    unelevatedButton: {
      defaultBackgroundColor: '#5000b9',
      disabledContentColor: '#E2CFFE',
      disabledBackgroundColor: '#F6F6F6',
      hoverBackgroundColor: '#702CD5',
      focusedBackgroundColor: '#5000b9',
      activeBackgroundColor: '#6732B9',
      defaultContentColor: '#ffffff',
      hoverContentColor: '#ffffff',
      focusedContentColor: '#ffffff',
      activeContentColor: '#D1C1EA',
    },
    textButton: {
      defaultBackgroundColor: 'transparent',
      disabledBackgroundColor: 'transparent', // TODO: This is a placeholder for now
      hoverBackgroundColor: 'transparent',
      focusedBackgroundColor: 'transparent',
      activeBackgroundColor: 'transparent',
      defaultContentColor: `rgba(${COLORS.purple.rgb.r}, ${COLORS.purple.rgb.g}, ${COLORS.purple.rgb.b}, 1)`,
      disabledContentColor: `rgba(${COLORS.purple.rgb.r}, ${COLORS.purple.rgb.g}, ${COLORS.purple.rgb.b}, 1)`,
      hoverContentColor: `rgba(${COLORS.purple.rgb.r}, ${COLORS.purple.rgb.g}, ${COLORS.purple.rgb.b}, 1)`,
      focusedContentColor: `rgba(${COLORS.purple.rgb.r}, ${COLORS.purple.rgb.g}, ${COLORS.purple.rgb.b}, 1)`,
      activeContentColor: `rgba(${COLORS.purple.rgb.r}, ${COLORS.purple.rgb.g}, ${COLORS.purple.rgb.b}, 1)`,
    },
  },
  default: {
    outlinedButton: {
      disabledContentColor: 'rgba(0,0,0, 0.5)',
      disabledBackgroundColor: 'transparent', // TODO: This is a placeholder for now
      hoverBackgroundColor: 'rgba(0,0,0, 0.05)',
      focusedBackgroundColor: 'rgba(0,0,0, 0.05)',
      activeBackgroundColor: 'rgba(0,0,0, 0.2)',
      defaultContentColor: '#292f36',
      hoverContentColor: '#292f36',
      focusedContentColor: '#292f36',
      activeContentColor: '#292f36',
    },
    unelevatedButton: {
      defaultBackgroundColor: 'rgba(0, 0, 0, 0.4)',
      disabledContentColor: 'white',
      disabledBackgroundColor: 'rgba(0, 0, 0, 0.4)', // TODO: This is a placeholder for now
      hoverBackgroundColor: 'rgba(0, 0, 0, 0.5)',
      focusedBackgroundColor: 'rgba(0, 0, 0, 0.55)',
      activeBackgroundColor: 'rgba(0, 0, 0, 0.6)',
      defaultContentColor: 'white',
      hoverContentColor: 'white',
      focusedContentColor: 'white',
      activeContentColor: 'white',
    },
    textButton: {
      disabledBackgroundColor: 'transparent', // TODO: This is a placeholder for now
      defaultBackgroundColor: 'transparent',
      hoverBackgroundColor: 'transparent',
      focusedBackgroundColor: 'transparent',
      activeBackgroundColor: 'transparent',
      disabledContentColor: '#5F6369',
      defaultContentColor: '#5F6369',
      hoverContentColor: '#292F36',
      focusedContentColor: '#292F36',
      activeContentColor: '#292F36',
    },
  },
};

const getContentForSize = (text, size, contentColor) => {
  const sizeObject = SIZE[size] || SIZE.md;
  return (
    <Text
      color={contentColor}
      isBold
      dangerouslySetFontSize={sizeObject.textFontSize}
    >
      {text}
    </Text>
  );
};

const getColorPropsForPrimaryUnelevatedButton = () => {
  const {
    defaultBackgroundColor,
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  } = THEMES.primary.unelevatedButton;
  return {
    defaultBackgroundColor,
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  };
};
const getColorPropsForRedUnelevatedButton = () => {
  const {
    defaultBackgroundColor,
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  } = THEMES.red.unelevatedButton;
  return {
    defaultBackgroundColor,
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  };
};
const getColorPropsForBlackUnelevatedButton = () => {
  const {
    defaultBackgroundColor,
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  } = THEMES.black.unelevatedButton;
  return {
    defaultBackgroundColor,
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  };
};
const getColorPropsForGreenUnelevatedButton = () => {
  const {
    defaultBackgroundColor,
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  } = THEMES.green.unelevatedButton;
  return {
    defaultBackgroundColor,
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  };
};
const getColorPropsForDefaultUnelevatedButton = () => {
  const {
    defaultBackgroundColor,
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledContentColor,
  } = THEMES.default.unelevatedButton;
  return {
    defaultBackgroundColor,
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledContentColor,
  };
};

const getColorPropsForPrimaryTextButton = () => {
  const {
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  } = THEMES.primary.textButton;
  return {
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  };
};

const getColorPropsForDefaultTextButton = () => {
  const {
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  } = THEMES.default.textButton;
  return {
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  };
};

const getColorPropsForPrimaryOutlinedButton = () => {
  const {
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  } = THEMES.primary.outlinedButton;
  return {
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  };
};
const getColorPropsForDefaultOutlinedButton = () => {
  const {
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  } = THEMES.default.outlinedButton;
  return {
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  };
};

const getColorPropsForWhiteOutlinedButton = () => {
  const {
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  } = THEMES.white.outlinedButton;
  return {
    hoverBackgroundColor,
    focusedBackgroundColor,
    activeBackgroundColor,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledBackgroundColor,
    disabledContentColor,
  };
};
const getOutlinedButtonColorPropsForTheme = theme => {
  switch (theme) {
    case 'primary':
      return getColorPropsForPrimaryOutlinedButton();
    case 'white':
      return getColorPropsForWhiteOutlinedButton();
    case 'default':
    default:
      return getColorPropsForDefaultOutlinedButton();
  }
};

const getTextButtonColorPropsForTheme = theme => {
  switch (theme) {
    case 'primary':
      return getColorPropsForPrimaryTextButton();
    case 'default':
    default:
      return getColorPropsForDefaultTextButton();
  }
};

const getUnelevatedButtonColorPropsForTheme = theme => {
  switch (theme) {
    case 'green':
      return getColorPropsForGreenUnelevatedButton();
    case 'black':
      return getColorPropsForBlackUnelevatedButton();
    case 'red':
      return getColorPropsForRedUnelevatedButton();
    case 'primary':
      return getColorPropsForPrimaryUnelevatedButton();
    case 'default':
    default:
      return getColorPropsForDefaultUnelevatedButton();
  }
};

const Button = ({
  colorTheme,
  type,
  renderIcon,
  isHovered,
  isActive,
  isProcessing,
  isFocused,
  text,
  shape,
  isFullWidth,
  isDisabled,
  typeAttribute,
  size,
  height,
  isTextFirst,
}) => {
  const sizeObject = SIZE[size] || SIZE.md;
  switch (type) {
    case 'outlined':
      return (
        <ButtonOutlined
          borderWidth={2}
          borderColor="#DFE0E1"
          isDisabled={isDisabled}
          isFocused={isFocused}
          isHovered={isHovered}
          isActive={isActive}
          isProcessing={isProcessing}
          {...getOutlinedButtonColorPropsForTheme(colorTheme)}
          shape={shape}
          paddingY={sizeObject.paddingY}
          paddingX={sizeObject.paddingX}
          renderContent={contentColor =>
            getContentForSize(text, size, contentColor)
          }
          renderLoading={contentColor => (
            <Spinner size={sizeObject.textFontSize} color={contentColor} />
          )}
          renderIcon={renderIcon}
          width={isFullWidth ? '100%' : 'auto'}
          height={height}
          typeAttribute={typeAttribute}
          isTextFirst={isTextFirst}
        />
      );
    case 'text':
      return (
        <ButtonText
          isDisabled={isDisabled}
          isFocused={isFocused}
          isHovered={isHovered}
          isActive={isActive}
          isProcessing={isProcessing}
          {...getTextButtonColorPropsForTheme(colorTheme)}
          shape={shape}
          paddingY={sizeObject.paddingY}
          paddingX={sizeObject.paddingX}
          renderContent={contentColor =>
            getContentForSize(text, size, contentColor)
          }
          renderIcon={renderIcon}
          width={isFullWidth ? '100%' : 'auto'}
          typeAttribute={typeAttribute}
          isTextFirst={isTextFirst}
        />
      );
    case 'unelevated':
    default:
      return (
        <div>
          <ButtonUnelevated
            isDisabled={isDisabled}
            isFocused={isFocused}
            isHovered={isHovered}
            isActive={isActive}
            isProcessing={isProcessing}
            {...getUnelevatedButtonColorPropsForTheme(colorTheme)}
            shape={shape}
            paddingY={sizeObject.paddingY}
            paddingX={sizeObject.paddingX}
            width={isFullWidth ? '100%' : 'auto'}
            renderContent={contentColor =>
              getContentForSize(text, size, contentColor)
            }
            renderLoading={contentColor => (
              <Spinner size={sizeObject.textFontSize} color={contentColor} />
            )}
            renderIcon={renderIcon}
            typeAttribute={typeAttribute}
            isTextFirst={isTextFirst}
          />
        </div>
      );
  }
};

Button.defaultProps = {
  isHovered: false,
  isActive: false,
  isProcessing: false,
  isFocused: false,
  isDisabled: false,
  size: 'md',
  type: 'unelevated',
  colorTheme: 'default',
  renderIcon: noop,
  shape: 'square',
  isFullWidth: false,
};

Button.propTypes = {
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
  isHovered: PropTypes.bool,
  isActive: PropTypes.bool,
  isProcessing: PropTypes.bool,
  isFocused: PropTypes.bool,
  isDisabled: PropTypes.bool,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  shape: PropTypes.oneOf(['square', 'rounded', 'pill', 'circle']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  isFullWidth: PropTypes.bool,
  typeAttribute: PropTypes.oneOf(['submit', 'button', 'reset']).isRequired,
};

export default Button;
