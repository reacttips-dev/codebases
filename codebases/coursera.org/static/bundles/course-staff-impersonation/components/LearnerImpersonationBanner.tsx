/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import user from 'js/lib/user';
import { compose } from 'recompose';

import localStorage from 'js/lib/coursera.store';

import { Button } from '@coursera/cds-core';
import type { Theme } from '@coursera/cds-core';
import CourseraLogo from 'bundles/page/components/CourseraLogo';
import Modal from 'bundles/phoenix/components/Modal';
import ModalButtonFooter from 'bundles/authoring/common/modals/ModalButtonFooter';

import { REBRAND_COLORS } from 'bundles/front-page/components/modules/buttons/sharedStyles';

import _t from 'i18n!nls/course-staff-impersonation';
import { FormattedHTMLMessage } from 'react-intl';

import withLearnerImpersonationEditEnabled from './withLearnerImpersonationEditEnabled';
import WithTerminateSessionMutation from './withTerminateSessionMutation';
import LearnerImpersonationModeToggleDropdown from './LearnerImpersonationModeToggleDropdown';
import isImpersonationEditModeEnabled from '../utils/actAsLearnerEditModeExperimentUtils';
import type { PartnerLearnerImpersonationSession } from '../utils/types';
import ViewOnlyModeIndicator from './ViewOnlyModeIndicator';
import ViewOnlyModeTooltip from './ViewOnlyModeTooltip';

import 'css!./__styles__/LearnerImpersonationBanner';

type OuterProps = {
  actAsLearnerSession: PartnerLearnerImpersonationSession;
};

type Props = OuterProps & {
  isActAsLearnerEditModeEnabled: boolean;
  courseId: string;
};

const styles = {
  banner: (theme: Theme) => css`
    background-color: ${theme.palette.purple[800]};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100vw;
    height: 65px;
    padding: ${theme.spacing(0)} ${theme.spacing(32)};
  `,
  content: () => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  copy: (theme: Theme) => css`
    color: white;
    margin-left: ${theme.spacing(32)};
  `,
  endSessionButton: (theme: Theme) => css`
    margin-left: ${theme.spacing(32)};
    width 128px
    height 40px
  `,
  tooltipWrapper: () => css`
    position: relative;
    width 0px;
  `,
};

const EndSessionModal = ({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) => (
  <Modal
    modalName="End session?"
    handleClose={onCancel}
    className="end-session-modal"
    data-e2e="banner-end-session-modal"
  >
    <h2>{_t('End session?')}</h2>
    <p>{_t('By ending this session, you will return to your admin experience.')}</p>
    <ModalButtonFooter
      onCancelButtonClick={onCancel}
      onPrimaryButtonClick={onConfirm}
      primaryButtonContents="End session"
    />
  </Modal>
);

const LearnerImpersonationBanner: React.FunctionComponent<Props> = ({
  actAsLearnerSession,
  isActAsLearnerEditModeEnabled,
}) => {
  const { display_name: displayName } = user.get();
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);

  const isTooltipShownForSession = !localStorage.get('aal_hide_view_only_tooltip_session');
  const [showTooltip, setShowTooltip] = useState(isTooltipShownForSession);

  const localStorageHideTooltip = localStorage.get('aal_hide_view_only_tooltip');

  return (
    <WithTerminateSessionMutation actAsLearnerSession={actAsLearnerSession}>
      {({ terminateSession }) => {
        return (
          <div className="rc-LearnerImpersonationBanner">
            <div className="border left" />
            <div className="border right" />
            <div className="border bottom" />

            <div css={styles.banner}>
              <CourseraLogo hexColorCode={REBRAND_COLORS.BLUISH_WHITE} />

              <div css={styles.content}>
                <span css={styles.copy}>
                  <FormattedHTMLMessage
                    message={_t(`You are acting as <strong>{displayName}</strong>`)}
                    displayName={displayName}
                  />
                </span>

                {isImpersonationEditModeEnabled() &&
                  (isActAsLearnerEditModeEnabled ? (
                    <LearnerImpersonationModeToggleDropdown actAsLearnerSession={actAsLearnerSession} />
                  ) : (
                    <ViewOnlyModeIndicator />
                  ))}

                {isImpersonationEditModeEnabled() && showTooltip && !localStorageHideTooltip && (
                  <div css={styles.tooltipWrapper}>
                    <ViewOnlyModeTooltip
                      learnerName={displayName}
                      onClose={() => setShowTooltip(!showTooltip)}
                      isActAsLearnerEditModeEnabled={isActAsLearnerEditModeEnabled}
                      aalSessionId={actAsLearnerSession.startsAt}
                    />
                  </div>
                )}
              </div>

              <Button
                css={styles.endSessionButton}
                variant="secondary"
                size="small"
                onClick={() => setShowEndSessionModal(true)}
                data-e2e="banner-end-session-button"
              >
                {_t(`Exit learner view`)}
              </Button>
            </div>

            {showEndSessionModal && (
              <EndSessionModal
                onCancel={() => setShowEndSessionModal(false)}
                onConfirm={() => {
                  localStorage.remove('aal_hide_view_only_tooltip_session');
                  terminateSession();
                }}
              />
            )}
          </div>
        );
      }}
    </WithTerminateSessionMutation>
  );
};

export default compose<Props, OuterProps>(withLearnerImpersonationEditEnabled())(LearnerImpersonationBanner);
