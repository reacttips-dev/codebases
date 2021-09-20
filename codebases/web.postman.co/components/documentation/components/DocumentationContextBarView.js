import React from 'react';
import { observer } from 'mobx-react';

import ContextBarSkeletonLoader from './entity/SkeletonLoader/ContextBarSkeletonLoader/ContextBarSkeletonLoader';
import { getStore } from '../../js/stores/get-store';
import CrashHandler from '../../js/components/empty-states/CrashHandler';
import { ACTION_REQUEST_ACCESS } from '@@runtime-repl/collection/CollectionActionsConstants';
import { collectionActions } from '@@runtime-repl/collection/_api/CollectionInterface';

import { ContextBarFooter } from './ContextBar';
import { DOCUMENTATION_ANALYTICS, DOCUMENTATION_ENTITY, DOCUMENTATION_ORIGIN } from '../constants';
import AnalyticsService from '../../js/modules/services/AnalyticsService';
import { isPublicWorkspace, openEntityByResolvingUid } from '../utils/utils';
import DocumentationError from './DocumentationError';
import withErrorHandler from '../hocs/withErrorHandler';
import withContextBarTitle from '../hocs/withContextBarTitle';
import DocumentationIntersectionObserver from './DocumentationIntersectionObserver';
import RuntimeEntity from './entity/RuntimeEntity';

@withContextBarTitle
@withErrorHandler
@observer
export default class DocumentationContextBarView extends React.Component {
  state = {
    showFooter: true,
    collectionData: undefined
  };

  unsubscribe = null;

  componentDidMount () {
    let { contextData, controller } = this.props,
      { entityUid } = controller,
      { type: entityType, id: entityId } = contextData;

    AnalyticsService.addEventV2({
      category: DOCUMENTATION_ANALYTICS.CATEGORY,
      action: 'view',
      label: isPublicWorkspace()
        ? DOCUMENTATION_ANALYTICS.LABEL.PUBLIC_CONTEXTBAR
        : DOCUMENTATION_ANALYTICS.LABEL.PRIVATE_CONTEXTBAR,
      entityType,
      entityId:
        entityType === DOCUMENTATION_ENTITY.COLLECTION ? entityUid : entityId
    });
  }

  openCollection = () => {
    let { contextData, controller } = this.props,
      { id: entityId, type: entityType } = contextData,
      { entityUid } = controller;

    AnalyticsService.addEventV2({
      category: DOCUMENTATION_ANALYTICS.CATEGORY,
      action: 'open_tab',
      label: isPublicWorkspace()
        ? DOCUMENTATION_ANALYTICS.LABEL.PUBLIC_CONTEXTBAR
        : DOCUMENTATION_ANALYTICS.LABEL.PRIVATE_CONTEXTBAR,
      entityType,
      entityId:
        entityType === DOCUMENTATION_ENTITY.COLLECTION ? entityUid : entityId
    });
  };

  requestEditAccess = () => {
    let collectionId =
      this.props.contextData.parentCollectionUid || this.props.contextData.uid;

    collectionActions(collectionId, ACTION_REQUEST_ACCESS);
  };

  handleEditModeChange = (entityType, entityId, editMode) => {
    return this.setState({ showFooter: !editMode });
  };

  handleUpdateName = (entityType, entityId, title) => {
    this.props.controller.store.updateName(title);
  };

  handleUpdateDescription = (entityType, entityId, description) => {
    this.props.controller.store.updateDescription(description);
  };

  /**
   * Handle click on the parent entity while rendering inherited auth
   */
  handleParentEntityClick = (parentType, parentId) => {
    return openEntityByResolvingUid(parentType, parentId);
  }

  /**
   * Render an entity of any type: collection, folder, request.
   *
   * @param {Object} data - The data to be rendered within the component, with resolved variables/placeholders
   * @param {String} id - UUID of the selected entity
   * @param {String} type - The element type. One of collection, folder, or request
   * @param {String} collectionUid - collectionUid of the parent collection of the selected entity
   * @param {Object} [rawData] - Data with unresolved variables/placeholders. Necessary if inline editing is to be
   *                              enabled.
   * @param {Object} parentCollectionData - Parent collection object of the selected entity.
   *                                         Required for inherited auth resolution.
   * @param {String} parentCollectionUid - Uid of the parent collection
   * @param {Object} rootRef - Ref to the root element
   * @param {Boolean} isEditable - Flag indicating if the entity is editable by the user
   * @param {Object} store - The context bar store
   * @return {JSX|null} - The rendered element-specific output, or null.
   */
  renderEntity = ({
    data,
    id,
    type,
    parentCollectionData,
    parentCollectionUid,
    rootRef,
    isEditable,
    store
  }) => {
    const controller = this.props.controller;

    return (
      <React.Fragment>
        <div
          ref={rootRef}
          className='documentation-context-view__entity-body-container'
        >
          <RuntimeEntity
            type={type}
            entityData={data}
            parentCollectionData={parentCollectionData}
            store={store}
            onClose={this.props.onClose}
            source={DOCUMENTATION_ORIGIN.CONTEXT_VIEW}
            onRequestAccess={this.requestEditAccess}
            editable={isEditable}
            updateName={this.handleUpdateName}
            updateDescription={this.handleUpdateDescription}
            onParentEntityClick={this.handleParentEntityClick}
            onEditModeChange={this.handleEditModeChange}
            updateUnsavedDescription={_.get(controller, 'updateUnsavedDescription')}
            unsavedDescription={_.get(controller, 'contextBarUnsavedDescription')}
          />
        </div>
        {this.state.showFooter ? (
          <ContextBarFooter
            id={id}
            type={type}
            collectionUid={parentCollectionUid}
            onOpenCollection={this.openCollection}
          />
        ) : null}
      </React.Fragment>
    );
  };

  render () {
    const { contextData, controller, editorId } = this.props;

    let editorStore = getStore('EditorStore').find(editorId);

    // Forcefully un-mounting the documentation context bar
    // Otherwise the hash fragment conflicts if same documentation opened in 2 different tabs
    // @todo - properly unmount the parent tab itself when tab is not active
    if (!editorStore.isActive) {
      return null;
    }

    let { id, type } = contextData,
      { store } = controller,
      { isEditable, parentCollectionData, entityData } = store,
      { isLoading, error, data } = entityData,
      parentCollectionUid =
        type === DOCUMENTATION_ENTITY.COLLECTION
          ? contextData.collectionUid
          : contextData.parentCollectionUid;

    if (typeof id === 'undefined') {
      return null;
    }

    return (
      <React.Fragment>
        {isLoading ? (
          <ContextBarSkeletonLoader />
        ) : error ? (
          <DocumentationError title={error.title} message={error.message} />
        ) : (
          <CrashHandler
            message={`There was an error while fetching the documentation for this ${type}. If this problem persists, contact us at help@postman.com`}

            // error should only shown only when there is an explict error, other wise we can show
            // empty screen (render null)
            showError={error}
          >
            <DocumentationIntersectionObserver>
              {({ rootRef }) =>
              (data
                ? this.renderEntity({
                  data,
                  id,
                  type,
                  parentCollectionData,
                  parentCollectionUid,
                  rootRef,
                  isEditable,
                  store
                })
                : null)
              }
            </DocumentationIntersectionObserver>
          </CrashHandler>
        )}
      </React.Fragment>
    );
  }
}
