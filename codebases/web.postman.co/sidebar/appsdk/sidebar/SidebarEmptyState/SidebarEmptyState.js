import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Text, Heading } from '@postman/aether';
import { Button } from '../../../js/components/base/Buttons';

export default class SidebarEmptyState extends Component {
  constructor (props) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  handleAction () {
    this.props.action.handler && this.props.action.handler();
  }

  render () {
    return (
      <div className='sidebar-empty-state'>
        <div className='sidebar-empty-state__illustration' >
          {this.props.illustration ? this.props.illustration : null}
        </div>
        <div className='sidebar-empty-state__head-and-body'>
          <div className='sidebar-empty-state__title'>
            <Heading
              type='h4'
              color='content-color-secondary'
              text={this.props.title}
            />
          </div>
          <div className='sidebar-empty-state__description'>
            <Text type='body-medium' color='content-color-secondary'>{this.props.message}</Text>
          </div>
        </div>
        {
          this.props.action && (
            <div className='sidebar-empty-state__cta'>
              <Button
                type='text'
                onClick={this.handleAction}
                disabled={!this.props.hasPermissions}
                tooltip={this.props.action.tooltip}
              >
                {this.props.action.label}
              </Button>
            </div>
          )
        }
      </div>
    );
  }
}

SidebarEmptyState.defaultProps = {
  action: null,
  hasPermissions: true
};

SidebarEmptyState.propTypes = {
  illustration: PropTypes.node,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  action: PropTypes.shape({
    label: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]).isRequired,
    handler: PropTypes.func.isRequired,
    tooltip: PropTypes.string
  }),
  hasPermissions: PropTypes.bool
};
