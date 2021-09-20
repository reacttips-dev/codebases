import React, { Component } from 'react';
import SignedOutModal from '../user/SignedOutModal';
import { Button } from '../base/Buttons';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import { PUBLISHING_DOCS } from '../../constants/AppUrlConstants';

export default class PublishDocsSignedoutModal extends Component {
  constructor (props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.handlePublishDocsDocumentation = this.handlePublishDocsDocumentation.bind(this);
    this.renderSignedOutText = this.renderSignedOutText.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('publishDocsSignedoutModal', this.toggleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('publishDocsSignedoutModal', this.toggleOpen);
  }

  toggleOpen (value = false) {
    this.setState({ isOpen: value });
  }

  handlePublishDocsDocumentation () {
    openExternalLink(PUBLISHING_DOCS);
  }


  renderSignedOutText () {
    return (
      <div className='publish-docs-signed-out-modal-content'>
        <div>
          <div>You can publish your documentation in Postman.</div>
          <div>Documentation lets you create and share beautiful web pages publicly or privately. You must be signed in to your Postman account to publish.</div>
        </div>
        <Button
          className='publish-docs-signed-out-learn-more'
          type='text'
          onClick={this.handlePublishDocsDocumentation}
        >
          Learn more about publishing
        </Button>
      </div>
    );
  }


  render () {

    return (
      <SignedOutModal
        isOpen={this.state.isOpen}
        message={this.renderSignedOutText}
        title={'PUBLISH DOCUMENTATION'}
        onRequestClose={this.toggleOpen}
      />
    );
  }
}
