import React from 'react';
import Modal from 'bundles/ui/components/Modal';
import StarterCode from 'bundles/author-code-evaluator/models/StarterCode';
import AuthoringEvaluatorEditor from 'bundles/author-code-evaluator/components/AuthoringEvaluatorEditor';
import type { LanguageType } from 'bundles/cml/constants/codeLanguages';
import _t from 'i18n!nls/authoring';
import 'css!./__styles__/CMLCodeEditorEvaluatorConfigModal';

type Props = {
  isOpen: boolean;
  value: string;

  evaluatorId: string;
  language: LanguageType;

  onRequestClose: () => void;
  onSave: (x: string, value: string, b?: boolean) => void;

  allowClose?: boolean;
};

class CMLCodeEditorEvaluatorConfigModal extends React.Component<Props> {
  static defaultProps = {
    allowClose: true,
  };

  handlePublish = (evaluatorId: string, expression: string) => {
    this.props.onSave(evaluatorId, expression);
  };

  handleRemove = () => {
    const { value } = this.props;
    this.props.onSave('', value, true);
  };

  render() {
    const { value, evaluatorId, language, isOpen, onRequestClose, allowClose } = this.props;
    const starterCode = new StarterCode({ expression: value, language });

    return (
      <Modal
        size="large"
        isOpen={isOpen}
        title={_t('Interactive Settings')}
        onRequestClose={onRequestClose}
        className="rc-CMLCodeEditorEvaluatorConfigModal"
        allowClose={allowClose}
      >
        <div style={{ paddingTop: 20 }}>
          <AuthoringEvaluatorEditor
            publishedEvaluatorId={evaluatorId}
            starterCode={starterCode}
            onPublish={this.handlePublish}
            onRemove={this.handleRemove}
            onClose={onRequestClose}
          />
        </div>
      </Modal>
    );
  }
}

export default CMLCodeEditorEvaluatorConfigModal;
