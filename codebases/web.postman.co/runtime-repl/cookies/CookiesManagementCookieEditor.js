import React, { Component } from 'react';
import TextArea from '@postman-app-monolith/renderer/js/components/base/TextArea';
import KeyMaps from '@postman-app-monolith/renderer/js/components/base/keymaps/KeyMaps';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';

const keyMap = {
  submit: ['mod+enter', 'enter'],
  cancel: 'esc'
};

export default class CookiesManagementCookieEditor extends Component {
  componentDidMount () {
    this.refs.editor && this.refs.editor.focus();
  }

  getKeyMapHandlers () {
    return {
      submit: this.props.onSave,
      cancel: this.props.onRequestCancel
    };
  }

  render () {
    return (
      <div className='cookies-management-cookie-editor-wrapper'>
        <KeyMaps keyMap={keyMap} handlers={this.getKeyMapHandlers()}>
          <TextArea
            ref='editor'
            className='cookies-management-cookie-editor'
            value={this.props.value}
            onChange={this.props.onChange}
          />
        </KeyMaps>
        <div className='cookies-management-cookie-editor__actions'>
          <Button
            className='cookies-management-cookie-editor__action cookies-management-cookie-editor__action--cancel'
            onClick={this.props.onCancel}
            type='text'
          >
            Cancel
          </Button>
          <Button
            className='cookies-management-cookie-editor__action cookies-management-cookie-editor__action--save'
            onClick={this.props.onSave}
            type='primary'
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}
