import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Icon } from '@postman/aether';

import { Dropdown, DropdownMenu, DropdownButton, MenuItem } from '../base/Dropdowns';
import { Button } from '../base/Buttons';
import { Input } from '../base/Inputs';
import { getStore } from '../../stores/get-store';
import XPath from '../base/XPaths/XPath';
import SyncWorkspaceController from '../../modules/controllers/SyncWorkspaceController';
import { ModalFooter } from '../../components/base/Modals';
import LoadingIndicator from '../base/LoadingIndicator';

@observer
export default class ForkCollectionModal extends Component {
  constructor (props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.fetchAllWorkspaces = this.fetchAllWorkspaces.bind(this);

    this.state = {
      workspaces: [],
      loading: false,
      error: false
    };
  }

  componentDidMount () {
    this.fetchAllWorkspaces();
  }

  fetchAllWorkspaces () {
    this.setState({
      loading: true,
      error: false
    });

    SyncWorkspaceController.getAll()
      .then((workspaces) => {
        this.setState({
          workspaces: workspaces,
          loading: false
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: true
        });

        pm.logger.error('Could not find workspaces', err);
        pm.toasts.error('Could not check data in all workspaces');
      });
  }

  getJoinedWorkspaces (workspaces = []) {
    let currentUserId = getStore('CurrentUserStore').id,
        wsMemberPropertyPath = `members.users.${currentUserId}`,
        personal = [],
        joined = [];

    _.forEach(workspaces, (ws) => {
      if (!ws) {
        return;
      }

      switch (ws.type) {
        case 'personal':
          personal.push(ws);
          break;

        case 'team':
          _.get(ws, wsMemberPropertyPath) && joined.push(ws);
          break;
      }
    });

    return {
      personal: _.sortBy(personal, [(w) => _.toLower(w.name)]),
      joined: _.sortBy(joined, [(w) => _.toLower(w.name)])
    };
  }

  handleClose () {
    this.props.onClose && this.props.onClose();
  }

  handleSubmit () {
    this.props.onSubmit && this.props.onSubmit();
  }

  getIconName (workspace) {
    let iconName = '';

    if (workspace.type === 'personal') {
      iconName = 'icon-descriptive-user-stroke';
    }
    else if (workspace.visibilityStatus === 'public') {
      iconName = 'icon-state-published-stroke';
    }
    else if (workspace.type === 'team' && workspace.visibilityStatus === 'private-team') {
      iconName = 'icon-state-locked-stroke';
    }
    else if (workspace.type === 'team') {
      iconName = 'icon-descriptive-team-stroke';
    }

    return iconName;
  }

  render () {
    const workspaces = this.getJoinedWorkspaces(this.state.workspaces || []),
      joinedWorkspaces = workspaces.personal.concat(workspaces.joined),
      selectedWorkspace = ((joinedWorkspaces || []).find((workspace) => {
        return workspace.id === this.props.selectedWorkspaceId;
      })) || joinedWorkspaces[0] || {};

    if (this.state.error) {
      return (
        <div className='app-crash-wrapper fork-collection-modal__workspaces-error'>
          <div className='app-crash-thumbnail' />
          <div className='app-crash-content-container'>
            <div className='app-crash-header'>Unable to fetch workspaces</div>
            <div className='app-crash-content'>
              Could not fetch workspaces you belong to
            </div>
            <Button
              type='primary'
              onClick={this.fetchAllWorkspaces}
            >
              Retry
          </Button>
          </div>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className='fork-collection'>
          <div>
            Forking a collection creates a new collection with a reference to the original, allowing you to merge or pull changes between them.
          </div>
          <div className='fork-collection__input-group'>
            <div className='fork-collection__input-group__label'>
              Fork label
            </div>
            <XPath identifier='forkName'>
              <Input
                className='fork-collection__input-group__input'
                inputStyle='box'
                value={this.props.name}
                onChange={this.props.onForkLabelChange}
                onSubmit={() => this.props.onForkCollection(selectedWorkspace.id, selectedWorkspace.visibilityStatus)}
              />
            </XPath>
            <div className='fork-collection__input-group__helptext'>
              This will be used to identify this fork, and distinguish it from the parent and other related collections.
            </div>

            <div className='fork-collection__input-group__label'>
              Add this to a workspace
            </div>
            <XPath identifier='forkWorkspace'>
              <Dropdown
                className='fork-collection-dropdown'
                fullWidth
                onSelect={this.props.onChangeWorkspace}
              >
                <DropdownButton
                  size='small'
                  type='secondary'
                >
                  <Button>
                    {
                      this.state.loading ? <LoadingIndicator /> :
                        <span className='workspace-name'>
                          {selectedWorkspace.name}
                        </span>
                    }
                  </Button>
                </DropdownButton>
                <DropdownMenu fluid>
                  {
                    _.map(joinedWorkspaces, (workspace) => {
                      const iconName = this.getIconName(workspace);

                      return (
                        <MenuItem key={workspace.id} refKey={workspace.id}>
                          <span>{workspace.name}</span>
                          <Icon name={iconName} color='content-color-secondary' />
                        </MenuItem>
                      );
                    })
                  }
                </DropdownMenu>
              </Dropdown>
            </XPath>
            <div className='fork-collection__input-group__helptext'>
              You can always add the fork to another workspace later.
            </div>
          </div>
        </div>
        <ModalFooter className='fork-collection-modal__footer'>
          <XPath identifier='create'>
            <Button
              className='fork-collection__confirm'
              type='primary'
              size='small'
              onClick={() => this.props.handleForkCollection(selectedWorkspace.id, selectedWorkspace.visibilityStatus)}
              disabled={this.props.disableForkButton || this.state.loading}
            >
              {this.props.isLoading ? <LoadingIndicator /> : 'Fork collection'}
            </Button>
          </XPath>
          <XPath identifier='cancel'>
            <Button
              className='fork-collection__cancel'
              type='secondary'
              size='small'
              onClick={this.props.handleClose}
            >
              Cancel
            </Button>
          </XPath>
        </ModalFooter>
      </React.Fragment>
    );
  }
}

ForkCollectionModal.propTypes = {
  selectedWorkspace: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  onChangeWorkspace: PropTypes.func,
  onForkLabelChange: PropTypes.func
};

ForkCollectionModal.defaultProps = {
  selectedWorkspace: ''
};
