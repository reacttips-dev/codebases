import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import TextArea from '../base/TextArea';

export default class SyncIssue extends Component {
  constructor (props) {
    super(props);
  }

  render () {

    return (
      <div className='sync-issue'>
        <div className='sync-issue-container'>
          <div className='sync-issue-content-left'>
            Your updates couldn’t be synced with Postman’s servers. Please wait a few minutes and try again.
          </div>
          <div className='sync-issue-content-right'>
            <Button
              type='primary'
              className='sync-issue-button'
              onClick={this.props.onResyncNow}
            >
              Resync Now
            </Button>
          </div>
        </div>

        <div className='sync-issue-detailed-log-container'>
          <div className='sync-issue-detailed-log-head-text'> Detailed log:</div>
          <TextArea
            className='sync-issue-detailed-log'
            value={this.props.errorLog}
            ref={(textarea) => { return this.props.isVisible && textarea && textarea.focus(); }}
            readOnly
          />
        </div>

        <div className='sync-issue-container'>
          <div className='sync-issue-content-left'>
            Sync issues aren’t common; please alert our support team.
          </div>
          <div className='sync-issue-content-right'>
            <Button
              type='secondary'
              className='sync-issue-button'
              onClick={this.props.onErrorReporting}
            >
              Report Issue
            </Button>
          </div>
        </div>

        <div className='sync-issue-container'>
          <div className='sync-issue-content-left'>
            Discarding will restore your sync, but the changes mentioned above will be lost.
          </div>
          <div className='sync-issue-content-right'>
            <Button
              type='secondary'
              className='sync-issue-button'
              onClick={this.props.onDiscardChange}
            >
              Discard Failed Updates
            </Button>
          </div>
        </div>

      </div>
    );
  }
}
