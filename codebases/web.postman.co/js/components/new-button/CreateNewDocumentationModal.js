import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { Tabs, Tab } from '../base/Tabs';
import { Input } from '../base/Inputs';
import { Button } from '../base/Buttons';
import TextEditor from '../../../appsdk/components/editors/texteditor/TextEditor';
import LoadingIndicator from '../base/LoadingIndicator';
import PublishIcon from '../base/Icons/PublishIcon';
import CollectionIcon from '../base/Icons/CollectionIcon';
import CreationError from './CreationError';
import CollectionsEmpty from '../empty-states/CollectionsEmpty';
import CollectionMetaIcons from '@@runtime-repl/collection/CollectionMetaIcons';
import CollectionForkLabel from '../collections/CollectionForkLabel';
import {
  MARKDOWN_DOCS,
  DOCUMENTATION_PUBLISH_DOCS,
  ADD_EXAMPLE_DOCS,
  VIEW_DOCS,
  INTRO_API_DOCUMENTATION
} from '../../constants/AppUrlConstants';

import { DataEditor, utils } from '@postman/data-editor';
import RowRenderer from '../base/data-editor/RowRenderer';
import DEInput from '../base/data-editor/components/DEInputs';
import HeaderActions from '../base/data-editor/components/HeaderActions';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import PluralizeHelper from '../../utils/PluralizeHelper';
import httpStatusCodes from '@@runtime-repl/request-http/httpstatuscodes';
import { getStore } from '../../stores/get-store';
import DataEditorRequestMethods from './DataEditorRequestMethods';
import Link from '../../../appsdk/components/link/Link';

let getAllStatusList = () => {
  return _.reduce(httpStatusCodes, (acc, obj, key) => {
    acc.push({ value: `${key} ${obj.name}` });
    return acc;
  }, []);
};

@observer
export default class CreateNewDocumentationModal extends Component {
  constructor (props) {
    super(props);

    let DEConfig = {
      columns: [{
        name: 'method',
        type: 'string',
        label: 'Method',
        width: 20,
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
        width: 40,
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
            <DEInput
              value={value}
              onAction={handleChange}
              cellInfo={cellInfo}
              placeholder='URL'
            />
          );
        }
      }, {
        name: 'requestBody',
        type: 'string',
        label: 'Request Body',
        width: 20,
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
            <DEInput
              value={value}
              onAction={handleChange}
              cellInfo={cellInfo}
              placeholder='Body'
            />
          );
        }
      }, {
        name: 'description',
        type: 'string',
        label: 'Description',
        width: 40,
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
            <DEInput
              value={value}
              onAction={handleChange}
              cellInfo={cellInfo}
              placeholder='Description'
            />
          );
        }
      }, {
        name: 'code',
        type: 'string',
        label: 'Response Code',
        width: 23,
        resize: true,
        hidden: true,
        renderer: (value, onAction, { isCollapsed, subColumnIndex }, style, cellInfo) => {
          let handleChange = (value) => {
            onAction && onAction(
              'edit',
              { value: value }
            );
          };

          return (
            <DEInput
              type='number'
              value={value}
              onAction={handleChange}
              cellInfo={cellInfo}
              placeholder='Code'
              suggestions={getAllStatusList()}
            />
          );
        }
      }, {
        name: 'response',
        type: 'string',
        label: 'Response Body',
        width: 36,
        resize: true,
        hidden: true,
        default: ''
      }],
      renderers: {
        string: (value, onAction, { isCollapsed, subColumnIndex }, style, cellInfo) => {
          let handleChange = (value) => {
            onAction && onAction(
              'edit',
              { value: value }
            );
          };
          return (
            <DEInput
              value={value}
              onAction={handleChange}
              cellInfo={cellInfo}
            />
          );
        },
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
    this.getSelectedOptionName = this.getSelectedOptionName.bind(this);
    this.openLink = this.openLink.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleColumnToggle = this.handleColumnToggle.bind(this);
  }

  getClasses () {
    return classnames({
      'create-new-monitor-modal__content': true,
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

  onCollectionSelect () {
    this.refs.collectionName && this.refs.collectionName.focus();
  }

  getDocumentationLinkShortened (link) {
    return _.truncate(link, { length: 60 });
  }

  handleChange (values) {
    this.setState({ values });

    let requests = _.dropRight(utils.unflattenNodes(values));
    this.props.onRequestChange(requests);
  }

  handleColumnToggle (newConfig) {
    this.setState({ config: newConfig });
  }

  renderStep1 () {

    return (
      <div className='create-new-monitor-modal__body step1'>
        <Tabs
          type='primary'
          defaultActive='new'
          activeRef={this.props.activeSource}
          onChange={this.props.onChangeSource}
          className='tabs-container'
        >
          <Tab refKey='new'>Create a new collection</Tab>
          <Tab refKey='workspace'>Select an existing collection</Tab>
        </Tabs>
        <div className='create-new-monitor-modal__right__intro'>
          {this.props.activeSource === 'new' ?
            'Create a new collection by adding individual requests. Use the "Description" column to document what each endpoint URL does. To add a request body or an example response body, click the (•••) icon.' :
            'Make your collection easier to consume by adding documentation. Select a collection to document.'
           }
        </div>
        <div className='create-new-monitor-modal__right'>
        {
          this.props.activeSource === 'new' &&
            <div className='create-new-monitor-modal__right__table'>
              <div className='create-new-monitor-modal__data-editor'>
                <DataEditor
                  input={this.state.values}
                  config={this.state.config}
                  onChange={this.handleChange}
                />
              </div>
            </div>
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
            <div className='create-new-monitor-modal__right__collections'>
              {
                _.map(this.props.ownCollections, (c) => {
                  return (
                    <div className='create-new-monitor-modal__card' key={c.id} onClick={this.props.onSelectCollection.bind(this, c)}>
                      <CollectionIcon className='create-new-monitor-modal__card__icon' />
                      <div className='create-new-monitor-modal__card__content'>
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
                  );
                })
              }
            </div>
        }
        </div>
      </div>
    );
  }

  renderStep2 () {
    return (
      <div className='create-new-monitor-modal__body step2'>
        <div className='create-new-monitor__body__input-group create-new-monitor__body__input-group--name'>
          <div className='create-new-monitor__body__label'>
          {
            this.props.activeSource === 'new' ?
            'Name your collection' :
            'Collection Name'
          }
          </div>
          <div className='create-new-monitor__body__input'>
            <div className='create-new-monitor__body__field'>
              <Input
                ref='collectionName'
                disabled={!_.isEmpty(this.props.selectedOptions.collectionId)}
                inputStyle='box'
                value={this.props.selectedOptions.name}
                onChange={this.props.onCollectionNameChange}
                onEnter={this.props.onCreateCollection}
              />
            </div>
          </div>
        </div>
        <div className='create-new-monitor__body__input-group create-new-monitor__body__input-group--description'>
          <div className='create-new-monitor__body__label'>
              Describe your collection
          </div>
          <div className='create-new-monitor__body__input'>
            <div className='create-new-monitor__body__field create-new-documentation-editor'>
              <TextEditor
                hideLineNumbers
                hideCodeFolding
                language='markdown'
                value={this.props.collectionDescription}
                onChange={this.props.onCollectionDescriptionChange}
              />
            </div>
            <div className='create-new-monitor__body__input__helptext'>
              <span>
                Give a brief description of what your collection can do and some key details such as what the collection provides and who it's for.
                {
                  this.props.activeSource !== 'new' && ' Use markdown to add headings, lists, code snippets, etc.'
                }
              </span>
              {
                this.props.activeSource === 'new' && <span>
                  <br /><br />
                  <span>You can use </span>
                  <Button
                    className='learn-more-link'
                    type='text'
                    onClick={openExternalLink.bind(this, MARKDOWN_DOCS)}
                  >
                    markdown
                  </Button>
                  <span> for adding headings, lists, code snippets etc. in your description.</span>
                </span>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderStep3 () {
    if (this.props.collectionStatus.error) {
      return (
        <div className='create-new-monitor-modal__body is-error step3'>
          <CreationError
            subtitle='Something went wrong while creating this documentation. You can try again later.'
            onRetry={this.props.onRetry}
          />
        </div>
      );
    }
    else if (this.props.collectionStatus.loading) {
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
              <PublishIcon
                className='create-new-monitor-modal__content__header__icon__documentation'
                size='lg'
              />
            </div>
              <div className='create-new-monitor-modal__content__header__text'>
                <div className='create-new-monitor-modal__content__header__text__title'>
                  <b>{_.truncate(this.props.selectedOptions.name, { length: 40 })} </b>
                  {
                    this.props.activeSource === 'new' ?
                      ' created and documented' :
                      ' documented'
                  }
                </div>
                <div className='create-new-monitor-modal__content__header__text__text view_documentation'>
                  <div>Take a look at your beautiful new documentation:</div>
                  <Link
                    to={{
                      routeIdentifier: 'build.documentation',
                      routeParams: { collectionUid: _.get(this.props.selectedOptions, 'collectionUid') }
                    }}
                    onClick={this.props.onClose}
                  >
                    <Button type='text'>
                      View Documentation
                    </Button>
                  </Link>
                  <div>The documentation is private, so only people you share the collection with can view it.</div>
                </div>
              </div>
          </div>
          <div className='separator'>
            NEXT STEPS
            <div className='separator-line' />
          </div>
          <div className='create-new-monitor-modal__content__footer'>
            <div className='create-new-monitor-modal__step'>
              <div className='create-new-monitor-modal__step__title'>Add more details to your documentation</div>
              <div className='create-new-monitor-modal__step__text'>
              <span>For easy onboarding, you can also describe request params, body, and even collection folders.</span>
                <Button
                  className='learn-more-link'
                  onClick={this.openLink.bind(this, INTRO_API_DOCUMENTATION)}
                  type='text'
                ><div>Learn how</div>
                </Button>
              </div>
            </div>
            <div className='create-new-monitor-modal__step'>
              <div className='create-new-monitor-modal__step__title'>Share with your team</div>
              <div className='create-new-monitor-modal__step__text'>
              <div>Share the documentation to a team workspace so your teammates can view and collaborate on it.</div>
                <Button
                  className='learn-more-link'
                  onClick={this.openLink.bind(this, VIEW_DOCS)}
                  type='text'
                ><div>Learn how</div>
                </Button>
              </div>
            </div>
            <div className='create-new-monitor-modal__step'>
              <div className='create-new-monitor-modal__step__title'>Share with the world</div>
              <div className='create-new-monitor-modal__step__text'>
                <div>Publish the documentation for people outside your team on a custom domain with your own branding.</div>
                <Button
                  className='learn-more-link'
                  onClick={this.openLink.bind(this, DOCUMENTATION_PUBLISH_DOCS)}
                  type='text'
                >Learn how</Button>
              </div>
            </div>
            <div className='create-new-monitor-modal__step'>
              <div className='create-new-monitor-modal__step__title'>Add sample responses</div>
              <div className='create-new-monitor-modal__step__text'>
                <div>Make your collection easier to consume by documenting some example responses.</div>
                <Button
                  className='learn-more-link'
                  onClick={this.openLink.bind(this, ADD_EXAMPLE_DOCS)}
                  type='text'
                >Learn how to create examples</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render () {
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
