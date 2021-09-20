import React, { Component } from 'react';
import classnames from 'classnames';

import Text from './Text';
import Icon from './Icon';
import Pane from './Pane';
import Drawer from './Drawer';
import { Tooltip, TooltipBody } from '../../base/Tooltips';

export default class Item extends Component {
  constructor (props) {
    super(props);

    this.state = { showTooltip: false };

    this.handleToggleTooltip = this.handleToggleTooltip.bind(this);
  }

  handleToggleTooltip (value = !this.state.showTooltip) {
    if (this.props.isOpen && value) {
      // Do not show the tooltip if the status bar / pane is open
      this.setState({ showTooltip: false });
      return;
    }

    this.setState({ showTooltip: value });
  }

  getClasses () {
    return classnames({
      'sb__item': true,
      'is-disabled': this.props.isDisabled,
      'is-active': this.props.isDisabled && this.props.isOpen
    }, this.props.className);
  }

  render () {
    return (
      <div
        ref='item'
        className={this.getClasses()}
      >
        {
          React.Children.map(this.props.children, (child) => {
            if (child.type === Icon) {
              return React.cloneElement(child, {
                onMouseEnter: this.handleToggleTooltip.bind(this, true),
                onMouseLeave: this.handleToggleTooltip.bind(this, false)
              });
            }
            else if (child.type === Text) {
              return React.cloneElement(child);
            }
            else if (child.type === Pane) {
              return React.cloneElement(child, {
                isOpen: this.props.isOpen,
                onClose: this.props.toggleActive
              });
            }
            else if (child.type === Drawer) {
              return React.cloneElement(child, {
                isOpen: this.props.isOpen,
                onClose: this.props.toggleActive
              });
            }
            else {
              throw new Error('Invalid child type, must be Icon, Text, Drawer or Pane');
            }
          })
        }
        {
          this.props.tooltip &&
            <Tooltip
              show={this.state.showTooltip}
              target={this.refs.item}
              placement='top'
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
