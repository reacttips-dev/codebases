import React from 'react';
import { LanguageType } from 'bundles/cml/constants/codeLanguages';
import { CodeBlockOptions } from 'bundles/cml/types/Content';
import CMLCodeEditorLanguageDisplay from './CMLCodeEditorLanguageDisplay';
import CMLCodeEditorEvaluatorConfig from './CMLCodeEditorEvaluatorConfig';
import 'css!./__styles__/CMLCodeEditorToolbar';

type Props = {
  value: string;
  evaluatorId?: string;
  codeBlockOptions?: CodeBlockOptions;
  languageValue: LanguageType;
  onEvaluatorChange: (evaluatorId: string, value: string) => void;
  toggleEcbConfigModal?: (showEcbConfigModal: boolean, ecbModalComponent: React.ReactElement | null) => void;
};

class CMLCodeEditorToolbar extends React.Component<Props> {
  render() {
    const { value, evaluatorId, codeBlockOptions, languageValue, onEvaluatorChange, toggleEcbConfigModal } = this.props;
    const context = codeBlockOptions?.context || {};
    const { courseId, itemId, branchId } = context;
    const canCreateEvaluator = codeBlockOptions?.ecbEnabled;

    return (
      <div className="rc-CMLCodeEditorToolbar horizontal-box caption-text">
        <CMLCodeEditorLanguageDisplay languageValue={languageValue} />

        {canCreateEvaluator && (
          <CMLCodeEditorEvaluatorConfig
            value={value}
            language={languageValue}
            evaluatorId={evaluatorId}
            courseId={courseId}
            itemId={itemId}
            branchId={branchId}
            onEvaluatorChange={onEvaluatorChange}
            toggleEcbConfigModal={toggleEcbConfigModal}
          />
        )}
      </div>
    );
  }
}

export default CMLCodeEditorToolbar;
