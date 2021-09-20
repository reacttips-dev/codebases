import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classes from 'classnames';
import { Tooltip, TooltipBody } from './Tooltips';

export class Button extends Component {
  constructor (props) {
    super(props);
    this.state = { showTooltip: false };

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleShowTooltipToggle = this.handleShowTooltipToggle.bind(this);
    this.handleHideTooltipToggle = this.handleHideTooltipToggle.bind(this);
  }

  handleClick (e) {
    this.handleHideTooltipToggle();
    !this.props.disabled && this.props.onClick && this.props.onClick(e);
  }

  handleMouseDown (e) {
    !this.props.disabled && this.props.onMouseDown && this.props.onMouseDown(e);
  }

  handleShowTooltipToggle () {
    if (!this.props.tooltip) {
      return;
    }

    !this.state.showTooltip && this.setState({ showTooltip: true });
  }

  handleHideTooltipToggle () {
    if (!this.props.tooltip) {
      return;
    }

    this.state.showTooltip && this.setState({ showTooltip: false });
  }

  focus () {
    if (!this.props.focusable) {
      return;
    }

    let $node = findDOMNode(this);
    $node && $node.focus();
  }

  getClasses () {
    return classes({
      'btn': true,
      'btn-fluid': this.props.fluid,
      'btn-primary': this.props.type === 'primary',
      'btn-secondary': this.props.type === 'secondary',
      'btn-tertiary': this.props.type === 'tertiary',
      'btn-header': this.props.type === 'header',
      'btn-text': this.props.type === 'text',
      'btn-icon': this.props.type === 'icon',
      'btn-icon-rect': this.props.iconType === 'rect',
      'btn-icon-circle': this.props.iconType === 'circle',
      'btn-small': this.props.size === 'small',
      'btn-huge': this.props.size === 'huge',
      'is-disabled': this.props.disabled,
      'is-hovered': this.props.hovered,
      'is-active': this.props.active,
      'is-focused': this.props.focused
    }, this.props.className);
  }

  render () {
    let classes = this.getClasses(),

    /**
     * allow components to decide tooltip placement on button
     * set default value to bottom-left for tooltip placement
     */
      tooltipPlacement = this.props.tooltipPlacement || 'bottom-left';

    return (
      <div
        className={classes}
        onMouseDown={this.handleMouseDown}
        onClick={this.handleClick}
        ref='tooltip_button'
        onMouseEnter={this.handleShowTooltipToggle}
        onMouseLeave={this.handleHideTooltipToggle}
        tabIndex={this.props.focusable ? -1 : 0}
      >
        {this.props.children}
        {
          this.props.tooltip &&
          <Tooltip
            show={this.state.showTooltip}
            target={this.refs.tooltip_button}
            placement={tooltipPlacement}
            immediate={this.props.tooltipImmediate}
          >
            <TooltipBody>
              {this.props.tooltip}
            </TooltipBody>
          </Tooltip>
        }
      </div>
    );
  }
}

Button.defaultProps = {
  tooltipImmediate: false
};

export class ButtonGroup extends Component {
  constructor (props) {
    super(props);
  }

  getClasses () {
    return classes({
      'btn-group': true,
      'btn-group-separated': this.props.separated
    });
  }

  render () {
    let classes = this.getClasses();

    return (
      <div className={classes}>{this.props.children}</div>
    );
  }
}
