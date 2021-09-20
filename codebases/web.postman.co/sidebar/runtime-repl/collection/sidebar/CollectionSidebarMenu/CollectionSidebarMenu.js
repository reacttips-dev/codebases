import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import NavigationService from '@postman-app-monolith/renderer/js/services/NavigationService';
import SidebarListActions from '@postman-app-monolith/renderer/js/containers/apps/requester/sidebar/SidebarListActions';
import { DropdownMenu, MenuItem } from '@postman-app-monolith/renderer/js/components/base/Dropdowns';
import { canJoinWorkspace, isLoggedIn, isWorkspaceMember } from '../../../_common/WorkspaceHelpers';
import CollectionSidebarModel from '../CollectionSidebarModel';
import { createCollection } from '../../_api/CollectionInterface';
import {
  DISABLED_TOOLTIP_IS_OFFLINE
} from '../../../_common/DisabledTooltipConstants';

const NEW_COLLECTION_CLICK_THROTTLE_TIMEOUT = 1000; // 1 sec

@observer
export default class CollectionSidebarMenu extends Component {
  constructor (props) {
    super(props);

    this.state = { isCollectionCreateEnabled: true };

    this.handleNewCollectionClick = this.handleNewCollectionClick.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleNewCollectionClick () {
    // Disable the create collection button for the defined timeout to prevent
    // a lot of collection creates in a short ammount of time
    this.setState({ isCollectionCreateEnabled: false });

    // Enable after the timeout has elapsed
    //
    // Cancel any pending timeout before setting a new timeout
    this.timeoutId && clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(
      () => { this.setState({ isCollectionCreateEnabled: true }); },
      NEW_COLLECTION_CLICK_THROTTLE_TIMEOUT
    );

    createCollection();
  }

  handleTrashOpen () {
    if (!isWorkspaceMember()) {
      if (canJoinWorkspace()) {
        return pm.mediator.trigger('openUnjoinedWorkspaceModal');
      }

      if (!isLoggedIn()) {
        return pm.mediator.trigger('showSignInModal', {
          type: 'trash',
          origin: 'open_trash'
        });
      }
    }

    NavigationService.transitionTo('trash');
  }

  handleSearchChange (query) {
    this.props.model && this.props.model.setSearchQuery(query);
  }

  render () {
    const permissionStore = getStore('PermissionStore'),
      workspaceId = getStore('ActiveWorkspaceStore').id,
      canAddCollection = permissionStore.can('addCollection', 'workspace', workspaceId),
      { userCanSave } = getStore('OnlineStatusStore'),
      isCollectionCreateEnabled = userCanSave && canAddCollection && this.state.isCollectionCreateEnabled,
      isOffline = !getStore('SyncStatusStore').isSocketConnected,
      disableTrash = (isLoggedIn() && !(isWorkspaceMember() || canJoinWorkspace())) || isOffline;

    let tooltipMessage = disableTrash ? 'Only members of this workspace can recover deleted collections' : 'Recover your deleted collections';

    tooltipMessage = isOffline ? 'You can perform this action once you\'re back online' : tooltipMessage;

    return (
      <div className='collection-sidebar-menu'>
        <SidebarListActions
          createNewConfig={{
            tooltip: userCanSave ? // eslint-disable-line no-nested-ternary
              (canAddCollection ?
                'Create new Collection' :
                'You don\'t have permission to create a Collection in this workspace.'
              ) :
              DISABLED_TOOLTIP_IS_OFFLINE,
            disabled: !isCollectionCreateEnabled,
            onCreate: this.handleNewCollectionClick,
            xPathIdentifier: 'addCollection'
          }}
          onSearch={this.handleSearchChange}
          searchQuery={_.get(this.props.model, 'searchQuery')}
          moreActions={(
            <DropdownMenu>
              <MenuItem>
                <Button
                  onClick={this.handleTrashOpen}
                  tooltip={pm.isScratchpad ? 'You need to be in a workspace to open trash' : tooltipMessage}
                  disabled={pm.isScratchpad || disableTrash}
                  type='text'
                  className='collection-sidebar-menu__actions-trash'
                >
                  Open Trash
                </Button>
              </MenuItem>
            </DropdownMenu>
          )}
        />
      </div>
    );
  }
}

CollectionSidebarMenu.propTypes = {
  model: PropTypes.instanceOf(CollectionSidebarModel).isRequired
};
