/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Checkbox } from '@coursera/coursera-ui';
import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import _t from 'i18n!nls/assess-common';

import { typeNames } from 'bundles/compound-assessments/constants';

import ProfileImageCA from 'bundles/compound-assessments/components/shared/ProfileImageCA';
import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { FormPartsValidationStatuses } from 'bundles/compound-assessments/components/form-parts/lib/constants';

import ValidationError from 'bundles/compound-assessments/components/form-parts/cds/ValidationError';

import type {
  OptionsPrompt,
  OptionsResponse,
  ResponseMetadata,
  Responses,
} from 'bundles/compound-assessments/types/FormParts';

import type { Theme } from '@coursera/cds-core';
import { Typography, withTheme } from '@coursera/cds-core';

type Props = {
  prompt: OptionsPrompt;
  response?: OptionsResponse;
  responses?: Responses;
  metadata: ResponseMetadata;
  onChangeResponse: (response: OptionsResponse) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  showValidation: boolean;
  theme: Theme;
};

const styles = {
  prompt: (theme: Theme, isInvalid: boolean) =>
    css({
      padding: theme.spacing(12),
      border: isInvalid ? `1px solid ${theme.palette.red[700]}` : `solid thin ${theme.palette.gray[300]}`,
    }),

  table: (theme: Theme, isInvalid: boolean) =>
    css({
      width: '100%',
      borderLeft: 'hidden',
      borderRight: 'hidden',
      borderBottom: 'hidden',
      borderSpacing: '0px 16px',
      borderCollapse: 'separate',
      td: {
        border: isInvalid ? `1px solid ${theme.palette.red[700]}` : `solid thin ${theme.palette.gray[300]}`,
        verticalAlign: 'middle',
        padding: theme.spacing(12),
      },
    }),
  tableRow: css({
    'td:nth-child(1)': {
      width: '120px',
    },
  }),
  points: (theme: Theme, hasLeftBorder: boolean) =>
    css({
      width: '120px',
      boxShadow: hasLeftBorder ? `inset 4px 0px 0 0px ${theme.palette.gray[500]}` : 'none',
    }),
  description: css({
    display: 'flex',
    justifyContent: 'space-between',
  }),
  profileImages: css({
    whiteSpace: 'nowrap',
  }),
  profileImage: (theme: Theme) =>
    css({
      display: 'inline-block',
      width: '28px',
      '.rc-ProfileImage': {
        '.c-profile-image': {
          border: `1px solid ${theme.palette.white}`,
          borderCollapse: 'separate',
        },
        '.c-profile-initials': {
          backgroundColor: '#8C8C8C',
        },
      },
    }),
  validationError: (theme: Theme) =>
    css({
      marginBottom: theme.spacing(16),
    }),
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

export class Options extends React.Component<Props> {
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
    const { prompt, response, responses, isDisabled, isReadOnly, showValidation, theme } = this.props;
    if (prompt) {
      const chosen = ((((response || {}).definition || {}).reviewPart || {}).definition || {}).choice;
      const { options = [] } = ((prompt || {}).reviewPartSchemaDetails || {}).definition || {};

      const peerResponses = getPeerResponses(responses);

      const isInvalid = showValidation && checkInvalid(response);

      return (
        <div>
          <div css={styles.prompt(theme, !!isInvalid)}>
            <Typography variant="body1" component="div">
              <CMLOrHTML value={prompt.promptContent} />
            </Typography>
          </div>
          <table css={styles.table(theme, !!isInvalid)}>
            {options &&
              options.map(({ id, points, display }: $TSFixMe) => (
                <tr key={id}>
                  {/* @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
                  <td css={styles.points(theme, peerResponses[id])}>
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
                            uncheckedColor: theme.palette.gray[400],
                            uncheckedHoverColor: theme.palette.gray[400],
                            checkedColor: theme.palette.gray[400],
                            checkedHoverColor: theme.palette.gray[400],
                          }
                        : {})}
                    >
                      <Typography variant="h3semibold">
                        <FormattedMessage
                          message={_t('{points, plural, =1 {# point} other {# points}}')}
                          points={points || 0}
                        />
                      </Typography>
                    </Checkbox>
                  </td>
                  <td>
                    <div css={styles.description}>
                      <CMLOrHTML value={display} />
                      {/* @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
                      {peerResponses[id] && (
                        <div css={styles.profileImages}>
                          {/* @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
                          {peerResponses[id].map(
                            ({ submitterProfile: { definition: profile }, createdBy }: $TSFixMe) => (
                              <div css={styles.profileImage(theme)}>
                                <ProfileImageCA profile={profile} key={createdBy} />
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </table>
          {isInvalid && <ValidationError css={styles.validationError(theme)} />}
        </div>
      );
    }
    return null;
  }
}

export default withTheme(Options);
