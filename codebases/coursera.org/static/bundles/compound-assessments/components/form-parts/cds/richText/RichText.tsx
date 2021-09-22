import React from 'react';

import initBem from 'js/lib/bem';

import RichTextHTMLEditor from 'bundles/assess-common/components/RichTextHTMLEditor';
import RichTextView from 'bundles/assess-common/components/RichTextView';
import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { FormPartsValidationStatuses } from 'bundles/compound-assessments/components/form-parts/lib/constants';

import ValidationError from 'bundles/compound-assessments/components/form-parts/cds/ValidationError';

import { typeNames } from 'bundles/compound-assessments/constants';

import type { RichTextPrompt, RichTextResponse } from 'bundles/compound-assessments/types/FormParts';

import ReadOnlyText from '../ReadOnlyText';

import 'css!./__styles__/RichText';

const bem = initBem('RichText');

type Props = {
  prompt: RichTextPrompt;
  response: RichTextResponse;
  onChangeResponse: (response: RichTextResponse) => void;
  isReadOnly: boolean;
  showValidation: boolean;
  ariaLabelledBy?: string;
  // isDisabled: boolean, // TODO: add support of isDisabled
};

export const checkInvalid = (response: RichTextResponse): FormPartsValidationStatus | null => {
  const definition = (((response || {}).definition || {}).submissionPartResponse || {}).definition || {};
  // @ts-expect-error TSMIGRATION
  const isValid = ((definition.richText || {}).definition || {}).html;
  return !isValid ? FormPartsValidationStatuses.warning : null;
};

/**
 * Issues with a11y implementation not possible to add custom aria attributes
 * @see https://github.com/ianstormtaylor/slate/issues/2572
 */
class RichText extends React.Component<Props> {
  onChange = (html: string) => {
    const { onChangeResponse } = this.props;

    const newResponse = {
      typeName: typeNames.SUBMISSION_RESPONSE,
      definition: {
        submissionPartResponse: {
          typeName: 'richTextResponse',
          definition: {
            richText: {
              typeName: 'htmlContent',
              definition: {
                html,
              },
            },
          },
        },
      },
    };

    // @ts-expect-error TSMIGRATION
    onChangeResponse(newResponse);
  };

  render() {
    const { response, prompt, isReadOnly, showValidation, ariaLabelledBy } = this.props;

    const definition = (((response || {}).definition || {}).submissionPartResponse || {}).definition || {};
    // @ts-expect-error TSMIGRATION
    const content: string = ((definition.richText || {}).definition || {}).html || '';

    if (!prompt) {
      return null;
    }

    const isInvalid = showValidation && checkInvalid(response);

    // Warning: this is uncontrolled component. Changed props will not update text.
    return (
      <div className={bem()}>
        {isReadOnly ? (
          <ReadOnlyText isMultiLine={true}>
            {content && (
              <RichTextView
                submissionPart={{
                  richText: {
                    typeName: 'html',
                    definition: content,
                  },
                }}
              />
            )}
          </ReadOnlyText>
        ) : (
          <div className={bem('richText', { isInvalid: !!isInvalid })}>
            <RichTextHTMLEditor content={content} onChange={this.onChange} ariaLabelledBy={ariaLabelledBy} />
            {isInvalid && <ValidationError />}
          </div>
        )}
      </div>
    );
  }
}

export default RichText;
