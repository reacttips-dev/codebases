import React from 'react';

import Retracked from 'js/lib/retracked';
import CodeEvaluatorOutput from 'bundles/code-evaluator/components/CodeEvaluatorOutput';
import EvaluationRunner from 'bundles/code-evaluator/models/EvaluationRunner';
import type Evaluation from 'bundles/code-evaluator/models/Evaluation';
import type EvaluatorSummary from 'bundles/code-evaluator/models/EvaluatorSummary';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type AceEditorModel from 'bundles/phoenix/models/AceEditor';
import EvaluatorHintUtils from 'bundles/code-evaluator/utils/EvaluatorHintUtils';
import { Notification } from '@coursera/coursera-ui';
import TrackedButton from 'bundles/page/components/TrackedButton';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import type { Hint } from 'bundles/cml/types/Hint';

import _t from 'i18n!nls/cml';

type Props = {
  aceEditor: typeof AceEditorModel;
  evaluatorId: string;
  evaluatorSummary: typeof EvaluatorSummary;
  onUpdate?: (value: string) => void;
  originalValue: string;
};

type State = {
  value: string;
  evaluation: InstanceType<typeof Evaluation>;
  evaluationRunner: typeof EvaluationRunner;
  hints: Hint[];
  showHintMessage: boolean;
};

class CMLCodeEvaluator extends React.Component<Props, State> {
  private buttonRef: HTMLButtonElement | null;

  constructor(props: Props) {
    super(props);

    this.buttonRef = null;
    const { aceEditor, evaluatorId, onUpdate } = props;
    const { value } = aceEditor;

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

    aceEditor.onChange((
      updatedValue: $TSFixMe /* TODO: type aceEditor */,
      changeDelta: $TSFixMe /* TODO: type aceEditor */
    ) => {
      const { hints } = this.state;
      const updatedHints = EvaluatorHintUtils.updateHints(hints, aceEditor, changeDelta);
      this.setState({ value: updatedValue, hints: updatedHints });
      if (onUpdate) {
        onUpdate(updatedValue);
      }
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const { keyCode } = event;
    const target = event.target as HTMLTextAreaElement;
    // Press Escape key inside code editor to exit and pass focus to "Run" button
    if (keyCode === 27 && target.className === 'ace_text-input') {
      this.handleFocus();
    }
  };

  handleReset = () => {
    const { aceEditor, originalValue, evaluatorId } = this.props;
    aceEditor.editor.setValue(originalValue);

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
    const { aceEditor } = this.props;
    const { hints } = this.state;
    const displayedHints = hints.filter((hint) => hint.show);
    const highlightClassName = 'cml-code-error-highlight';

    aceEditor.removeMarkers((marker: $TSFixMe /* TODO: type aceEditor */) => marker.clazz === highlightClassName);
    displayedHints.forEach((hint) => {
      aceEditor.addMarkerByDocIndex(hint.startPosition, hint.endPosition, highlightClassName);
    });

    aceEditor.setAnnotations(
      displayedHints
        .filter((hint) => hint.text)
        .map((hint) => ({
          text: hint.text,
          type: 'warning',
          ...aceEditor.docIndexToPos(hint.startPosition),
        }))
    );
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
})(CMLCodeEvaluator);
