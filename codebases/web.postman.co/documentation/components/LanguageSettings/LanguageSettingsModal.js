import React, { PureComponent } from 'react';
import { Modal, ModalContent, ModalHeader } from '../../../js/components/base/Modals';
import LanguageSettingsView from './LanguageSettingsView';
import { DOCUMENTATION_DEFAULT_LANGUAGE_SETTINGS } from '../../constants';
import { getStore } from '../../../js/stores/get-store';

export default class LanguageSettingsModal extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
      openExperimentalMode: true,
      showStartupToast: false,
      activeLanguage: { language: DOCUMENTATION_DEFAULT_LANGUAGE_SETTINGS.LANGUAGE, variant: DOCUMENTATION_DEFAULT_LANGUAGE_SETTINGS.VARIANT }
    };

    this.modalContext = null;
    this.timeout = null;
    this.store = getStore('CodegenStore');
  }

  componentDidMount () {
    pm.mediator.on('openLanguageSettingsModel', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openLanguageSettingsModel', this.handleClose);
    this.timeout && clearTimeout(this.timeout);
  }

  /**
   * Handles setting the initial state of the modal according to the passes params
   *
   * @param {String} currentLanguage - Language to be shown in modal
   * @param {Object} context - Additional data from the trigger
   */
  handleOpen = (currentLanguage, context) => {
    let userPreferredLanguage = currentLanguage ? currentLanguage.id : this.store.getLanguagePreference(),
      language, variant;

    this.modalContext = context;

    if (userPreferredLanguage) {
      try {
        userPreferredLanguage = JSON.parse(userPreferredLanguage);
        language = _.get(userPreferredLanguage, 'language', DOCUMENTATION_DEFAULT_LANGUAGE_SETTINGS.LANGUAGE);
        variant = _.get(userPreferredLanguage, 'variant', DOCUMENTATION_DEFAULT_LANGUAGE_SETTINGS.VARIANT);

        this.setState({
          isOpen: true,
          activeLanguage: { language, variant }
        });
      }
      catch (err) {
        // Default language is already stored in state in the constructor
        pm.logger.error(`LanguageSettingsModal.handleOpen - ${err}`);
      }
    }
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  getCustomStyles () {
    return {
      marginTop: '17vh',
      height: '65vh',
      minWidth: '720px',
      maxHeight: '70vh',
      width: '55vw'
    };
  }

  render () {
    return (
      <Modal
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        className='snippet-generator-modal documentation-codegen'
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>CODE GENERATION SETTINGS</ModalHeader>
        <ModalContent className='experimental-request-editor-snippet-generator-modal-content'>
          <LanguageSettingsView
            activeLanguage={this.state.activeLanguage}
            editorId={this.state.editorId}
            showStartupToast={this.state.showStartupToast}
            onRequestClose={this.handleClose}
            modalContext={this.modalContext}
          />
        </ModalContent>
      </Modal>
    );
  }
}
