import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Xpath from '@postman-app-monolith/renderer/js/components/base/XPaths/XPath';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import CollectionSidebarModel from './CollectionSidebarModel';

import SidebarLoadingState from '../../../appsdk/sidebar/SidebarLoadingState/SidebarLoadingState';
import CollectionSidebarListContainer from './CollectionSidebarListContainer/CollectionSidebarListContainer';
import CollectionSidebarMenu from './CollectionSidebarMenu/CollectionSidebarMenu';


import {
  READY,
  ERROR,
  LOADING
} from '../../_common/WorkbenchStatusConstants';
import SidebarErrorState from '../../_common/components/SidebarErrorState/SidebarErrorState';
import { SidebarOfflineState } from '../../_common/components/molecule';

@observer
export default class CollectionSidebarView extends Component {
  constructor (props) {
    super(props);
    this.focus = this.focus.bind(this);
    this.focusCollection = this.focusCollection.bind(this);
    this.focusNext = this.focusNext.bind(this);

    this.listRef = null;
  }

  getView () {
    const { model, status } = this.props.controller || {},

      // The API isConsistentlyOffline is only supposed to be used to show the offline state view to the user
      // when he has been consistently offline.
      // For disabling the actions on lack of connectivity, please rely on the socket connected state itself for now.
      // Otherwise, there is a chance of data loss if we let the user perform actions
      // when we are attempting a connection.
      { isConsistentlyOffline } = getStore('SyncStatusStore');

    if (!pm.isScratchpad && isConsistentlyOffline && status === LOADING) {
      return <SidebarOfflineState />;
    }

    if (status === ERROR) {
      return (
        <SidebarErrorState
          title='Couldn’t load collections'
          description='Try refreshing this page or check back in some time'
        />
      );
    }

    if (status === READY) {
      return (
        <Xpath identifier='collection'>
          <CollectionSidebarListContainer
            ref={(ref) => { this.listRef = ref; }}
            model={model}
          />
        </Xpath>
      );
    }

    // Keeping sidebar in loading state if the `status` does not meet any of the above condition
    return <SidebarLoadingState hasIcon />;
  }

  focus () {
    _.invoke(this, 'listRef.__wrappedInstance.focus');
  }

  focusCollection (collectionId, CollectionSidebarContainer) {
    _.invoke(this, 'listRef.__wrappedInstance.focusCollection', collectionId, CollectionSidebarContainer);
  }

  focusNext () {
    const collection = _.head(_.get(this.props.controller, 'model.collections'));

    _.invoke(this, 'listRef.handleSelect', collection.id);
  }

  render () {
    const { model } = this.props.controller || {};

    return (
      <div className='collection-sidebar'>
        <div className='collection-sidebar-wrapper'>
          <CollectionSidebarMenu
            model={model}
          />
          {this.getView()}
        </div>
      </div>
    );
  }
}

CollectionSidebarView.propTypes = {
  controller: PropTypes.shape({
    model: PropTypes.instanceOf(CollectionSidebarModel),
    status: PropTypes.oneOf([ERROR, READY, LOADING])
  }).isRequired
};
