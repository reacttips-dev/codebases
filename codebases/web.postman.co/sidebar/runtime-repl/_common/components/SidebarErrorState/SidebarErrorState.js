import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';

@observer
export default class SidebarErrorState extends Component {
  constructor (props) {
    super(props);

    this.renderButton = this.renderButton.bind(this);
  }

  renderButton () {
    if (this.props.buttonText) {
      return (
        <Button
          type='secondary'
          onClick={this.props.handler}
        >
          {this.props.buttonText}
        </Button>
      );
    }
  }

  render () {
    return (
      <div className='sidebar-error-wrapper'>
        <div className='sidebar-error-thumbnail' />
        <div className='sidebar-error-content-container'>
          <div className='sidebar-error-header'>{this.props.title}</div>
          <div className='sidebar-error-content'>
            {this.props.description}
          </div>
          {this.renderButton()}
        </div>
      </div>
    );
  }
}

SidebarErrorState.defaultProps = {
  description: null,
  buttonText: null,
  handler: _.noop
};

SidebarErrorState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  handler: PropTypes.func
};
