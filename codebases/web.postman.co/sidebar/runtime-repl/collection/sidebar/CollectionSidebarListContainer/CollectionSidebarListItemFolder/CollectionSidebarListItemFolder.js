import React from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { DragSource, DropTarget } from 'react-dnd';
import { observer } from 'mobx-react';
import { Icon } from '@postman/aether';
import ContextMenu from '@postman-app-monolith/renderer/js/components/base/ContextMenu';
import InlineInput from '@postman-app-monolith/renderer/js/components/base/InlineInput';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';

import XPath from '@postman-app-monolith/renderer/js/components/base/XPaths/XPath';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import { isWorkspaceMember } from '../../../../_common/WorkspaceHelpers';
import FolderActionsDropdown from '../../../../folder/view/FolderActionsDropdown';

import {
  ACTION_TYPE_ADD_REQUEST,
  ACTION_TYPE_ADD_FOLDER,
  ACTION_TYPE_DUPLICATE,
  ACTION_TYPE_DELETE,
  ACTION_TYPE_RENAME_TOGGLE
} from '../../../CollectionActionsConstants';
import CollectionSidebarModel from '../../CollectionSidebarModel';
import ICollectionSidebarListItem from '../ICollectionSidebarListItem';

const FOLDER_ITEM_HEIGHT = 30,

  folderSource = {
    canDrag (props) {
      if (props.item._persistentState.isEditing) {
        return false;
      }

      return isWorkspaceMember() && props.collection.userCanUpdate;
    },

    beginDrag (props) {
      return {
        id: props.item.id,
        type: 'folder',
        collection: props.item.collection
      };
    },

    endDrag (props, monitor) {
      const dragItem = monitor.getItem(),
        { dropItem, position } = monitor.getDropResult() || {};

      if (_.isUndefined(dropItem)) {
        return;
      }

      props.onDragDrop(dragItem, dropItem, position);
    }
  },

  folderTarget = {
    hover (props, monitor, component) {
      const { persistentState } = props,
        dragId = monitor.getItem().id,
        dropId = props.item.id,
        dragItem = monitor.getItem();

      let isEditable = false;

      if (dragItem.type === 'request' || dragItem.type === 'folder') {
        isEditable = props.collection.userCanUpdate;
      }

      if (dragId === dropId || (!isEditable)) {
        return {};
      }

      const sourceOffset = monitor.getClientOffset(),
        targetOffset = findDOMNode(component).getBoundingClientRect(),
        threshold = FOLDER_ITEM_HEIGHT * 0.25,
        bottomThreshold = (targetOffset.top + FOLDER_ITEM_HEIGHT - threshold),
        topThreshold = (targetOffset.top + threshold);

      if (monitor.getItem().type !== 'request' && sourceOffset.y > bottomThreshold) {
        persistentState.scheduleHoverUpdate('bottom');
      } else if (monitor.getItem().type !== 'request' && sourceOffset.y < topThreshold) {
        persistentState.scheduleHoverUpdate('top');
      } else if (sourceOffset.y < bottomThreshold && sourceOffset.y > topThreshold) {
        persistentState.scheduleHoverUpdate('on');
      } else {
        persistentState.scheduleHoverUpdate();
      }
    },

    drop (props, monitor, component) {
      const dragId = monitor.getItem().id,
        dropId = props.item.id,
        dragItem = monitor.getItem();

      let isEditable = false;

      if (dragItem.type === 'request' || dragItem.type === 'folder') {
        isEditable = props.collection.userCanUpdate;
      }

      if (dragId === dropId || (!isEditable)) {
        return {};
      }

      const sourceOffset = monitor.getClientOffset(),
        targetOffset = findDOMNode(component).getBoundingClientRect(),

        threshold = targetOffset.height * 0.25,

        bottomThreshold = (targetOffset.bottom - threshold),
        topThreshold = (targetOffset.top + threshold);

      let position;

      if (dragItem.type !== 'request' && sourceOffset.y > bottomThreshold) {
        position = 'after';
      } else if (dragItem.type !== 'request' && sourceOffset.y < topThreshold) {
        position = 'before';
      } else if (sourceOffset.y < bottomThreshold && sourceOffset.y > topThreshold) {
        position = 'on';
      }

      return {
        dropItem: {
          id: props.item.id,
          type: 'folder',
          collection: props.item.collection
        },
        position
      };
    }
  };

@ContextMenu([
  {
    label: 'Add Request',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave &&
        props.collection.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_ADD_REQUEST);
    }
  },
  {
    label: 'Add Folder',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave &&
        props.collection.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_ADD_FOLDER);
    }
  },
  {
    label: 'Rename',
    shortcut: 'rename',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave &&
        props.collection.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_RENAME_TOGGLE);
    }
  },
  {
    label: 'Duplicate',
    shortcut: 'duplicate',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave &&
        props.collection.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_DUPLICATE);
    }
  },
  {
    label: 'Delete',
    shortcut: 'delete',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave &&
        props.collection.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_DELETE);
    }
  }
], (monitor) => ({ isContextMenuOpen: monitor.isOpen }))
@DropTarget([
  'collection-sidebar-request-item',
  'collection-sidebar-folder-item'
], folderTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isDragOver: monitor.isOver({ shallow: true })
}))
@DragSource('collection-sidebar-folder-item', folderSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
@observer
export default class CollectionSidebarListItemFolder extends ICollectionSidebarListItem {
  constructor (props) {
    super(props);

    this.onItemClick = this.onItemClick.bind(this);
    this.handleItemToggle = this.handleItemToggle.bind(this);
    this.setInlineInputRef = this.setInlineInputRef.bind(this);
    this.onInlineInputSubmit = this.onInlineInputSubmit.bind(this);
    this.onInlineInputToggle = this.onInlineInputToggle.bind(this);
    this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
    this.handleActionSelect = this.handleActionSelect.bind(this);
  }

  getClasses () {
    return classnames({
      'collection-sidebar-list-item__entity': true,
      'collection-sidebar-list-item__folder': true,
      'is-drop-hovered-top': this.props.persistentState.dropHoverTop && this.props.isDragOver,
      'is-drop-hovered-bottom': this.props.persistentState.dropHoverBottom && this.props.isDragOver
    });
  }

  getHeadClasses () {
    return classnames({
      'collection-sidebar-list-item__folder__head': true,
      'is-open': this.isOpen(),
      'is-hovered': this.props.persistentState.dropdownOpen,
      'is-focused': this.props.isFocused,
      'is-dragged': this.props.isDragging,
      'is-right-above': this.props.persistentState.dropHover && this.props.isDragOver
    });
  }

  getFolderIconClasses () {
    return classnames({
      'pm-icon': true,
      'pm-icon-normal': true,
      'collection-sidebar-list-item__folder__head__icon': true,
      icon_folder: true
    });
  }

  isOpen () {
    return this.props.model.isOpen(this.props.item.id);
  }

  onItemClick () {
    if (this.props.isContextMenuOpen()) {
      return;
    }

    super.onItemClick();
  }

  render () {
    const
      {
        connectDragSource,
        connectDropTarget,
        connectDragPreview,
        item,
        model,
        persistentState
      } = this.props,
      itemDepth = item.depth,
      iconDirection = model.isOpen(item.id) ? 'down' : 'right';

    return super.render(
      this.getClasses(),
      connectDropTarget(connectDragPreview(connectDragSource(
        <div
          title={item.name}
          className={this.getHeadClasses()}
          onClick={this.onItemClick}
        >
          {
            _.times(itemDepth, (index) => (
              <div
                key={`indent-${index}`}
                className={classnames('collection-sidebar__indent',
                  {
                    'active-indent': this.showActiveIndent(index)
                  })}
              />
            ))
          }
          <Button
            type='icon'
            onClick={this.handleItemToggle}
            className='collection-sidebar-list-item__toggle-btn'
          >
            <Icon
              name={`icon-direction-${iconDirection}`}
              className='pm-icon pm-icon-normal'
            />
          </Button>
          <div className='collection-sidebar-list-item__folder__icon-wrapper'>
            <Icon name='icon-entity-folder-stroke' className={this.getFolderIconClasses()} />
          </div>
          <XPath identifier='head'>
            <div className='collection-sidebar-list-item__folder__head__meta'>
              <InlineInput
                className='collection-sidebar-list-item__entity__name collection-sidebar-list-item__folder__head__name'
                placeholder='Folder Name'
                ref={this.setInlineInputRef}
                value={item.name}
                onSubmit={this.onInlineInputSubmit}
                onToggleEdit={this.onInlineInputToggle}
              />
            </div>
          </XPath>
          <div className='collection-sidebar-list-item__folder__head__actions'>
            {
              (persistentState.isHovered || persistentState.dropdownOpen) && (
                <XPath identifier='folderOption'>
                  <div className='collection-sidebar-folder-dropdown-actions-wrapper'>
                    <FolderActionsDropdown
                      className='collection-sidebar-folder-actions-dropdown'
                      onSelect={this.handleActionSelect}
                      onToggle={this.handleDropdownToggle}
                      actions={item.actions}
                    />
                  </div>
                </XPath>
              )
            }
          </div>
        </div>
      )))
    );
  }
}


CollectionSidebarListItemFolder.defaultProps = {
  isFocused: false,
  isDragOver: false,
  isDragging: false,
  isContextMenuOpen: _.noop,
  connectDragSource: _.noop,
  connectDropTarget: _.noop,
  connectDragPreview: _.noop
};

CollectionSidebarListItemFolder.propTypes = {
  collection: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  model: PropTypes.instanceOf(CollectionSidebarModel).isRequired,

  isFocused: PropTypes.bool,

  isDragOver: PropTypes.bool,
  isDragging: PropTypes.bool,

  isContextMenuOpen: PropTypes.func,

  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  connectDragPreview: PropTypes.func
};
