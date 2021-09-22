import React from 'react';
import classNames from 'classnames';
import { LanguageType } from 'bundles/cml/constants/codeLanguages';
import CMLCodeEditorEvaluatorDropdown from './CMLCodeEditorEvaluatorDropdown';
import CMLCodeEditorEvaluatorConfigModal from './CMLCodeEditorEvaluatorConfigModal';
import 'css!./__styles__/CMLCodeEditorEvaluatorConfig';

type Props = {
  courseId?: string;
  branchId?: string;
  itemId?: string;
  evaluatorId?: string;
  value: string;
  language: LanguageType;
  onEvaluatorChange: (evaluatorId: string, value: string) => void;
  toggleEcbConfigModal?: (showEcbConfigModal: boolean, ecbModalComponent: React.ReactElement | null) => void;
};

type State = {
  isOpen: boolean;
};

class CMLCodeEditorEvaluatorConfig extends React.Component<Props, State> {
  state = {
    isOpen: false,
  };

  handleClose = () => {
    const { toggleEcbConfigModal } = this.props;
    this.setState({ isOpen: false });

    if (typeof toggleEcbConfigModal === 'function') {
      toggleEcbConfigModal(false, null);
    }
  };

  handleSave = (evaluatorId: string, value: string, closeOnSave = false) => {
    this.props.onEvaluatorChange(evaluatorId, value);
    if (closeOnSave) {
      this.handleClose();
    }
  };

  handleOpen = () => {
    const { evaluatorId, value, language, toggleEcbConfigModal } = this.props;

    if (typeof toggleEcbConfigModal === 'function') {
      // pass up the modal component to render to CMLEditorV2, don't render inline
      const modalComponent = evaluatorId ? (
        <CMLCodeEditorEvaluatorConfigModal
          isOpen={true}
          value={value}
          language={language}
          evaluatorId={evaluatorId}
          onSave={this.handleSave}
          onRequestClose={this.handleClose}
        />
      ) : null;

      toggleEcbConfigModal(true, modalComponent);
    } else {
      // open modal inline (CMLEditor v1)
      this.setState({ isOpen: true });
    }
  };

  render() {
    const { isOpen } = this.state;
    const { evaluatorId, value, language, courseId, branchId, itemId, toggleEcbConfigModal } = this.props;

    const configClasses = classNames('rc-CMLCodeEditorEvaluatorConfig', {
      interactive: !!evaluatorId,
    });

    return (
      <div className={configClasses}>
        {evaluatorId && (
          <CMLCodeEditorEvaluatorConfigModal
            isOpen={isOpen}
            value={value}
            language={language}
            evaluatorId={evaluatorId}
            onSave={this.handleSave}
            onRequestClose={this.handleClose}
          />
        )}
        <CMLCodeEditorEvaluatorDropdown
          language={language}
          evaluatorId={evaluatorId}
          branchId={branchId as string}
          itemId={itemId as string}
          courseId={courseId as string}
          onSave={this.handleSave}
          value={value}
          handleOpen={this.handleOpen}
          toggleEcbConfigModal={toggleEcbConfigModal}
        />
      </div>
    );
  }
}

export default CMLCodeEditorEvaluatorConfig;
