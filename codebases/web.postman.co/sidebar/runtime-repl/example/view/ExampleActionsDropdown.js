import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import { EntityActionsDropdown } from '../../_common/components/compound';

import {
  ACTION_TYPE_DELETE,
  ACTION_TYPE_DUPLICATE,
  ACTION_TYPE_RENAME_TOGGLE
} from '../../collection/CollectionActionsConstants';
import {
  DISABLED_TOOLTIP_IS_OFFLINE,
  DISABLED_TOOLTIP_NO_PERMISSION
} from '../../_common/DisabledTooltipConstants';

@observer
export default class ExampleActionsDropdown extends React.Component {
  constructor (props) {
    super(props);

    this.getDisabledText = this.getDisabledText.bind(this);
  }

  getDisabledText (isDisabled) {
    if (!isDisabled) {
      return;
    }

    if (!getStore('OnlineStatusStore').userCanSave) {
      return DISABLED_TOOLTIP_IS_OFFLINE;
    }

    return DISABLED_TOOLTIP_NO_PERMISSION;
  }

  getKeymapHandlers () {
    return {
      rename: pm.shortcuts.handle('rename', this.handleShortcutSelect.bind(this, ACTION_TYPE_RENAME_TOGGLE)),
      duplicate: pm.shortcuts.handle('duplicate', this.handleShortcutSelect.bind(this, ACTION_TYPE_DUPLICATE)),
      delete: pm.shortcuts.handle('delete', this.handleShortcutSelect.bind(this, ACTION_TYPE_DELETE))
    };
  }


  handleShortcutSelect (action) {
    this.props.onSelect && this.props.onSelect(action);
  }

  render () {
    return (
      <EntityActionsDropdown
        dropdownClassName={this.props.className}
        actions={this.props.actions}
        keymapHandlers={this.getKeymapHandlers()}
        onSelect={this.props.onSelect}
        onToggle={this.props.onToggle}
        getDisabledText={this.getDisabledText}
      />
    );
  }
}

ExampleActionsDropdown.defaultProps = {
  onToggle: _.noop,
  className: null
};

ExampleActionsDropdown.propTypes = {
  actions: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onToggle: PropTypes.func,
  className: PropTypes.string
};
