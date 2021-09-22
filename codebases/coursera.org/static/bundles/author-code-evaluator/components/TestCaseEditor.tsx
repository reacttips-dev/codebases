import React from 'react';

import classNames from 'classnames';
import CodeEditor from 'bundles/phoenix/components/CodeEditor';
import CodeBlockV2 from 'bundles/code-evaluator/components/CodeBlockV2';
import CodeOutput from 'bundles/author-code-evaluator/components/CodeOutput';
import CodeEvaluatorOutput from 'bundles/code-evaluator/components/CodeEvaluatorOutput';
import Evaluation from 'bundles/code-evaluator/models/Evaluation';
import type EvaluatorTestCaseRunner from 'bundles/author-code-evaluator/models/EvaluatorTestCaseRunner';
import { isMonacoEnabled } from 'bundles/cml/utils/FeatureUtils';
import type { LanguageType } from 'bundles/cml/constants/codeLanguages';
import _t from 'i18n!nls/author-code-evaluator';
import 'css!bundles/author-code-evaluator/components/__styles__/TestCaseEditor';

class TestCaseEditor extends React.Component<{
  testCaseRunner: EvaluatorTestCaseRunner;
  isTestCaseAdded: boolean;
  selectedTestCaseIndex: number | undefined | null;
  language: LanguageType;
  onChange: (testCaseRunner: EvaluatorTestCaseRunner) => void;
  onCancel: () => void;
  handleRun: (expression: string) => void;
  evaluatorDraftId: string;
  titleRow: JSX.Element | undefined | null;
  onOverwriteOutput: () => void;
  runInProgress: boolean | undefined | null;
}> {
  useMonacoEditor = isMonacoEnabled();

  handleRun = () => {
    const { expression } = this.props.testCaseRunner.testCase;

    this.props.handleRun(expression);
  };

  onChangeExpression = (expression: string) => {
    const { testCaseRunner } = this.props;
    const copy = testCaseRunner.copy();
    copy.testCase.expression = expression;

    this.props.onChange(copy);
  };

  onChangeTitle = (event: Event) => {
    const { testCaseRunner } = this.props;
    const copy = testCaseRunner.copy();
    if (event.target instanceof HTMLInputElement) {
      copy.testCase.name = event.target.value;
    }

    this.props.onChange(copy);
  };

  render() {
    const {
      testCaseRunner,
      isTestCaseAdded,
      language,
      onCancel,
      selectedTestCaseIndex,
      evaluatorDraftId,
      titleRow,
      onOverwriteOutput,
      runInProgress,
    } = this.props;

    const testCaseOutput = testCaseRunner.response;
    const { expression } = testCaseRunner.testCase;
    const testCaseRunDisabled = expression === '';

    const expectedResponse = testCaseRunner.testCase.result && testCaseRunner.testCase.result.toJSON();
    const expectedOutput = new Evaluation({
      active: false,
      fail: false,
      response: expectedResponse,
    });

    const actualResponse = testCaseOutput && testCaseOutput.toJSON();
    const actualOutput = new Evaluation({
      active: false,
      fail: false,
      response: actualResponse,
    });

    let actualResponseErrorUrl: string | null = null;
    if (actualResponse != null && !actualResponse.hasSuccessResult && actualResponse.logUrls != null) {
      actualResponseErrorUrl = actualResponse.logUrls.stderrUrl;
    }

    return (
      <div className="rc-TestCaseEditor">
        {/* top row */}
        <div className="row">
          <div className="column">{titleRow}</div>
        </div>

        {/* middle row */}
        <div className="row">
          <div className="column">
            <div className="horizontal-box align-items-spacebetween flex-1" style={{ padding: '8px 12px' }}>
              {_t('Input')}
              <button
                type="button"
                className="button-link body-2-text caption-text"
                onClick={this.handleRun}
                disabled={testCaseRunDisabled}
              >
                {_t('Run')}
              </button>
            </div>
          </div>
          {isTestCaseAdded && (
            <div className="column">
              <div className="flex-1" style={{ padding: '8px 12px' }}>
                {_t('Output')}
              </div>
              <button
                className="button-link body-2-text"
                type="button"
                disabled={!testCaseRunner.isFailed}
                onClick={onOverwriteOutput}
                style={{ marginRight: 12 }}
              >
                {_t('Overwrite')}
              </button>
            </div>
          )}

          <div
            className={classNames('column', 'horizontal-box', 'align-items-spacebetween', {
              'flex-2': !isTestCaseAdded,
            })}
          >
            <div className="flex-1" style={{ padding: '8px 12px' }}>
              {_t('Expected Output')}
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="row">
          <div className="column">
            <div className="flex-1 align-self-start">
              {this.useMonacoEditor ? (
                <CodeBlockV2
                  key={selectedTestCaseIndex || undefined}
                  readOnly={false}
                  codeLanguage={language}
                  expression={expression}
                  onChange={this.onChangeExpression}
                />
              ) : (
                <CodeEditor
                  key={selectedTestCaseIndex || undefined}
                  value={expression}
                  language={language}
                  onChange={this.onChangeExpression}
                />
              )}
              {testCaseRunDisabled && (
                <p className="caption-text color-secondary-text" style={{ paddingLeft: 16 }}>
                  {_t('Add some code to run this test case.')}
                </p>
              )}
            </div>
          </div>
          <div
            className={classNames('column', 'vertical-box', {
              'flex-2': !isTestCaseAdded,
            })}
          >
            <CodeOutput
              evaluatorDraftId={evaluatorDraftId}
              evaluation={actualOutput}
              onCancel={onCancel}
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              runInProgress={runInProgress}
            />
            {actualResponse != null && (
              <div className="caption-text color-secondary-text" style={{ padding: '8px 12px' }}>
                {_t('Evaluation ID:')} &nbsp; {actualResponse.id}
                {actualResponseErrorUrl && (
                  <div>
                    <a href={actualResponseErrorUrl}>{_t('stderr logs')}</a>
                  </div>
                )}
              </div>
            )}
          </div>
          {isTestCaseAdded && (
            <div className="column vertical-box">
              <CodeEvaluatorOutput
                evaluatorId={evaluatorDraftId}
                evaluation={expectedOutput}
                // active evaluations require an onCancel, but this evaluation will never be active.
                onCancel={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TestCaseEditor;
