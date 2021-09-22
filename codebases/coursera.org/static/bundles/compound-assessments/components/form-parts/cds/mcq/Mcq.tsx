/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import Option from 'bundles/compound-assessments/components/form-parts/cds/checkbox/Option';
import GradeNotification from 'bundles/compound-assessments/components/form-parts/cds/GradeNotification';
import ValidationError from 'bundles/compound-assessments/components/form-parts/cds/ValidationError';
import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { FormPartsValidationStatuses } from 'bundles/compound-assessments/components/form-parts/lib/constants';

import { typeNames } from 'bundles/compound-assessments/constants';

import type {
  McqPrompt,
  McqReflectPrompt,
  McqResponse,
  McqReflectResponse,
} from 'bundles/compound-assessments/types/FormParts';
import type { Theme } from '@coursera/cds-core';

type Prompt = McqPrompt | McqReflectPrompt;
type Response = McqResponse | McqReflectResponse;

type Props = {
  prompt?: Prompt;
  response?: Response;
  onChangeResponse: (response: Response) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  showValidation: boolean;
};

export const checkInvalid = (response?: Response): FormPartsValidationStatus | null =>
  !(((response || {}).definition || {}).value || {}).chosen ? FormPartsValidationStatuses.warning : null;

const styles = {
  validationError: css({
    transform: 'translate(-10px)',
  }),
  optionContainer: (theme: Theme) =>
    css({
      ':not(:first-child)': {
        marginTop: theme.spacing(12),
      },
    }),
};

/**
 * Mcq - renders a group of radio buttons
 * Known accessibility issues
 * @link https://blog.tenon.io/accessible-validation-of-checkbox-and-radiobutton-groups
 */
class Mcq extends React.Component<Props> {
  chose = (chosen: string) => {
    const { onChangeResponse } = this.props;
    onChangeResponse({
      typeName: typeNames.AUTO_GRADABLE_RESPONSE,
      definition: {
        value: {
          chosen,
        },
      },
    });
  };

  render() {
    const { prompt, response, isDisabled, isReadOnly, showValidation } = this.props;

    if (prompt) {
      const { chosen } = ((response || {}).definition || {}).value || {};
      const { options } = prompt.variant.definition;

      const isInvalid = !!(showValidation && checkInvalid(response));

      return (
        <div>
          {options &&
            options.map((option, index) => (
              <div key={option.id} css={styles.optionContainer}>
                <Option
                  onChange={() => this.chose(option.id)}
                  option={option}
                  isSelected={chosen === option.id}
                  isDisabled={isDisabled}
                  isReadOnly={isReadOnly}
                  isRadio={true}
                  promptId={prompt.id}
                  inputHtmlAttributes={{
                    'aria-describedby': isInvalid && index === 0 ? `validation-error-${prompt.id}` : undefined, // work around to force screen reader to read validation message
                  }}
                />
              </div>
            ))}
          <GradeNotification prompt={prompt} />
          {isInvalid && (
            <div css={styles.validationError}>
              <ValidationError id={prompt.id} />
            </div>
          )}
        </div>
      );
    }
    return null;
  }
}

export default Mcq;
