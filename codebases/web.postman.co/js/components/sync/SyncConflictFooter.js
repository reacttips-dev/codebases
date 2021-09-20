import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import KeyMaps from '../base/keymaps/KeyMaps';

export default class SyncConflictFooter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isResolveFocused: true
    };

    this.handleResync = this.handleResync.bind(this);
    this.handleFocusClick = this.handleFocusClick.bind(this);
    this.handleFocusSwitch = this.handleFocusSwitch.bind(this);
  }

  handleResync () {
    this.props.onResyncClicked && this.props.onResyncClicked();
  }

  handleFocusSwitch (e) {
    this.setState({ isResolveFocused: !this.state.isResolveFocused });
  }

  handleFocusClick () {
    this.state.isResolveFocused ? this.handleResync() : this.props.onAllServerValueSelected();
  }


  render () {
    const handlers = {
      'submit': this.handleFocusClick,
      'focusNext': this.handleFocusSwitch
    };

    return (
      <KeyMaps
        keyMap={pm.shortcuts.getShortcuts()}
        handlers={handlers}
        ref={this.props.keymapRef}
      >
        <div className='sync-conflict-footer'>
          <Button
            className='sync-conflict-resolve'
            type='primary'
            size='small'
            disabled={!this.props.isHydrated}
            onClick={this.handleResync}
            focused={this.state.isResolveFocused}
          >
            Resolve Conflicts
          </Button>
          <Button
            type='secondary'
            size='small'
            disabled={!this.props.isHydrated}
            focused={!this.state.isResolveFocused}
            onClick={() => { this.props.onAllServerValueSelected(); }}
          >
            Reset
          </Button>
        </div>
      </KeyMaps>
    );
  }
}
