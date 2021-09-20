import React from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

import { Icon } from '@postman/aether';
import { observer } from 'mobx-react';

import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import ContextMenu from '@postman-app-monolith/renderer/js/components/base/ContextMenu';
import InlineInput from '@postman-app-monolith/renderer/js/components/base/InlineInput';
import XPath from '@postman-app-monolith/renderer/js/components/base/XPaths/XPath';
import {
  ACTION_TYPE_DUPLICATE,
  ACTION_TYPE_DELETE,
  ACTION_TYPE_RENAME_TOGGLE
} from '../../../CollectionActionsConstants';
import CollectionSidebarModel from '../../CollectionSidebarModel';
import { isWorkspaceMember } from '../../../../_common/WorkspaceHelpers';
import ICollectionSidebarListItem from '../ICollectionSidebarListItem';
import ExampleActionsDropdown from '../../../../example/view/ExampleActionsDropdown';

const getMiddleY = (component) => {
    const elementRect = findDOMNode(component).getBoundingClientRect();

    return elementRect.top + (elementRect.height / 2);
  },

  itemSource = {
    canDrag (props) {
      if (props.item._persistentState.isEditing) {
        return false;
      }

      return isWorkspaceMember() && props.collection.userCanUpdate;
    },

    beginDrag (props) {
      return {
        id: props.item.id,
        type: 'response',
        request: props.item.request
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

  itemTarget = {
    hover (props, monitor, component) {
      const { persistentState } = props,
        dragId = monitor.getItem().id,
        dropId = props.item.id,
        dragItem = monitor.getItem(),

        isEditable = (dragItem.type === 'response') && props.collection.userCanUpdate;

      if (dragId === dropId || (!isEditable)) {
        return {};
      }

      if (!props.isFirstChild) {
        persistentState.scheduleHoverUpdate('bottom');

        return;
      }

      // Will only be used for first response in its parent
      if (monitor.getClientOffset().y > getMiddleY(component)) {
        persistentState.scheduleHoverUpdate('bottom');
      } else {
        persistentState.scheduleHoverUpdate('top');
      }
    },

    drop (props, monitor, component) {
      const dragId = monitor.getItem().id,
        dropId = props.item.id,
        dragItem = monitor.getItem(),

        isEditable = (dragItem.type === 'response') && props.collection.userCanUpdate;

      if (dragId === dropId || (!isEditable)) {
        return {};
      }

      let position = 'after';

      if (props.isFirstChild) {
        position = monitor.getClientOffset().y > getMiddleY(component) ? 'after' : 'before';
      }

      return {
        dropItem: {
          id: props.item.id,
          type: 'response',
          request: props.item.request
        },
        position
      };
    }
  };
@ContextMenu([
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
@DropTarget('collection-sidebar-response-item', itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isDragOver: monitor.isOver({ shallow: true })
}))
@DragSource('collection-sidebar-response-item', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))

@observer
export default class CollectionSidebarListItemExample extends ICollectionSidebarListItem {
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
      'collection-sidebar-list-item__request': true,
      'is-active': this.props.selected
    });
  }

  getHeadClasses () {
    return classnames({
      'collection-sidebar-list-item__request__head': true,
      'is-drop-hovered-top': this.props.persistentState.dropHoverTop && this.props.isDragOver,
      'is-drop-hovered-bottom': (this.props.persistentState.dropHover || this.props.persistentState.dropHoverBottom) &&
        this.props.isDragOver,
      'is-hovered': this.props.persistentState.dropdownOpen,
      'is-selected': this.props.selected,
      'is-focused': this.props.isFocused,
      'is-dragged': this.props.isDragging
    });
  }

  onItemClick () {
    if (this.props.isContextMenuOpen()) {
      return;
    }

    super.onItemClick();
  }

  render () {
    const {
        connectDragSource,
        connectDropTarget,
        connectDragPreview,
        item,
        persistentState
      } = this.props,
      itemDepth = item.depth;

    return super.render(
      this.getClasses(),
      connectDropTarget(connectDragPreview(connectDragSource(
        <div
          className={this.getHeadClasses()}
          title={item.name}
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
          <div className='collection-sidebar-list-item__example-icon__wrapper'>
            <Icon
              name='icon-entity-example-stroke'
              color='content-color-secondary'
              className='collection-sidebar-list-item__example-icon'
            />
          </div>
          <XPath identifier='head'>
            <div className='collection-sidebar-list-item__request__meta'>
              <InlineInput
                className='collection-sidebar-list-item__entity__name collection-sidebar-list-item__request__name'
                placeholder='Example Name'
                ref={this.setInlineInputRef}
                value={item.name}
                onSubmit={this.onInlineInputSubmit}
                onToggleEdit={this.onInlineInputToggle}
              />
            </div>
          </XPath>
          <div className='collection-sidebar-list-item__request__actions'>
            {
                (persistentState.isHovered || persistentState.dropdownOpen) && (
                  <XPath identifier='responseOption'>
                    <div className='collection-sidebar-request-dropdown-actions-wrapper'>
                      <ExampleActionsDropdown
                        className='collection-sidebar-request-actions-dropdown'
                        actions={item.actions}
                        onSelect={this.handleActionSelect}
                        onToggle={this.handleDropdownToggle}
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

CollectionSidebarListItemExample.defaultProps = {
  isFocused: false,
  isDragOver: false,
  isDragging: false,
  selected: false,
  isContextMenuOpen: _.noop,

  connectDragSource: _.noop,
  connectDropTarget: _.noop,
  connectDragPreview: _.noop
};

CollectionSidebarListItemExample.propTypes = {
  collection: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  model: PropTypes.instanceOf(CollectionSidebarModel).isRequired,

  activeIndent: PropTypes.object.isRequired,

  isFocused: PropTypes.bool,

  isDragOver: PropTypes.bool,
  isDragging: PropTypes.bool,
  selected: PropTypes.bool,

  isContextMenuOpen: PropTypes.func,

  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  connectDragPreview: PropTypes.func
};
