import React, { Component } from 'react';
import { Icon } from '@postman/aether';

import { observer } from 'mobx-react';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import { Button, ButtonGroup } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import { ACTION_TYPE_DELETE_TOOLTIP } from './HeaderPresetActionsTooltipConstants';

@observer
export default class HeaderPresetListItem extends Component {
  constructor (props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleAction (action, event) {
    event.stopPropagation();
    this.props.onAction && this.props.onAction(action);
  }

  handleSelect () {
    this.props.onSelect && this.props.onSelect();
  }

  getTooltipText (isDisabled) {
    if (isDisabled) {
      return 'You do not have permissions to perform this action.';
    }

    return ACTION_TYPE_DELETE_TOOLTIP;
  }

  render () {
    const permissionStore = getStore('PermissionStore'),
      canDeleteHeaderpreset = permissionStore.can('delete', 'headerpreset', this.props.headerPreset.id);

    return (
      <div className='header-preset-list-item'>
        <div className='header-preset-list-item__name-wrapper'>
          <span
            className='header-preset-list-item__name'
            onClick={this.handleSelect}
          >
            {this.props.headerPreset.name}
          </span>
        </div>
        <div className='header-preset-list-item__actions'>
          <ButtonGroup>
            <Button
              type='icon'
              onClick={this.handleAction.bind(this, 'delete')}
              disabled={!canDeleteHeaderpreset}
              tooltip={this.getTooltipText(!canDeleteHeaderpreset)}
            >
              <Icon
                name='icon-action-delete-stroke'
                color='content-color-primary'
                size='small'
                className='header-preset-list-item-action-delete'
              />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}
