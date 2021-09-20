import React, { Component } from 'react';
import MissingCurrentWorkspaceModal from '../../components/workspaces/MissingCurrentWorkspaceModal';

const defaultState = { isOpen: false };

export default class MissingCurrentWorkspaceModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = defaultState;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('missingCurrentWorkspace', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('missingCurrentWorkspace', this.handleOpen);
  }

  handleOpen (workspace) {
    this.setState({
      isOpen: true,
      workspaceName: workspace.name
    });
  }

  handleClose () {
    this.setState(defaultState);
  }

  render () {
    return (
      <MissingCurrentWorkspaceModal
        isOpen={this.state.isOpen}
        workspaceName={this.state.workspaceName}
        onRequestClose={this.handleClose}
      />
    );
  }
}
