import React from 'react';

import type EvaluatorTestCaseRunner from 'bundles/author-code-evaluator/models/EvaluatorTestCaseRunner';
import _t from 'i18n!nls/author-code-evaluator';

class TestCaseTitleRow extends React.Component<{
  isTestCaseAdded: boolean;
  testCaseRunner: EvaluatorTestCaseRunner;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onAddTestCase: (x: any) => void;
  onDuplicate: () => void;
}> {
  render() {
    const { isTestCaseAdded, testCaseRunner, onChange, onDelete, onAddTestCase, onDuplicate } = this.props;

    const canAddTestCase =
      testCaseRunner.testCase.expression !== '' &&
      testCaseRunner.testCase.name !== '' &&
      testCaseRunner.response != null;

    return (
      <div
        className="rc-TestCaseTitleRow horizontal-box align-items-spacebetween flex-1"
        style={{ padding: '4px 12px' }}
      >
        <input
          type="text"
          maxLength={80}
          onChange={onChange}
          placeholder={_t('Enter test case title')}
          style={{ border: 'none', width: 500 }}
          className="body-2-text"
          value={testCaseRunner.testCase.name}
        />
        {!isTestCaseAdded && (
          <div>
            <button className="button-link body-2-text cancel" onClick={onDelete} style={{ marginRight: 12 }}>
              {_t('Cancel')}
            </button>
            <button className="button-link body-2-text add" disabled={!canAddTestCase} onClick={onAddTestCase}>
              {_t('Add')}
            </button>
          </div>
        )}

        {isTestCaseAdded && (
          <div>
            <button className="button-link body-2-text delete" onClick={onDelete} style={{ marginRight: 12 }}>
              {_t('Delete')}
            </button>
            <button className="button-link body-2-text duplicate" onClick={onDuplicate} style={{ marginRight: 12 }}>
              {_t('Duplicate')}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default TestCaseTitleRow;
