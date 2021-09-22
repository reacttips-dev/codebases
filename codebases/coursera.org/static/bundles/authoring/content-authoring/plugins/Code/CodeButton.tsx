import React from 'react';
import { SvgButton, color } from '@coursera/coursera-ui';
import { SvgCode } from '@coursera/coursera-ui/svg';
import _t from 'i18n!nls/authoring';

import CMLCodeEditorLanguagePicker from 'bundles/authoring/content-authoring/components/CodeEditor/CMLCodeEditorLanguagePicker';
import type { CodeBlockOptions } from 'bundles/cml/types/Content';

import { BLOCK_TYPES } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';
import { codeStrategy, hasCode } from './utils';
import type { SlateValue } from '../../types';

import 'css!./__styles__/CodeButton';

export type Props = {
  codeBlockOptions?: CodeBlockOptions;
  key?: string;
  isDisabled?: boolean;
};

type PropsFromEditor = {
  value: SlateValue;
  onChange: ({ value }: { value: SlateValue }) => void;
};

type State = {
  showLanguagePicker: boolean;
};

class CodeButton extends React.Component<Props & Partial<PropsFromEditor>, State> {
  state = {
    showLanguagePicker: false,
  };

  handleClick = () => {
    this.setState({ showLanguagePicker: true });
  };

  handleCancel = () => {
    this.setState({ showLanguagePicker: false });
  };

  handleLanguageSelect = (selectedlanguage: string) => {
    const { value, onChange, codeBlockOptions } = this.props;

    if (!value) {
      return;
    }

    codeStrategy(selectedlanguage, codeBlockOptions, value.change(), onChange);

    this.setState({ showLanguagePicker: false });
  };

  render() {
    const { value, isDisabled = false } = this.props;
    const { showLanguagePicker } = this.state;

    return (
      <div className="rc-CodeButton">
        <SvgButton
          rootClassName="toolbar-button"
          type="icon"
          size="zero"
          svgElement={<SvgCode size={18} color={color.primaryText} title={_t('Code')} />}
          onClick={this.handleClick}
          disabled={
            isDisabled || hasCode(value as SlateValue) || shouldDisableTool(value as SlateValue, BLOCK_TYPES.CODE)
          }
        />
        {showLanguagePicker && (
          <CMLCodeEditorLanguagePicker onSelect={this.handleLanguageSelect} onCancel={this.handleCancel} />
        )}
      </div>
    );
  }
}

export default CodeButton;
