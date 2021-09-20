import React, { Component } from 'react';
import { Label } from '@postman/aether';

import { observer } from 'mobx-react';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import { Input } from '@postman-app-monolith/renderer/js/components/base/Inputs';
import KeyMaps from '@postman-app-monolith/renderer/js/components/base/keymaps/KeyMaps';
import { headerHighlight } from '@@runtime-repl/_common/RequestUtil';
import { getKeySuggestions, getValueSuggestions } from '@postman-app-monolith/renderer/js/utils/AutoSuggestUtil';
import KeyValueEditor from '@@runtime-repl/_common/components/keyvalue-editor/KeyValueEditor';

const keyMap = { submit: 'mod+enter' };

@observer
export default class EditHeaderPreset extends Component {
  getKeyMapHandlers () {
    return { submit: this.props.onSubmit };
  }

  getTooltipText (isDisabled) {
    if (isDisabled) {
      return 'You do not have permissions to perform this action.';
    }
  }

  render () {
    const permissionStore = getStore('PermissionStore'),
      canEditHeaderpreset = permissionStore.can('edit', 'headerpreset', this.props.headerPresetId);

    return (
      <KeyMaps keyMap={keyMap} handlers={this.getKeyMapHandlers()}>
        <div className='edit-header-preset'>
          <div className='edit-header-preset__header'>
            <div className='edit-header-preset__header__title'>
              <Label
                type='primary'
                color='content-color-primary'
                text='Edit Header Preset'
              />
            </div>
          </div>
          <div className='edit-header-preset__section-name'>
            <Input
              inputStyle='box'
              placeholder='Header Preset Name'
              value={this.props.name}
              error={this.props.nameError}
              ref={this.props.presetNameInput}
              onChange={this.props.onNameChange}
              onSubmit={this.props.onSubmit}
            />
          </div>
          <div className='edit-header-preset__section-values'>
            <KeyValueEditor
              disableMultilineKey
              disableMultilineValue
              enableVariableSuggestions
              allowedColumns={['key', 'value', 'description']}
              values={this.props.values}
              editor={this.props.valueEditor}
              onChange={this.props.onValuesChange}
              showColumns={this.props.showColumns}
              onColumnToggle={this.props.onColumnToggle}
              keySuggestions={getKeySuggestions(getStore('HeaderPreset').headerPresetsForAutoComplete)}
              valueSuggestions={getValueSuggestions()}
              highlight={headerHighlight}
            />
          </div>
          <div className='edit-header-preset__section-controls'>
            <Button
              type='primary'
              size='small'
              className='edit-header-preset__section-controls__submit'
              onClick={this.props.onSubmit}
              disabled={!canEditHeaderpreset}
              tooltip={this.getTooltipText(!canEditHeaderpreset)}
            >
Update

            </Button>
            <Button
              type='secondary'
              size='small'
              className='edit-header-preset__section-controls__cancel'
              onClick={this.props.onClose}
            >
Cancel

            </Button>
          </div>
        </div>
      </KeyMaps>
    );
  }
}
