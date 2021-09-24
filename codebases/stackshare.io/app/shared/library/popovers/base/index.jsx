import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Popover, {AUTO_FIT_OFF, AUTO_FIT_VERTICAL} from './popover.jsx';
import PopoverAnchor from './anchor.jsx';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {ARROW_BOTTOM, ARROW_LEFT, ARROW_RIGHT, ARROW_TOP} from './arrow';
import {LAYOUT_STYLE_FIT, LAYOUT_STYLE_NORMAL} from './popover';

const HOVER_TRANSITION_TIMEOUT = 200;

export const ACTIVATE_MODE_HOVER = 'hover';
export const ACTIVATE_MODE_CLICK = 'click';
export const DEACTIVATE_MODE_HOVER = 'hover';
export const DEACTIVATE_MODE_CLICK = 'click';
export {
  AUTO_FIT_OFF,
  AUTO_FIT_VERTICAL,
  LAYOUT_STYLE_NORMAL,
  LAYOUT_STYLE_FIT
} from './popover.jsx';

class PopoverWithAnchor extends Component {
  static propTypes = {
    children: PropTypes.any,
    autoFit: PropTypes.oneOf([AUTO_FIT_OFF, AUTO_FIT_VERTICAL]),
    activateMode: PropTypes.oneOf([ACTIVATE_MODE_CLICK, ACTIVATE_MODE_HOVER]),
    deactivateMode: PropTypes.oneOf([DEACTIVATE_MODE_CLICK, DEACTIVATE_MODE_HOVER]),
    anchor: PropTypes.element,
    width: PropTypes.any,
    arrowSide: PropTypes.oneOf([ARROW_TOP, ARROW_BOTTOM, ARROW_LEFT, ARROW_RIGHT]),
    arrowOffset: PropTypes.number,
    onActivate: PropTypes.func,
    layoutStyle: PropTypes.oneOf([LAYOUT_STYLE_NORMAL, LAYOUT_STYLE_FIT]),
    sendAnalyticsEvent: PropTypes.func,
    activationEvent: PropTypes.string
  };

  static defaultProps = {
    activateMode: ACTIVATE_MODE_HOVER,
    deactivateMode: DEACTIVATE_MODE_HOVER,
    activationEvent: null
  };

  state = {visible: false, position: {x: 0, y: 0}, anchorHeight: 0};
  _autoDismissTimer = null;

  handleDismissByHover = () => {
    this._autoDismissTimer = setTimeout(
      () => this.setState({visible: false}),
      HOVER_TRANSITION_TIMEOUT
    );
  };

  handleShow = position => {
    const {activationEvent, sendAnalyticsEvent} = this.props;
    if (activationEvent) {
      sendAnalyticsEvent(activationEvent);
    }
    this.setState(prevState => ({
      position,
      visible: !prevState.visible
    }));
  };

  componentDidUpdate(_, prevState) {
    const {visible} = this.state;
    if (visible !== prevState.visible) {
      if (visible) {
        this.cancelAutoDismiss();
        this.props.onActivate && this.props.onActivate();
      }
    }
  }

  cancelAutoDismiss = () => clearTimeout(this._autoDismissTimer);

  render() {
    const {visible, position, anchorHeight} = this.state;
    const {
      children,
      autoFit,
      anchor,
      width,
      arrowSide,
      arrowOffset,
      activateMode,
      deactivateMode,
      layoutStyle
    } = this.props;

    return [
      visible && (
        <Popover
          key="popover"
          autoFit={autoFit}
          width={width}
          anchorHeight={anchorHeight}
          layoutStyle={layoutStyle}
          arrowSide={arrowSide}
          arrowOffset={arrowOffset}
          delayShow={activateMode === ACTIVATE_MODE_HOVER}
          onDismissByClick={deactivateMode === DEACTIVATE_MODE_CLICK ? this.handleShow : null}
          position={position}
          onMouseEnter={
            activateMode === ACTIVATE_MODE_HOVER || deactivateMode === DEACTIVATE_MODE_HOVER
              ? this.cancelAutoDismiss
              : null
          }
          onMouseLeave={deactivateMode === DEACTIVATE_MODE_HOVER ? this.handleDismissByHover : null}
        >
          {children}
        </Popover>
      ),
      anchor && (
        <PopoverAnchor
          key="anchor"
          onSize={({height}) => this.setState({anchorHeight: height})}
          onClick={activateMode === ACTIVATE_MODE_CLICK ? this.handleShow : null}
          onMouseEnter={activateMode === ACTIVATE_MODE_HOVER ? this.handleShow : null}
          onMouseLeave={deactivateMode === DEACTIVATE_MODE_HOVER ? this.handleDismissByHover : null}
        >
          {anchor}
        </PopoverAnchor>
      )
    ];
  }
}

export default withSendAnalyticsEvent(PopoverWithAnchor);
