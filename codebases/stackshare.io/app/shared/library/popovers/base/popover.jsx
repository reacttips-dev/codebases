import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import Arrow, {ARROW_TOP, ARROW_BOTTOM, ARROW_LEFT, ARROW_RIGHT} from './arrow.jsx';
import {ASH, WHITE} from '../../../style/colors';
import {ARROW_CENTER_OFFSET, ARROW_HEIGHT} from './arrow';
import PositionPropType, {DefaultPosition} from './position-prop-type';

export {ARROW_TOP, ARROW_BOTTOM, ARROW_LEFT, ARROW_RIGHT} from './arrow.jsx';

const ANCHOR_OFFSET = 2;

export const AUTO_FIT_VERTICAL = 'vertical';
export const AUTO_FIT_OFF = null;

export const LAYOUT_STYLE_FIT = 'fit';
export const LAYOUT_STYLE_NORMAL = null;

const Container = glamorous.div(
  {
    display: 'flex',
    border: `1px solid ${ASH}`,
    flexDirection: 'column',
    margin: 0,
    backgroundColor: WHITE,
    zIndex: Number.MAX_SAFE_INTEGER,
    borderRadius: 2
  },
  ({width, top, left, opacity, delayShow, layoutStyle, inline}) => ({
    position: inline ? 'relative' : 'absolute',
    minWidth: inline ? 'auto' : width,
    width: inline ? '100%' : 'auto',
    top: inline ? 'auto' : top,
    left: inline ? 'auto' : left,
    opacity,
    transition: `opacity ${delayShow ? '300ms 500ms' : '100ms'}`,
    padding: layoutStyle === LAYOUT_STYLE_FIT ? 0 : '20px 18px'
  })
);

const MIN_Y = 0;
const MIN_TOP = 45;

export default class Popover extends Component {
  static propTypes = {
    width: PropTypes.any,
    anchorHeight: PropTypes.any,
    autoFit: PropTypes.oneOf([AUTO_FIT_OFF, AUTO_FIT_VERTICAL]),
    arrowSide: PropTypes.oneOf([ARROW_TOP, ARROW_BOTTOM, ARROW_LEFT, ARROW_RIGHT]),
    arrowOffset: PropTypes.number,
    onDismissByClick: PropTypes.func,
    ...PositionPropType,
    children: PropTypes.any,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    delayShow: PropTypes.bool,
    layoutStyle: PropTypes.oneOf([LAYOUT_STYLE_NORMAL, LAYOUT_STYLE_FIT]),
    inline: PropTypes.bool
  };

  static defaultProps = {
    autoFit: AUTO_FIT_OFF,
    width: 'auto',
    anchorHeight: 0,
    arrowSide: ARROW_BOTTOM,
    arrowOffset: 0,
    layoutStyle: LAYOUT_STYLE_NORMAL,
    ...DefaultPosition,
    inline: false
  };

  state = {height: 0, nudgeX: 0, opacity: 0, nudgeY: 0};
  _el = null;

  handleDismiss = event => {
    if (this._el && !this._el.contains(event.target)) {
      this.props.onDismissByClick();
    }
  };

  componentDidMount() {
    if (this._el) {
      let nudgeX = 0;
      let flipY = false;

      if (this.props.autoFit === AUTO_FIT_VERTICAL) {
        const offsetTop = this._el.offsetTop;
        const rect = this._el.getBoundingClientRect();
        const parent = this._el.offsetParent
          ? this._el.offsetParent.getBoundingClientRect()
          : {x: 0, width: window.innerWidth};
        if (rect.x + rect.width > parent.x + parent.width) {
          nudgeX = parent.x + parent.width - (rect.x + rect.width);
        }
        if (rect.x < 0) {
          nudgeX = 0 - rect.x;
        }

        if (rect.y - rect.height < MIN_Y) {
          flipY = true;
        }

        if (offsetTop < MIN_TOP) {
          flipY = true;
        }
      }

      //eslint-disable-next-line
      this.setState({height: this._el.clientHeight, nudgeX, flipY, opacity: 1});
    }
    if (this.props.onDismissByClick) {
      document.addEventListener('click', this.handleDismiss, false);
    }
  }

  componentWillUnmount() {
    if (this.props.onDismissByClick) {
      document.removeEventListener('click', this.handleDismiss, false);
    }
    this._el = null;
  }

  getArrowSide() {
    if (this.state.flipY) {
      if (this.props.arrowSide === ARROW_BOTTOM) {
        return ARROW_TOP;
      }
    }
    return this.props.arrowSide;
  }

  render() {
    const {
      arrowSide,
      arrowOffset,
      width,
      anchorHeight,
      position,
      children,
      onMouseEnter,
      onMouseLeave,
      delayShow,
      layoutStyle,
      inline
    } = this.props;

    const {nudgeX, flipY, height} = this.state;

    let top = position.y - height - ARROW_HEIGHT - ANCHOR_OFFSET;
    if (flipY) {
      top = position.y + anchorHeight + ARROW_HEIGHT + ANCHOR_OFFSET;
    }
    const left = position.x + nudgeX + ARROW_CENTER_OFFSET;
    return (
      <Container
        key="popover"
        top={top}
        left={left}
        width={width}
        innerRef={el => (this._el = el)}
        opacity={this.state.opacity}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        delayShow={delayShow}
        layoutStyle={layoutStyle}
        inline={inline}
      >
        <Arrow
          side={flipY && arrowSide === ARROW_BOTTOM ? ARROW_TOP : arrowSide}
          offset={arrowOffset - nudgeX}
        />
        {children}
      </Container>
    );
  }
}
