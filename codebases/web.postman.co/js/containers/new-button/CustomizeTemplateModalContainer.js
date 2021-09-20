import React, { Component } from 'react';
import classnames from 'classnames';
import { Button } from '../../components/base/Buttons';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';

import TemplateController from '../../modules/controllers/TemplateController';
import CustomizeTemplate from '../../components/new-button/CustomizeTemplate';
import FinishTemplate from '../../components/new-button/FinishTemplate';
import DisabledOperationModal from '../../components/new-button/DisabledOperationModal';
import AnalyticsService from '../../modules/services/AnalyticsService';
import NavigationService from '../../services/NavigationService';
import { OPEN_CREATE_NEW_IDENTIFIER } from '../../../onboarding/navigation/constants';
import { observer } from 'mobx-react';
import { getStore } from '../../stores/get-store';

@observer
export default class CustomizeTemplateModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      isLoading: false,
      templateId: '',
      versionTag: '',
      selectedOptions: {},
      lifecycle: 'view', // or 'use', 'success', 'failure',
      templateStatus: {},
      userStatus: {},
      saveToActivity: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleOptionValueChange = this.handleOptionValueChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('showCustomizeTemplateContainer', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showCustomizeTemplateContainer', this.handleOpen);
  }

  getClasses () {
    return classnames({
      'customize-template-modal': true,
      'is-finished': this.state.lifecycle === 'success'
    });
  }

  getStyles () {
    return {
      marginTop: '10vh',
      width: '80vw',
      maxHeight: '570px',
      height: '75vh'
    };
  }

  checkOffline () {
    return !navigator.onLine;
  }

  handleOpen (templateId, options, versionTag) {
    if (_.isEmpty(options)) {
      let template = getStore('TemplateListStore').find(templateId),
        updatedState = {
          templateId,
          versionTag,
          isOpen: true,
          selectedOptions: { name: template.name },
          lifecycle: 'view'
        };

      template && (updatedState.selectedOptions = template);
      this.setState(updatedState);
    }
    else {
      this.setState({
        isOpen: true,
        ...options
      });
    }
  }

  handleClose () {
    this.handleSaveToActivity();
    this.setState({
      isOpen: false,
      saveToActivity: false
    });
  }

  handleSaveToActivity () {
    if (!this.state.saveToActivity) {
      return;
    }
    let metaObj = {
      ..._.pick(this.state, ['isLoading', 'selectedOptions']),
      lifecycle: 'success',
      templateStatus: this.state.templateStatus
    };
    pm.mediator.trigger('saveXFlowActivity', 'template', metaObj);
  }

  handleBack () {
    this.handleClose();
    NavigationService.transitionTo(OPEN_CREATE_NEW_IDENTIFIER);
  }

  handleOptionValueChange (category, field, value) {
    if (!category || !this.state.selectedOptions || !this.state.selectedOptions[category]) {
      return;
    }

    let changedFieldIndex = _.findIndex(this.state.selectedOptions[category], ['key', field]);

    if (changedFieldIndex === -1) {
      return;
    }

    let newTemplateData = {
      ...this.state.selectedOptions,
      [category]: [
        ..._.slice(this.state.selectedOptions[category], 0, changedFieldIndex),
        {
          ...this.state.selectedOptions[category][changedFieldIndex],
          value
        },
        ..._.slice(this.state.selectedOptions[category], changedFieldIndex + 1)
      ]
    };

    this.setState({ selectedOptions: newTemplateData });
  }

  handleCreate () {
    if (this.checkOffline()) {
      return;
    }

    this.setState({
      lifecycle: 'use'
    }, async () => {
      try {
        await TemplateController.importTemplate(this.state.templateId, this.state.selectedOptions, this.state.versionTag);
        AnalyticsService.addEvent('template', 'successful_import', _.snakeCase(this.state.templateId));
        this.setState({
          isLoading: false,
          saveToActivity: true,
          lifecycle: 'success'
        });
      }
      catch (e) {
        AnalyticsService.addEvent('template', 'failure_import', _.snakeCase(this.state.templateId));
        this.setState({
          isLoading: false,
          lifecycle: 'failure'
        });
      }
    });
  }

  render () {
    let currentUser = getStore('CurrentUserStore'),
        isLoggedIn = currentUser.isLoggedIn,
        isSyncEnabled = getStore('GateKeeperStore').isSyncEnabled,
        isOffline = this.checkOffline();

    return (
      <Modal
        className={this.getClasses()}
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getStyles()}
      >
        <ModalHeader>
        {
          this.state.lifecycle === 'view' &&
            'Customization options'
        }
        {
          this.state.lifecycle === 'use' &&
            'Importing template...'
        }
        {
          this.state.lifecycle === 'success' &&
            'Success!'
        }
        {
          this.state.lifecycle === 'failure' &&
            'Something went wrong'
        }
        </ModalHeader>
        <ModalContent>
        {
          (!isLoggedIn || !isSyncEnabled) &&
            <DisabledOperationModal
              isLoggedIn={isLoggedIn}
              isSyncEnabled={isSyncEnabled}
              entity='template'
            />
        }
        {
          isLoggedIn && isSyncEnabled &&
            this.state.lifecycle === 'view' &&
              <CustomizeTemplate
                templateData={this.state.selectedOptions}
                isLoading={this.state.isLoading}
                isOffline={isOffline}
                onOfflineRetry={this.handleCreate}
                onOptionValueChange={this.handleOptionValueChange}
              />
        }
        {
          isLoggedIn && isSyncEnabled &&
            (this.state.lifecycle === 'use' || this.state.lifecycle === 'success' || this.state.lifecycle === 'failure') &&
              <FinishTemplate
                isOffline={isOffline}
                templateData={this.state.selectedOptions}
                lifecycle={this.state.lifecycle}
                onRetry={this.handleCreate}
              />
        }
        </ModalContent>
        <ModalFooter>
        {
          isLoggedIn && isSyncEnabled &&
            this.state.lifecycle === 'view' &&
            !isOffline &&
              <div>
                <Button
                  type='secondary'
                  onClick={this.handleBack}
                >
                  Back
                </Button>
                <Button
                  type='primary'
                  onClick={this.handleCreate}
                >
                  Create
                </Button>
              </div>
        }
        {
          isLoggedIn && isSyncEnabled &&
            this.state.lifecycle === 'success' &&
              <Button
                type='primary'
                onClick={this.handleClose}
              >
                Okay
              </Button>
        }
        </ModalFooter>
      </Modal>
    );
  }
}
