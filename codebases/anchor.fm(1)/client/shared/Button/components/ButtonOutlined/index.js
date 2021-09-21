import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '../ButtonBase';
import ButtonContent from '../ButtonContent';

const noop = () => null;

const getContentColorForButtonState = ({
  isHovered,
  isActive,
  isFocused,
  defaultContentColor,
  hoverContentColor,
  focusedContentColor,
  activeContentColor,
  isDisabled,
  disabledContentColor,
}) => {
  if (isDisabled) {
    return disabledContentColor;
  }
  if (isActive) {
    return activeContentColor;
  }
  if (isFocused) {
    return focusedContentColor;
  }
  if (isHovered) {
    return hoverContentColor;
  }
  return defaultContentColor;
};

const ButtonOutlined = ({
  isHovered,
  isActive,
  isFocused,
  isDisabled,
  disabledContentColor,
  disabledBackgroundColor,
  hoverBackgroundColor,
  focusedBackgroundColor,
  activeBackgroundColor,
  shape = 'square',
  width = '100%',
  height = 'auto',
  renderContent,
  renderLoading,
  renderIcon,
  isProcessing,
  paddingX,
  paddingY,
  defaultContentColor,
  hoverContentColor,
  focusedContentColor,
  activeContentColor,
  borderWidth,
  borderColor,
  typeAttribute,
  isTextFirst,
}) => {
  const contentColor = getContentColorForButtonState({
    isHovered,
    isActive,
    isFocused,
    isDisabled,
    defaultContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
    disabledContentColor,
  });
  return (
    <ButtonBase
      borderWidth={borderWidth}
      borderColor={borderColor}
      height={height}
      width={width}
      shape={shape}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isHovered={isHovered}
      isActive={isActive}
      disabledBackgroundColor={disabledBackgroundColor}
      defaultBackgroundColor="transparent"
      hoverBackgroundColor={hoverBackgroundColor}
      focusedBackgroundColor={focusedBackgroundColor}
      activeBackgroundColor={activeBackgroundColor}
      isRaised={false}
      typeAttribute={typeAttribute}
    >
      <ButtonContent
        renderIcon={renderIcon ? () => renderIcon(contentColor) : noop}
        renderContent={() => renderContent(contentColor)}
        renderLoading={isProcessing ? () => renderLoading(contentColor) : noop}
        paddingY={paddingY}
        paddingX={paddingX}
        isTextFirst={isTextFirst}
        height={height}
      />
    </ButtonBase>
  );
};

ButtonOutlined.defaultProps = {
  renderIcon: noop,
  renderContent: noop,
  renderLoading: noop,
  shape: 'square',
  width: '100%',
  height: 'auto',
  paddingX: 0,
  paddingY: 0,
  typeAttribute: 'button',
  isDisabled: false,
};

ButtonOutlined.propTypes = {
  isDisabled: PropTypes.bool,
  isHovered: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  disabledBackgroundColor: PropTypes.string.isRequired,
  hoverBackgroundColor: PropTypes.string.isRequired,
  focusedBackgroundColor: PropTypes.string.isRequired,
  activeBackgroundColor: PropTypes.string.isRequired,
  shape: PropTypes.oneOf(['square', 'rounded', 'pill', 'circle']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  renderContent: PropTypes.func,
  renderLoading: PropTypes.func,
  renderIcon: PropTypes.func,
  isProcessing: PropTypes.bool.isRequired,
  paddingX: PropTypes.number,
  paddingY: PropTypes.number,
  defaultContentColor: PropTypes.string.isRequired,
  disabledContentColor: PropTypes.string.isRequired,
  hoverContentColor: PropTypes.string.isRequired,
  focusedContentColor: PropTypes.string.isRequired,
  activeContentColor: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired,
  typeAttribute: PropTypes.oneOf(['submit', 'button', 'reset']),
};

export default ButtonOutlined;
