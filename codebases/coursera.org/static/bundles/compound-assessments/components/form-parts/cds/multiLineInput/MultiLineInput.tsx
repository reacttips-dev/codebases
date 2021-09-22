import React from 'react';
import initBem from 'js/lib/bem';
import { TextInput, Textarea } from '@coursera/coursera-ui';
import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';
import _t from 'i18n!nls/compound-assessments';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import { typeNames } from 'bundles/compound-assessments/constants';

import ProfileImageCA from 'bundles/compound-assessments/components/shared/ProfileImageCA';

import ValidationError from 'bundles/compound-assessments/components/form-parts/cds/ValidationError';
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
import { Typography } from '@coursera/cds-core';

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

class MultiLineInput extends React.Component<Props> {
  extraCreditEnabled() {
    const { role, courseId } = this.props;
    return role === AssignmentRoles.GRADER && enableExtraCredit(courseId);
  }

  onChangeScore = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { onChangeResponse, response, prompt } = this.props;
    const { value } = event.target as HTMLInputElement;
    const { input } = response?.definition?.reviewPart?.definition || {};

    const parsedValue = parseInt(value, 10);

    const { points } = prompt?.reviewPartSchemaDetails?.definition || {};
    const maxReviewPoints = this.extraCreditEnabled() ? points * EXTRA_CREDIT_RUBRIC_POINTS_MULTIPLIER : points;

    const score = Number.isNaN(parsedValue) ? null : Math.max(Math.min(parsedValue, maxReviewPoints), 0);

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
    const reviewPoints: number = prompt?.reviewPartSchemaDetails?.definition?.points;

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
        <Typography component="div" variant="body1">
          <CMLOrHTML value={prompt.promptContent} />
        </Typography>
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
                        <Typography variant="h4bold">{submitterProfile.definition.fullName}</Typography>
                      </div>
                    )}
                    {reviewPoints && (
                      <Typography variant="body1">
                        <FormattedMessage
                          message={_t('Score {score}')}
                          score={
                            <Typography variant="h4bold" component="span">
                              {responseScore}/{reviewPoints}
                            </Typography>
                          }
                        />
                      </Typography>
                    )}
                    <Typography variant="body1" className={bem('review-text')}>
                      {responseInput}
                    </Typography>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className={bem('form-parts')}>
            {typeof reviewPoints === 'number' && reviewPoints > 0 && (
              <div className={bem('text-input')}>
                <Typography variant="h3bold">{_t('Score')}</Typography>
                <TextInput
                  componentId={prompt.id}
                  disabled={isDisabled}
                  value={typeof score === 'number' ? String(score) : score}
                  onChange={this.onChangeScore}
                />
                <Typography className={bem('text-input-note')} component="span" variant="body1">
                  <FormattedMessage
                    message={_t(' out of {reviewPoints, plural, one {# point} other {# points}}')}
                    reviewPoints={reviewPoints}
                  />
                  {score && score > reviewPoints && (
                    <FormattedMessage
                      message={_t(' ({extraPoints, plural, one {# extra point} other {# extra points}})')}
                      extraPoints={score - reviewPoints}
                    />
                  )}
                </Typography>
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
        )}
      </div>
    );
  }
}

export default MultiLineInput;
