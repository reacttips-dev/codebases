import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { Icon, Text, IllustrationUnableToLoad, IllustrationCheckInternetConnection } from '@postman/aether';

import { Tabs, Tab } from '../base/Tabs';
import { Checkbox, Input } from '../base/Inputs';
import { Dropdown, DropdownButton, DropdownMenu, MenuItem } from '../base/Dropdowns';
import { Button } from '../base/Buttons';
import LoadingIndicator from '../base/LoadingIndicator';
import MockIcon from '../base/Icons/MockIcon';
import CopyIcon from '../base/Icons/CopyIcon';
import CustomMockError from '../../../mocks/components/CustomMockError';
import CollectionsEmpty from '../empty-states/CollectionsEmpty';
import { openPostmanUsages, openBillingOverview } from '../../models/services/DashboardService';
import XPath from '../base/XPaths/XPath';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { createEvent } from '../../modules/model-event';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import AnalyticsService from '../../modules/services/AnalyticsService';
import ClipboardHelper from '../../utils/ClipboardHelper';
import MockDelaySelector from '../../../mocks/components/MockDelaySelector';

import {
  PRO_API_KEYS_LINK,
  EXAMPLE_DOCS,
  MOCKING_WITH_EXAMPLES,
  PRO_API_INTRO
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
import DataEditorRequestMethods from './DataEditorRequestMethods';
import { openNewRequestTab } from '@@runtime-repl/request-http/_api/RequestInterface';
import Link from '../../../appsdk/components/link/Link';

let getAllStatusList = () => {
  return _.reduce(httpStatusCodes, (acc, obj, key) => {
    acc.push({ value: `${key} ${obj.name}` });
    return acc;
  }, []);
};

@observer
export default class CreateNewMockModal extends Component {
  constructor (props) {
    super(props);

    let DEConfig = {
      columns: [{
        name: 'method',
        type: 'string',
        label: 'Method',
        width: 17,
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
        label: 'Request Path',
        width: 33,
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
              <div className='data-editor__cell--path'>
                <span className='prefix'>{'{{url}}/'}</span>
                <DEInput
                  value={value}
                  onAction={handleChange}
                  cellInfo={cellInfo}
                  placeholder='Path'
                />
              </div>
            </XPath>
          );
        }
      }, {
        name: 'requestBody',
        type: 'string',
        label: 'Request Body',
        width: 15,
        resize: true,
        hidden: true,
        default: '',
        renderer: (value, onAction, { isCollapsed, subColumnIndex }, style, cellInfo) => {
          let handleChange = (value) => {
            onAction && onAction(
              'edit',
              { value: value }
            );
          };

          return (
            <XPath identifier='requestBody' key='requestBody'>
              <DEInput
                value={value}
                onAction={handleChange}
                cellInfo={cellInfo}
                placeholder='Request Body'
              />
            </XPath>
          );
        }
      }, {
        name: 'description',
        type: 'string',
        label: 'Description',
        width: 15,
        resize: true,
        hidden: true,
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
                value={value}
                onAction={handleChange}
                cellInfo={cellInfo}
                placeholder='Description'
              />
            </XPath>
          );
        }
      }, {
        name: 'code',
        type: 'string',
        label: 'Response Code',
        width: 17,
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
            <XPath identifier='code' key='code'>
              <DEInput
                type='number'
                value={value}
                onAction={handleChange}
                cellInfo={cellInfo}
                placeholder='value'
                suggestions={getAllStatusList()}
              />
            </XPath>
          );
        }
      }, {
        name: 'response',
        type: 'string',
        label: 'Response Body',
        width: 33,
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
            <XPath identifier='response' key='response'>
              <DEInput
                value={value}
                onAction={handleChange}
                cellInfo={cellInfo}
                placeholder='Response Body'
              />
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

    this.handleChange = this.handleChange.bind(this);
    this.handleColumnToggle = this.handleColumnToggle.bind(this);
    this.getSelectedOptionName = this.getSelectedOptionName.bind(this);
    this.openLink = this.openLink.bind(this);
    this.openRequestInTab = this.openRequestInTab.bind(this);
    this.handleCopyUrl = this.handleCopyUrl.bind(this);
  }

  getClasses () {
    return classnames({
      'create-new-mock-modal__content': true,
      [`step${this.props.activeStep}`]: true
    });
  }

  getSelectedOptionName (list, selectedItem, defaultValue) {
    let item = _.find(list, ['id', selectedItem]);

    if (!item) {
      return defaultValue;
    }

    return item.name;
  }

  openLink (link) {
    link && openExternalLink(link);
  }

  async openRequestInTab () {
    let activeWorkspaceSessionId = getStore('ActiveWorkspaceSessionStore').id;

    this.props.onClose && this.props.onClose();

    // open the mock as a request with Url prefilled
    await openNewRequestTab({ initialValue: { url: this.props.selectedOptions.mockUrl } });

    return dispatchUserAction(createEvent(
      'setActiveEnvironment',
      'workspacesession',
      {
        workspaceSession: { id: activeWorkspaceSessionId },
        activeEnvironment: this.props.selectedOptions.environmentId
      }
    ));
  }

  focusUrl (requestIndex) {
    this.refs[`request-${requestIndex}-url`] && this.refs[`request-${requestIndex}-url`].focus();
  }

  onCollectionSelect () {
    this.refs.mockName && this.refs.mockName.focus();
  }

  handleChange (values) {
    this.setState({ values });

    let requests = _.dropRight(utils.unflattenNodes(values));
    this.props.onRequestChange(requests);
  }

  handleColumnToggle (newConfig) {
    this.setState({ config: newConfig });
  }

  handleCopyUrl () {
    ClipboardHelper.copy(this.props.selectedOptions.mockUrl);

    AnalyticsService.addEventV2({
      category: 'mock',
      action: 'copy',
      label: 'mock_create',
      entityId: _.get(this.props, 'mockId')
    });

    pm.toasts.success('Mock URL copied');
  }

  renderStep1 () {

    return (
      <div className='create-new-mock-modal__body step1'>
        <Tabs
          type='primary'
          defaultActive='new'
          activeRef={this.props.activeSource}
          onChange={this.props.onChangeSource}
        >
          <XPath identifier='createNewTab'>
            <Tab
              refKey='new'
              className='create-new-mock-modal__body__tab-content'
            >
              Create a new collection
            </Tab>
          </XPath>
          <XPath identifier='chooseCollectionTab'>
            <Tab refKey='workspace'>Select an existing collection</Tab>
          </XPath>
        </Tabs>

        <div className='create-new-mock-modal__right__intro'>
          <div>
            <span className='create-new-mock-modal__right__intro__heading'>
              Mock servers let you simulate your API endpoints without having to set up a backend.
            </span>
            {this.props.activeSource === 'new' &&
              <Fragment>
                <span>
                  Enter request paths for your API endpoints and then the expected response
                   code and response body to create an&nbsp;
                </span>
                <Link
                  to={EXAMPLE_DOCS}
                  target='_blank'
                >
                  <Text
                    isExternal
                    type='link-default'
                  >
                    example
                  </Text>
                </Link>
                <span>.&nbsp;To add a body or description to the request, click the (•••) icon.</span>
              </Fragment>
            }
            {this.props.activeSource === 'workspace' &&
              <span>Select a collection from this workspace to mock.</span>
            }
          </div>
        </div>
        <div className='create-new-mock-modal__right'>
          {
            this.props.activeSource === 'new' &&
            <XPath identifier='createNew'>
              <div className='create-new-mock-modal__right__table'>
                <div className='create-new-mock-modal__data-editor'>
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
                <div className='create-new-mock-modal__right__collections'>
                  {
                    _.map(this.props.ownCollections, (c) => {
                      return (
                        <XPath identifier={c.id} key={c.id}>
                          <div className='create-new-mock-modal__card' key={c.id} onClick={this.props.onSelectCollection.bind(this, c)}>
                            <Icon name='icon-entity-collection-stroke' className='create-new-mock-modal__card__icon' />
                            <div className='create-new-mock-modal__card__content'>
                              <div className='create-new-mock-modal__card__title'>
                                <span>{c.name}</span>
                                <CollectionMetaIcons
                                  collection={c}
                                  userCanUpdate={c.userCanUpdate}
                                />
                              </div>
                              <div className='create-new-mock-modal__card__subtitle'>
                                <span className='create-new-mock-modal__card__requests'>
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
        <div className='create-new-mock-modal__footer__helptext'>
          <span>Learn how mock servers and examples can </span>
          <Link
            to={MOCKING_WITH_EXAMPLES}
            target='_blank'
          >
            <Text
              isExternal
              type='link-default'
            >
              speed up your API development
            </Text>
          </Link>
          <span>.</span>
        </div>
      </div>
    );
  }

  renderStep2 () {
    if (this.props.isLoading || this.props.configStatus.loading) {
      return (
        <div className='create-new-mock-modal__body step2 is-loading'>
          <LoadingIndicator />
        </div>
      );
    }

    return (
      <div className='create-new-mock-modal__body step2'>
        <div className='create-new-mock__body__input-group create-new-mock__body__input-group--name'>
          <div className='create-new-mock__body__label'>
            Name the mock server
          </div>
          <div className='create-new-mock__body__input'>
            <div className='create-new-mock__body__field'>
              <XPath identifier='mockName'>
                <Input
                  ref='mockName'
                  inputStyle='box'
                  value={this.props.selectedOptions.name}
                  onChange={this.props.onMockNameChange}
                  className={classnames({ 'input-box__error': this.props.isNameEmpty })}
                />
              </XPath>
            </div>
          </div>
          {
            this.props.isNameEmpty &&
              <div className='mock-name-empty__msg-container'>
                <span className='mock-name-empty__msg-container__text'>Please enter a mock server name.</span>
              </div>
          }
        </div>
        {this.props.selectedOptions.collectionId &&
          <div className='create-new-mock__body__input-group create-new-mock__body__input-group--environment'>
            <div className='create-new-mock__body__label'>
              Tag
            </div>
            <div className='create-new-mock__body__input'>
              <div className='create-new-mock__body__field'>
                <XPath identifier='mockVersion'>
                  <Dropdown
                    allowScroll
                    fullWidth
                    onSelect={this.props.onSelectVersion}
                    className='create-new-mock__body__field__version-dropdown'
                  >
                    <DropdownButton
                      size='small'
                      type='secondary'
                    >
                      <Button>
                        <span className='create-new-mock__body__field__version-dropdown__button-label'>
                          {this.getSelectedOptionName(this.props.ownVersions, this.props.selectedOptions.versionId, '')}
                        </span>
                      </Button>
                    </DropdownButton>
                    <DropdownMenu fluid>
                      {
                        _.map(this.props.ownVersions, (version) => {
                          return (
                            <MenuItem
                              key={version.id}
                              refKey={version.id}
                            >
                              <span>{version.name}</span>
                            </MenuItem>
                          );
                        })
                      }
                    </DropdownMenu>
                  </Dropdown>
                </XPath>
              </div>
              <div className='create-new-mock__body__input__helptext'>
                <Text
                  className='create-new-mock__body__input__helptext__content'
                  color='content-color-secondary'
                  type='para'
                >
                  Choose a collection tag for this mock server.
                  If the collection is not linked to an API, mock server can only be created on the current tag.
                </Text>
              </div>
            </div>
          </div>
        }
        <div className='create-new-mock__body__input-group create-new-mock__body__input-group--environment'>
          <div className='create-new-mock__body__label'>
            Select an environment (optional)
          </div>
          <div className='create-new-mock__body__input'>
            <div className='create-new-mock__body__field'>
              <XPath identifier='environment'>
                <Dropdown
                  allowScroll
                  fullWidth
                  onSelect={this.props.onSelectEnvironment}
                >
                  <DropdownButton
                    size='small'
                    type='secondary'
                  >
                    <Button><span>{this.getSelectedOptionName(this.props.ownEnvironments, this.props.selectedOptions.environmentId, 'No Environment')}</span></Button>
                  </DropdownButton>
                  <DropdownMenu fluid>
                    {
                      _.isEmpty(this.props.ownEnvironments) ?
                        <MenuItem refKey=''><span>No Environment</span></MenuItem> :
                      _.map(this.props.ownEnvironments, (obj) => {
                        return (
                          <MenuItem
                            key={obj.id}
                            refKey={obj.id}
                          >
                            <span>{obj.name}</span>
                          </MenuItem>
                        );
                      })
                    }
                  </DropdownMenu>
                </Dropdown>
              </XPath>
            </div>
            <div className='create-new-mock__body__input__helptext'>
              <Text
                className='create-new-mock__body__input__helptext__content'
                color='content-color-secondary'
                type='para'
              >
                Environments are groups of variables. The mock server will use the variable values
                from the selected environment in the request and response.
              </Text>
            </div>
          </div>
        </div>
        {
          <div className='create-new-mock__body__input-group create-new-mock__body__input-group--private'>
            <div className='create-new-mock__body__input'>
              <div className='create-new-mock__body__field'>
                <Checkbox
                  checked={this.props.selectedOptions.isPrivate}
                  onChange={this.props.onMockPrivateChange}
                />
                <span
                  onClick={this.props.onMockPrivateChange.bind(this, !this.props.selectedOptions.isPrivate)}
                  className='create-new-mock__body__input__label--checkbox'
                >
                  Make this mock server private
                </span>
              </div>
              <div className='create-new-mock__body__input__helptext'>
                <Text
                  className='create-new-mock__body__input__helptext__content'
                  color='content-color-secondary'
                  type='para'
                >
                  Note: To call a private mock server, you'll need to add an&nbsp;
                  <Text type='code'>x-api-key</Text>
                  &nbsp;header to your requests. See how to generate a&nbsp;
                  <Link
                    to={PRO_API_INTRO}
                    target='_blank'
                  >
                    <Text
                      isExternal
                      type='link-primary'
                    >
                      Postman API key
                    </Text>
                  </Link>
                </Text>
              </div>
            </div>
          </div>
        }
        {
          <div className='create-new-mock__body__input-group create-new-mock__body__input-group--create-environment'>
            <div className='create-new-mock__body__input'>
              <div className='create-new-mock__body__field'>
                <Checkbox
                  checked={this.props.selectedOptions.createEnvironment}
                  onChange={this.props.onCreateEnvironmentChange}
                />
                <span
                  onClick={this.props.onCreateEnvironmentChange.bind(this, !this.props.selectedOptions.createEnvironment)}
                  className='create-new-mock__body__input__label--checkbox'
                >
                  Save the mock server URL as an environment variable
                </span>
              </div>
              <div className='create-new-mock__body__input__helptext'>
                <Text
                  className='create-new-mock__body__input__helptext__content'
                  color='content-color-secondary'
                  type='para'
                >
                  Note: This will create a new environment containing the URL.
                </Text>
              </div>
            </div>
          </div>
        }

        <div className='create-mock-form__body__input-group create-mock-form__body__input-group__delay'>
          <div className='create-mock-form__body__input'>
              <MockDelaySelector
                source='cnx'
                onChange={this.props.onMockDelayChange}
                config={_.get(this.props, 'configOptions.delay.fixed')}
                delayDurationError={this.props.delayDurationError}
                delay={this.props.selectedOptions.delay}
              />
          </div>
        </div>
      </div>
    );
  }

  renderStep3 () {
    if ((_.isEqual(this.props.activeSource, 'new') && this.props.collectionStatus.loading) || this.props.mockStatus.loading) {
      return (
        <div className='create-new-mock-modal__body step3'>
          <LoadingIndicator />
        </div>
      );
    }

    let heading,
      subHeading;

    if (_.isEqual(this.props.activeSource, 'new') && this.props.selectedOptions.createEnvironment) {
      heading = 'Mock server, collection and environment created';
      subHeading = (
        <div className='create-new-mock-modal__content__header__helper-text'>
          To keep things easy, they're all named&nbsp;
          <span className='create-new-mock-modal__content__header__helper-text__entity-name'>
            {this.props.selectedOptions.name}
          </span>
          .
        </div>
      );
    }
    else if (_.isEqual(this.props.activeSource, 'new')) {
      heading = 'Mock server and collection created';
      subHeading = (
        <div className='create-new-mock-modal__content__header__helper-text'>
          To keep things easy, they're both named&nbsp;
          <span className='create-new-mock-modal__content__header__helper-text__entity-name'>
            {this.props.selectedOptions.name}
          </span>
          .
        </div>
      );
    }
    else if (_.isEqual(this.props.activeSource, 'workspace') && this.props.selectedOptions.createEnvironment) {
      heading = 'Mock server and environment created';
      subHeading = (
        <div className='create-new-mock-modal__content__header__helper-text'>
          To keep things easy, they're both named&nbsp;
          <span className='create-new-mock-modal__content__header__helper-text__entity-name'>
            {this.props.selectedOptions.name}
          </span>
          .
        </div>
      );
    }
    else {
      heading = 'Mock server created';
      subHeading = (
        <div className='create-new-mock-modal__content__header__helper-text'>
          <span className='create-new-mock-modal__content__header__helper-text__entity-name'>
            {this.props.selectedOptions.name}
          </span>
          &nbsp;has been created for&nbsp;
          <span className='create-new-mock-modal__content__header__helper-text__entity-name'>
            {_.get(getStore('CollectionStore').find(this.props.selectedOptions.collectionId), 'name')}
          </span>
          &nbsp;collection.
        </div>
      );
    }

    return (
      <div className='create-new-mock-modal__body step3'>
        <div className='create-new-mock-modal__card__center'>
          <div className='create-new-mock-modal__content__header'>
            <div className='create-new-mock-modal__content__header__icon'>
              <MockIcon
                className='create-new-mock-modal__content__header__icon__mock'
                size='lg'
              />
            </div>
            <div className='create-new-mock-modal__content__header__text'>
              <div className='create-new-mock-modal__content__header__text__title'>
                {heading}
              </div>
              {subHeading}
            </div>
          </div>
          <div className='separator'>
            Try it out:
            <div className='separator-line' />
          </div>
          <div className='create-new-mock-modal__content__footer'>
            <div className='create-new-mock-modal__content__footer__title'>To call the mock server:</div>
            <div className='create-new-mock-modal__step'>
              <div className='create-new-mock-modal__step__text'>
                <span>Add examples responses to each request that the mock server will return.</span>
                <Link
                  to={EXAMPLE_DOCS}
                  target='_blank'
                >
                  <Text
                    isExternal
                    type='link-default'
                  >
                    Learn what examples are and how to use them
                  </Text>
                </Link>
              </div>
            </div>
            {
              this.props.selectedOptions.isPrivate &&
                <div className='create-new-mock-modal__step'>
                  <div className='create-new-mock-modal__step__text'>
                    <Text
                      className='create-new-mock-modal__step__text__content'
                      color='content-color-secondary'
                      type='para'
                    >
                      Add an&nbsp;
                      <Text type='code'>x-api-key</Text>
                      &nbsp;header to your requests.&nbsp;
                      <Link
                        to={PRO_API_KEYS_LINK}
                        target={window.SDK_PLATFORM === 'browser' ? '_self' : '_blank'}
                      >
                        <Text
                          isExternal={window.SDK_PLATFORM === 'browser' ? false : true}
                          type='link-default'
                        >
                          Generate Postman API key
                        </Text>
                      </Link>
                    </Text>
                  </div>
                </div>
            }
            <div className='create-new-mock-modal__step'>
              <div className='create-new-mock-modal__step__text'>
                <span>Then just send a request to the following URL, followed by the request path: </span>
                <Button
                  onClick={this.openRequestInTab}
                  type='text'
                  className='create-new-mock-modal__step__text__link learn-more-link'
                >
                  {this.props.selectedOptions.mockUrl + '/'}
                </Button>
                {this.props.selectedOptions.createEnvironment &&
                  <div>
                    Or select the&nbsp;
                    <span className='create-new-mock-modal__step__text__bold'>{this.props.selectedOptions.name}</span>
                    &nbsp;environment and enter&nbsp;
                    <span className='create-new-mock-modal__step__text__bold'>{'{{url}}'}</span>
                    &nbsp;followed by the request path.
                  </div>
                }
              </div>
              <div className='create-new-mock-modal__step__copy'>
                <Button
                  className='create-new-mock-modal__step__copy-button'
                  onClick={this.handleCopyUrl}
                  type='secondary'
                >
                  <CopyIcon className='create-new-mock-modal__step__copy-button__icon' />
                  Copy Mock URL
                </Button>
            </div>
            </div>
            <div className='create-new-mock-modal__footer__helptext'>
              <span>Note: Calls to a mock server count against your plan's monthly call limits. Be sure to check your </span>
              <Link
                to={`${pm.appUrl}/dpxy/billing/add-ons/overview`}
                target={window.SDK_PLATFORM === 'browser' ? '_self' : '_blank'}
              >
                <Text
                  isExternal={window.SDK_PLATFORM === 'browser' ? false : true}
                  type='link-default'
                >
                  usage limits
                </Text>
              </Link>
              <span>.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render () {
    if (this.props.permissionsLoading) {
      return (
        <div className='permissions-loading'>
          <LoadingIndicator />
        </div>
      );
    }

    if (this.props.isUserDelinquent) {
      let subtitle = '',
        action = null;

      if (this.props.isUserBilling) {
        subtitle = 'Your team does not have access to certain Postman services due to non-payment of invoices.' +
          ' Pay the current invoice to continue.';
        action = openBillingOverview;
      }
      else {
        subtitle = 'Your team does not have access to certain Postman services due to non-payment of invoices.' +
          ' Contact your team’s billing manager for more information about your team’s payment.';
      }

      return (
        <div className='create-new-mock__error'>
          <CustomMockError
            actionName='Make Payment'
            subtitle={subtitle}
            title='Cannot access Postman servers'
            onRetry={action}
            illustration={<IllustrationUnableToLoad />}
          />
        </div>
      );
    }

    if (!this.props.isSyncEnabled) {
      const subtitle = 'Your team has disabled syncing with Postman services. Contact support to resume using these features.';

      return (
        <div className='create-new-mock__error'>
          <CustomMockError
            subtitle={subtitle}
            title='Cannot access Postman servers'
            illustration={<IllustrationUnableToLoad />}
          />
        </div>
      );
    }

    if (this.props.collectionStatus.error || this.props.mockStatus.error) {
      return (
        <div className='create-new-mock__error'>
          <CustomMockError
            subtitle='Something went wrong while creating this mock. You can try again later.'
            onRetry={this.props.onRetry}
            illustration={<IllustrationUnableToLoad />}
          />
        </div>
      );
    }

    if (this.props.isOffline && this.props.activeStep !== 3) {
      return (
        <div className='create-new-mock__error'>
          <CustomMockError
            subtitle='Please check your internet connection and try again.'
            onRetry={this.props.onOfflineRetry}
            illustration={<IllustrationCheckInternetConnection />}
          />
        </div>
      );
    }

    if (this.props.errorFetchingVersions) {
      return (
        <div className='create-new-mock__error'>
          <CustomMockError
            subtitle='An error occurred while fetching collection information.'
            onRetry={this.props.onVersionFetchRetry}
            actionName='Try again'
            illustration={<IllustrationUnableToLoad />}
          />
        </div>
      );
    }

    if (this.props.configStatus.error) {
      return (
        <div className='create-new-mock__error'>
          <CustomMockError
            subtitle='There was an unexpected error. Please try again.'
            onRetry={this.props.onConfigFetchRetry}
            actionName='Try again'
            illustration={<IllustrationUnableToLoad />}
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
