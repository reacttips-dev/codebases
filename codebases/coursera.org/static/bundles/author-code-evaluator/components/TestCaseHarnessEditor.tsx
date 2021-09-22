import React from 'react';

import CodeEditor from 'bundles/phoenix/components/CodeEditor';
import CodeBlockV2 from 'bundles/code-evaluator/components/CodeBlockV2';
import PreambleEditor from 'bundles/author-code-evaluator/components/PreambleEditor';
import AuthorEvaluatorSectionHeader from 'bundles/author-code-evaluator/components/AuthorEvaluatorSectionHeader';
import AuthorEvaluatorSectionCaption from 'bundles/author-code-evaluator/components/AuthorEvaluatorSectionCaption';
import TestCaseHarness from 'bundles/author-code-evaluator/models/TestCaseHarness';
import type { LanguageType } from 'bundles/cml/constants/codeLanguages';
import _t from 'i18n!nls/author-code-evaluator';

class TestCaseHarnessEditor extends React.Component<{
  onChange: (rawTestCaseHarness: any) => void;
  harness: TestCaseHarness;
  language: LanguageType;
  useMonacoEditor?: boolean;
}> {
  handleChange = (preamble: string, testCase: string) => {
    const harness = new TestCaseHarness({ preamble, testCase });
    this.props.onChange(harness.toJSON());
  };

  handlePreambleChange = (preamble: string) => {
    const {
      harness: { testCase },
    } = this.props;
    this.handleChange(preamble, testCase);
  };

  handleTestCaseChange = (testCase: string) => {
    const {
      harness: { preamble },
    } = this.props;
    this.handleChange(preamble, testCase);
  };

  renderCodeEditor = () => {
    const {
      harness: { testCase },
      language,
      useMonacoEditor,
    } = this.props;
    return useMonacoEditor ? (
      <CodeBlockV2
        readOnly={false}
        codeLanguage={language}
        expression={testCase}
        onChange={this.handleTestCaseChange}
      />
    ) : (
      <CodeEditor value={testCase} language={language} onChange={this.handleTestCaseChange} />
    );
  };

  render() {
    const {
      harness: { preamble, testCase },
      language,
      useMonacoEditor,
    } = this.props;

    return (
      <div className="rc-TestCaseHarnessEditor">
        <PreambleEditor
          preamble={preamble}
          language={language}
          onChange={this.handlePreambleChange}
          useMonacoEditor={useMonacoEditor}
        />

        <AuthorEvaluatorSectionHeader style={{ paddingTop: 20, paddingBottom: 5 }}>
          {_t('Grading Feedback Code')}
        </AuthorEvaluatorSectionHeader>

        <AuthorEvaluatorSectionCaption style={{ paddingBottom: 10 }}>
          {_t('This code will be used to evaluate and provide feedback to the learner on their submission.')}
        </AuthorEvaluatorSectionCaption>

        {testCase != null && this.renderCodeEditor()}
      </div>
    );
  }
}

export default TestCaseHarnessEditor;
