/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import _t from 'i18n!nls/compound-assessments';
import { Textarea } from '@coursera/coursera-ui';
import GradeNotification from 'bundles/compound-assessments/components/form-parts/cds/GradeNotification';
import { Typography } from '@coursera/cds-core';
import { typeNames } from 'bundles/compound-assessments/constants';

import type { ReflectPrompt, ReflectResponse } from 'bundles/compound-assessments/types/FormParts';
import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';
import type { Theme } from '@coursera/cds-core';

import ReadOnlyText from '../ReadOnlyText';

export const styles = {
  textAreaContainer: css({
    // Textarea from CUI has extra 21px on the top. This is to offset that
    marginTop: -21,
  }),
  subtitle: (theme: Theme) =>
    css({
      marginTop: theme.spacing(4),
    }),
};

type Props = {
  prompt?: ReflectPrompt;
  response?: ReflectResponse;
  onChangeResponse: (response: ReflectResponse) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
};

export const checkInvalid = (): FormPartsValidationStatus | null => null;

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
      <div>
        {isReadOnly ? (
          <div>
            {!isPartialFeedback && <ReadOnlyText isMultiLine={true}>{answer}</ReadOnlyText>}
            <GradeNotification prompt={prompt} />
          </div>
        ) : (
          <div css={styles.textAreaContainer}>
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
            <Typography variant="body2" id={`caption-${prompt.id}`} color="supportText" css={styles.subtitle}>
              {_t('Your answer cannot be more than 10000 characters.')}
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

export default TextAreaBox;
