import React from 'react';
import initBem from 'js/lib/bem';
import _t from 'i18n!nls/compound-assessments';
import { TextInput } from '@coursera/coursera-ui';

import GradeNotification from 'bundles/compound-assessments/components/form-parts/GradeNotification';
import ValidationError from 'bundles/compound-assessments/components/form-parts/ValidationError';
import { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { FormPartsValidationStatuses } from 'bundles/compound-assessments/components/form-parts/lib/constants';

import { typeNames } from 'bundles/compound-assessments/constants';

import {
  TextExactMatchPrompt,
  RegexPrompt,
  SingleNumericPrompt,
  TextExactMatchResponse,
  RegexResponse,
  SingleNumericResponse,
} from 'bundles/compound-assessments/types/FormParts';

import 'css!./__styles__/TextInputBox';

import ReadOnlyText from '../ReadOnlyText';

const bem = initBem('TextInputBox');

type Prompt = TextExactMatchPrompt | RegexPrompt | SingleNumericPrompt;
type Response = TextExactMatchResponse | RegexResponse | SingleNumericResponse;

type Props = {
  prompt?: Prompt;
  response?: Response;
  onChangeResponse: (response: Response) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  showValidation: boolean;
};

export const checkInvalid = (response?: Response): FormPartsValidationStatus | null =>
  !(((response || {}).definition || {}).value || {}).answer ? FormPartsValidationStatuses.warning : null;

class TextInputBox extends React.Component<Props> {
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

  render() {
    const { response, prompt, isDisabled, isReadOnly, showValidation } = this.props;
    const { answer } = ((response || {}).definition || {}).value || {};
    const isPartialFeedback = ((prompt || {}).variant || {}).detailLevel === 'Partial';

    if (!prompt) {
      return null;
    }

    const isInvalid = !!(showValidation && checkInvalid(response));

    // This is a hack to enable password question
    // Hopefully it can be deprecated soon
    // Hide input text when proctors use textbox to enter password, unlocking exam. Case sensitive. FLEX-18904
    let shouldMaskInputField = false;
    if (prompt.variant.definition.prompt.typeName === 'cml') {
      shouldMaskInputField = prompt.variant.definition.prompt.definition.value.includes('[password-question]');
    }

    return (
      <div className={bem(undefined, { isInvalid })}>
        {isReadOnly ? (
          <div>
            {!isPartialFeedback && <ReadOnlyText>{answer}</ReadOnlyText>}
            <GradeNotification prompt={prompt} />
          </div>
        ) : (
          <TextInput
            value={answer}
            disabled={isDisabled}
            label={_t('Enter answer here')}
            placeholder={_t('Enter answer here')}
            onChange={this.onChange}
            type={shouldMaskInputField ? 'password' : 'text'}
            componentId={`text-input-${prompt.id}`}
            nativeHtmlAttributes={{
              'aria-describedby': isInvalid ? `validation-error-${prompt.id}` : undefined,
            }}
          />
        )}
        {isInvalid && <ValidationError id={prompt.id} />}
      </div>
    );
  }
}

export default TextInputBox;
