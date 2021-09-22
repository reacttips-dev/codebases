import type { RawEvaluatorDraft } from 'bundles/author-code-evaluator/models/EvaluatorDraft';

import React from 'react';
import SimpleStarterCodeEditor from 'bundles/author-code-evaluator/components/SimpleStarterCodeEditor';
import TestCaseSandbox from 'bundles/author-code-evaluator/components/TestCasesSandbox';
import EvaluatorDraftEditor from 'bundles/author-code-evaluator/components/EvaluatorDraftEditor';
import AuthorEvaluatorSaveModal from 'bundles/author-code-evaluator/components/AuthorEvaluatorSaveModal';
import type StarterCode from 'bundles/author-code-evaluator/models/StarterCode';
import EvaluationRunner from 'bundles/code-evaluator/models/EvaluationRunner';
import type Evaluation from 'bundles/code-evaluator/models/Evaluation';
import type EvaluatorTestCase from 'bundles/author-code-evaluator/models/EvaluatorTestCase';
import AuthoringEvaluator from 'bundles/author-code-evaluator/models/AuthoringEvaluator';
import AuthoringEvaluatorAPIUtils from 'bundles/author-code-evaluator/utils/AuthoringEvaluatorAPIUtils';
import _t from 'i18n!nls/author-code-evaluator';
import 'css!./__styles__/AuthoringEvaluatorEditor';

type Props = {
  publishedEvaluatorId: string;
  starterCode: StarterCode;
  onPublish: (versionedId: string, expression: string) => void;
  onRemove: () => void;
  onClose: () => void;
};

type State = {
  starterCode: StarterCode;
  evaluation: Evaluation | null;
  evaluationRunner?: EvaluationRunner | null;
  authoringEvaluator: AuthoringEvaluator | null;
  publishInProgress: boolean;
  hasValidTestCases: boolean;
  hasError: boolean;
  runInProgress: boolean;
  hasHarnessChanged: boolean;
};

type onChangeType = {
  testCases: Array<EvaluatorTestCase>;
};

class AuthoringEvaluatorEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { starterCode } = props;

    this.state = {
      starterCode,
      evaluation: null,
      evaluationRunner: null,
      authoringEvaluator: null,
      publishInProgress: false,
      hasValidTestCases: false,
      hasError: false,
      runInProgress: false,
      hasHarnessChanged: false,
    };
  }

  componentDidMount() {
    const { publishedEvaluatorId } = this.props;
    const unversionedEvaluatorId = AuthoringEvaluator.getUnversionedId(publishedEvaluatorId);

    AuthoringEvaluatorAPIUtils.get(unversionedEvaluatorId).then((response) => {
      const authoringEvaluator = new AuthoringEvaluator(response);

      const evaluationRunner = new EvaluationRunner(authoringEvaluator.draft.id);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
      const { evaluation } = evaluationRunner;

      this.setState({ authoringEvaluator, evaluationRunner, evaluation });
    });
  }

  handleEvaluationRun = (expression: string) => {
    this.setState({ runInProgress: true });

    if (this.state.authoringEvaluator == null) {
      return;
    }

    const runEvaluation = (evaluationRunner: EvaluationRunner) => {
      evaluationRunner.run(expression, (evaluation: Evaluation) => this.setState({ evaluation, runInProgress: false }));
    };

    if (!this.state.hasHarnessChanged) {
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'EvaluationRunner | null | undefi... Remove this comment to see the full error message
      runEvaluation(this.state.evaluationRunner);
    } else {
      // If we have changed any harness data, we need to save it before we can run the evaluations.
      AuthoringEvaluatorAPIUtils.save(this.state.authoringEvaluator)
        .then((response) => {
          const authoringEvaluator = new AuthoringEvaluator(response);
          const evaluationRunner = new EvaluationRunner(authoringEvaluator.draft.id);

          this.setState({
            authoringEvaluator,
            evaluationRunner,
            hasHarnessChanged: false,
          });

          runEvaluation(evaluationRunner);
        })
        .catch(() => {
          this.setState({ hasError: true });
        });
    }
  };

  handleEvaluationCancel = () => {
    if (this.state.evaluationRunner == null) {
      return;
    }
    this.state.evaluationRunner.cancel((evaluation: Evaluation) => this.setState({ evaluation }));
  };

  handleEvaluatorDraftChange = (draft: RawEvaluatorDraft) => {
    if (this.state.authoringEvaluator == null) {
      return;
    }

    const { id, metadata, testCases } = this.state.authoringEvaluator;
    const rawTestCases = testCases.map((testCase) => testCase.toJSON());
    const authoringEvaluator = new AuthoringEvaluator({
      id,
      testCases: rawTestCases,
      metadata,
      draft,
    });

    this.setState({ authoringEvaluator, hasHarnessChanged: true });
  };

  handleTestCaseChange = ({ testCases }: onChangeType) => {
    if (this.state.authoringEvaluator == null) {
      return;
    }

    const { id, metadata, draft } = this.state.authoringEvaluator;
    const rawTestCases = testCases.map((testCase) => testCase.toJSON());
    const authoringEvaluator = new AuthoringEvaluator({
      id,
      testCases: rawTestCases,
      metadata,
      draft,
    });

    this.setState({ authoringEvaluator });
  };

  handleStarterCodeChange = (starterCode: StarterCode) => {
    this.setState({ starterCode });
  };

  handlePublish = () => {
    this.setState({ publishInProgress: true, hasError: false });

    if (this.state.authoringEvaluator == null) {
      return;
    }

    AuthoringEvaluatorAPIUtils.save(this.state.authoringEvaluator)
      .then((response) => {
        const authoringEvaluator = new AuthoringEvaluator(response);

        this.setState({ authoringEvaluator, hasHarnessChanged: false });

        return AuthoringEvaluatorAPIUtils.publish(authoringEvaluator);
      })
      .then((response) => {
        const {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'expression' does not exist on type 'Star... Remove this comment to see the full error message
          starterCode: { expression },
        } = this.state;
        const authoringEvaluator = new AuthoringEvaluator(response);
        const { versionedId } = authoringEvaluator;
        this.setState({ publishInProgress: false, authoringEvaluator });

        this.props.onPublish(versionedId, expression);
      })
      .catch(() => {
        this.setState({ publishInProgress: false, hasError: true });
      });
  };

  setHasValidTestCases = (hasValidTestCases: boolean) => {
    this.setState({ hasValidTestCases });
  };

  render() {
    const {
      authoringEvaluator,
      starterCode,
      evaluation,
      runInProgress,
      publishInProgress,
      hasHarnessChanged,
    } = this.state;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'language' does not exist on type 'Starte... Remove this comment to see the full error message
    const { language } = starterCode;

    if (authoringEvaluator == null || evaluation == null) {
      return null;
    }

    const { draft } = authoringEvaluator;

    const { hasValidTestCases } = this.state;

    return (
      <div className="rc-AuthoringEvaluatorEditor">
        <EvaluatorDraftEditor language={language} evaluatorDraft={draft} onChange={this.handleEvaluatorDraftChange} />

        <TestCaseSandbox
          language={language}
          onChange={this.handleTestCaseChange}
          onCancel={this.handleEvaluationCancel}
          setValidation={this.setHasValidTestCases}
          handleRun={this.handleEvaluationRun}
          authoringEvaluator={authoringEvaluator}
          evaluation={evaluation}
          runInProgress={runInProgress}
          hasHarnessChanged={hasHarnessChanged}
        />

        <SimpleStarterCodeEditor starterCode={starterCode} onChange={this.handleStarterCodeChange} />

        <div className="horizontal-box align-items-spacebetween" style={{ paddingTop: 40 }}>
          <button type="button" className="primary remove-execution-btn" onClick={this.props.onRemove}>
            {_t('Remove Execution')}
          </button>
          <div>
            <button type="button" style={{ marginRight: 20 }} className="secondary" onClick={this.props.onClose}>
              {_t('Cancel')}
            </button>

            <button
              type="button"
              disabled={!hasValidTestCases || publishInProgress}
              className="primary"
              onClick={this.handlePublish}
            >
              {publishInProgress ? _t('Saving...') : _t('Save')}
            </button>
          </div>
        </div>

        {this.state.hasError && (
          <div className="caption-text color-secondary-text align-right" style={{ marginTop: 8 }}>
            {_t('An error has occurred.')}
          </div>
        )}

        {publishInProgress && <AuthorEvaluatorSaveModal />}
      </div>
    );
  }
}

export default AuthoringEvaluatorEditor;
