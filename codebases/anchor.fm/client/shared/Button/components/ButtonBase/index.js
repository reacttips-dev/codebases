import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ButtonBase.sass';

// NOTE:
//   Here's a great link on designing buttons
//   https://medium.com/eightshapes-llc/buttons-in-design-systems-eac3acf7e23

// TODO:
//   This should be the same as the radius
//   of box. Use a constant and import into
//   both components
const cornerRaidus = 10;
const pillRadius = 25;

const getBorderRadiusStyleForSquareShape = borderWidth => ({
  borderRadius: 0,
});

const getBorderRadiusStyleForRoundedShape = borderWidth => ({
  borderRadius: cornerRaidus,
});

const getBorderRadiusStyleForCircleShape = borderWidth => ({
  borderRadius: '50%',
});
const getBorderRadiusStyleForPillShape = borderWidth => ({
  borderRadius: pillRadius,
});

const getBorderRadiusStylesForShape = (shape, borderWidth) => {
  switch (shape) {
    case 'square':
      return getBorderRadiusStyleForSquareShape(borderWidth);
    case 'rounded':
      return getBorderRadiusStyleForRoundedShape(borderWidth);
    case 'circle':
      return getBorderRadiusStyleForCircleShape(borderWidth);
    case 'pill':
      return getBorderRadiusStyleForPillShape(borderWidth);
    case 'none':
      return {};
    default:
      return {};
  }
};

const getBoxShadow = (
  isRaised,
  borderWidth,
  borderColor,
  isActive,
  isFocused,
  isHovered
) => {
  const boxShadowWithBorder = `inset 0px 0px 0px ${borderWidth}px ${borderColor}`;
  const boxShadowWithBorderAndRaisedEffect = isRaised
    ? isActive
      ? `${boxShadowWithBorder}, rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px`
      : isHovered || isFocused
      ? `${boxShadowWithBorder}, rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px`
      : `${boxShadowWithBorder}, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px`
    : boxShadowWithBorder;
  // if (isActive) {
  //   return `${boxShadowWithBorder}, rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px`;
  // }
  // if (isHovered || isFocused) {
  //   return `${boxShadowWithBorder}, rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px`;
  // }
  // return `${boxShadowWithBorder}, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px`;
  return boxShadowWithBorder;
};

class ButtonBase extends Component {
  getBackgroundColor = () => {
    const {
      isHovered,
      isActive,
      isFocused,
      hoverBackgroundColor,
      activeBackgroundColor,
      focusedBackgroundColor,
      defaultBackgroundColor,
      isDisabled,
      disabledBackgroundColor,
    } = this.props;
    if (isDisabled) {
      return disabledBackgroundColor;
    }
    if (isActive) {
      return activeBackgroundColor;
    }
    if (isHovered) {
      return hoverBackgroundColor;
    }
    if (isFocused) {
      return focusedBackgroundColor;
    }
    return defaultBackgroundColor;
  };

  render() {
    const { children, height, shape, width } = this.props;
    const {
      isFocused,
      isActive,
      isHovered,
      borderWidth,
      borderColor,
      isRaised,
      isDisabled,
      typeAttribute,
    } = this.props;
    return (
      // https://github.com/yannickcr/eslint-plugin-react/issues/1555
      // tl;dr "proper" solution is to render three different <button>
      // each with a different type in order for the linter to not be
      // pissed about it and it doesn't allow dynamic assignment.
      // ignoring this rule here.
      // eslint-disable-next-line react/button-has-type
      <button
        type={typeAttribute}
        className={styles.root}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={{
          padding: 0,
          cursor: isDisabled ? 'default' : 'pointer',
          backgroundColor: this.getBackgroundColor(),
          width,
          height,
          ...getBorderRadiusStylesForShape(shape),
          boxShadow: getBoxShadow(
            isRaised,
            borderWidth,
            borderColor,
            isActive,
            isFocused,
            isHovered
          ),
        }}
      >
        {children}
      </button>
    );
  }
}

ButtonBase.defaultProps = {
  height: 'auto',
  shape: 'square',
  width: '100%',
  borderColor: 'black',
  isDisabled: false,
  disabledBackgroundColor: null,
};

ButtonBase.propTypes = {
  children: PropTypes.element.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  shape: PropTypes.oneOf(['circle', 'rounded', 'square', 'pill']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isRaised: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  hoverBackgroundColor: PropTypes.string.isRequired,
  activeBackgroundColor: PropTypes.string.isRequired,
  focusedBackgroundColor: PropTypes.string.isRequired,
  defaultBackgroundColor: PropTypes.string.isRequired,
  disabledBackgroundColor: PropTypes.string,
  isDisabled: PropTypes.bool,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string,
  typeAttribute: PropTypes.oneOf(['submit', 'button', 'reset']).isRequired,
};

export default ButtonBase;
