import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { IllustrationNoCollection } from '@postman/aether';

import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import { createCollection } from '../../../_api/CollectionInterface';
import SidebarEmptyState from '../../../../../appsdk/sidebar/SidebarEmptyState/SidebarEmptyState';
import SidebarNoResultsFound from '../../../../../appsdk/sidebar/SidebarNoResultsFound/SidebarNoResultsFound';

@observer
export default class CollectionSidebarListEmpty extends Component {
  constructor (props) {
    super(props);

    this.handleCreateCollection = this.handleCreateCollection.bind(this);
  }

  getTooltipText (canAddCollection, isLoggedIn) {
    if (!isLoggedIn && window.SDK_PLATFORM === 'browser') {
      return 'Sign in to create a Collection';
    }

    if (!canAddCollection) {
      return 'You do not have permissions to perform this action.';
    }
  }

  handleCreateCollection () {
    this.props.onClose && this.props.onClose();

    createCollection();
  }

  isCollectionAddEnabled (canAddCollection, isLoggedIn) {
    if (window.SDK_PLATFORM === 'browser') {
      return (isLoggedIn && canAddCollection);
    }

    return canAddCollection;
  }

  render () {
    const permissionStore = getStore('PermissionStore'),
      workspaceId = getStore('ActiveWorkspaceStore').id,
      canAddCollection = permissionStore.can('addCollection', 'workspace', workspaceId),
      { isLoggedIn } = getStore('CurrentUserStore');

    if (this.props.query) {
      return (
        <SidebarNoResultsFound searchQuery={this.props.query} illustration={<IllustrationNoCollection />} />
      );
    }

    return (
      <SidebarEmptyState
        illustration={<IllustrationNoCollection />}
        title='You don’t have any collections'
        message='Collections let you group related requests, making them easier to access and run.'
        action={{
          label: 'Create Collection',
          handler: this.handleCreateCollection,
          tooltip: this.getTooltipText(canAddCollection, isLoggedIn)
        }}
        hasPermissions={this.isCollectionAddEnabled(canAddCollection, isLoggedIn)}
      />
    );
  }
}

CollectionSidebarListEmpty.defaultProps = {
  query: null,
  onClose: null
};

CollectionSidebarListEmpty.propTypes = {
  query: PropTypes.string,
  onClose: PropTypes.func
};
