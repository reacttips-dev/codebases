import React from 'react';
import initBem from 'js/lib/bem';
import _t from 'i18n!nls/compound-assessments';
import { Textarea, Caption } from '@coursera/coursera-ui';
import GradeNotification from 'bundles/compound-assessments/components/form-parts/GradeNotification';

import { typeNames } from 'bundles/compound-assessments/constants';

import { ReflectPrompt, ReflectResponse } from 'bundles/compound-assessments/types/FormParts';
import { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import ReadOnlyText from '../ReadOnlyText';

import 'css!./__styles__/TextAreaBox';

const bem = initBem('TextAreaBox');

type Props = {
  prompt?: ReflectPrompt;
  response?: ReflectResponse;
  onChangeResponse: (response: ReflectResponse) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
};

export const checkInvalid = (response: Response): FormPartsValidationStatus | null => null;

class TextAreaBox extends React.Component<Props> {
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
    const { response, prompt, isDisabled, isReadOnly } = this.props;
    const { answer } = ((response || {}).definition || {}).value || {};
    const isPartialFeedback = ((prompt || {}).variant || {}).detailLevel === 'Partial';

    if (!prompt) {
      return null;
    }

    return (
      <div className={bem()}>
        {isReadOnly ? (
          <div>
            {!isPartialFeedback && <ReadOnlyText isMultiLine={true}>{answer}</ReadOnlyText>}
            <GradeNotification prompt={prompt} />
          </div>
        ) : (
          <div>
            <Textarea
              value={answer}
              disabled={isDisabled}
              placeholder={_t('What do you think?')}
              onChange={this.onChange}
              componentId={`text-area-${prompt.id}`}
              nativeHtmlAttributes={{
                'aria-describedby': `caption-${prompt.id}`,
              }}
            />
            <div className={bem('foot-note')}>
              <Caption id={`caption-${prompt.id}`}>{_t('Your answer cannot be more than 10000 characters.')}</Caption>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TextAreaBox;
