import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';

@observer
export default class ManageHeaderPresetControls extends Component {
  constructor (props) {
    super(props);

    this.handleAddHeaderPresetSelect = this.handleAddHeaderPresetSelect.bind(this);
  }

  handleAddHeaderPresetSelect () {
    this.props.onAddHeaderPresetSelect && this.props.onAddHeaderPresetSelect();
  }

  getTooltipText (isDisabled) {
    if (isDisabled) {
      return 'You do not have permissions to perform this action.';
    }
  }

  render () {
    const permissionStore = getStore('PermissionStore'),
      workspaceId = getStore('ActiveWorkspaceStore').id,
      canAddHeaderpreset = permissionStore.can('addHeaderpreset', 'workspace', workspaceId);

    return (
      <div className='manage-header-preset-controls'>
        <div className='manage-header-preset-meta'>
          <span>
            Quickly add groups of header key/value pairs to the request.
            Start typing the name of the preset name and it&apos;ll show up in the dropdown list.
          </span>
        </div>
        <div className='manage-header-preset-buttons'>
          <Button
            type='primary'
            size='small'
            className='manage-header-preset-buttons--add-header-preset'
            onClick={this.handleAddHeaderPresetSelect}
            disabled={!canAddHeaderpreset}
            tooltip={this.getTooltipText(!canAddHeaderpreset)}
          >
Add
          </Button>
        </div>
      </div>
    );
  }
}
