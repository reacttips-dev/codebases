import React, { Component } from 'react';
import { StyleSheet, css, color, transition, iconSize } from '@coursera/coursera-ui';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  SvgIcon: {
    display: 'inline-block',
    color: color.icon,
    transition: transition.easeOut(),
    userSelect: 'none',
  },
});

// Dynamic styles
function getStyles({ propColor, hoverColor, size, hovered }: $TSFixMe) {
  return {
    SvgIcon: {
      fill: hovered && hoverColor ? hoverColor : propColor,
      height: size,
      width: size,
    },
  };
}

class SvgIcon extends Component {
  static propTypes = {
    // Override the inline-styles of the root element
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types

    // Attributes overwrite.
    htmlAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types

    // Elements passed into the SVG Icon.
    children: PropTypes.node,

    // Fill color of the svg, default to color.icon.
    color: PropTypes.string,

    isThemeDark: PropTypes.bool,

    // Width and height of the svg, should be equal, so only use size.
    size: PropTypes.number,

    // Default to color.darkPrimary
    hoverColor: PropTypes.string,

    onMouseEnter: PropTypes.func,

    onMouseLeave: PropTypes.func,

    // Allows you to redefine what the coordinates
    viewBox: PropTypes.string,

    hovered: PropTypes.bool,
    // Sometimes may need to disable mouse event so hovered state can
    // be passed in, e.g. SvgButton
    disableMouseEvent: PropTypes.bool,
  };

  static defaultProps = {
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    viewBox: '0 0 24 24',
    size: iconSize.sm, // 24
    style: {},
    htmlAttributes: {},
  };

  constructor(props: $TSFixMe, context: $TSFixMe) {
    super(props, context);
    const { color: colorAlt, hoverColor, isThemeDark, hovered } = props;
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_color' does not exist on type 'SvgIcon'... Remove this comment to see the full error message
    this._color = colorAlt || (isThemeDark ? color.iconThemeDark : color.icon);
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_hoverColor' does not exist on type 'Svg... Remove this comment to see the full error message
    this._hoverColor = hoverColor || this._color;
    this.state = {
      hovered: !!hovered,
    };
  }

  componentWillReceiveProps(nextProps: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'hovered' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { hovered } = this.state;
    if ('hovered' in nextProps && nextProps.hovered !== hovered) {
      this.setState({ hovered: nextProps.hovered });
    }
  }

  handleMouseLeave = (e: $TSFixMe) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'disableMouseEvent' does not exist on typ... Remove this comment to see the full error message
    const { disableMouseEvent, onMouseLeave } = this.props;
    if (!disableMouseEvent) {
      this.setState({ hovered: false });
      if (onMouseLeave) {
        onMouseLeave(e);
      }
    }
  };

  handleMouseEnter = (e: $TSFixMe) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'disableMouseEvent' does not exist on typ... Remove this comment to see the full error message
    const { disableMouseEvent, onMouseEnter } = this.props;
    if (!disableMouseEvent) {
      this.setState({ hovered: true });
      if (onMouseEnter) {
        onMouseEnter(e);
      }
    }
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'style' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const { style, children, size, viewBox, htmlAttributes } = this.props;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'hovered' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { hovered } = this.state;

    const dynamicStyles = getStyles({
      // @ts-expect-error ts-migrate(2339) FIXME: Property '_color' does not exist on type 'SvgIcon'... Remove this comment to see the full error message
      propColor: this._color,
      // @ts-expect-error ts-migrate(2339) FIXME: Property '_hoverColor' does not exist on type 'Svg... Remove this comment to see the full error message
      hoverColor: this._hoverColor,
      size,
      hovered,
    });
    const mergedStyles = { ...dynamicStyles.SvgIcon, ...style };

    return (
      <svg
        {...htmlAttributes}
        {...css(styles.SvgIcon)}
        style={mergedStyles}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    );
  }
}

export default SvgIcon;
