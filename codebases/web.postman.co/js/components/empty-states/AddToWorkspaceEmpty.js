import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import { WORKSPACE_DOCS } from '../../constants/AppUrlConstants.js';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
export default class AddToWorkspaceEmpty extends Component {
  constructor (props) {
    super(props);
    this.handleWorkspaceCreate = this.handleWorkspaceCreate.bind(this);
  }

  handleWorkspaceCreate () {
    pm.mediator.trigger('openCreateNewWorkspaceModal');
    this.props.onCreateWorkspace && this.props.onCreateWorkspace();
  }


  render () {
    return (
      <div className='add-to-workspace-empty--container'>
        <div className='add-to-workspace-empty--title'>You don't have any workspaces to share in</div>
        <div className='add-to-workspace-empty--subtext'>Share your collections, environments, monitors, mock servers and integrations in contextual workspaces to organize your APIs.</div>
        <Button
          type='text'
          className='docs-link'
          onClick={() => {
            openExternalLink(WORKSPACE_DOCS);
          }}
        >
          Learn more about workspaces
        </Button>
        <Button
          type='primary'
          onClick={this.handleWorkspaceCreate}
        >
          Create a new workspace
        </Button>
      </div>
    );
  }
}
