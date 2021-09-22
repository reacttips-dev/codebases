import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import _t from 'i18n!nls/course-v2';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import { H2 } from '@coursera/coursera-ui';

import waitForGraphQL from 'js/lib/waitForGraphQL';
import gql from 'graphql-tag';

import Modal from 'bundles/ui/components/Modal';

import ModalSection from 'bundles/author-common/components/ModalSection';
// we always want to show the switcher in this modal
import BranchSwitcher from 'bundles/authoring/branches/components/BranchSwitcher';
import GroupSwitcher from 'bundles/course-v2/components/course-view/GroupSwitcher';
import SessionSwitcher from 'bundles/course-v2/components/course-view/SessionSwitcher';

import ModalButtonFooter from 'bundles/authoring/common/modals/ModalButtonFooter';
import type Session from 'bundles/authoring/sessions/models/Session';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type GroupSummary from 'bundles/authoring/groups/models/GroupSummary';
import type AuthoringCourseBranch from 'bundles/author-common/models/AuthoringCourseBranch';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { selectBranch, selectSession, selectGroup } from 'bundles/ondemand/actions/BranchSessionGroupActions';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { changeUserEnrollment } from 'bundles/course-v2/actions/ChangeViewSettingActions';

import 'css!./__styles__/ChangeCourseViewSettingsModal';

type Props = {
  courseId: string;
  courseSlug: string;
  onCloseModal: () => void;
  selectedBranchId: string;
  selectedSessionId: string;
  selectedGroupId: string;
  branches: Array<AuthoringCourseBranch>;
  sessions: Array<Session>;
  groups: Array<GroupSummary>;
  isSessionsV2Enabled: boolean;
  userCanSwitchGroups: boolean;
};

type State = {
  loadingPreview: boolean;
};

class ChangeCourseViewSettingsModal extends React.Component<Props, State> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    loadingPreview: false,
  };

  handleCancel = () => {
    this.handleCloseModal();
  };

  handleSelectBranch = (branchId: string) => {
    const { executeAction } = this.context;
    executeAction(selectBranch, branchId);
  };

  handleSelectSession = (sessionId: string) => {
    const { executeAction } = this.context;
    executeAction(selectSession, sessionId);
  };

  handleSelectGroup = (groupId: string) => {
    const { executeAction } = this.context;
    executeAction(selectGroup, groupId);
  };

  handleCloseModal = () => {
    const { onCloseModal } = this.props;
    this.enableScroll();
    onCloseModal();
  };

  onPreview = () => {
    const {
      courseId,
      branches,
      selectedSessionId,
      selectedGroupId,
      selectedBranchId,
      userCanSwitchGroups,
    } = this.props;
    const { executeAction } = this.context;
    const selectedBranch = branches.find((branch) => branch.id === selectedBranchId);
    if (selectedBranch) {
      this.setState(() => ({ loadingPreview: true }));
      executeAction(changeUserEnrollment, {
        courseId,
        sessionId: selectedSessionId,
        groupId: selectedGroupId,
        userCanSwitchGroups,
      });
    }
  };

  disableScroll = () => {
    const { body } = document;
    if (body) {
      body.style.overflow = 'hidden';
    }
  };

  enableScroll = () => {
    const { body } = document;
    if (body) {
      body.style.overflow = 'visible';
    }
  };

  render() {
    const {
      branches,
      sessions,
      groups,
      selectedSessionId,
      selectedBranchId,
      selectedGroupId,
      isSessionsV2Enabled,
      userCanSwitchGroups,
    } = this.props;
    const { loadingPreview } = this.state;

    return (
      <Modal
        className="rc-ChangeCourseViewSettingsModal"
        onRequestClose={this.handleCloseModal}
        onAfterOpen={this.disableScroll}
      >
        <H2 className="modal-header">{_t('Change View Settings')}</H2>

        <div className="modal-description">
          {userCanSwitchGroups && (
            <FormattedMessage
              message={_t(`Choose a version to view as a learner, choose a specific session and group
              (if any) associated with that version to see what learners in those sessions/groups see.`)}
            />
          )}
          {!userCanSwitchGroups && (
            <FormattedMessage
              message={_t(`Choose a version to view as a learner, choose a specific session associated
                with that version to see what learners in that session see.`)}
            />
          )}
        </div>

        <ModalSection heading={_t('Version')}>
          <BranchSwitcher
            selectedBranchId={selectedBranchId}
            branches={branches}
            onSelect={this.handleSelectBranch}
            showIfSingleBranch={true}
            persistBranchSelectionChanges={false}
          />
        </ModalSection>

        <ModalSection heading={_t('Session')}>
          <SessionSwitcher
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            onSessionSelect={this.handleSelectSession}
            isSessionsV2Enabled={isSessionsV2Enabled}
          />
        </ModalSection>

        {userCanSwitchGroups && (
          <ModalSection heading={_t('Group')}>
            <GroupSwitcher selectedGroupId={selectedGroupId} groups={groups} onGroupSelect={this.handleSelectGroup} />
          </ModalSection>
        )}

        <ModalButtonFooter
          onCancelButtonClick={this.handleCancel}
          onPrimaryButtonClick={this.onPreview}
          isCancelButtonDisabled={loadingPreview}
          isPrimaryButtonDisabled={loadingPreview}
          primaryButtonContents={loadingPreview ? _t('Loading...') : _t('Continue')}
        />
      </Modal>
    );
  }
}

export default _.compose(
  waitForGraphQL(
    gql`
      query CourseViewSessionsV2AuthoringEligibilityCheckQuery($courseId: String!) {
        CourseSessionsV2AuthoringEligibilityCheckV1Resource {
          get(id: $courseId) {
            eligibleForSessionsV2
          }
        }
      }
    `,
    {
      options: ({ courseId }: { courseId: string }) => ({
        variables: {
          courseId,
        },
      }),
      props: ({ data }) => {
        // @ts-expect-error TSMIGRATION
        const { SessionsV2AuthoringEligibilityCheckV1Resource } = data;
        if (SessionsV2AuthoringEligibilityCheckV1Resource) {
          const { get } = SessionsV2AuthoringEligibilityCheckV1Resource;
          return {
            isSessionsV2Enabled: get && get.eligibleForSessionsV2,
          };
        }
        return {
          isSessionsV2Enabled: false,
        };
      },
    }
  ),
  // TODO: connectToStores<Props, InputProps, Stores>
  connectToStores<any, any>(['ChangeViewSettingsModalStore'], ({ ChangeViewSettingsModalStore }) => ({
    selectedBranchId: ChangeViewSettingsModalStore.getSelectedBranchId(),
    selectedSessionId: ChangeViewSettingsModalStore.getSelectedSessionId(),
    selectedGroupId: ChangeViewSettingsModalStore.getSelectedGroupId(),
    sessions: ChangeViewSettingsModalStore.getSessions(),
    groups: ChangeViewSettingsModalStore.getGroups(),
    branches: ChangeViewSettingsModalStore.getBranches(),
  }))
)(ChangeCourseViewSettingsModal);
