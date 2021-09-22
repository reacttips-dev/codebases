import React from 'react';
import initBem from 'js/lib/bem';
import { Textarea } from '@coursera/coursera-ui';

import { typeNames } from 'bundles/compound-assessments/constants';

import type { PlainTextPrompt, PlainTextResponse } from 'bundles/compound-assessments/types/FormParts';
import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import ReadOnlyText from 'bundles/compound-assessments/components/form-parts/cds/ReadOnlyText';

// import 'css!./__styles__/PlainText';

const bem = initBem('PlainText');

type Props = {
  prompt: PlainTextPrompt;
  response: PlainTextResponse;
  onChangeResponse: (response: PlainTextResponse) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
};

export const checkInvalid = (response: PlainTextResponse): FormPartsValidationStatus | null => null;

class PlainText extends React.Component<Props> {
  onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { onChangeResponse } = this.props;
    const { value } = event.target as HTMLInputElement;

    onChangeResponse({
      typeName: typeNames.SUBMISSION_RESPONSE,
      definition: {
        submissionPartResponse: {
          typeName: 'plainTextResponse',
          definition: {
            plainText: value,
          },
        },
      },
    });
  };

  render() {
    const { response, prompt, isDisabled, isReadOnly } = this.props;
    const value = ((((response || {}).definition || {}).submissionPartResponse || {}).definition || {}).plainText;

    if (!prompt) {
      return null;
    }

    return (
      <div className={bem()}>
        {isReadOnly ? (
          <ReadOnlyText>{value}</ReadOnlyText>
        ) : (
          <Textarea
            value={value}
            disabled={isDisabled}
            onChange={this.onChange}
            componentId={`text-area-${prompt.id}`}
          />
        )}
      </div>
    );
  }
}

export default PlainText;
