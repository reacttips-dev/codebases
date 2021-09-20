import React from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';
import classnames from 'classnames';
import { Icon } from '@postman/aether';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import InlineInput from '@postman-app-monolith/renderer/js/components/base/InlineInput';
import CollectionMetaIcons from '@@runtime-repl/collection/CollectionMetaIcons';
import ContextMenu from '@postman-app-monolith/renderer/js/components/base/ContextMenu';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import XPath from '@postman-app-monolith/renderer/js/components/base/XPaths/XPath';
import { decomposeUID } from '@postman-app-monolith/renderer/js/utils/uid-helper';
import CollectionActionsDropdown from '../../../view/CollectionActionsDropdown';
import { isWorkspaceMember } from '../../../../_common/WorkspaceHelpers';

import {
  DISABLED_TOOLTIP_IS_OFFLINE
} from '../../../../_common/DisabledTooltipConstants';
import {
  ACTION_TYPE_DUPLICATE,
  ACTION_TYPE_FORK,
  ACTION_TYPE_MERGE,
  ACTION_TYPE_PULL_REQUEST,
  ACTION_TYPE_DELETE,
  ACTION_TYPE_FAVORITE,
  ACTION_TYPE_ADD_REQUEST,
  ACTION_TYPE_ADD_FOLDER,
  ACTION_TYPE_RENAME_TOGGLE,
  ACTION_MANAGE_ROLES,
  ACTION_REMOVE_FROM_WORKSPACE,
  ACTION_TYPE_ADD_MONITOR,
  ACTION_TYPE_ADD_MOCK,
  ACTION_TYPE_DOWNLOAD
} from '../../../CollectionActionsConstants';
import CollectionSidebarModel from '../../CollectionSidebarModel';
import ICollectionSidebarListItem from '../ICollectionSidebarListItem';

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
    label: 'Monitor Collection',
    isVisible (props) {
      const permissionStore = getStore('PermissionStore'),
        workspaceId = getStore('ActiveWorkspaceStore').id;

      return getStore('OnlineStatusStore').userCanSaveAndSync &&
        props.item.userCanCreateMonitor &&
        permissionStore.can('addMonitor', 'workspace', workspaceId);
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_ADD_MONITOR);
    }
  },
  {
    label: 'Mock Collection',
    isVisible (props) {
      const permissionStore = getStore('PermissionStore'),
        workspaceId = getStore('ActiveWorkspaceStore').id;

      return getStore('OnlineStatusStore').userCanSaveAndSync &&
        props.item.userCanCreateMock &&
        permissionStore.can('addMock', 'workspace', workspaceId);
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_ADD_MOCK);
    }
  },
  {
    label: 'Create a fork',
    isVisible () {
      return getStore('OnlineStatusStore').userCanSaveAndSync;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_FORK);
    }
  },
  {
    label: 'Merge changes',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSaveAndSync && props.item.isForked;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_MERGE);
    }
  },
  {
    label: 'Create Pull Request',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSaveAndSync && props.item.isForked;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_PULL_REQUEST);
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
  {
    label: 'Duplicate',
    shortcut: 'duplicate',
    isVisible () {
      const permissionStore = getStore('PermissionStore'),
        workspaceId = getStore('ActiveWorkspaceStore').id;

      return getStore('OnlineStatusStore').userCanSave &&
        permissionStore.can('addCollection', 'workspace', workspaceId);
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_DUPLICATE);
    }
  },
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
  },
  {
    label: 'Manage Roles',
    isVisible () {
      const currentUserStore = getStore('CurrentUserStore');

      return getStore('OnlineStatusStore').userCanSave && Boolean(currentUserStore.team);
    },
    onClick (props) {
      props.item.handleAction(ACTION_MANAGE_ROLES);
    }
  },
  {
    label: 'Remove from workspace',
    isVisible () {
      const permissionStore = getStore('PermissionStore'),
        workspaceId = getStore('ActiveWorkspaceStore').id,
        isOnline = getStore('SyncStatusStore').isSocketConnected;

      return getStore('OnlineStatusStore').userCanSaveAndSync &&
        permissionStore.can('removeCollection', 'workspace', workspaceId) && isOnline;
    },
    onClick (props) {
      props.item.handleAction(ACTION_REMOVE_FROM_WORKSPACE);
    }
  },
  {
    label: 'Delete',
    shortcut: 'delete',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave && props.item.userCanDelete;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_DELETE);
    }
  }
], (monitor) => ({ isContextMenuOpen: monitor.isOpen }))
@DropTarget([
  'collection-sidebar-request-item',
  'collection-sidebar-folder-item'
],
{
  canDrop (props) {
    return props.item.userCanUpdate;
  },

  drop (props, monitor) {
    const dragId = monitor.getItem().id,
      dropId = props.item.id,
      dragItem = monitor.getItem();

    let isEditable = false;

    switch (dragItem.type) {
      case 'folder':

      case 'request':
        if (props.item.userCanUpdate) {
          isEditable = true;
        }

      default:
    }

    if (dragId === dropId || (!isEditable)) {
      return {};
    }

    return {
      dropItem: {
        id: dropId,
        type: 'collection'
      },
      position: 'on'
    };
  }
},
(connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isDragOver: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop()
}))
@DragSource(
  'collection-sidebar-collection-item',
  {
    canDrag (props) {
      if (props.item._persistentState.isEditing) {
        return false;
      }

      return isWorkspaceMember();
    },

    beginDrag (props) {
      return {
        id: props.item.id,
        type: 'collection'
      };
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })
)
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
      'is-drop-hovered': this.props.item.userCanUpdate && this.props.isDragOver,
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
        connectDragSource,
        connectDropTarget,
        connectDragPreview,

        item,
        persistentState
      } = this.props,

      itemDepth = item.depth,
      isFavoriteDisabled = !getStore('OnlineStatusStore').userCanSave,
      iconDirection = this.isOpen() ? 'down' : 'right';

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
                  <CollectionMetaIcons
                    collection={item}
                    userCanUpdate={item.userCanUpdate}
                    showForkLabel
                  />
                </div>
                {(persistentState.isHovered || this.isFavorite()) && (
                  <Button
                    disabled={isFavoriteDisabled}
                    tooltip={isFavoriteDisabled && DISABLED_TOOLTIP_IS_OFFLINE}
                    active={this.isFavorite()}
                    className='collection-sidebar-list-item__head__favorite-button'
                    onClick={this.handleToggleFavorite}
                  >
                    {
                      this.isFavorite() ? (
                        <Icon
                          name='icon-action-favorite-fill'
                          className='collection-sidebar-list-item__head__favorite-button-icon pm-icon pm-icon-secondary'
                        />
                      ) : (
                        <Icon
                          name='icon-action-favorite-stroke'
                          className='pm-icon pm-icon-normal collection-sidebar-list-item__head__favorite-button-icon'
                        />
                      )
                    }
                  </Button>
                )}
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
      )))
    );
  }
}


CollectionSidebarListItemHead.defaultProps = {
  isEditing: false,
  isDragOver: false,
  setEditCache: _.noop,
  isContextMenuOpen: _.noop,
  editCache: null,
  connectDragSource: _.noop,
  connectDropTarget: _.noop,
  connectDragPreview: _.noop,
  canDrop: false
};

CollectionSidebarListItemHead.propTypes = {
  item: PropTypes.object.isRequired,
  model: PropTypes.instanceOf(CollectionSidebarModel).isRequired,
  editCache: PropTypes.object,
  isEditing: PropTypes.bool,
  isDragOver: PropTypes.bool,
  setEditCache: PropTypes.func,
  isContextMenuOpen: PropTypes.func,

  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  connectDragPreview: PropTypes.func,
  canDrop: PropTypes.bool
};
