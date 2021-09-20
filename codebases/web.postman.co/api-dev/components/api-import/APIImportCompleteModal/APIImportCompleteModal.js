import React from 'react';

import { Button } from '../../../../js/components/base/Buttons';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter
} from '../../../../js/components/base/Modals';
import ToggleSwitch from '../../../../js/components/base/ToggleSwitch';
import { Icon } from '@postman/aether';

import PluralizeHelper from '../../../../js/utils/PluralizeHelper';
import PublishingService from '../../../../js/modules/services/PublishingService';
import SidebarService from '../../../../appsdk/sidebar/SidebarService';
import AnalyticsService from '../../../../js/modules/services/AnalyticsService';
import { getStore } from '../../../../js/stores/get-store';

import { actionConstants, AFTER_IMPORT_ACTIONS } from '../../../configs/AfterImportActionsConfig';

const entityUserFriendlyNames = {
  api: { singular: 'API', plural: 'APIs' },
  collection: { singular: 'collection', plural: 'collections' },
  request: { singular: 'request', plural: 'requests' },
  environment: { singular: 'environment', plural: 'environments' },
  headerPreset: { singular: 'header preset', plural: 'header presets' },
  global: { singular: 'global', plural: 'globals' }
};

const ORDERED_ENTITIES = ['api', 'collection', 'request', 'environment', 'headerPreset', 'global'];

export default class APIImportCompleteModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showModal: false,
      meta: {},
      entities: {},
      nextActions: [],
      customStyles: null
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOptionToggle = this.handleOptionToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('showAPIImportCompleteModal', this.handleOpen);
    pm.mediator.on('closeAPIImportCompleteModal', this.handleClose);
  }

  componentWillUnmount () {
    pm.mediator.off('showAPIImportCompleteModal', this.handleOpen);
    pm.mediator.off('closeAPIImportCompleteModal', this.handleClose);
  }

  handleOpen (importedEntities, importMeta, customStyles) {
    let nextActions = [...AFTER_IMPORT_ACTIONS];

    // If user has imported APIs in personal workspace, remove the "Publish APIs" action from the after import actions
    if (_.get(importMeta, 'workspace.type') === 'personal' ||
      (_.get(importMeta, 'workspace.type') === 'team' && _.get(importMeta, 'workspace.visibilityStatus') === 'private-team')) {
      _.remove(nextActions, (action) => action.type === actionConstants.PUBLISH_API_ACTION);
    }

    this.setState({
      showModal: true,
      entities: importedEntities,
      meta: importMeta,
      nextActions
    });

    // Custom modal styling
    if (customStyles) {
      this.setState({ customStyles });
    }
  }

  handleClose () {
    // Switch to "APIs" tab after closing this modal
    SidebarService.setActiveTab('api');

    this.setState({
      showModal: false,
      entities: {},
      meta: {},
      nextActions: [],
      customStyles: null
    });
  }

  handleOptionToggle (type, newValue) {
    let nextActions = _.map(this.state.nextActions, (action) => {
      if (action.type === type) {
        action.value = newValue;
      }
      return action;
    });

    this.setState({ nextActions });
  }

  handleSubmit () {
    let { entities } = this.state;

    if (!entities) return;

    _.forEach(this.state.nextActions, (action) => {
      // bail out if action is not enabled
      if (!action.value) {
        return;
      }

      // Publish API action
      if (action.type === actionConstants.PUBLISH_API_ACTION) {
        let importedApis = _.get(entities, 'api.imported.details'),
          entitiesToPublish = _.map(importedApis, (api) => {
          return {
            entityType: 'api',
            entityId: api.id,
            type: 'internal',
            versions: [_.get(api, 'versions[0].id')]
          };
        });

        this.handlePublish(entitiesToPublish);
      }

      // Add implementation here for more actions
    });

    // Fire action and close the modal
    this.handleClose();
  }

  /**
   * Publish APIs of team workspace to private API network.
   * @param {Array<Object>} entities
   */
  handlePublish (entities) {
    if (_.isEmpty(entities)) {
      return;
    }

    return PublishingService.bulkPublishEntities(entities)
      .then((entities) => {
        AnalyticsService.addEventV2AndPublish({
          category: 'private-api-network',
          action: 'add-api',
          label: 'import',
          value: entities.length,
          userId: getStore('CurrentUserStore').id,
          teamId: getStore('CurrentUserStore').teamId
        });

        pm.toasts.success('Added to the API Network');
      })
      .catch((err) => {
        pm.logger.warn('AfterImportComplete~handlePublish', err);
        pm.toasts.error(_.get(err, 'error.message') || 'An error occurred while adding these APIs to the network');
        return Promise.reject(err);
      });
  }

  getCustomStyles () {
    return Object.assign({}, {
      marginTop: '15vh',
      height: '65vh',
      minWidth: '450px',
      maxHeight: '700px',
      width: '55vw'
    }, this.state.customStyles);
  }

  /**
   * Returns string in `<entity-count> <entity-name>` format.
   * @param {Number} count
   * @param {String} entity
   * @returns {String} Ex. "5 APIs", "1 collection", "2 requests" etc.
   */
  getXEntityString (count, entity) {
    let { singular, plural } = entityUserFriendlyNames[entity];

    return `${count} ${PluralizeHelper.pluralize({ count, singular, plural })}`;
  }

  getSuccessMessage () {
    let message = '',
      { entities } = this.state,
      tense = _.get(this.state, 'meta.totalImportedEntities') > 1 ? 'were' : 'was',
      xEntityStringArray = [],
      lastEntityString = '';

    _.forEach(ORDERED_ENTITIES, (entity) => {
      let data = entities[entity],
        importCount;

      if (!_.isEmpty(data)) {
        importCount = _.isObject(data.imported) ? data.imported.count : data.imported;
        importCount > 0 && xEntityStringArray.push(this.getXEntityString(importCount, entity));
      }
    });

    lastEntityString = _.last(xEntityStringArray) || '';

    if (xEntityStringArray.length > 1) {
      let slicedArray = _.slice(xEntityStringArray, 0, xEntityStringArray.length - 1);
      message = `${slicedArray.join(', ')} and ${lastEntityString} ${tense} imported. They'll show up in the sidebar in just a few seconds.`;
    }
    else {
      message = `${lastEntityString} ${tense} imported.`;
    }

    return message;
  }

  getFailureMessage () {
    let message = '',
      { entities } = this.state,
      xEntityStringArray = [],
      lastEntityString = '',
      failedCollectionGenerationString = '',
      failedCollectionNames = '';

    _.forEach(ORDERED_ENTITIES, (entity) => {
        let data = entities[entity],
          failCount;

        // skipping count for collection which are failed to generate from APIs
        if (!_.isEmpty(data)) {
          failCount = _.isObject(data.failed) ? _.get(data, 'failed.importedCollections', 0) : data.failed;
          failCount > 0 && xEntityStringArray.push(this.getXEntityString(failCount, entity));
        }
    });

    // create string for collections which are failed to generate
    if (_.get(entities, 'collection.failed.generatedCollections', []).length > 0) {
      let lastCollectionString = '',

        // Like 'Unable to generate collection for X, Y and Z APIs'
        failedCollectionsStringArray = _.get(entities, 'collection.failed.generatedCollections', []);

      lastCollectionString = _.last(failedCollectionsStringArray) || '';

      if (failedCollectionsStringArray.length > 1) {
        let slicedArray = _.slice(failedCollectionsStringArray, 0, failedCollectionsStringArray.length - 1);

        failedCollectionNames = `${slicedArray.join(', ')} and ${lastCollectionString}`;
      }
      else {
        failedCollectionNames = `${lastCollectionString}`;
      }

      failedCollectionGenerationString = `Unable to generate collection for ${failedCollectionNames}
        ${PluralizeHelper.pluralize({
          count: _.get(entities, 'collection.failed.generatedCollections', []).length,
          singular: entityUserFriendlyNames['api'].singular,
          plural: entityUserFriendlyNames['api'].plural
        })}`;

      message += failedCollectionGenerationString;
    }

    // bail out and return message 'Unable to generate collection for X and Y APIs.' since there is no failure
    // in other entities import
    if (message && _.isEmpty(xEntityStringArray)) {
      return message + '.';
    }

    // appending 'and import' in case there is already some string present like 'Unable to generate collection for X API'
    // and there are other entities which failed to import.
    if (message && !_.isEmpty(xEntityStringArray)) {
      message += ' and import ';
    }

    // appending 'Unable to import' string if there the message is empty
    else if (!message) {
      message += 'Unable to import ';
    }

    lastEntityString = xEntityStringArray.pop();

    // if there are strings after popping last item, add 'and' before the last string.
    // Eg. Unable to generate collection for X API and import Y collection and Z request.
    if (!_.isEmpty(xEntityStringArray)) {
      message += `${xEntityStringArray.join(', ')} and ${lastEntityString}.`;
    }

    // if there are no strings after popping last item, just append the last string.
    // Eg. Unable to generate collection for X API and import Y collection.
    else {
      message += `${lastEntityString}.`;
    }

    return message;
  }

  getImportStatus () {
    let { entities } = this.state || {},
      allPassed = true,
      status = {};

    // bail out if entity data is not received yet
    if (_.isEmpty(entities)) { return; }

    // Check if any one the entity failed to get imported
    _.forEach(entities, (entityData, entity) => {
      // for collection entity, `failed` key will have an object as a value
      if (entity === 'collection' && (
        _.size(entityData.failed.generatedCollections) > 0 ||
        _.size(entityData.failed.importedCollections) > 0)) {
          allPassed = false;
          return;
      }

      // for other entities `failed` key will have a number as a value
      if (entityData.failed > 0) {
        allPassed = false;
        return;
      }
    });

    status['passed'] = this.getSuccessMessage();

    if (allPassed) {
      status['title'] = 'Import complete';
    }
    else {
      status['title'] = 'Import partially complete';
      status['failed'] = this.getFailureMessage();
    }

    return status;
  }

  getButtonText () {
    let enabledActions = _.filter(this.state.nextActions, (action) => action.value);

    if (!_.isEmpty(enabledActions)) {
      return 'Confirm and Close';
    }

    return 'Close';
  }

  render () {
    let status = this.getImportStatus();

    return (
      <Modal
        isOpen={this.state.showModal}
        onRequestClose={this.handleClose}
        className='api-import-complete-modal'
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>Import</ModalHeader>
        <ModalContent>
          <div className='imported-data-status-wrapper'>
            <div className='imported-data-status__title'>
              <span>{_.get(status, 'title')}</span>
            </div>
            <div className='imported-data-status__subtitle'>
              {
                status && status.failed &&
                  <div className='imported-data-status--failed'>
                    <Icon
                      name='icon-action-clear-stroke'
                      color='content-color-error'
                    />
                    <div>{status.failed}</div>
                  </div>
              }
              {
                status && status.passed &&
                  <div className='imported-data-status--passed'>
                    <Icon
                      name='icon-state-success-stroke'
                      color='content-color-success'
                    />
                    <div>{status.passed}</div>
                  </div>
              }
            </div>
          </div>
          {
            !_.isEmpty(this.state.nextActions) &&
              <div className='content-separator'>
                <div className='separator__title'><span>NEXT STEPS</span></div>
                <div className='separator__horizontal' />
              </div>
          }
          {
            !_.isEmpty(this.state.nextActions) &&
              <div className='after-import-section'>
                <div className='after-import-options'>
                  {
                    _.map(this.state.nextActions, (action) => {
                      return (
                        <div className={`after-import-option option--${action.type}`} key={action.type}>
                          <div className='option__bullet-point-wrapper'><span>&#x25A0;</span></div>
                          <div className='option__text-wrapper'>
                            <div className='option__label'>{action.label}</div>
                            <div className='option__description'>{action.description}</div>
                          </div>
                          <div className='option__toggle-switch-wrapper'>
                            <ToggleSwitch
                              activeLabel='Yes'
                              inactiveLabel='No'
                              isActive={action.value}
                              onClick={() => this.handleOptionToggle(action.type, !action.value)}
                            />
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
          }
        </ModalContent>
        <ModalFooter>
          <Button
            type='primary'
            className='api-import-complete-modal__close-button'
            onClick={this.handleSubmit}
          >
            { this.getButtonText() }
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
