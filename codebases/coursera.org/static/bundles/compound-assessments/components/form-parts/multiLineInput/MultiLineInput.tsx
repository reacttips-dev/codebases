import React from 'react';
import initBem from 'js/lib/bem';
import { TextInput, Textarea, P, Strong, View } from '@coursera/coursera-ui';
import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';
import _t from 'i18n!nls/compound-assessments';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import { typeNames } from 'bundles/compound-assessments/constants';

import ProfileImageCA from 'bundles/compound-assessments/components/shared/ProfileImageCA';

import ValidationError from 'bundles/compound-assessments/components/form-parts/ValidationError';
import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { FormPartsValidationStatuses } from 'bundles/compound-assessments/components/form-parts/lib/constants';

import user from 'js/lib/user';

import type {
  MultiLinePrompt,
  MultiLineResponse,
  ResponseMetadata,
} from 'bundles/compound-assessments/types/FormParts';
import type { AssignmentRole } from 'bundles/compound-assessments/types/Roles';

import { AssignmentRoles } from 'bundles/compound-assessments/types/Roles';

import {
  enableExtraCredit,
  EXTRA_CREDIT_RUBRIC_POINTS_MULTIPLIER,
} from 'bundles/author-assignment-grading/components/common/utils/utils';

import 'css!./__styles__/MultiLineInput';

const bem = initBem('MultiLineInput');

type Responses = Array<{ response: MultiLineResponse; metadata: ResponseMetadata }>;

type Props = {
  prompt: MultiLinePrompt;
  response?: MultiLineResponse;
  responses?: Responses;
  metadata: ResponseMetadata;
  onChangeResponse: (response: MultiLineResponse) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  showValidation: boolean;
  role: AssignmentRole;
  courseId: string;
};

export const checkInvalid = (
  response: MultiLineResponse | null | undefined,
  prompt: MultiLinePrompt
): FormPartsValidationStatus | null => {
  const { input, score } = response?.definition?.reviewPart?.definition || {};
  const hasReviewPoints = !!prompt?.reviewPartSchemaDetails?.definition?.points;
  if (hasReviewPoints && typeof score !== 'number') {
    // score is required for review
    return FormPartsValidationStatuses.error;
  } else if (!input) {
    return FormPartsValidationStatuses.warning;
  }
  return null;
};

type State = {
  scoreInputValue?: string;
};

const NUMBER_OR_FLOAT_REGEX = /^\d*(\.\d{0,2})?$/;

class MultiLineInput extends React.Component<Props, State> {
  state: State = {
    scoreInputValue: undefined,
  };

  extraCreditEnabled() {
    const { role, courseId } = this.props;
    return role === AssignmentRoles.GRADER && enableExtraCredit(courseId);
  }

  onChangeScore = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { onChangeResponse, response, prompt } = this.props;
    const { value } = event.target as HTMLInputElement;
    const { input } = response?.definition?.reviewPart?.definition || {};

    if (String(value).match(NUMBER_OR_FLOAT_REGEX)) {
      this.setState({ scoreInputValue: value });
      const parsedValue = parseFloat(value);

      const { points } = prompt?.reviewPartSchemaDetails?.definition || {};
      const maxReviewPoints = this.extraCreditEnabled() ? points * EXTRA_CREDIT_RUBRIC_POINTS_MULTIPLIER : points;

      const score = Number.isNaN(parsedValue) ? undefined : Math.max(Math.min(parsedValue, maxReviewPoints), 0);

      onChangeResponse({
        typeName: typeNames.REVIEW_RESPONSE,
        definition: {
          reviewPart: {
            typeName: 'multiLineInput',
            definition: {
              input,
              score,
            },
          },
        },
      });
    }
  };

  onChangeInput = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { onChangeResponse, response } = this.props;
    const { value } = event.target as HTMLInputElement;
    const { score } = response?.definition?.reviewPart?.definition || {};

    onChangeResponse({
      typeName: typeNames.REVIEW_RESPONSE,
      definition: {
        reviewPart: {
          typeName: 'multiLineInput',
          definition: {
            input: value,
            score,
          },
        },
      },
    });
  };

  render() {
    const { response, responses, prompt, isDisabled, isReadOnly, showValidation } = this.props;
    const { input, score } = response?.definition?.reviewPart?.definition || {};
    let { scoreInputValue } = this.state;
    const reviewPoints: number = prompt?.reviewPartSchemaDetails?.definition?.points;

    if (!scoreInputValue || parseFloat(scoreInputValue) !== score) {
      scoreInputValue = typeof score === 'number' ? String(score) : '';
    }

    if (!prompt) {
      return null;
    }

    const combinedResponses: Responses = responses || [];
    // In read only mode we want to show either peer responses from `responses` field or your own
    // response from `response`. Collect everything in `responses` variable to render it using the
    // same code.
    if (isReadOnly) {
      let { metadata } = this.props;
      if (response) {
        if (!metadata) {
          const currentUser = user.get();
          metadata = {
            submitterProfile: {
              typeName: 'user',
              definition: {
                fullName: currentUser.full_name,
                photoUrl: currentUser.photo_120,
              },
            },
          };
        }
        combinedResponses.push({ response, metadata });
      }
    }

    const isInvalid = showValidation && checkInvalid(response, prompt);

    return (
      <div className={bem(undefined, { isInvalid: !!isInvalid })}>
        <P tag="div" rootClassName={bem('prompt')}>
          <CMLOrHTML value={prompt.promptContent} />
        </P>
        {isReadOnly ? (
          <div className={bem('read-only')}>
            {combinedResponses &&
              combinedResponses.map(({ response: { definition } = {}, metadata: { submitterProfile } = {} }) => {
                const { score: responseScore, input: responseInput } = definition?.reviewPart?.definition || {};
                return (
                  <div className={bem('review')}>
                    {submitterProfile && (
                      <div className={bem('review-author')}>
                        <div className={bem('review-profile-image')}>
                          <ProfileImageCA profile={submitterProfile.definition} />
                        </div>
                        <Strong>{submitterProfile.definition.fullName}</Strong>
                      </div>
                    )}
                    {reviewPoints && (
                      <View rootClassName={bem('review-score')}>
                        <FormattedMessage
                          message={_t('Score {score}')}
                          score={
                            <strong>
                              {responseScore}/{reviewPoints}
                            </strong>
                          }
                        />
                      </View>
                    )}
                    <View rootClassName={bem('review-text')}>{responseInput}</View>
                  </div>
                );
              })}
          </div>
        ) : (
          <div>
            <div className={bem('form-parts')}>
              {typeof reviewPoints === 'number' && reviewPoints > 0 && (
                <div className={bem('text-input')}>
                  <Strong> {_t('Score')} </Strong>
                  <TextInput
                    componentId={prompt.id}
                    disabled={isDisabled}
                    value={scoreInputValue}
                    onChange={this.onChangeScore}
                  />
                  <View rootClassName={bem('text-input-note')} tag="span">
                    <FormattedMessage
                      message={_t(' out of {reviewPoints, plural, one {# point} other {# points}}')}
                      reviewPoints={reviewPoints}
                    />
                    {!!score && score > reviewPoints && (
                      <FormattedMessage
                        message={_t(' ({extraPoints, plural, one {# extra point} other {# extra points}})')}
                        extraPoints={score - reviewPoints}
                      />
                    )}
                  </View>
                </div>
              )}
              <div className={bem('text-area')}>
                <Textarea
                  value={input}
                  disabled={isDisabled}
                  onChange={this.onChangeInput}
                  componentId={`text-area-${prompt.id}`}
                />
              </div>
              {isInvalid && <ValidationError className={bem('validation-error')} />}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MultiLineInput;
