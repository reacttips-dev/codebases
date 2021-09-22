import _ from 'lodash';

import React from 'react';

import AuthorEvaluatorSectionHeader from 'bundles/author-code-evaluator/components/AuthorEvaluatorSectionHeader';
import AuthorEvaluatorSectionCaption from 'bundles/author-code-evaluator/components/AuthorEvaluatorSectionCaption';
import TestCaseEditor from 'bundles/author-code-evaluator/components/TestCaseEditor';
import TestCasePill from 'bundles/author-code-evaluator/components/TestCasePill';
import TestCaseTitleRow from 'bundles/author-code-evaluator/components/TestCaseTitleRow';
import TestCaseRunner from 'bundles/author-code-evaluator/components/TestCaseRunner';
import type AuthoringEvaluator from 'bundles/author-code-evaluator/models/AuthoringEvaluator';
import type Evaluation from 'bundles/code-evaluator/models/Evaluation';
import EvaluatorTestCase from 'bundles/author-code-evaluator/models/EvaluatorTestCase';
import EvaluatorTestCaseRunner from 'bundles/author-code-evaluator/models/EvaluatorTestCaseRunner';
import type { LanguageType } from 'bundles/cml/constants/codeLanguages';
import _t from 'i18n!nls/author-code-evaluator';

type onChangeType = {
  testCases: Array<EvaluatorTestCase>;
};

type Props = {
  language: LanguageType;
  onChange: (arg: onChangeType) => void;
  onCancel: () => void;
  setValidation: (isValid: boolean) => void;
  handleRun: (expression: string) => void;
  authoringEvaluator: AuthoringEvaluator;
  evaluation: Evaluation;
  runInProgress?: boolean;
  hasHarnessChanged: boolean;
};

type State = {
  selectedTestCaseIndex: number | null;
  testCaseRunners: Array<EvaluatorTestCaseRunner>;
  newTestCaseRunner: EvaluatorTestCaseRunner | null;
  runningAll: boolean;
  isRunning: boolean;
};

class TestCasesSandbox extends React.Component<Props, State> {
  constructor(props: Props, context: {}) {
    super(props, context);

    this.state = {
      selectedTestCaseIndex: null,
      testCaseRunners: props.authoringEvaluator.testCases.map(
        (testCase) => new EvaluatorTestCaseRunner({ testCase, response: null })
      ),
      newTestCaseRunner: null,
      runningAll: false,
      isRunning: false,
    };
  }

  componentDidMount() {
    this.props.setValidation(this.areTestCasesValid(this.state));
  }

  componentWillReceiveProps(newProps: Props) {
    // We have to invalidate all test case runs if we update the draft (IE, starter code changes).
    if (
      this.props.authoringEvaluator.draft.id !== newProps.authoringEvaluator.draft.id ||
      (!this.props.hasHarnessChanged && newProps.hasHarnessChanged)
    ) {
      const { testCaseRunners: currentTestCaseRunners } = this.state;
      const testCaseRunners = currentTestCaseRunners.map((testCase) => {
        const copy = testCase.copy();
        copy.response = null;
        copy.testCase.latestEvaluationId = null;
        return copy;
      });

      this.setState({ testCaseRunners });
    }
  }

  componentWillUpdate(newProps: Props, newState: State) {
    if (this.state !== newState) {
      newProps.setValidation(this.areTestCasesValid(newState));

      const testCases = newState.testCaseRunners.map((testCaseEvaluator) => testCaseEvaluator.testCase);

      if (!_.isEqual(this.state.testCaseRunners, newState.testCaseRunners)) {
        this.props.onChange({ testCases });
      }
    }
  }

  handleDelete = () => {
    const { testCaseRunners, selectedTestCaseIndex, newTestCaseRunner } = this.state;

    if (newTestCaseRunner != null) {
      this.setState({
        newTestCaseRunner: null,
      });
    } else if (selectedTestCaseIndex != null) {
      const newTestCaseRunners = testCaseRunners.slice();
      newTestCaseRunners.splice(selectedTestCaseIndex, 1);

      this.setState({
        testCaseRunners: newTestCaseRunners,
        selectedTestCaseIndex: null,
        newTestCaseRunner: null,
      });
    }
  };

  handleDuplicate = () => {
    const testCase = this.getCurrentTestCase();
    if (testCase != null) {
      const numberOfTestCases = this.state.testCaseRunners.length;
      const copy = testCase.copy();
      copy.testCase.name = `Test case ${numberOfTestCases + 1}`;

      this.setState({
        newTestCaseRunner: copy,
        selectedTestCaseIndex: null,
      });
    }
  };

  /*
   * If we do a test run and the output doesn't match, we offer users the option to use the new output.
   */
  handleOverwriteOutput = () => {
    const testCase = this.getCurrentTestCase();
    if (testCase != null) {
      const copy = testCase.copy();
      copy.testCase.result = copy.response;
      this.updateTestCase(copy);
    }
  };

  handleRun = () => {
    this.setState({ isRunning: true });
  };

  onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const testCase = this.getCurrentTestCase();
    if (!testCase) {
      return;
    }

    const copy = testCase.copy();
    if (event.target instanceof HTMLInputElement) {
      copy.testCase.name = event.target.value;
    }

    this.onChangeTestCase(copy);
  };

  /*
   * Resets the evaluation of the current test case and calls update. Callers should only pass in a copy of the
   * current test case, not the actual current test case, so that we don't have weird things happening to the data flow.
   */
  onChangeTestCase = (testCase: EvaluatorTestCaseRunner) => {
    // Always reset the response on change, because it could be out of date.
    testCase.response = null; // eslint-disable-line no-param-reassign
    testCase.testCase.latestEvaluationId = null; // eslint-disable-line no-param-reassign
    this.updateTestCase(testCase);
  };

  getRunningTestCases = (): Array<EvaluatorTestCaseRunner> => {
    const { isRunning, testCaseRunners, runningAll } = this.state;
    const currentTestCase = this.getCurrentTestCase();

    if (runningAll) {
      return testCaseRunners;
    } else if (isRunning && currentTestCase != null) {
      return [currentTestCase];
    } else {
      return [];
    }
  };

  /*
   * There can only be one "current" test case - the new test case that hasn't been saved, or the selected one. There
   * can also be no current test case.
   */
  getCurrentTestCase = (): EvaluatorTestCaseRunner | null => {
    const { newTestCaseRunner, selectedTestCaseIndex, testCaseRunners } = this.state;
    if (newTestCaseRunner != null) {
      return newTestCaseRunner;
    } else if (selectedTestCaseIndex != null) {
      return testCaseRunners[selectedTestCaseIndex];
    }

    return null;
  };

  /*
   * Gets the next index of the "unchecked" test case (the test case that has not yet been run to verify that it is
   * correct).
   */
  getUncheckedTestCaseIndex = (): number | null => {
    const { testCaseRunners } = this.state;
    let index = 0;
    while (index < testCaseRunners.length) {
      if (testCaseRunners[index].response == null) {
        return index;
      }
      index += 1;
    }

    return null;
  };

  /*
   * Updates the current test case. Do not call this function unless we don't need to invalidate test case output,
   * instead call `onChangeTestCase`.
   */
  updateTestCase = (testCase: EvaluatorTestCaseRunner) => {
    const { selectedTestCaseIndex, newTestCaseRunner, testCaseRunners: currentTestCaseRunners } = this.state;

    if (selectedTestCaseIndex == null && newTestCaseRunner) {
      this.setState({
        newTestCaseRunner: testCase,
      });
    } else if (selectedTestCaseIndex != null) {
      const testCaseRunners = currentTestCaseRunners.slice();
      testCaseRunners[selectedTestCaseIndex] = testCase;

      this.setState({
        testCaseRunners,
      });
    }
  };

  /*
   * Creates a new, provisional test case to work on.
   */
  createNewTestCase = () => {
    const numberOfTestCases = this.state.testCaseRunners.length;
    const testCase = new EvaluatorTestCase({
      name: `Submission example ${numberOfTestCases + 1}`,
      expression: '',
      result: null,
      latestEvaluationId: null,
    });
    const newTestCaseRunner = new EvaluatorTestCaseRunner({
      testCase,
      response: null,
    });

    this.setState({
      newTestCaseRunner,
      selectedTestCaseIndex: null,
    });
  };

  /*
   * Adds the new test case to the list of test cases.
   */
  addNewTestCase = () => {
    const { newTestCaseRunner, testCaseRunners: currentTestCaseRunners } = this.state;
    if (newTestCaseRunner == null) {
      return;
    }

    // Add the result to start.
    newTestCaseRunner.testCase.result = newTestCaseRunner.response;

    const testCaseRunners = currentTestCaseRunners.slice();

    testCaseRunners.push(newTestCaseRunner);

    this.setState({
      testCaseRunners,
      selectedTestCaseIndex: testCaseRunners.length - 1,
      newTestCaseRunner: null,
    });
  };

  selectTestCase = (index: number) => {
    this.setState({ selectedTestCaseIndex: index, newTestCaseRunner: null });
  };

  areTestCasesValid = (state: State): boolean => {
    return (
      _.every(state.testCaseRunners, (testCaseEvaluator) => testCaseEvaluator.isPassed) &&
      state.testCaseRunners.length > 0 &&
      state.newTestCaseRunner == null
    );
  };

  runAllTestCases = () => {
    this.setState({
      runningAll: true,
      isRunning: true,
    });
  };

  changeRunningTestCase = (index: number, testCaseRunner: EvaluatorTestCaseRunner) => {
    const { runningAll, testCaseRunners } = this.state;

    if (runningAll) {
      const newTestCaseRunners = testCaseRunners.slice();
      newTestCaseRunners[index] = testCaseRunner;
      this.setState({
        testCaseRunners: newTestCaseRunners,
      });
    } else {
      this.updateTestCase(testCaseRunner);
    }
  };

  closeTestCaseRunner = () => {
    this.setState({ isRunning: false, runningAll: false });
  };

  render() {
    const { language, onCancel, handleRun, authoringEvaluator, evaluation, runInProgress } = this.props;
    const { isRunning, testCaseRunners, selectedTestCaseIndex, newTestCaseRunner, runningAll } = this.state;

    const { draft } = authoringEvaluator;

    const selectedTestCase = this.getCurrentTestCase();

    const hasTestCaseWithResponse = testCaseRunners.find((testCase) => testCase.response == null) != null;
    const hasTestCaseWithoutExpression =
      testCaseRunners.find((testCase) => testCase.testCase.expression === '') != null;

    const runAllDisabled =
      newTestCaseRunner != null ||
      testCaseRunners.length === 0 ||
      !hasTestCaseWithResponse ||
      hasTestCaseWithoutExpression;

    const titleRow = selectedTestCase && (
      <TestCaseTitleRow
        testCaseRunner={selectedTestCase}
        isTestCaseAdded={selectedTestCaseIndex != null}
        onDelete={this.handleDelete}
        onChange={this.onChangeTitle}
        onAddTestCase={this.addNewTestCase}
        onDuplicate={this.handleDuplicate}
      />
    );

    return (
      <div className="rc-TestCasesSandbox">
        <div className="horizontal-box align-items-spacebetween">
          <AuthorEvaluatorSectionHeader style={{ paddingTop: 20, paddingBottom: 5 }}>
            {_t('Submission Sandbox')}
          </AuthorEvaluatorSectionHeader>

          <button
            type="button"
            onClick={this.runAllTestCases}
            className="button-link body-2-text"
            disabled={runAllDisabled}
          >
            {_t('Run all submission examples')}
          </button>
        </div>

        <AuthorEvaluatorSectionCaption style={{ paddingBottom: 10 }}>
          {_t(
            `Verify that the starter code and / or grading feedback code does what you expect with examples of
               possible learner submissions.
               Provide at least one submission example and run all examples at least once.`
          )}
        </AuthorEvaluatorSectionCaption>

        <div style={{ marginBottom: 12 }}>
          {testCaseRunners.map((testCaseEvaluator: EvaluatorTestCaseRunner, index: number) => {
            return (
              <span style={{ marginRight: 20 }} key={testCaseEvaluator.testCase.name}>
                <TestCasePill
                  name={testCaseEvaluator.testCase.name}
                  onClick={this.selectTestCase}
                  index={index}
                  isFailed={testCaseEvaluator.isFailed}
                  isPassed={testCaseEvaluator.isPassed}
                  isSelected={index === selectedTestCaseIndex}
                />
              </span>
            );
          })}
          <button
            type="button"
            onClick={this.createNewTestCase}
            className="button-link body-2-text"
            disabled={newTestCaseRunner != null}
          >
            {_t('+ Add submission example')}
          </button>
        </div>

        {selectedTestCase != null && !runningAll && (
          <TestCaseEditor
            titleRow={titleRow}
            testCaseRunner={selectedTestCase}
            isTestCaseAdded={selectedTestCaseIndex != null}
            language={language}
            onChange={this.onChangeTestCase}
            selectedTestCaseIndex={selectedTestCaseIndex}
            onCancel={onCancel}
            onOverwriteOutput={this.handleOverwriteOutput}
            handleRun={this.handleRun}
            runInProgress={runInProgress}
            evaluatorDraftId={draft.id}
          />
        )}
        {isRunning && (
          <TestCaseRunner
            evaluation={evaluation}
            handleRun={handleRun}
            onCancel={onCancel}
            onClose={this.closeTestCaseRunner}
            onChange={this.changeRunningTestCase}
            testCaseRunners={this.getRunningTestCases()}
          />
        )}
      </div>
    );
  }
}

export default TestCasesSandbox;
