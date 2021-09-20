import React, { Component } from 'react';
import { Icon } from '@postman/aether';
import { Input } from '../../../../js/components/base/Inputs';
import util from '../../../../js/utils/util';
import { observer } from 'mobx-react';

import { getStore } from '../../../../js/stores/get-store';
import { VISIBILITY } from '../../../../js/constants/WorkspaceVisibilityConstants';
import {
  Modal,
  ModalContent,
  ModalHeader
} from '../../../../js/components/base/Modals';
import WorkspaceVisibilitySelector from './WorkspaceVisibilitySelector';
import {
  bindTrackedStateToComponent,
  TrackedState
} from '../../../../js/modules/tracked-state/TrackedState';
import { Button } from '../../../../js/components/base/Buttons';
import LoadingIndicator from '../../../../js/components/base/LoadingIndicator';
import dispatchUserAction from '../../../../js/modules/pipelines/user-action';

const defaultObjectForStateTracking = {
    name: '',
    visibilityStatus: VISIBILITY.public,
    teamRole: ''
  },
  stateTrackingProperties = Object.keys(defaultObjectForStateTracking);

@observer
export default class CreateNewPublicWorkspaceModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isTooltipVisible: false,
      loading: false,
      showInviteDeniedError: false,
      isOpen: false,
      nameError: false,
      disableCreateWorkspace: true
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);

    this.trackedState = new TrackedState(defaultObjectForStateTracking);

    bindTrackedStateToComponent(this.trackedState, this);
  }

  componentDidMount () {
    pm.mediator.on('openCreateNewPublicWorkspaceModal', this.handleOpen);
  }

  handleOpen (data) {
    this.handleCreatedPublicWorkspace = data.handleCreatedPublicWorkspace;

    this.setState({ isOpen: true }, () => {
      // Focus on the Workspace name input to close the opened dropdown
      _.invoke(this, 'nameInputRef.focus');
    });
  }

  handleClose (workspace) {
    this.setState({ isOpen: false, nameError: false }, () => {
      this.handleCreatedPublicWorkspace(workspace);
    });
  }

  handleChange (field, value) {
    if (stateTrackingProperties.includes(field)) {
      this.trackedState.set({
        [field]: value
      });
      if (field === 'name') {
        this.trackedState.get('name').length === 0
          ? this.setState({ disableCreateWorkspace: true })
          : this.setState({ disableCreateWorkspace: false });
      }
    } else {
      this.setState({ [field]: value });
    }
  }

  handleCreate () {
    const currentUser = getStore('CurrentUserStore'),
      teamId = currentUser.teamId;

    let workspace = {
      id: util.guid(),
      name: this.trackedState.get('name'),
      type: (teamId) && 'team',
      visibilityStatus: VISIBILITY.public,
      roles: this.trackedState.get('teamRole')
    };

    let workspaceAddEvent = {
      name: 'create',
      namespace: 'workspace',
      data: workspace
    };

    this.setState({ loading: true });

    dispatchUserAction(workspaceAddEvent)
      .then((response) => {
        if (!_.isEmpty(_.get(response, 'error'))) {
          pm.logger.error(
            'Error in creating a public workspace',
            response.error
          );
          return;
        } else {
          this.handleChange('name', '');
          this.handleClose(workspace);
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (
          err.toString().includes('Error: Workspace slug already registered.')
        ) {
          this.setState({ nameError: true });
          this.handleChange('name', '');
        } else {
          this.setState({ nameError: false });
          pm.toasts.error(
            _.get(err, 'error', 'Error in creating a public workspace')
          );
          pm.logger.error('Error in creating a public workspace', err);
        }
      });
  }

  render () {
    return (
      <Modal
        className='create-new-public-workspace-modal'
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        customStyles={{
          maxHeight: '150vh',
          width: '600px'
        }}
      >
        <ModalHeader>Create Workspace</ModalHeader>
        <ModalContent className='create-new-public-workspace-modal__content'>
          <div className='create-new-public-workspace-modal__input-group'>
            <div className='create-new-public-workspace-modal__input-group__label'>
              Name
            </div>
            <div className='create-new-public-workspace-modal__input-group__input'>
              <Input
                inputStyle='box'
                value={this.trackedState.get('name')}
                type='text'
                placeholder={'Enter workspace name'}
                onChange={this.handleChange.bind(this, 'name')}
                ref={(input) => {
                  this.nameInputRef = input;
                }}
                onSubmit={this.props.onCreate}
                error={this.state.nameError}
              />
            </div>
            {this.state.nameError && (
              <div className='create-new-public-workspace-modal__input-group--error'>
                <Icon
                  color='content-color-error'
                  name='icon-state-info-stroke'
                  className='pm-icon'
                />
                <span>
                  The workspace name must be unique. Try a different name.
                </span>
              </div>
            )}

            <div className='create-new-public-workspace-modal__input-group__visibility'>
              <div className='create-new-public-workspace-modal__input-group__input'>
                <WorkspaceVisibilitySelector
                  defaultWsVisibility={VISIBILITY.public}
                  handleChange={this.handleChange}
                  handleClose={this.handleClose}
                />
              </div>
            </div>

            <div className='create-new-public-workspace-modal__input-group__buttons'>
              <Button
                type='secondary'
                size='small'
                onClick={this.handleClose}
                className='create-new-public-workspace-modal__input-group__cancel-button'
              >
                Cancel
              </Button>

              <Button
                className='button-large create-new-public-workspace-modal__input-group__create-button'
                type='primary'
                size='small'
                onClick={this.handleCreate}
                disabled={this.state.disableCreateWorkspace}
              >
                {this.state.loading ? (
                  <LoadingIndicator className='create-new-public-workspace-modal__input-group__loading-indicator' />
                ) : (
                  'Create Workspace'
                )}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}
