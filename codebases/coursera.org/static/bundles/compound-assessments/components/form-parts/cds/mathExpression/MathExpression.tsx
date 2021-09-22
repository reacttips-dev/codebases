import React from 'react';
import initBem from 'js/lib/bem';
import _t from 'i18n!nls/compound-assessments';
import { TextInput } from '@coursera/coursera-ui';
import { debounce } from 'lodash';
import GradeNotification from 'bundles/compound-assessments/components/form-parts/cds/GradeNotification';
import MathExpressionPreview from 'bundles/compound-assessments/components/form-parts/cds/mathExpression/MathExpressionPreview';

import ValidationError from 'bundles/compound-assessments/components/form-parts/cds/ValidationError';
import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { FormPartsValidationStatuses } from 'bundles/compound-assessments/components/form-parts/lib/constants';

import { typeNames } from 'bundles/compound-assessments/constants';

import type { MathExpressionPrompt, MathExpressionResponse } from 'bundles/compound-assessments/types/FormParts';

import ReadOnlyText from '../ReadOnlyText';

import 'css!./__styles__/MathExpression';

const bem = initBem('FormPartsMathExpression');

type Props = {
  prompt?: MathExpressionPrompt;
  response?: MathExpressionResponse;
  onChangeResponse: (response: MathExpressionResponse) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  showValidation: boolean;
};

export const checkInvalid = (response?: MathExpressionResponse): FormPartsValidationStatus | null =>
  !(((response || {}).definition || {}).value || {}).answer ? FormPartsValidationStatuses.warning : null;

export class MathExpression extends React.Component<Props> {
  onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { onChangeResponse } = this.props;
    const { value } = event.target as HTMLInputElement;

    onChangeResponse({
      typeName: typeNames.AUTO_GRADABLE_RESPONSE,
      definition: {
        value: {
          answer: value,
        },
      },
    });
  };

  deBouncedOnChangeResponse = debounce((response: MathExpressionResponse) => {
    const { onChangeResponse } = this.props;
    onChangeResponse(response);
  }, 500);

  render() {
    const { response, prompt, isDisabled, isReadOnly, showValidation } = this.props;
    const { answer } = ((response || {}).definition || {}).value || {};
    const isPartialFeedback = ((prompt || {}).variant || {}).detailLevel === 'Partial';

    if (!prompt) {
      return null;
    }

    const isInvalid = !!(showValidation && checkInvalid(response));

    return (
      <div className={bem(undefined, { isInvalid })}>
        {!isPartialFeedback && (
          <div className={bem('input-container')}>
            <MathExpressionPreview userText={answer} />
            {isReadOnly ? (
              <ReadOnlyText>{answer}</ReadOnlyText>
            ) : (
              <div>
                <TextInput
                  value={answer}
                  disabled={isDisabled}
                  label={_t('Enter math expression here')}
                  placeholder={_t('Enter math expression here')}
                  onChange={this.onChange}
                  componentId={`text-input-${prompt.id}`}
                  nativeHtmlAttributes={{
                    'aria-describedby': isInvalid ? `validation-error-${prompt.id}` : undefined,
                  }}
                />
                {isInvalid && <ValidationError id={prompt.id} />}
              </div>
            )}
          </div>
        )}
        <GradeNotification prompt={prompt} />
      </div>
    );
  }
}

export default MathExpression;
