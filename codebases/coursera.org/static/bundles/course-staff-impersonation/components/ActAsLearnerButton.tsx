import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import _ from 'lodash';
import user from 'js/lib/user';
import redirect from 'js/lib/coursera.redirect';
import connectToRouter from 'js/lib/connectToRouter';
import type { InjectedRouter } from 'js/lib/connectToRouter';
import epic from 'bundles/epic/client';

import { Button, Loading, Notification } from '@coursera/coursera-ui';
import { Form, Field } from 'react-final-form';
import type { FormRenderProps } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import ModalButtonFooter from 'bundles/authoring/common/modals/ModalButtonFooter';
import TextInputAdapter from 'bundles/course-staff-impersonation/components/TextInputAdapter';
import Modal from 'bundles/phoenix/components/Modal';

import _t from 'i18n!nls/course-staff-impersonation';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type GroupMember from 'bundles/authoring/groups/models/GroupMember';

import 'css!./__styles__/ActAsLearnerButton';

type FormValues = {
  reason?: string;
};

type InputProps = { learner: GroupMember; groupId: string };

type Props = InputProps & { router: InjectedRouter };

/* eslint-disable graphql/template-strings */
const partnerLearnerImpersonationMutation = gql`
  mutation PartnerLearnerImpersonationMutation($input: DataMap!) {
    activateGroupSession(input: $input)
      @rest(
        method: "POST"
        type: "PartnerLearnerImpersonationSessionsResource"
        path: "partnerLearnerImpersonation/activateGroupSession"
      ) {
      redirectUrl
    }
  }
`;
/* eslint-enable */

const validateForm = (values: FormValues): FormValues => {
  let errors = {};
  if (!values.reason) {
    errors = { reason: _t(`Required.`) };
  }
  return errors;
};

export const ActAsLearnerButton: React.FunctionComponent<Props> = ({ groupId, learner, router }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  if (!epic.get('Degrees', 'enableImpersonation')) {
    return null;
  }

  const { display_name: currentUserName } = user.get();
  const { fullName: actAsLearnerName } = learner;

  return (
    <div className="rc-ActAsLearnerButton">
      <Button
        rootClassName="act-as-learner-button"
        type="link"
        onClick={() => setShowModal(true)}
        data-e2e="open-modal-button"
      >
        {_t('Act as learner')}
      </Button>

      {showModal && (
        <Modal modalName={_t('Act as learner')} handleClose={() => setShowModal(false)} data-e2e="start-session-modal">
          <h2 className="modal-title">{_t('Act as learner')}</h2>
          <Mutation mutation={partnerLearnerImpersonationMutation}>
            {(activateGroupSession: $TSFixMe) => {
              const onSubmit = (args: FormValues) => {
                return activateGroupSession({
                  variables: {
                    input: {
                      actsAs: learner.userId,
                      groupId,
                      returnUrl: router.location.pathname,
                      ...args,
                    },
                  },
                })
                  .then(
                    ({
                      data: {
                        // @ts-ignore ts-migrate(7031) FIXME: Binding element 'redirectUrl' implicitly has an 'a... Remove this comment to see the full error message
                        activateGroupSession: { redirectUrl },
                      },
                    }) => {
                      redirect.setLocation(redirectUrl);
                    }
                  )
                  .catch((err: Error) => {
                    return { [FORM_ERROR]: _.toString(err) };
                  });
              };

              return (
                <Form
                  onSubmit={onSubmit}
                  validate={validateForm}
                  render={({ handleSubmit, submitError, submitSucceeded, submitting }: FormRenderProps) => {
                    // We want to keep the loading state even after the request has returned to
                    // give the browser time to redirect to the new page.
                    const hasSubmitted = submitting || submitSucceeded;
                    return (
                      <form onSubmit={handleSubmit}>
                        {!hasSubmitted ? (
                          <div>
                            {/* TODO: add PRC link */}
                            <p>
                              {_t(`By acting as this learner, you will be able to take action as if you were them. This is
                              intended to help address learner-specific issues. Maximum session length is 1 hour.`)}
                            </p>

                            <table>
                              <tr>
                                <td>{_t(`You're logged in as:`)}</td>
                                <td>
                                  <strong>{currentUserName}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td>{_t(`You'll be acting as the learner:`)}</td>
                                <td>
                                  <strong>{actAsLearnerName}</strong>
                                </td>
                              </tr>
                            </table>
                            <Field component={TextInputAdapter} label={_t(`Reason for request`)} name="reason" />

                            {submitError && (
                              <Notification style={{ marginTop: '24px' }} message={submitError} type="danger" />
                            )}
                          </div>
                        ) : (
                          <Loading rootClassName="loading" loadingMessage={_t(`Starting session...`)} />
                        )}
                        <ModalButtonFooter
                          onCancelButtonClick={() => setShowModal(false)}
                          onPrimaryButtonClick={handleSubmit}
                          primaryButtonContents={_t(`Start session`)}
                          isCancelButtonDisabled={hasSubmitted}
                          isPrimaryButtonDisabled={hasSubmitted}
                        />
                      </form>
                    );
                  }}
                />
              );
            }}
          </Mutation>
        </Modal>
      )}
    </div>
  );
};

export default compose<Props, InputProps>(
  connectToRouter<Props, InputProps>((router) => ({ router }))
)(ActAsLearnerButton);
