import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { Tabs, Tab } from '../base/Tabs';
import LoadingIndicator from '../base/LoadingIndicator';
import CollectionIcon from '../base/Icons/CollectionIcon';
import CreationError from './CreationError';
import CollectionsEmpty from '../empty-states/CollectionsEmpty';
import GetUniqueIdHelper from '../../utils/GetUniqueIdHelper';
import Link from '../../../appsdk/components/link/Link';

import {
  TEST_SCRIPT_DOCS,
  SAVE_REQUEST_DOCS,
  ENVIRONMENT_DOCS,
  MONITORING_DOCS,
  MONITORING_REGION_DOCS
} from '../../constants/AppUrlConstants';
import CollectionMetaIcons from '@@runtime-repl/collection/CollectionMetaIcons';
import CollectionForkLabel from '../collections/CollectionForkLabel';

import { DataEditor, utils } from '@postman/data-editor';
import RowRenderer from '../base/data-editor/RowRenderer';
import DEInput from '../base/data-editor/components/DEInputs';
import HeaderActions from '../base/data-editor/components/HeaderActions';

import PluralizeHelper from '../../utils/PluralizeHelper';
import httpStatusCodes from '@@runtime-repl/request-http/httpstatuscodes';

import { getStore } from '../../stores/get-store';
import XPath from '../base/XPaths/XPath';
import DataEditorRequestMethods from './DataEditorRequestMethods';
import { Text } from '@postman/aether';
import MonitorFormComponent from '../../../monitors/components/create-edit-form/MonitorFormComponent';
import MonitorFormHelperFunctions from '../../../monitors/components/create-edit-form/MonitorFormHelperFunctions';


let getAllStatusList = () => {
  return _.reduce(httpStatusCodes, (acc, obj, key) => {
    acc.push({ value: `${key} ${obj.name}` });
    return acc;
  }, []);
};

const monitorFormConfig = {
  isEditable: false,
  type: 'modal',
  showFormControls: false,
  hideCollection: true
};

@observer
export default class CreateNewMonitorModal extends Component {
  constructor (props) {
    super(props);
    this.state = { uniqueName: GetUniqueIdHelper.generateUniqueId(), showRegionTooltip: false, target: null };

    let DEConfig = {
      columns: [{
        name: 'method',
        type: 'string',
        label: 'Request Method',
        width: 21,
        resize: true,
        default: 'GET',
        renderer: (value, onAction, { isCollapsed, subColumnIndex }, style, cellInfo) => {
          return (
            <DataEditorRequestMethods allowScroll value={value} onChange={(value) => onAction('edit', { value })} />
          );
        }
      },
      {
        name: 'url',
        type: 'string',
        label: 'Request URL',
        width: 37,
        resize: true,
        default: '',
        renderer: (value, onAction, { isCollapsed, subColumnIndex }, style, cellInfo) => {
          let handleChange = (value) => {
            onAction && onAction(
              'edit',
              { value: value }
            );
          };
          return (
            <XPath identifier='url' key='url'>
              <DEInput
                type='autosuggest'
                value={value}
                onAction={handleChange}
                cellInfo={cellInfo}
                placeholder='URL'
              />
            </XPath>
          );
        }
      }, {
        name: 'body',
        hidden: true,
        type: 'string',
        label: 'Request Body',
        width: 25,
        resize: true,
        default: '',
        renderer: (value, onAction, { isCollapsed, subColumnIndex }, style, cellInfo) => {
          let handleChange = (value) => {
            onAction && onAction(
              'edit',
              { value: value }
            );
          };
          return (
            <XPath identifier='body' key='body'>
              <DEInput
                type='autosuggest'
                value={value}
                onAction={handleChange}
                cellInfo={cellInfo}
                placeholder='Body'
              />
            </XPath>
          );
        }
      }, {
        name: 'description',
        hidden: true,
        type: 'string',
        label: 'Description',
        width: 20,
        resize: true,
        default: '',
        renderer: (value, onAction, { isCollapsed, subColumnIndex }, style, cellInfo) => {
          let handleChange = (value) => {
            onAction && onAction(
              'edit',
              { value: value }
            );
          };
          return (
            <XPath identifier='description' key='description'>
              <DEInput
                type='autosuggest'
                value={value}
                onAction={handleChange}
                cellInfo={cellInfo}
                placeholder='Description'
              />
            </XPath>
          );
        }
      }, {
        name: 'testResponseCode',
        type: 'string',
        label: 'Check Status Code',
        width: 21,
        resize: true,
        default: 200,
        renderer: (value, onAction, { isCollapsed, subColumnIndex }, style, cellInfo) => {
          let handleChange = (value) => {
            onAction && onAction(
              'edit',
              { value: value }
            );
          };

          return (
            <XPath identifier='testResponseCode' key='testResponseCode'>
              <DEInput
                type='number'
                value={value}
                onAction={handleChange}
                cellInfo={cellInfo}
                placeholder='Status Code'
                suggestions={getAllStatusList()}
              />
            </XPath>
          );
        }
      }, {
        name: 'testResponseTime',
        type: 'number',
        label: 'Check Response Time',
        width: 21,
        resize: true,
        default: 400,
        renderer: (value, onAction, { isCollapsed, subColumnIndex }, style, cellInfo) => {
          let handleChange = (value) => {
            onAction && onAction(
              'edit',
              { value: value }
            );
          };

          return (
            <XPath identifier='testResponseTime' key='testResponseTime'>
              <div className='data-editor__cell--time'>
                <DEInput
                  type='number'
                  value={value}
                  onAction={handleChange}
                  cellInfo={cellInfo}
                  placeholder='Response Time'
                />
                <span className='postfix'>ms</span>
              </div>
            </XPath>
          );
        }
      }],
      renderers: {
        row: ({ children, index, nodeId }, onAction, { isCollapsed, subColumnIndex }, style) => {
          return (
            <RowRenderer
              index={index}
              style={style}
              nodeId={nodeId}
              onAction={onAction}
            >
              { children }
            </RowRenderer>
          );
        },
        header: (children) => {
          return (
            <div className='data-editor__custom-header'>
              <div className='data-editor__header-offset' />
              { children }
              <div className='data-editor__header__controls'>
                <HeaderActions
                  onColumnToggle={this.handleColumnToggle}
                  config={this.state.config}
                  columnGroups={[
                    {
                      label: 'Show columns',
                      columns: [
                        'method',
                        'url',
                        'body',
                        'description'
                      ]
                    }, {
                      label: 'Add tests',
                      columns: [
                        'testResponseCode',
                        'testResponseTime'
                      ]
                    }
                  ]}
                />
              </div>
            </div>
          );
        }
      },
      height: 300
    };

    this.state = {
      values: [],
      config: DEConfig
    };

    this.getSelectedOptionName = this.getSelectedOptionName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleColumnToggle = this.handleColumnToggle.bind(this);
    this.setRegionDisplay = this.setRegionDisplay.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.fetchVersionText = this.fetchVersionText.bind(this);
    this.child = React.createRef();
  }

  onClick = () => {
    this.refs.content.handleCreate();
  };

  getClasses () {
    return classnames({
      'create-new-monitor-modal__content': true,
      [`step${this.props.activeStep}`]: true
    });
  }

  setRegionDisplay (type) {
    return classnames({
      'create-new-monitor__body__input': true,
      'create-new-monitor__body__input--regions': true,
      [`create-new-monitor__body__input-regions--${type}`]: true
    });
  }

  handleMouseOver (region) {
    if (region.enabled) {
      return;
    }

    this.setState({ target: region.id, showRegionTooltip: true });
  }

  handleMouseOut () {
    this.setState({ target: null, showRegionTooltip: false });
  }

  getSelectedOptionName (list, selectedItem, defaultValue) {
    let item = _.find(list, ['id', selectedItem]);

    if (!item) {
      return defaultValue;
    }

    return item.name;
  }

  handleTestChange (requestIndex, testIndex, value) {
    let tests = _.get(this.props, `selectedOptions.requests[${requestIndex}].tests`, ['200', '400']);
    tests[testIndex] = parseInt(value) || '';
    this.props.onRequestChange(requestIndex, 'test', tests);
  }

  onCollectionSelect () {
    this.refs.monitorName && this.refs.monitorName.focus();
  }

  handleChange (values) {
    this.setState({ values });

    let requests = _.dropRight(utils.unflattenNodes(values));
    this.props.onRequestChange(requests);
  }

  handleColumnToggle (newConfig) {
    this.setState({ config: newConfig });
  }

  collectionClassCheck () {
    return classnames({
      'create-new-monitor-modal__card': true,
      'create-new-monitor-disabled': this.props.isOffline
    });
  }

  collectionCardOfflineCheck () {
    return classnames({
      'create-new-monitor-modal__card__content': true,
      'create-new-monitor-disabled': this.props.isOffline,
      'create-new-monitor-modal-offline': this.props.isOffline
    });
  }

  fetchVersionText (versions) {
    if (versions == 1) {
      return `Choose a collection version for this monitor. If the collection is not linked to an API,
      monitor can only be created on current version.`;
    }
    else {
      return 'Choose a collection version for this monitor.';
    }
  }

  renderStep1 () {

    return (
      <div className='create-new-monitor-modal__body step1'>
        <Tabs
          type='primary'
          defaultActive='new'
          activeRef={this.props.activeSource}
          onChange={this.props.onChangeSource}
        >
          <XPath identifier='createNewTab'><Tab refKey='new'>Monitor new collection</Tab></XPath>
          <XPath identifier='chooseCollectionTab'><Tab refKey='workspace'>Monitor existing collection</Tab></XPath>
        </Tabs>
        <div className='create-new-monitor-modal__right__intro'>
          {
            this.props.activeSource === 'new' &&
              <span>Enter the requests you want to monitor. Optionally, add a request body by clicking on the (•••) icon.</span>
          }
          {
            this.props.activeSource === 'workspace' &&
              <span>Select the collection you want to monitor</span>
          }
        </div>
        <div className='create-new-monitor-modal__right'>
        {
          this.props.activeSource === 'new' &&
            <XPath identifier='createNew'>
              <div className='create-new-monitor-modal__right__table'>
                <div className='create-new-monitor-modal__data-editor'>
                  <DataEditor
                    input={this.state.values}
                    config={this.state.config}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </XPath>
        }
        {
          this.props.activeSource === 'workspace' && _.isEmpty(this.props.ownCollections) &&
            <CollectionsEmpty
              isMember
              workspaceId={getStore('ActiveWorkspaceStore').id}
              onClose={this.props.onClose}
            />
        }

        {
          this.props.activeSource === 'workspace' && !_.isEmpty(this.props.ownCollections) &&
            <XPath identifier='chooseCollection'>
              <div className='create-new-monitor-modal__right__collections'>
                {
                  _.map(this.props.ownCollections, (c) => {
                    return (
                      <XPath identifier={c.id}>
                        <div className={this.collectionClassCheck()} key={c.id} onClick={this.props.onSelectCollection.bind(this, c)}>
                          <CollectionIcon className='create-new-monitor-modal__card__icon' />
                          <div className={this.collectionCardOfflineCheck()}>
                            <div className='create-new-monitor-modal__card__title'>
                              <span>{c.name}</span>
                              <CollectionMetaIcons
                                collection={c}
                                userCanUpdate={c.userCanUpdate}
                              />
                            </div>
                            <div className='create-new-monitor-modal__card__subtitle'>
                              <span className='create-new-monitor-modal__card__requests'>
                                {c.requestCount} {PluralizeHelper.pluralize({
                                  count: c.requestCount,
                                  singular: 'request',
                                  plural: 'requests'
                                })}
                              </span>
                              <CollectionForkLabel forkInfo={_.get(c, 'forkInfo')} />
                            </div>
                          </div>
                        </div>
                      </XPath>
                    );
                  })
                }
              </div>
            </XPath>
        }
        </div>
        <div className='create-new-monitor-modal__footer__helptext'>
          <b>What is a monitor? </b>
          <span>A monitor lets you run requests periodically to check for its performance and response through </span>
          <Link
            to={TEST_SCRIPT_DOCS}
            target='_blank'
          >
          <Text type='link-default'>tests</Text>
          </Link>.
          <span> Learn more about </span>
          <Link
            to={MONITORING_DOCS}
            target='_blank'
          >
          <Text type='link-default'>monitors</Text>
          </Link>.
        </div>
      </div>
    );
  }

  renderStep2 () {
    if (this.props.isLoadingRegions || this.props.isLoadingVersions || this.props.loading) {
      return (
        <div className='create-new-monitor-modal__body step2 is-loading'>
          <LoadingIndicator />
        </div>
      );
    }

    return (
      <MonitorFormComponent
        ref='content'
        selectedOptions={this.props.selectedOptions}
        onClose={this.props.onClose}
        getSelectedOptionName={MonitorFormHelperFunctions.getSelectedOptionNameNoCollection}
        monitorFormConfig={monitorFormConfig}
        environments={this.props.environments}
        collectionFromContainer={this.props.collectionFromContainer}
        activeSourceFromContainer={this.props.activeSourceFromContainer}
        from={this.props.from}
      />
    );
  }

  renderStep3 () {
    if ((_.isEqual(this.props.activeSource, 'new') && this.props.collectionStatus.loading) || this.props.monitorStatus.loading) {
      return (
        <div className='create-new-monitor-modal__body step3'>
          <LoadingIndicator />
        </div>
      );
    }

    return (
      <div className='create-new-monitor-modal__body step3'>
        <div className='create-new-monitor-modal__card__center'>
          <div className='create-new-monitor-modal__content__header'>
            <div className='create-new-monitor-modal__content__header__icon'>
              <MonitorIcon
                className='create-new-monitor-modal__content__header__icon__monitor'
                size='lg'
              />
              <div className='create-new-monitor-modal__content__header__icon__monitor' />
            </div>
            <div className='create-new-monitor-modal__content__header__text'>
              <span className='create-new-monitor-modal__content__header__text__title'>
                <b>{_.truncate(this.props.selectedOptions.name, { length: 40 })}</b> monitor created
              </span>
              <div className='create-new-monitor-modal__content__header__text__text'>Runs at a schedule to check the performance of your requests</div>
            </div>
          </div>
          {
            _.isEqual(this.props.activeSource, 'new') &&
            <div className='create-new-monitor-modal__content__header'>
              <div className='create-new-monitor-modal__content__header__icon'>
                <CollectionIcon
                  className='create-new-monitor-modal__content__header__icon__collection'
                  size='lg'
                />
              </div>
              <div className='create-new-monitor-modal__content__header__text'>
                <span className='create-new-monitor-modal__content__header__text__title'>
                  <b>{_.truncate(this.props.selectedOptions.name, { length: 40 })}</b> collection created
                </span>
                <div className='create-new-monitor-modal__content__header__text__text'>Contains all the requests which are being monitored</div>
              </div>
            </div>
          }
          <div className='separator'>
            NEXT STEPS
            <div className='separator-line' />
          </div>
          <div className='create-new-monitor-modal__content__footer'>
            <div className='create-new-monitor-modal__step'>
              <div className='create-new-monitor-modal__step__title'>Check monitor results</div>
              <div className='create-new-monitor-modal__step__text'>
                <span>See the monitor run results on the </span>
                <Button
                  className='monitor-url'
                  onClick={this.props.onMonitorClick}
                  type='text'
                >web dashboard</Button>
              </div>
            </div>
            <div className='create-new-monitor-modal__step'>
              <div className='create-new-monitor-modal__step__title'>Add more requests to this collection</div>
              <div className='create-new-monitor-modal__step__text'>
                <span>Save new requests to this collection in the postman app. </span>
                <Link
                  to={SAVE_REQUEST_DOCS}
                  target='_blank'
                  className='learn-more-link btn-text'
                >Learn how</Link>
              </div>
            </div>
            <div className='create-new-monitor-modal__step'>
              <div className='create-new-monitor-modal__step__title'>Add custom tests to a request</div>
              <div className='create-new-monitor-modal__step__text'>
                <span>Write test scripts in Javascript and add them to any request. </span>
                <Link
                  to={TEST_SCRIPT_DOCS}
                  target='_blank'
                  className='learn-more-link btn-text'
                >Learn how</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render () {
    if (this.props.collectionStatus.error || this.props.monitorStatus.error) {
      return (
        <div className='create-new-monitor__error'>
          <CreationError
            subtitle='Something went wrong while creating this monitor. You can try again later.'
            onRetry={this.props.onRetry}
          />
        </div>
      );
    }

    if (this.props.errorFetchingVersions) {
      return (
        <div className='create-new-monitor__error'>
          <CreationError
            subtitle='Please check your internet connection and try again.'
            onRetry={this.props.onVersionFetchRetry}
          />
        </div>
      );
    }

    return (
      <div className={this.getClasses()}>
        {
          this.props.activeStep === 1 && this.renderStep1()
        }
        {
          this.props.activeStep === 2 && this.renderStep2()
        }
        {
          this.props.activeStep === 3 && this.renderStep3()
        }
        </div>
    );
  }
}
