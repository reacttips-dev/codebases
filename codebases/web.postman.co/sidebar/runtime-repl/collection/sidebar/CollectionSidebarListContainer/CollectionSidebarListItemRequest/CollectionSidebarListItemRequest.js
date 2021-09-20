import React from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

import { Icon } from '@postman/aether';
import { observer } from 'mobx-react';
import ContextMenu from '@postman-app-monolith/renderer/js/components/base/ContextMenu';
import InlineInput from '@postman-app-monolith/renderer/js/components/base/InlineInput';
import RequestIcon from '@@runtime-repl/request-http/RequestIcon';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';

import XPath from '@postman-app-monolith/renderer/js/components/base/XPaths/XPath';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import RequestActionsDropdown from '../../../../request-http/view/RequestActionsDropdown';
import {
  ACTION_TYPE_OPEN,
  ACTION_TYPE_DUPLICATE,
  ACTION_TYPE_DELETE,
  ACTION_TYPE_RENAME_TOGGLE
} from '../../../CollectionActionsConstants';
import CollectionSidebarModel from '../../CollectionSidebarModel';
import { isWorkspaceMember } from '../../../../_common/WorkspaceHelpers';
import ICollectionSidebarListItem from '../ICollectionSidebarListItem';

const REQUEST_ITEM_HEIGHT = 30,

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
        type: 'request',
        folder: props.item.folder,
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

  itemTarget = {
    hover (props, monitor, component) {
      const { persistentState } = props,
        dragId = monitor.getItem().id,
        dropId = props.item.id,
        dragItem = monitor.getItem();

      let isEditable = false;

      if (dragItem.type === 'response' || dragItem.type === 'request') {
        isEditable = props.collection.userCanUpdate;
      }

      if (dragId === dropId || (!isEditable)) {
        return {};
      }

      const sourceOffset = monitor.getClientOffset(),
        targetOffset = findDOMNode(component).getBoundingClientRect(),
        threshold = REQUEST_ITEM_HEIGHT * 0.25,
        bottomThreshold = (targetOffset.top + REQUEST_ITEM_HEIGHT - threshold),
        topThreshold = (targetOffset.top + threshold);

      if (monitor.getItem().type !== 'response' && sourceOffset.y > bottomThreshold) {
        persistentState.scheduleHoverUpdate('bottom');
      } else if (monitor.getItem().type !== 'response' && sourceOffset.y < topThreshold) {
        persistentState.scheduleHoverUpdate('top');
      } else if (monitor.getItem().type !== 'request' && sourceOffset.y < bottomThreshold && sourceOffset.y > topThreshold) {
        persistentState.scheduleHoverUpdate('on');
      }
    },

    drop (props, monitor, component) {
      const dragId = monitor.getItem().id,
        dropId = props.item.id,
        dragItem = monitor.getItem();

      let isEditable = false;

      if (dragItem.type === 'request' || dragItem.type === 'response') {
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

      let position = 'after';

      if (monitor.getItem().type !== 'response' && sourceOffset.y > bottomThreshold) {
        position = 'after';
      } else if (monitor.getItem().type !== 'response' && sourceOffset.y < topThreshold) {
        position = 'before';
      } else if (monitor.getItem().type === 'response') {
        position = 'on';
      }

      return {
        dropItem: {
          id: props.item.id,
          type: 'request',
          collection: props.item.collection
        },
        position
      };
    }
  };

@ContextMenu([
  {
    label: 'Open in Tab',
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_OPEN, {}, { preview: false });
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
  'collection-sidebar-response-item'
], itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isDragOver: monitor.isOver({ shallow: true })
}))
@DragSource('collection-sidebar-request-item', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
@observer
export default class CollectionSidebarListItemRequest extends ICollectionSidebarListItem {
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
      'is-open': this.isOpen(),
      'is-hovered': this.props.persistentState.dropdownOpen,
      'is-selected': this.props.selected,
      'is-focused': this.props.isFocused,
      'is-dragged': this.props.isDragging,
      'is-drop-hovered-top': this.props.persistentState.dropHoverTop && this.props.isDragOver,
      'is-drop-hovered-bottom': this.props.persistentState.dropHoverBottom && this.props.isDragOver,
      'is-right-above': this.props.persistentState.dropHover && this.props.isDragOver
    });
  }

  isOpen () {
    return this.props.model.isOpen(this.props.item.id);
  }

  onItemClick (e) {
    if (this.props.isContextMenuOpen()) {
      return;
    }

    super.onItemClick(e);
  }

  render () {
    const {
        connectDragSource,
        connectDropTarget,
        connectDragPreview,
        model,
        item,
        persistentState
      } = this.props,
      itemDepth = item.depth,
      hasExamples = Boolean(item.responses.size),
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
          {
            hasExamples ?
              (
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
              ) :
              (<div className='collection-sidebar-list__request-spacing' />)
          }
          <RequestIcon method={item.method || 'GET'} />
          <XPath identifier='head'>
            <div className='collection-sidebar-list-item__request__meta'>
              <InlineInput
                className='collection-sidebar-list-item__entity__name collection-sidebar-list-item__request__name'
                placeholder='Request Name'
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
                <XPath identifier='requestOption'>
                  <div className='collection-sidebar-request-dropdown-actions-wrapper'>
                    <RequestActionsDropdown
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


CollectionSidebarListItemRequest.defaultProps = {
  isFocused: false,
  isDragOver: false,
  isDragging: false,
  selected: false,
  isContextMenuOpen: _.noop,
  connectDragSource: _.noop,
  connectDropTarget: _.noop,
  connectDragPreview: _.noop
};

CollectionSidebarListItemRequest.propTypes = {
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
