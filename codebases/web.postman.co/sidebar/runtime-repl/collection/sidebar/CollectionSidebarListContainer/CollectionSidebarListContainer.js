import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, Observer } from 'mobx-react';
import { Text } from '@postman/aether';

import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { reaction } from 'mobx';
import onClickOutside from '@postman/react-click-outside';

import KeyMaps from '@postman-app-monolith/renderer/js/components/base/keymaps/KeyMaps';
import XPath from '@postman-app-monolith/renderer/js/components/base/XPaths/XPath';
import TransientCollectionSidebarListItemHead from '@@runtime-repl/transient-collection/sidebar/TransientCollectionSidebarListItemHead';
import TransientCollectionSidebarListItemFolder from '@@runtime-repl/transient-collection/sidebar/TransientCollectionSidebarListItemFolder';
import TransientCollectionSidebarListItemRequest from '@@runtime-repl/transient-collection/sidebar/TransientCollectionSidebarListItemRequest';
import TransientCollectionSidebarListItemExample from '@@runtime-repl/transient-collection/sidebar/TransientCollectionSidebarListItemExample';
import CollectionSidebarListEmpty from './CollectionSidebarListEmpty/CollectionSidebarListEmpty';

import CollectionSidebarListItemFolder from './CollectionSidebarListItemFolder/CollectionSidebarListItemFolder';
import CollectionSidebarListItemRequest from './CollectionSidebarListItemRequest/CollectionSidebarListItemRequest';
import CollectionSidebarListItemExample from './CollectionSidebarListItemExample/CollectionSidebarListItemExample';
import CollectionSidebarListItemHead from './CollectionSidebarListItemHead/CollectionSidebarListItemHead';
import CollectionSidebarListItemEmpty from './CollectionSidebarListItemEmpty/CollectionSidebarListItemEmpty';

import { isLoggedIn, isWorkspaceMember, canJoinWorkspace } from '../../../_common/WorkspaceHelpers';
import CollectionSidebarModel from '../CollectionSidebarModel';
import {
  COLLECTION, FOLDER, REQUEST, RESPONSE
} from '../../../_common/ModelConstant';
import {
  ACTION_TYPE_ADD_REQUEST,
  ACTION_TYPE_DELETE,
  ACTION_TYPE_DUPLICATE,
  ACTION_TYPE_RENAME_TOGGLE,
  ACTION_TYPE_SELECT
} from '../../CollectionActionsConstants';
import CollectionSidebarListItemLoading from './CollectionSidebarListItemLoading/CollectionSidebarListItemLoading';

const DEFAULT_HEIGHT = 28,
  EMPTY_ITEM_HEIGHT = 52,
  OVERSCAN_COUNT = 5,
  EMPTY = 'empty',
  ZERO_INDEX = 0,
  LOADING = 'loading',
  DELAY_FOR_PREVIEW_TAB_DEBOUNCE = 200;

function CollectionSidbarEmptyFeatureBranch ({ depth } = {}) {
  return (
    <div className='collection-sidebar-empty__branch collection-sidebar-list-item__body--empty'>
      {_.times(depth, (index) => (
        <div
          key={`indent-${index}`}
          className='collection-sidebar__indent'
        />
      ))}
      <div className='collection-sidebar-list__empty-item__content'>
        <Text type='body-small' color='content-color-secondary'>
          No collections found in this branch
        </Text>
      </div>
    </div>
  );
}


@onClickOutside
@observer
export default class CollectionSidebarListContainer extends Component {
  constructor (props) {
    super(props);

    this.handleDragDrop = this.handleDragDrop.bind(this);
    this.handleCreateRequest = this.handleCreateRequest.bind(this);
    this.getListItem = this.getListItem.bind(this);
    this.getItemSize = this.getItemSize.bind(this);
    this.observeSizeChange = this.observeSizeChange.bind(this);
    this.unobserveSizeChange = this.unobserveSizeChange.bind(this);
    this.scrollToItemById = this.scrollToItemById.bind(this);
    this.debouncedOpenActiveItemInTab = _.debounce(this.openActiveItemInTab.bind(this), DELAY_FOR_PREVIEW_TAB_DEBOUNCE);

    // Edit cache
    // this.setEditCache = this.setEditCache.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    // Height set for empty list items, as their height may change due to sidebar resizing
    this.heightSetForEmptyItems = {};

    // To reset cached height when there are changes in list items, for example
    // if there is a drag/drop.
    this.heightReactionDisposer = reaction(() => _.get(this.props.model, 'items'), () => {
      this.listRef && this.listRef.resetAfterIndex(ZERO_INDEX);
    });

    // To move to the specified list item on focus shift
    this.focusReactionDisposer = reaction(() => _.get(this.props.model, 'activeItem'), (activeItem) => {
      if (!activeItem) {
        return;
      }

      // `requestIdleCallback` is used because mounting and rendering of new List items is of
      // higher priority and must be done before scrolling.
      // Also, this helps in waiting for the initial loading and mounting when Collection Sidebar is mounted,
      // before the initial scroll.
      requestIdleCallback(this.scrollToItemById.bind(this, activeItem.id));
    });

    // Resize observer for empty list items
    this.resizeObserver = new ResizeObserver((entries) => {
      // eslint-disable-next-line no-unused-vars
      for (const entry of entries) {
        if (!(entry && entry.target && entry.target.dataset)) {
          return;
        }

        const { index } = entry.target.dataset;

        this.heightSetForEmptyItems[index] = entry.target.offsetHeight;
      }

      this.listRef.resetAfterIndex(ZERO_INDEX);
    });

    /**
     * Cache for item currently in edit mode
     *
     * @type {Object}
     * @property {String} id - id of the list item in edit mode
     * @property {String} type - type of the list item (collection / folder / request)
     * @property {Object} listItem - cache of EnvironmentPreviewListItem state
     * @property {Object} inlineInput - cache of inlineInput state
     */
    this.editCache = null;
  }

  componentWillUnmount () {
    this.heightReactionDisposer && this.heightReactionDisposer();
    this.focusReactionDisposer && this.focusReactionDisposer();

    // If any item is in edit mode and not in view,
    // this will update the value if the component unmounts
    this.props.model.activeItem && this.props.model.activeItem.commitCachedRename();

    clearTimeout(this.clearCollectionLoadingTimer);
  }

  getListItem ({ index, style }) {
    const { model } = this.props,

      item = _.get(model, ['items', index]),
      prevItem = index && _.get(model, ['items', index - 1]), // If index is not zero
      { activeItem } = model;

    // If there is no item in this index then return null
    // Note: This should not happen
    if (!item) {
      pm.logger.warn('CollectionSideBarListContainer~getListItem', 'Could not find any item at index', index);

      return null;
    }

    const isFocused = model.isFocused(item.id),
      activeIndent = {};

    // Required to show active indentation line
    (item.type === EMPTY) && (item.parent = prevItem);

    if (activeItem) {
      activeIndent.show = this.shouldShowIndent(item, activeItem);
      activeIndent.depth = activeItem.depth - 1; // Subtract 1 to make the depth zero indexed
    }

    switch (item.type) {
      case LOADING: {
        return (
          <div
            className='collection-virtualized-list-item__loading'
            style={style}
          >
            <CollectionSidebarListItemLoading
              depth={item.depth}
              activeIndent={activeIndent}
            />
          </div>
        );
      }

      case EMPTY: {
        const collection = (prevItem.type === COLLECTION || prevItem.type === 'transient-collection') ?
          prevItem : model.getParentCollection(prevItem);

        return (
          <div
            className='collection-virtualized-list-item__empty'
            style={style}
          >
            <CollectionSidebarListItemEmpty
              parent={prevItem}
              canAddRequest={collection.userCanUpdate}
              depth={item.depth}
              index={index}
              observeSizeChange={this.observeSizeChange}
              unobserveSizeChange={this.unobserveSizeChange}
              onAddRequest={this.handleCreateRequest}
              activeIndent={activeIndent}
            />
          </div>
        );
      }

      case COLLECTION: {
        return (
          <div className='collection-virtualized-list-item__head' style={style}>
            <XPath identifier={item.xpath} key={item.xpath}>
              <CollectionSidebarListItemHead
                key={item.id}

                item={item}
                model={model}
                persistentState={item._persistentState}

                // Reordering
                onDragDrop={this.handleDragDrop}
              />
            </XPath>
          </div>
        );
      }

      case FOLDER: {
        const collection = item.$collection;

        return (
          <div
            className='collection-virtualized-list-item__folder'
            style={style}
          >
            <XPath identifier={item.xpath} key={item.xpath}>
              <CollectionSidebarListItemFolder
                key={item.id}

                model={model}
                item={item}
                persistentState={item._persistentState}
                collection={collection}

                // Flags
                isFocused={isFocused}

                // Reordering
                onDragDrop={this.handleDragDrop}

                // Indent marker config
                activeIndent={activeIndent}
              />
            </XPath>
          </div>
        );
      }

      case REQUEST: {
        const collection = item.$collection;

        return (
          <div
            className='collection-virtualized-list-item__request'
            style={style}
          >
            <XPath identifier={item.xpath} key={item.xpath}>
              <CollectionSidebarListItemRequest
                key={item.id}

                model={model}
                item={item}
                persistentState={item._persistentState}
                collection={collection}

                // Flags
                isFocused={isFocused}
                isFirstChild={prevItem && (prevItem.depth < item.depth)}

                // Reordering
                onDragDrop={this.handleDragDrop}

                // Indent marker
                activeIndent={activeIndent}
              />
            </XPath>
          </div>
        );
      }

      case RESPONSE: {
        const collection = item.$collection;

        return (
          <div
            className='collection-virtualized-list-item__example'
            style={style}
          >
            <XPath identifier={item.xpath} key={item.xpath}>
              <CollectionSidebarListItemExample
                key={item.id}

                model={model}
                item={item}
                persistentState={item._persistentState}
                collection={collection}

                // Flags
                isFocused={isFocused}
                isFirstChild={prevItem && (prevItem.depth < item.depth)}

                // Reordering
                onDragDrop={this.handleDragDrop}

                // Indent marker
                activeIndent={activeIndent}
              />
            </XPath>
          </div>
        );
      }

      case 'transient-collection': {
        return (
          <div className='collection-virtualized-list-item__head' style={style}>
            <XPath identifier={item.xpath} key={item.xpath}>
              <TransientCollectionSidebarListItemHead
                key={item.id}

                item={item}
                model={model}
                persistentState={item._persistentState}

                // Reordering
                onDragDrop={this.handleDragDrop}
              />
            </XPath>
          </div>
        );
      }

      case 'transient-folder': {
        const collection = item.$collection;

        return (
          <div
            className='collection-virtualized-list-item__folder'
            style={style}
          >
            <XPath identifier={item.xpath} key={item.xpath}>
              <TransientCollectionSidebarListItemFolder
                key={item.id}

                model={model}
                item={item}
                persistentState={item._persistentState}
                collection={collection}

                // Flags
                isFocused={isFocused}

                // Reordering
                onDragDrop={this.handleDragDrop}

                // Indent marker config
                activeIndent={activeIndent}
              />
            </XPath>
          </div>
        );
      }

      case 'transient-request': {
        const collection = item.$collection;

        return (
          <div
            className='collection-virtualized-list-item__request'
            style={style}
          >
            <XPath identifier={item.xpath} key={item.xpath}>
              <TransientCollectionSidebarListItemRequest
                key={item.id}

                model={model}
                item={item}
                persistentState={item._persistentState}
                collection={collection}

                // Flags
                isFocused={isFocused}
                isFirstChild={prevItem && (prevItem.depth < item.depth)}

                // Reordering
                onDragDrop={this.handleDragDrop}

                // Indent marker
                activeIndent={activeIndent}
              />
            </XPath>
          </div>
        );
      }

      case 'transient-example': {
        const collection = item.$collection;

        return (
          <div
            className='collection-virtualized-list-item__example'
            style={style}
          >
            <XPath identifier={item.xpath} key={item.xpath}>
              <TransientCollectionSidebarListItemExample
                key={item.id}

                model={model}
                item={item}
                persistentState={item._persistentState}
                collection={collection}

                // Flags
                isFocused={isFocused}
                isFirstChild={prevItem && (prevItem.depth < item.depth)}

                // Reordering
                onDragDrop={this.handleDragDrop}

                // Indent marker
                activeIndent={activeIndent}
              />
            </XPath>
          </div>
        );
      }

      default:
        return null;
    }
  }

  getItemSize (index) {
    const currentItem = _.get(this.props.model, ['items', index]);

    if (!currentItem) {
      // eslint-disable-next-line no-magic-numbers
      return 0;
    }

    if (currentItem.type === EMPTY) {
      return this.heightSetForEmptyItems[index] || EMPTY_ITEM_HEIGHT;
    }

    return DEFAULT_HEIGHT;
  }

  getKeyMapHandlers () {
    return {
      nextItem: pm.shortcuts.handle('nextItem', this.focusNextShortcut.bind(this)),
      prevItem: pm.shortcuts.handle('prevItem', this.focusPrevShortcut.bind(this)),
      expandItem: pm.shortcuts.handle('expandItem', this.expandItemShortcut.bind(this)),
      collapseItem: pm.shortcuts.handle('collapseItem', this.collapseItemShortcut.bind(this)),
      select: pm.shortcuts.handle('select', this.selectItemShortcut.bind(this)),
      cut: pm.shortcuts.handle('cut', this.cutItemShortcut.bind(this)),
      copy: pm.shortcuts.handle('copy', this.copyItemShortcut.bind(this)),
      paste: pm.shortcuts.handle('paste', this.pasteItemShortcut.bind(this)),
      duplicate: pm.shortcuts.handle('duplicate', this.duplicateItemShortcut.bind(this)),
      delete: pm.shortcuts.handle('delete', this.deleteItemShortcut.bind(this)),
      rename: pm.shortcuts.handle('rename', this.handleRenameShortcut.bind(this)),
      search: pm.shortcuts.handle('search'),
      quit: pm.shortcuts.handle('quit', this.handleQuitShortcut.bind(this)) // Discard changes
    };
  }

  observeSizeChange (node) {
    this.resizeObserver && this.resizeObserver.observe(node);
  }

  unobserveSizeChange (node, index) {
    this.resizeObserver && this.resizeObserver.unobserve(node);
    delete this.heightSetForEmptyItems[index];
  }

  handleQuitShortcut () {
    (this.props.model.activeItem) && this.props.model.activeItem.cancelRename();
  }

  handleClickOutside (e) {
    const targetClassName = e && e.target && e.target.className,
      isFromInlineInput = (targetClassName === 'input input-box inline-input'),
      { activeItem } = this.props.model;


    if (
      // Click is coming from the inline input
      isFromInlineInput ||

      // Or there is no active item
      !activeItem ||

      // Or the active item is not being edited
      !activeItem._persistentState.isEditing
    ) { return; } // Bail out

    this.props.model.activeItem && this.props.model.activeItem.commitCachedRename();

    // Stop the propagation to children elements, as this click is supposed to save the item
    // currently in edit mode. Also `commitCachedRename` will trigger a re-render.
    e && e.stopPropagation();
  }

  handleRenameShortcut () {
    const { activeItem } = this.props.model;

    if (!activeItem) {
      return;
    }

    // Enter into the renaming mode or exit out of it
    activeItem.handleAction(ACTION_TYPE_RENAME_TOGGLE);
  }

  shouldShowIndent (currentItem, activeItem) {
    if (!(activeItem && currentItem)) {
      return false;
    }

    const activeItemParent = this.props.model.getParent(activeItem);

    if (!activeItemParent) {
      return false;
    }

    if (activeItemParent.id === currentItem.id) {
      return true;
    }

    const currentItemParent = ((currentItem.type === EMPTY) || (currentItem.type === LOADING) ?
      currentItem.parent :
      this.props.model.getParent(currentItem));

    if (!currentItemParent) {
      return false;
    }

    return this.shouldShowIndent(currentItemParent, activeItem);
  }

  scrollToItemById (itemId) {
    if (!itemId) {
      return;
    }

    const foundIndex = _.findIndex(_.get(this.props.model, 'items'), (visibleItem) => visibleItem.id === itemId);

    // Item not found
    if (foundIndex < ZERO_INDEX) {
      return;
    }

    this.listRef && this.listRef.scrollToItem(foundIndex);
  }

  focus () {
    if (!this.sidebarListRef) {
      return;
    }

    this.sidebarListRef.focus();
  }

  // Its a wrapper function which will be used in the debounce function. Its function is for opening preview of
  // respective items scrolled in the Sidebar.
  openActiveItemInTab () {
    const { model } = this.props;

    model.activeItem && model.activeItem.openInTab();
  }

  focusNextShortcut (e) {
    e && e.preventDefault();

    const { model } = this.props;

    model.focusNextItem();
    this.debouncedOpenActiveItemInTab();
  }

  focusPrevShortcut (e) {
    e && e.preventDefault();

    const { model } = this.props;

    model.focusPreviousItem();
    this.debouncedOpenActiveItemInTab();
  }

  expandItemShortcut (e) {
    e && e.preventDefault();

    const { model } = this.props || {},
      { activeItem } = model || {};

    if (!activeItem) {
      return;
    }

    model.expandItem(activeItem);
  }

  collapseItemShortcut (e) {
    e && e.preventDefault();

    const { model } = this.props || {},
      { activeItem } = model || {};

    if (!activeItem) {
      return;
    }

    // If item is already open, close the item
    if (model.isOpen(activeItem.id)) {
      return model.collapseItem(activeItem);
    }

    // If item is already closed, check the parent
    const parentItem = model.getParent(activeItem);

    // If not parent element found then bail
    if (!parentItem) {
      return;
    }

    // If parent item is open the collapse it or else focus on it
    if (model.isOpen(parentItem.id)) {
      model.collapseItem(parentItem);
    } else {
      model.focusItem(parentItem);
    }
  }

  selectItemShortcut (e) {
    const { activeItem } = this.props.model;

    if (!activeItem) {
      return;
    }

    activeItem.commitCachedRename();

    e && e.preventDefault();

    (activeItem.type === REQUEST) && activeItem.handleAction(ACTION_TYPE_SELECT, { returnKey: true });
  }

  cutItemShortcut () {
    const { model } = this.props || {},
      { activeItem } = model || {};

    if (!(model && activeItem)) {
      return;
    }

    switch (activeItem.type) {
      case REQUEST:
        if (!activeItem.$collection.userCanUpdate) {
          return pm.toasts.error('You do not have permissions required to perform the action.');
        }

        break;

      case FOLDER:
        if (!activeItem.$collection.userCanUpdate) {
          return pm.toasts.error('You do not have permissions required to perform the action.');
        }

        break;

      default: // Collection cut is not supported
        return;
    }

    model.cutItem();
  }

  copyItemShortcut () {
    const { model } = this.props || {};

    model.copyItem();
  }

  pasteItemShortcut () {
    const { model } = this.props || {};

    if (!(model && model.clipboard)) {
      return false;
    }

    if (!isWorkspaceMember()) {
      if (canJoinWorkspace()) {
        return pm.mediator.trigger('openUnjoinedWorkspaceModal');
      }

      if (!isLoggedIn()) {
        return pm.mediator.trigger('showSignInModal', {
          type: 'collection_sidebar',
          origin: 'paste_item'
        });
      }

      return pm.toasts.error('You do not have permissions required to perform the action.');
    }

    model.pasteItem();
  }

  duplicateItemShortcut () {
    const { activeItem } = this.props.model || {};

    if (!activeItem) {
      return;
    }

    activeItem.handleAction(ACTION_TYPE_DUPLICATE);
  }

  deleteItemShortcut (e) {
    const { activeItem } = this.props.model || {};

    if (!activeItem || activeItem._persistentState.isEditing) {
      return;
    }

    e && e.preventDefault();

    activeItem.handleAction(ACTION_TYPE_DELETE);
  }

  handleDragDrop (source, destination, position) {
    // Bail if destination is runner
    if (destination.type === 'tab' && destination.id === 'runner') {
      return;
    }

    // If the sourceId is same a destination id then bail.
    // There is nothing to do
    if (source.id === destination.id) {
      return;
    }

    if ((destination.type === 'request' && source.type === 'request') || (destination.type === 'response' && source.type === 'response')) {
      // Only two possible positions before and after - In case of on make it before
      (position === 'on') && (position = 'before');
    }

    this.props.model.reorder(source, destination, position);
  }

  handleCreateRequest (target) {
    return target.handleAction(ACTION_TYPE_ADD_REQUEST);
  }

  render () {
    const items = _.get(this.props.model, 'items');

    if (_.isEmpty(items) && !this.props.isNested) {
      const query = _.get(this.props.model, 'searchQuery');

      return <CollectionSidebarListEmpty query={query} />;
    }

    if (_.isEmpty(items) && this.props.isNested) {
      return <CollectionSidbarEmptyFeatureBranch depth={2} />;
    }

    const lister = (data) => (
      <Observer>
        {this.getListItem.bind(this, data)}
      </Observer>
      ),
      sizer = ({ height, width }) => (
        <Observer>
          {() => (
            <List
              height={height}
              itemCount={items.length}
              itemSize={this.getItemSize}
              width={width}
              ref={(ref) => { this.listRef = ref; }}
              overscanCount={OVERSCAN_COUNT}
              className='collection-sidebar-list__list'
            >
              {lister}
            </List>
          )}
        </Observer>
      );

    if (this.props.isNested) {
      return (
        <KeyMaps handlers={this.getKeyMapHandlers()}>
          <div
            className='collection-sidebar-list'
            ref={(ref) => { this.sidebarListRef = ref; }}

            // Using `onClickCapture` instead of `onClick` to prevent propagation in cases of some item
            // already being in edit mode, and using the click to just save the item
            onClickCapture={this.handleClickOutside}
          >
            { items.map((_item, index) => this.getListItem({ index })) }
          </div>
        </KeyMaps>
      );
    }

    return (
      <KeyMaps handlers={this.getKeyMapHandlers()}>
        <div
          className='collection-sidebar-list'
          ref={(ref) => { this.sidebarListRef = ref; }}

          // Using `onClickCapture` instead of `onClick` to prevent propagation in cases of some item
          // already being in edit mode, and using the click to just save the item
          onClickCapture={this.handleClickOutside}
        >
          <AutoSizer>{sizer}</AutoSizer>
        </div>
      </KeyMaps>
    );
  }
}

CollectionSidebarListContainer.propTypes = {
  model: PropTypes.instanceOf(CollectionSidebarModel).isRequired
};
