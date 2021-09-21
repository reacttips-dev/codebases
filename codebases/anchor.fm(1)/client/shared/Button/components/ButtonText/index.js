import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '../ButtonBase';
import Spinner from '../../../../components/Spinner';
import ButtonContent from '../ButtonContent';

const noop = () => null;

const renderDefaultLoading = () => <Spinner />;

const getContentColorForButtonState = ({
  isHovered,
  isActive,
  isDisabled,
  isFocused,
  defaultContentColor,
  disabledContentColor,
  hoverContentColor,
  focusedContentColor,
  activeContentColor,
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

const ButtonText = ({
  isHovered,
  isActive,
  isFocused,
  isDisabled,
  disabledBackgroundColor,
  hoverBackgroundColor,
  disabledContentColor,
  focusedBackgroundColor,
  activeBackgroundColor,
  shape,
  width,
  height,
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
  typeAttribute,
}) => {
  const contentColor = getContentColorForButtonState({
    isHovered,
    isActive,
    isFocused,
    isDisabled,
    defaultContentColor,
    disabledContentColor,
    hoverContentColor,
    focusedContentColor,
    activeContentColor,
  });
  return (
    <ButtonBase
      borderWidth={0}
      height={height}
      width={width}
      shape={shape}
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
      borderColor="transparent"
    >
      <ButtonContent
        renderIcon={renderIcon ? () => renderIcon(contentColor) : null}
        renderContent={() => renderContent(contentColor)}
        renderLoading={() =>
          isProcessing
            ? renderLoading(contentColor) || renderDefaultLoading
            : noop()
        }
        paddingY={paddingY}
        paddingX={paddingX}
      />
    </ButtonBase>
  );
};

ButtonText.defaultProps = {
  renderIcon: noop,
  renderContent: noop,
  renderLoading: noop,
  shape: 'square',
  width: '100%',
  height: 'auto',
  paddingX: 0,
  paddingY: 0,
  typeAttribute: 'button',
};

ButtonText.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
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
  typeAttribute: PropTypes.oneOf(['submit', 'button', 'reset']),
};

export default ButtonText;
