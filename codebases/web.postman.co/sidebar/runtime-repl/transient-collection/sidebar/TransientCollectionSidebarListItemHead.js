import React from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';
import classnames from 'classnames';
import { Icon } from '@postman/aether';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import InlineInput from '@postman-app-monolith/renderer/js/components/base/InlineInput';
import ContextMenu from '@postman-app-monolith/renderer/js/components/base/ContextMenu';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import XPath from '@postman-app-monolith/renderer/js/components/base/XPaths/XPath';
import { decomposeUID } from '@postman-app-monolith/renderer/js/utils/uid-helper';
import CollectionActionsDropdown from '@@runtime-repl/collection/view/CollectionActionsDropdown';


import {

  // ACTION_TYPE_DUPLICATE,
  // ACTION_TYPE_DELETE,
  ACTION_TYPE_FAVORITE,
  ACTION_TYPE_ADD_REQUEST,
  ACTION_TYPE_ADD_FOLDER,
  ACTION_TYPE_RENAME_TOGGLE,
  ACTION_TYPE_DOWNLOAD
} from '@@runtime-repl/collection/CollectionActionsConstants';
import CollectionSidebarModel from '@@runtime-repl/collection/sidebar/CollectionSidebarModel';
import ICollectionSidebarListItem from '@@runtime-repl/collection/sidebar/CollectionSidebarListContainer/ICollectionSidebarListItem';

@ContextMenu([
  {
    label: 'Add Request',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave &&
        props.item.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_ADD_REQUEST);
    }
  },
  {
    label: 'Add Folder',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave &&
        props.item.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_ADD_FOLDER);
    }
  },
  {
    label: 'Rename',
    shortcut: 'rename',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave && props.item.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_RENAME_TOGGLE);
    }
  },

  // {
  //   label: 'Duplicate',
  //   shortcut: 'duplicate',
  //   isVisible () {
  //     const permissionStore = getStore('PermissionStore'),
  //       workspaceId = getStore('ActiveWorkspaceStore').id;
  //
  //     return getStore('OnlineStatusStore').userCanSave &&
  //       permissionStore.can('addCollection', 'workspace', workspaceId);
  //   },
  //   onClick (props) {
  //     props.item.handleAction(ACTION_TYPE_DUPLICATE);
  //   }
  // },

  {
    label: 'Export',
    isVisible (props) {
      const permissionStore = getStore('PermissionStore'),
        collectionModelId = decomposeUID(props.item.id).modelId,
        { userCanSave } = getStore('OnlineStatusStore');

      return userCanSave &&
        permissionStore.can('view', 'collection', collectionModelId);
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_DOWNLOAD);
    }
  }

  // {
  //   label: 'Delete',
  //   shortcut: 'delete',
  //   isVisible (props) {
  //     return getStore('OnlineStatusStore').userCanSave && props.item.userCanDelete;
  //   },
  //   onClick (props) {
  //     props.item.handleAction(ACTION_TYPE_DELETE);
  //   }
  // }
], (monitor) => ({ isContextMenuOpen: monitor.isOpen }))
@observer
export default class CollectionSidebarListItemHead extends ICollectionSidebarListItem {
  constructor (props) {
    super(props);

    this.onItemClick = this.onItemClick.bind(this);
    this.handleItemToggle = this.handleItemToggle.bind(this);
    this.setInlineInputRef = this.setInlineInputRef.bind(this);
    this.onInlineInputSubmit = this.onInlineInputSubmit.bind(this);
    this.onInlineInputToggle = this.onInlineInputToggle.bind(this);
    this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
    this.handleActionSelect = this.handleActionSelect.bind(this);
    this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
  }

  getClasses () {
    return classnames({
      'collection-sidebar-list-item__head': true
    });
  }

  getHeadClasses () {
    return classnames({
      'collection-sidebar-list-item__head__head': true,
      'is-hovered': this.props.persistentState.dropdownOpen,
      'is-focused': this.isFocused(),
      'is-favorited': this.isFavorite(),
      'is-open': this.isOpen()
    });
  }

  getActionsClasses () {
    return classnames({
      'collection-sidebar-list-item__head__actions': true,
      'is-selected': this.isExpanded()
    });
  }

  isExpanded () {
    return this.props.model.expandedItem === this.props.item.id;
  }

  isFavorite () {
    return this.props.item.isFavorite;
  }

  isOpen () {
    return this.props.model.isOpen(this.props.item.id);
  }

  isFocused () {
    return this.props.item.id === _.get(this.props.model, 'activeItem.id');
  }

  onItemClick () {
    if (this.props.isContextMenuOpen()) {
      return;
    }

    super.onItemClick();
  }


  handleToggleFavorite (e) {
    e && e.stopPropagation();

    this.props.item.handleAction(ACTION_TYPE_FAVORITE);
  }

  render () {
    const {
        item,
        persistentState
      } = this.props,

      itemDepth = item.depth,
      iconDirection = this.isOpen() ? 'down' : 'right';

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
        <XPath identifier='head'>
          <div className='collection-sidebar-list-item__head__meta'>
            <div
              className='collection-sidebar-list-item__head__name__wrapper'
              title={item.name}
            >
              <div className='collection-sidebar-list-item__head__name-icon__wrapper'>
                <InlineInput
                  className='collection-sidebar-list-item__head__name'
                  placeholder='Collection Name'
                  ref={this.setInlineInputRef}
                  value={item.name}
                  onSubmit={this.onInlineInputSubmit}
                  onToggleEdit={this.onInlineInputToggle}
                />
              </div>
            </div>
          </div>
        </XPath>
        <div className={this.getActionsClasses()}>
          <div className='collection-sidebar-list-item__head__action'>
            <XPath identifier='options'>
              <div className='collection-sidebar-dropdown-actions-wrapper'>
                {
                    (persistentState.isHovered || persistentState.dropdownOpen) && (
                      <CollectionActionsDropdown
                        className='collection-sidebar-actions-dropdown'
                        onSelect={this.handleActionSelect}
                        onToggle={this.handleDropdownToggle}
                        actions={item.actions}
                      />
                    )
                  }
              </div>
            </XPath>
          </div>
        </div>
      </div>
    );
  }
}


CollectionSidebarListItemHead.defaultProps = {
  isEditing: false,
  setEditCache: _.noop,
  isContextMenuOpen: _.noop,
  editCache: null
};

CollectionSidebarListItemHead.propTypes = {
  item: PropTypes.object.isRequired,
  model: PropTypes.instanceOf(CollectionSidebarModel).isRequired,
  editCache: PropTypes.object,
  isEditing: PropTypes.bool,
  setEditCache: PropTypes.func,
  isContextMenuOpen: PropTypes.func
};
