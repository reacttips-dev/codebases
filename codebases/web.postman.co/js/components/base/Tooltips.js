import React, { Component } from 'react';
import classnames from 'classnames';
import onClickOutside from '@postman/react-click-outside';
import { Tooltip as ReactTooltip } from 'reactstrap';
import { Theme } from '../../apps/shared/ThemeContext';

// Reference - https://reactstrap.github.io/components/tooltips/
const PlacementAnchorPositionMap = {
    'top-left': 'top-start',
    'top-right': 'top-end',
    'bottom-left': 'bottom-start',
    'bottom-right': 'bottom-end',
    'left-top': 'left-start',
    'left-bottom': 'left-end',
    'right-top': 'right-start',
    'right-bottom': 'right-end',
    'top': 'top',
    'bottom': 'bottom',
    'left': 'left',
    'right': 'right',
    'auto': 'auto'
  },
  SHOW_DEFAULT_DELAY = 700;

export class Tooltip extends Component {

  constructor (props) {
    super(props);

    this.state = {
      target: null,
      show: false
    };

    this.timeout = null;
    this.DOMWatcher = null;
    this.hideTooltip = this.hideTooltip.bind(this);
    this.onElementHide = this.onElementHide.bind(this);
  }

  UNSAFE_componentWillReceiveProps (nextProps) {

    if (this.props.show === false && nextProps.show === false) {
      return;
    }

    let target = nextProps.target,
      isInstanceOfElement = target instanceof Element;

    if (!target || !isInstanceOfElement || !document.body.contains(target)) {
      this.hideTooltip();
      return;
    }

    if (nextProps.show) {

      this.DOMWatcher && this.DOMWatcher.disconnect();
      this.state.target && this.state.target.removeEventListener('click', this.props.onTargetClick);
      target.addEventListener('click', nextProps.onTargetClick);

      this.DOMWatcher = new MutationObserver(this.onElementHide);
      this.DOMWatcher.observe(document.body, { subtree: true, childList: true });

      if (nextProps.immediate) {
        this.setState({
          show: true,
          target
        });
        return;
      }

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({
          show: true,
          target
        });
      }, nextProps.delay || SHOW_DEFAULT_DELAY);
    }

    else {
      this.hideTooltip();
    }
  }

  hideTooltip (e) {
    this.DOMWatcher && this.DOMWatcher.disconnect();
    this.state.target && this.state.target.removeEventListener('click', this.props.onTargetClick);
    clearTimeout(this.timeout);
    this.setState({ show: false, target: null }, () => {
      this.props.onClose && this.props.onClose(e);
    });
  }

  onElementHide (mutations) {

    if (!this.state.target) {
      return;
    }

    _.forEach(mutations, (mutation) => {
      let nodes = Array.from(mutation.removedNodes);
      let parentRemoved = nodes.some((parent) => parent.contains(this.state.target)),
        targetRemoved = nodes.indexOf(this.state.target) > -1;
      if (parentRemoved || targetRemoved) {
        this.hideTooltip();
        return false;
      }
    });
  }

  computeClasses () {
    return classnames(
      'tooltip',
      this.props.className
    );
  }

  componentWillUnmount () {
    this.hideTooltip();
  }

  render () {

    if (!this.state.target) {
      return false;
    }

    let placement = PlacementAnchorPositionMap[this.props.placement] || 'auto',
      offset = this.props.arrowOffset || this.props.arrowOffsetLeft || this.props.arrowOffsetTop || 0;

    return (
      <ReactTooltip
        isOpen={this.state.show}
        autohide={false}
        placement={placement}
        target={this.state.target}
        className={this.computeClasses()}
        offset={offset}
        boundariesElement={this.props.boundary || 'viewport'}
        container={this.props.container}
        hideArrow={this.props.hideArrow}
        arrowClassName={this.props.arrowClassName}
      >
        <Theme>
          <TooltipWrapper
            handleClose={this.hideTooltip}
            enableOutsideClick={this.props.closeOnClickOutside}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
          >
            {this.props.children}
          </TooltipWrapper>
        </Theme>
      </ReactTooltip>
    );
  }
}

@onClickOutside
export class TooltipWrapper extends Component {

  constructor () {
    super();
  }

  handleClickOutside (e) {
    if (this.props.enableOutsideClick) {
      this.props.handleClose && this.props.handleClose(e);
    }
  }

  render () {

    return (
      <div
        ref='tooltip-inner-wrapper'
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        <div className='tooltip-wrapper'>
          { this.props.children }
        </div>
      </div>
    );
  }
}

export class TooltipHeader extends Component {

  constructor () {
    super();
  }

  render () {
    return (
      <div className='tooltip-header'>
        <span className='tooltip-header-title'>
          {this.props.children}
        </span>
      </div>
    );
  }
}

export class TooltipBody extends Component {

  constructor () {
    super();
  }

  render () {
    return (
      <span className='tooltip-body'>
        {this.props.children}
      </span>
    );
  }
}
