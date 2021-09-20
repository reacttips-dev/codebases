import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import { COLLECTION_V2_BLOG } from '@postman-app-monolith/renderer/js/constants/AppUrlConstants';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import KeyMaps from '@postman-app-monolith/renderer/js/components/base/keymaps/KeyMaps';
import {
  Modal, ModalHeader, ModalContent, ModalFooter
} from '@postman-app-monolith/renderer/js/components/base/Modals';
import LoadingIndicator from '@postman-app-monolith/renderer/js/components/base/LoadingIndicator';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import RecommendationViewer from '../../../onboarding/src/features/Recommendations/components/RecommendationViewer';

export default class ExportCollectionModal extends Component {
  constructor (props) {
    super(props);

    this.state = { uniqueName: Math.random().toString(36).substring(7) };

    this.handleLearnMoreClick = this.handleLearnMoreClick.bind(this);
    this.getModalContent = this.getModalContent.bind(this);
  }

  getKeyMapHandlers () {
    return {
      submit: pm.shortcuts.handle('submit', this.props.onSubmit),
      select: pm.shortcuts.handle('select', this.props.onSubmit)
    };
  }

  getCustomStyles () {
    return { marginTop: '30vh' };
  }

  handleLearnMoreClick () {
    openExternalLink(COLLECTION_V2_BLOG);
  }

  getModalContent () {
    if (this.props.isLoading) {
      return <LoadingIndicator className='export-collection-modal__loading-indicator' />;
    }

    if (this.props.loadingError) {
      return 'Error Loading';
    }

    return (
      <KeyMaps keyMap={pm.shortcuts.getShortcuts()} handlers={this.getKeyMapHandlers()} ref={this.props.keymapRef}>
        <div className='export-collection-modal-content-wrapper'>
          <div className='export-collection-modal__message'>
            <span className='export-collection-modal__message__collection-name'>
              {' '}
              {this.props.name}
              {' '}
            </span>
            <span> will be exported as a JSON file. Export as:</span>
          </div>
          <RadioGroup
            name={this.state.uniqueName}
            selectedValue={this.props.format}
            onChange={this.props.onFormatChange}
          >
            <div className='export-collection-modal__choices'>
              <div className='export-collection-modal__choices-item'>
                <label className='export-collection-modal__choice__label'>
                  <Radio
                    value='v2'
                    className='export-collection-modal__choice__button radio-button'
                  />
                Collection v2
                </label>
              </div>
              <div className='export-collection-modal__choices-item'>
                <label className='export-collection-modal__choice__label'>
                  <Radio
                    value='v2.1'
                    className='export-collection-modal__choice__button radio-button'
                  />
                Collection v2.1 (recommended)
                </label>
              </div>
            </div>
          </RadioGroup>
          <div className='export-collection-modal__subtext'>
            <span className='export-collection-modal__subtext__learn-more' onClick={this.handleLearnMoreClick}>Learn more about collection formats</span>
          </div>
        </div>
      </KeyMaps>
    );
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        className='export-collection-modal'
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>EXPORT COLLECTION</ModalHeader>
        <RecommendationViewer
          target='modal/export/collection'
          className='export-collection-modal__onboarding-recommendation-viewer'
        />
        <ModalContent>
          {this.getModalContent()}
        </ModalContent>
        <ModalFooter>
          <Button
            type='primary'
            onClick={this.props.onSubmit}
            disabled={this.props.isLoading}
          >
Export
          </Button>
          <Button
            type='secondary'
            onClick={this.props.onRequestClose}
            disabled={this.props.isLoading}
          >
Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
