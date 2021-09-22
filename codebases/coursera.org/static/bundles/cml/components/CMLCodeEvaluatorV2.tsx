import React from 'react';
import monaco from 'monaco-editor';

import Retracked from 'js/lib/retracked';
import CodeEvaluatorOutput from 'bundles/code-evaluator/components/CodeEvaluatorOutput';
import EvaluationRunner from 'bundles/code-evaluator/models/EvaluationRunner';
import Evaluation from 'bundles/code-evaluator/models/Evaluation';
import EvaluatorSummary from 'bundles/code-evaluator/models/EvaluatorSummary';
import EvaluatorHintUtils from 'bundles/code-evaluator/utils/EvaluatorHintUtils';
import Notification from 'bundles/coursera-ui/components/extended/Notification';
import TrackedButton from 'bundles/page/components/TrackedButton';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import { Hint } from 'bundles/cml/types/Hint';
import _t from 'i18n!nls/cml';

import 'css!./__styles__/CMLCodeEvaluatorV2';

type Monaco = {
  Range: typeof monaco.Range;
};

type Props = {
  monacoEditor: monaco.editor.IStandaloneCodeEditor;
  monacoInstance: Monaco;
  evaluatorId: string;
  originalValue: string;
  onUpdate?: (answer: string) => void;
  evaluatorSummary: typeof EvaluatorSummary;
};

type State = {
  value: string;
  evaluation: InstanceType<typeof Evaluation>;
  evaluationRunner: typeof EvaluationRunner;
  hints: Hint[];
  showHintMessage: boolean;
};

/**
 * @class CMLCodeEvaluatorV2
 *
 * CMLCodeEvaluator based on monaco editor as opposed to ace editor.
 *
 */
class CMLCodeEvaluatorV2 extends React.Component<Props, State> {
  private buttonRef: HTMLButtonElement | null;

  constructor(props: Props) {
    super(props);

    this.buttonRef = null;
    const { monacoEditor, evaluatorId } = props;
    const value = monacoEditor.getValue();
    const evaluationRunner = new EvaluationRunner(evaluatorId);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
    const { evaluation } = evaluationRunner;
    this.state = {
      value,
      evaluation,
      // @ts-expect-error ts-migrate(2741) FIXME: Property 'prototype' is missing in type 'Evaluatio... Remove this comment to see the full error message
      evaluationRunner,
      hints: [],
      showHintMessage: true,
    };

    monacoEditor.onDidChangeModelContent(this.handleChange);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleChange = (event: monaco.editor.IModelContentChangedEvent) => {
    const {
      changes: [currentChange],
      isFlush,
    } = event;
    const { monacoEditor, onUpdate } = this.props;
    const { hints } = this.state;

    const changeDelta = { currentChange, isFlush };
    const model = monacoEditor.getModel();
    const { startColumn, startLineNumber } = currentChange.range;
    const changeStartPosition = model?.getOffsetAt({ column: startColumn, lineNumber: startLineNumber }) ?? 0;
    const updatedHints = EvaluatorHintUtils.getUpdatedHints(hints, changeStartPosition, changeDelta);

    const updatedValue = monacoEditor.getValue();
    this.setState({ value: updatedValue, hints: updatedHints });
    if (onUpdate) {
      onUpdate(updatedValue);
    }
  };

  handleKeyDown = (event: KeyboardEvent) => {
    const { keyCode } = event;
    const target = event.target as HTMLTextAreaElement;
    // Press Escape key inside code editor to exit and pass focus to "Run" button
    if (keyCode === 27 && target.className === 'monaco-editor') {
      this.handleFocus();
    }
  };

  handleReset = () => {
    const { monacoEditor, originalValue, evaluatorId } = this.props;
    monacoEditor.setValue(originalValue);

    const evaluationRunner = new EvaluationRunner(evaluatorId);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
    const { evaluation } = evaluationRunner;

    this.setState({
      hints: [],
      evaluation,
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'EvaluationRunner' is not assignable to type ... Remove this comment to see the full error message
      evaluationRunner,
    });
  };

  handleRun = () => {
    const { value, evaluationRunner } = this.state;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'run' does not exist on type 'typeof Eval... Remove this comment to see the full error message
    evaluationRunner.run(value, (evaluation: $TSFixMe /* TODO: type EvaluationRunner */) => {
      const hints = EvaluatorHintUtils.initHints(evaluation);
      this.setState({ evaluation, hints });
    });
  };

  handleFocus = () => {
    const { buttonRef } = this;
    if (buttonRef) {
      buttonRef.focus();
    }
  };

  handleCancel = () => {
    const { evaluationRunner } = this.state;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'cancel' does not exist on type 'typeof E... Remove this comment to see the full error message
    evaluationRunner.cancel((evaluation: $TSFixMe /* TODO: type EvaluationRunner */) => {
      this.setState({ evaluation, hints: [] });
    });
  };

  handleDismissHintMessage = () => {
    this.setState({ showHintMessage: false });
  };

  assignRef = (node: HTMLButtonElement | null) => {
    this.buttonRef = node;
  };

  nextHintIndex = () => {
    const { hints } = this.state;
    return hints.findIndex((hint) => !hint.show);
  };

  showNextHint = () => {
    const { hints } = this.state;

    const hintIndex = this.nextHintIndex();
    if (hintIndex >= 0) {
      const newHints = hints.slice();
      newHints[hintIndex].show = true;
      this.setState({ hints: newHints });
    }
  };

  renderHints = () => {
    const { monacoEditor, monacoInstance } = this.props;
    const { hints } = this.state;
    const model = monacoEditor.getModel();
    if (!model || hints.length <= 0) {
      return;
    }

    const displayedHints = hints.filter((hint) => hint.show);
    const glyphs = displayedHints.map((displayedHint) => {
      const { lineNumber: startLineNumber, column: startColumn } = model.getPositionAt(displayedHint.startPosition);
      const { lineNumber: endLineNumber, column: endColumn } = model.getPositionAt(displayedHint.endPosition);
      return {
        range: new monacoInstance.Range(startLineNumber, startColumn, endLineNumber, endColumn),
        options: {
          glyphMarginHoverMessage: { value: displayedHint.text },
          hoverMessage: { value: displayedHint.text },
          className: 'hintHighlight',
          glyphMarginClassName: 'hintAlert',
        },
      };
    });
    monacoEditor.deltaDecorations([], [...glyphs]);
  };

  render() {
    const { evaluatorSummary, evaluatorId } = this.props;
    const {
      hints,
      showHintMessage,
      evaluation,
      evaluation: { active },
    } = this.state;

    const moreHintsAvailable = this.nextHintIndex() >= 0;
    this.renderHints();
    const displayedHints = hints.filter((hint) => hint.show);
    const hintNotification = (
      <Notification
        type="info"
        isDismissible={true}
        onDismiss={this.handleDismissHintMessage}
        message={
          <FormattedHTMLMessage
            message={
              '<strong>Hint:</strong> Hover over a marker in the margin to see a hint about \nhow to correct your submission.'
            }
          />
        }
      />
    );

    return (
      <div className="rc-CMLCodeEvaluator">
        {moreHintsAvailable && (
          <TrackedButton
            trackingName="show_hint_button"
            data={{ evaluatorId }}
            className="secondary cml-code-evaluator-hint"
            onClick={this.showNextHint}
            withVisibilityTracking={true}
          >
            {_t('Show Hint')}
          </TrackedButton>
        )}
        <button
          disabled={active}
          className="secondary cml-code-evaluator-run"
          onClick={this.handleRun}
          ref={this.assignRef}
          type="button"
        >
          {_t('Run')}
        </button>

        <button
          disabled={active}
          type="button"
          className="button-link cml-code-evaluator-reset"
          onClick={this.handleReset}
        >
          {_t('Reset')}
        </button>

        {displayedHints.length > 0 && showHintMessage && hintNotification}

        <CodeEvaluatorOutput evaluation={evaluation} evaluatorSummary={evaluatorSummary} onCancel={this.handleCancel} />
      </div>
    );
  }
}

export default Retracked.createTrackedContainer<Props>(() => {
  return {
    namespace: {
      app: 'cml_code_evaluator',
      page: 'unknown',
    },
  };
})(CMLCodeEvaluatorV2);
