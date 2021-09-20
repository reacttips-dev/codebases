import React, { Component } from 'react';
import { Button } from '../base/Buttons';

export default class SyncConflictFooter extends Component {
  constructor (props) {
    super(props);
    this.handleResync = this.handleResync.bind(this);
  }

  handleResync () {
    this.props.onResyncClicked && this.props.onResyncClicked();
  }

  render () {

    return (
      <div className='sync-conflict-footer-wrapper'>
        <Button
          type='primary'
          onClick={this.handleResync}
        >
          Resync
        </Button>
      </div>
    );
  }
}
