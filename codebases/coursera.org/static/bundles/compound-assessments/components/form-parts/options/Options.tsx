import React from 'react';
import { Checkbox, color, Strong, P } from '@coursera/coursera-ui';
import initBem from 'js/lib/bem';
import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import _t from 'i18n!nls/assess-common';

import { typeNames } from 'bundles/compound-assessments/constants';

import ProfileImageCA from 'bundles/compound-assessments/components/shared/ProfileImageCA';
import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { FormPartsValidationStatuses } from 'bundles/compound-assessments/components/form-parts/lib/constants';

import ValidationError from 'bundles/compound-assessments/components/form-parts/ValidationError';

import type {
  OptionsPrompt,
  OptionsResponse,
  ResponseMetadata,
  Responses,
} from 'bundles/compound-assessments/types/FormParts';

import 'css!./__styles__/Options';

const bem = initBem('Options');

type Props = {
  prompt: OptionsPrompt;
  response?: OptionsResponse;
  responses?: Responses;
  metadata: ResponseMetadata;
  onChangeResponse: (response: OptionsResponse) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  showValidation: boolean;
};

export const checkInvalid = (response?: OptionsResponse): FormPartsValidationStatus | null =>
  !((((response || {}).definition || {}).reviewPart || {}).definition || {}).choice
    ? FormPartsValidationStatuses.error
    : null;

const getPeerResponses = (responses: Responses = []) =>
  responses.reduce((result, { response: { definition }, metadata }) => {
    // @ts-expect-error TSMIGRATION
    const optionId = (((definition || {}).reviewPart || {}).definition || {}).choice;
    if (optionId) {
      return {
        ...result,
        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        [optionId]: [...(result[optionId] || []), metadata],
      };
    }
    return result;
  }, {});

class Options extends React.Component<Props> {
  chose = (choice: string) => {
    const { onChangeResponse } = this.props;
    onChangeResponse({
      typeName: typeNames.REVIEW_RESPONSE,
      definition: {
        reviewPart: {
          definition: {
            choice,
          },
          typeName: typeNames.OPTIONS,
        },
      },
    });
  };

  render() {
    const { prompt, response, responses, isDisabled, isReadOnly, showValidation } = this.props;
    if (prompt) {
      const chosen = ((((response || {}).definition || {}).reviewPart || {}).definition || {}).choice;
      const { options = [] } = ((prompt || {}).reviewPartSchemaDetails || {}).definition || {};

      const peerResponses = getPeerResponses(responses);

      const isInvalid = showValidation && checkInvalid(response);

      return (
        <div className={bem(undefined, { isInvalid: !!isInvalid })}>
          <div className={bem('prompt')}>
            <P>
              <CMLOrHTML value={prompt.promptContent} />
            </P>
          </div>
          <table className={bem('table')}>
            {options &&
              options.map(({ id, points, display }: $TSFixMe) => (
                <tr key={id}>
                  {/* @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
                  <td className={bem('points', { leftBorder: peerResponses[id] })}>
                    <Checkbox
                      disabled={isDisabled}
                      onChange={() => this.chose(id)}
                      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      checked={!!(chosen === id || peerResponses[id])}
                      value={id}
                      isRadio
                      readOnly={isReadOnly}
                      name={prompt.id}
                      {...(isReadOnly
                        ? {
                            uncheckedColor: color.disabled,
                            uncheckedHoverColor: color.disabled,
                            checkedColor: color.disabled,
                            checkedHoverColor: color.disabled,
                          }
                        : {})}
                    >
                      <Strong>
                        <FormattedMessage
                          message={_t('{points, plural, =1 {# point} other {# points}}')}
                          points={points || 0}
                        />
                      </Strong>
                    </Checkbox>
                  </td>
                  <td>
                    <div className={bem('description')}>
                      <CMLOrHTML value={display} />
                      {/* @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
                      {peerResponses[id] && (
                        <div className={bem('profile-images')}>
                          {/* @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
                          {peerResponses[id].map(({ submitterProfile, createdBy }: $TSFixMe) => {
                            const profile = submitterProfile?.definition;
                            if (profile) {
                              return (
                                <div className={bem('profile-image')}>
                                  <ProfileImageCA profile={profile} key={createdBy} />
                                </div>
                              );
                            }
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </table>
          {isInvalid && <ValidationError className={bem('validation-error')} />}
        </div>
      );
    }
    return null;
  }
}

export default Options;
