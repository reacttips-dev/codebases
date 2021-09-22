import React from 'react';
import initBem from 'js/lib/bem';
import CodeBlock from 'bundles/code-evaluator/components/CodeBlock';
import CodeBlockV2 from 'bundles/code-evaluator/components/CodeBlockV2';
import GradeNotification from 'bundles/compound-assessments/components/form-parts/cds/GradeNotification';
import { LanguageType } from 'bundles/cml/constants/codeLanguages';

import { typeNames } from 'bundles/compound-assessments/constants';

import { CodeExpressionPrompt, CodeExpressionResponse } from 'bundles/compound-assessments/types/FormParts';
import { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';
import { isMonacoEnabled } from 'bundles/cml/utils/FeatureUtils';

import 'css!./__styles__/CodeExpression';

const bem = initBem('CodeExpression');

// No response prop because the user input is saved through
// evalEvaluatorSummaries.v1 within CodeBlock
type Props = {
  prompt?: CodeExpressionPrompt;
  onChangeResponse: (response: CodeExpressionResponse) => void;
};

export const checkInvalid = (): FormPartsValidationStatus | null => null;

class CodeExpression extends React.Component<Props> {
  useMonacoEditor = isMonacoEnabled();

  onCodeBlockUpdate = (answer: string) => {
    const { onChangeResponse } = this.props;

    onChangeResponse({
      typeName: typeNames.AUTO_GRADABLE_RESPONSE,
      definition: {
        value: {
          answer,
        },
      },
    });
  };

  render() {
    const { prompt } = this.props;
    if (prompt) {
      const {
        codeLanguage,
        starterCode,
        replEvaluatorId,
      }: { codeLanguage: LanguageType; starterCode: string; replEvaluatorId: string } = prompt.variant.definition;
      const isPartialFeedback = prompt.variant.detailLevel === 'Partial';

      const effectiveResponse = prompt.effectiveResponse?.response;
      const learnerAnswer = effectiveResponse && 'answer' in effectiveResponse ? effectiveResponse.answer : undefined;

      return (
        <div className={bem()}>
          {!isPartialFeedback && (
            <div className={bem('response')}>
              {this.useMonacoEditor ? (
                <CodeBlockV2
                  codeLanguage={codeLanguage}
                  evaluatorId={replEvaluatorId}
                  expression={learnerAnswer || starterCode}
                  useUserExpression={true}
                  onUpdate={this.onCodeBlockUpdate}
                />
              ) : (
                <CodeBlock
                  codeLanguage={codeLanguage}
                  evaluatorId={replEvaluatorId}
                  expression={learnerAnswer || starterCode}
                  useUserExpression={true}
                  onUpdate={this.onCodeBlockUpdate}
                />
              )}
            </div>
          )}
          <GradeNotification prompt={prompt} />
        </div>
      );
    }
    return null;
  }
}

export default CodeExpression;
