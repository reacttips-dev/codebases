import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';
import { Icon } from '@postman/aether';
import ContextMenu from '@postman-app-monolith/renderer/js/components/base/ContextMenu';
import InlineInput from '@postman-app-monolith/renderer/js/components/base/InlineInput';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';

import XPath from '@postman-app-monolith/renderer/js/components/base/XPaths/XPath';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import FolderActionsDropdown from '@@runtime-repl/folder/view/FolderActionsDropdown';

import {
  ACTION_TYPE_ADD_REQUEST,
  ACTION_TYPE_ADD_FOLDER,
  ACTION_TYPE_DUPLICATE,
  ACTION_TYPE_DELETE,
  ACTION_TYPE_RENAME_TOGGLE
} from '@@runtime-repl/collection/CollectionActionsConstants';
import CollectionSidebarModel from '@@runtime-repl/collection/sidebar/CollectionSidebarModel';
import ICollectionSidebarListItem from '@@runtime-repl/collection/sidebar/CollectionSidebarListContainer/ICollectionSidebarListItem';

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
      'collection-sidebar-list-item__folder': true
    });
  }

  getHeadClasses () {
    return classnames({
      'collection-sidebar-list-item__folder__head': true,
      'is-open': this.isOpen(),
      'is-hovered': this.props.persistentState.dropdownOpen,
      'is-focused': this.props.isFocused,
      'is-dragged': this.props.isDragging
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
        item,
        model,
        persistentState
      } = this.props,
      itemDepth = item.depth,
      iconDirection = model.isOpen(item.id) ? 'down' : 'right';

    return super.render(
      this.getClasses(),
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
    );
  }
}


CollectionSidebarListItemFolder.defaultProps = {
  isFocused: false,
  isContextMenuOpen: _.noop
};

CollectionSidebarListItemFolder.propTypes = {
  collection: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  model: PropTypes.instanceOf(CollectionSidebarModel).isRequired,

  isFocused: PropTypes.bool,

  isContextMenuOpen: PropTypes.func
};
