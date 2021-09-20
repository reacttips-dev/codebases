import React, { Component, Fragment } from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../../../../../js/components/base/Modals';
import TextArea from '../../../../../../js/components/base/TextArea';
import { Button } from '../../../../../../js/components/base/Buttons';
import LoadingIndicator from '../../../../../../js/components/base/LoadingIndicator';
import sanitise from '@postman/sanitise-user-content';

import {
  UIEventService,
  AnalyticsService
} from '../../../../common/dependencies';

const OPEN_REQUEST_TO_JOIN_MODAL = 'openRequestToJoinModal',
  WORD_LIMIT = 1000,
  WORD_LIMIT_ERROR = `Please limit your response to ${WORD_LIMIT} characters`,
  defaultState = {
    isOpen: false,
    isLoading: false,
    team: {},
    emailVerified: true,
    purpose: ''
  };


const RequestInfo = ({ hasGuidelines, emailVerified }) => {
  if (emailVerified) {
    return (
      <Fragment>
        <div className='request-to-join__block'>
        Once the team admin approves your request, you’ll be added to the team automatically.</div>
        <div className='request-to-join__block'>
          {hasGuidelines ?
            'Before we can send your request, please answer this question from the team admin' :
            'Add a note to help the team\'s Admin review your request (optional)'
          }
        </div>
      </Fragment>

    );
  }

  return (
    <div>
        Almost there, just two quick things to do before we can send your request
      <div>
            1. Verify your account. There should be a verification email waiting for you in your inbox.
      </div>
      <div>
        {
          hasGuidelines ?
            '2. Answer this question from the team Admin.' :
            '2. Add a note to help the team\'s Admin review your request (optional)'
        }
      </div>
    </div>

  );
};

export default class RequestToJoinModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
     ...defaultState
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePurpose = this.handlePurpose.bind(this);
    this.handleRequestToJoin = this.handleRequestToJoin.bind(this);
  }

  componentDidMount () {
    this.unsubscribeHandler = UIEventService.subscribe(OPEN_REQUEST_TO_JOIN_MODAL, this.handleOpen);
  }

  componentWillUnmount () {
    this.unsubscribeHandler && this.unsubscribeHandler();
  }

  handleOpen (opts = {}) {
    if (this.state.isOpen) {
      return;
    }

    this.onRequestToJoin = opts.onRequestToJoin;

    this.setState({
      ..._.omit(opts, 'onRequestToJoin'),
      isOpen: true
    });
  }

  handleClose () {
    this.state.isOpen && this.setState(defaultState);
  }

  handlePurpose (purpose) {
    this.setState({ purpose: sanitise(purpose) });
  }

  handleRequestToJoin () {
    const { purpose } = this.state;
    AnalyticsService.addEventV2({
      category: 'homepage',
      action: 'click',
      label: 'request_to_join'
    });

    this.setState({ isLoading: true });
    this.onRequestToJoin(this.handleClose, purpose);
  }

  getStyles () {
    return {
      marginTop: '0px',
      width: '25vw',
      minWidth: '400px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }

  render () {
    const { isOpen, team, isLoading, emailVerified, purpose } = this.state,
    hasGuidelines = Boolean(team.join_guidelines),
    label = hasGuidelines ? team.join_guidelines : '',
    placeholder = hasGuidelines ? 'Add Response' : 'Add a note',
    wordLimitBreach = purpose.length > WORD_LIMIT,
    isRequestToJoinDisabled = isLoading || wordLimitBreach ? true :
      hasGuidelines ? !(purpose.length > 0) : false;

    return (
      <Modal
        className='request-to-join'
        isOpen={isOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getStyles()}
      >
        <ModalHeader>
          You're trying to join {team.name || ''}
        </ModalHeader>
        <ModalContent>
        <Fragment>
          <RequestInfo emailVerified={emailVerified} hasGuidelines={hasGuidelines} />
          <br />
          {label && <b>{label}</b>}
          <TextArea
            onChange={this.handlePurpose}
            value={purpose}
            error={
              wordLimitBreach
              ?
                <Fragment>
                  <span>{WORD_LIMIT_ERROR}</span>
                  <span>{purpose.length} / {WORD_LIMIT}</span>
                </Fragment>
              :
                ''
              }
            placeholder={placeholder}
            rows='5'
          />
          {!wordLimitBreach &&
            <span className='request-to-join__character-usage'>{purpose.length} / {WORD_LIMIT}</span>
          }
          </Fragment>
        </ModalContent>
        <ModalFooter>
          <div className='request-to-join__actions'>
            <Button
              className='request-to-join__action-cancel'
              type='secondary'
              onClick={this.handleClose}
            >
              Cancel
            </Button>
            <Button
              className='request-to-join__action-confirm'
              type='primary'
              onClick={this.handleRequestToJoin}
              disabled={isRequestToJoinDisabled}
            >
              { isLoading ? <LoadingIndicator /> : 'Request to join' }
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}
