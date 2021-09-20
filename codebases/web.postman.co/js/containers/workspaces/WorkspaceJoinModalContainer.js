import React, { Component } from 'react';
import WorkspaceJoinModal from '../../components/workspaces/WorkspaceJoinModal';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { createEvent } from '../../modules/model-event';
import { getStore } from '../../stores/get-store';
import WorkspaceSwitchService from '../../services/WorkspaceSwitchService';

const defaultState = {
  isOpen: false,
  id: null,
  isJoining: false
};

export default class WorkspaceJoinModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = defaultState;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleJoinWorkspace = this.handleJoinWorkspace.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('joinWorkspace', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('joinWorkspace', this.handleOpen);
  }

  handleOpen (workspaceId) {
    this.setState({
      isOpen: true,
      id: workspaceId || getStore('ActiveWorkspaceStore').id
    });
  }

  handleClose () {
    this.setState(defaultState);
  }

  handleJoinWorkspace () {
    let joinWorkspaceEvent = createEvent('join', 'workspace', { model: 'workspace', workspace: { id: this.state.id } });

    this.setState({ isJoining: true });

    return dispatchUserAction(joinWorkspaceEvent)
      .then(() => {
        this.setState({ isJoining: true });

        WorkspaceSwitchService.switchWorkspace(this.state.id);
        this.handleClose();
      })
      .catch((e) => {
        this.setState({ isJoining: true });

        this.handleClose();
      });
  }


  render () {
    return (
      <WorkspaceJoinModal
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        onJoinWorkSpace={this.handleJoinWorkspace}
        isJoining={this.state.isJoining}
      />
    );
  }
}
