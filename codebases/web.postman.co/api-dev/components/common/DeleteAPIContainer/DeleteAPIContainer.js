import React, { Component } from 'react';
import { observer } from 'mobx-react';

import DeleteModal from '../DeleteModal/DeleteModal';
import { getStore } from '../../../../js/stores/get-store';
import { Icon } from '@postman/aether';

@observer
export default class DeleteAPIContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isDeleting: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('showAPIDeleteModal', this.handleOpen);
    pm.mediator.on('closeAPIDeleteModal', this.handleClose);
  }

  componentWillUnmount () {
    pm.mediator.off('showAPIDeleteModal', this.handleOpen);
    pm.mediator.off('closeAPIDeleteModal', this.handleClose);
  }

  handleOpen (apiId) {
    this.apiId = apiId;
    this.setState({ openDeleteModal: true });
  }

  handleClose () {
    this.setState({ openDeleteModal: false });
  }

  deleteItem () {
    if (!this.apiId) {
      return;
    }

    this.setState({ isDeleting: true });

    let apiSidebarStore = getStore('APISidebarStore'),
      apiListStore = getStore('APIListStore'),
      apiName = _.get(_.find((apiSidebarStore.sortedAPIs || []), (api) => api.id === this.apiId), 'name');

      return apiListStore.delete(this.apiId, apiName)
      .then(() => {

        // Switch focus if selected item got deleted
        if (this.apiId === apiSidebarStore.activeItem) {
          apiSidebarStore.focusPrev({ openEditor: false });
        }

        this.setState({ isDeleting: false, openDeleteModal: false });
      });
  }

  toggleDeleteModal () {
    this.setState((prevState) => ({ openDeleteModal: !prevState.openDeleteModal }));
  }

  renderModalContent () {
    const content = `This will delete the API from all workspaces – no one on your team will be able to access it.
      \nThis won\'t affect the mock servers, documentation, environments, test suites and monitors linked to this API.`;

    return (<div className='delete-api-container-wrapper'>
      <div className='delete-api-container-wrapper__content'>
        {content}
      </div>
      <div className='delete-api-container-wrapper__alert'>
        <div className='delete-api-container-wrapper__alert__icon'>
          <Icon
            name='icon-state-info-stroke'
            className='pm-icon pm-icon-normal'
          />
        </div>
        <div className='delete-api-container-wrapper__alert__text'>
          This API cannot be recovered once deleted.
        </div>
      </div>
    </div>);
  }

  render () {
    return (
      <DeleteModal
        headerTitle='Delete API?'
        content={this.renderModalContent()}
        width={'480px'}
        btnContent='Delete'
        isOpen={this.state.openDeleteModal}
        isLoading={this.state.isDeleting}
        onSubmit={this.deleteItem}
        onRequestClose={this.toggleDeleteModal}
      />
    );
  }
}
