/** @jsx jsx */
import PropTypes from 'prop-types';
import React from 'react';
import { jsx, css } from '@emotion/react';
import { H2 } from '@coursera/coursera-ui';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import Modal from 'bundles/ui/components/Modal';
import ModalSection from 'bundles/author-common/components/ModalSection';
import ContextSwitcher from 'bundles/authoring/course-level/components/versions/ContextSwitcher';
import GroupSwitcher from 'bundles/course-v2/components/course-view/GroupSwitcher';
import ModalButtonFooter from 'bundles/authoring/common/modals/ModalButtonFooter';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type GroupSummary from 'bundles/authoring/groups/models/GroupSummary';
import type AuthoringCourseBranch from 'bundles/author-common/models/AuthoringCourseBranch';
import type { AuthoringCourseContext, ContextMap } from 'bundles/authoring/common/types/authoringCourseContexts';
import { authoringCourseContextTypes } from 'bundles/authoring/common/constants/authoringCourseContexts';
import {
  viewContextAsLearner,
  getContextIdFromContext,
  getIdForContextSwitcher,
} from 'bundles/authoring/course-level/utils/contextUtils';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { selectBranch, selectSession, selectGroup } from 'bundles/ondemand/actions/BranchSessionGroupActions';
import { selectContext } from 'bundles/preview/actions/ContextSelectionActions';
import _t from 'i18n!nls/preview';

type PropsFromCaller = {
  courseSlug: string;
  courseId: string;
  onCloseModal: () => void;
  userCanSwitchGroups: boolean;
  contexts: Array<AuthoringCourseContext>;
  contextMap: ContextMap;
};

type PropsFromStores = {
  selectedBranchId: string;
  selectedGroupId: string;
  selectedContextId: string;
  branches: Array<AuthoringCourseBranch>;
  groups: Array<GroupSummary>;
};

type Props = PropsFromCaller & PropsFromStores;

type State = {
  loadingPreview: boolean;
  selectedContextIdForContextSwitcher: string;
  selectedContext: AuthoringCourseContext;
};

const styles = css`
  width: 720px !important;
  text-align: left !important;
  padding: 28px;
  border-radius: 3px;
  overflow: visible !important;

  .modal-header {
    margin-bottom: 20px;
  }

  .modal-description {
    font-size: 0.95em;
  }

  .rc-ContextSwitcher {
    .bt3-btn-group {
      min-width: 100%;

      .bt3-btn-default {
        min-width: 100%;
      }

      .dropdown-title {
        min-width: 95%;
      }
    }
  }
`;

class ChangeContextBasedCourseViewSettingsModal extends React.Component<Props, State> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  constructor(props: Props) {
    super(props);
    const { selectedContextId, contextMap, contexts } = props;
    const matchedContextForSelectedContextId = contextMap[selectedContextId] ?? contexts[0];
    const matchedContextIdForContextSwitcher = getIdForContextSwitcher(matchedContextForSelectedContextId);

    this.state = {
      loadingPreview: false,
      selectedContext: matchedContextForSelectedContextId,
      selectedContextIdForContextSwitcher: matchedContextIdForContextSwitcher,
    };
  }

  handleContextSelect = (newSelectedContextId: string, newSelectedContext: AuthoringCourseContext) => {
    if (!!newSelectedContextId && !!newSelectedContext) {
      const { executeAction } = this.context;

      this.setState({ selectedContext: newSelectedContext, selectedContextIdForContextSwitcher: newSelectedContextId });

      // the variable newSelectedContextId is returned from the ContextSwitcher, it is processed to have a potential prefix
      // to select context for the ContextSwitcher, so its value is not necessarily the same as the actual context id
      const contextIdForSelectedContext = getContextIdFromContext(newSelectedContext);
      executeAction(selectContext, { contextId: contextIdForSelectedContext });

      const { authoringCourseBranchId: newSelectedBranchId } = newSelectedContext.definition;
      let newSelectedSessionId: string | null = null;
      let newSelectedGroupId: string | null = null;

      // refresh the groups in the store
      if (newSelectedContext.typeName === authoringCourseContextTypes.SESSION_GROUP) {
        const { sessionId, groupId } = newSelectedContext.definition;
        newSelectedSessionId = sessionId;
        newSelectedGroupId = groupId;
      }

      // only execute the action of selectBranch if it is a different authoring branch id
      if (newSelectedBranchId !== this.props.selectedBranchId) {
        executeAction(selectBranch, newSelectedBranchId);
      }
      executeAction(selectSession, newSelectedSessionId);
      executeAction(selectGroup, newSelectedGroupId);
    }
  };

  handleSelectGroup = (groupId: string) => {
    const { executeAction } = this.context;
    executeAction(selectGroup, groupId);
  };

  onPreview = () => {
    const { courseId, courseSlug, branches, selectedGroupId, userCanSwitchGroups, groups } = this.props;
    const { selectedContext } = this.state;
    const { executeAction } = this.context;

    if (selectedContext) {
      const branchForSelectedContext = branches.find(
        (branch) => branch.id === selectedContext.definition.authoringCourseBranchId
      );
      if (branchForSelectedContext) {
        this.setState(() => ({ loadingPreview: true }));
        let specifiedGroupId;

        // if the group switcher is displayed, the user may select a different group
        // then we need to specify that group id in the payload (instead of deriving from the context)
        if (userCanSwitchGroups && groups.length > 1) {
          specifiedGroupId = selectedGroupId;
        }

        executeAction(viewContextAsLearner, {
          courseContext: selectedContext,
          branch: branchForSelectedContext,
          courseSlug,
          courseId,
          skipReloadWindow: false,
          useSameWindow: true,
          specifiedGroupId,
        });
      }
    }
  };

  render() {
    const { groups, selectedGroupId, userCanSwitchGroups, contexts, onCloseModal } = this.props;
    const { loadingPreview, selectedContextIdForContextSwitcher } = this.state;

    const displayGroupSwitcher = userCanSwitchGroups && groups.length > 1;

    return (
      <Modal className="rc-ChangeContextBasedCourseViewSettingsModal" onRequestClose={onCloseModal} css={styles}>
        <H2 className="modal-header">{_t('Change View Settings')}</H2>

        <span className="modal-description">
          {displayGroupSwitcher
            ? _t(
                'Choose an instance to view as a learner, choose a specific group associated with that instance to see what learners in those groups see.'
              )
            : _t('Choose an instance to view as a learner.')}
        </span>

        <ModalSection heading={_t('Instance')}>
          <ContextSwitcher
            courseContexts={contexts}
            selectedContextId={selectedContextIdForContextSwitcher}
            onSelect={this.handleContextSelect}
          />
        </ModalSection>

        {displayGroupSwitcher && (
          <ModalSection heading={_t('Group')}>
            <GroupSwitcher selectedGroupId={selectedGroupId} groups={groups} onGroupSelect={this.handleSelectGroup} />
          </ModalSection>
        )}

        <ModalButtonFooter
          onCancelButtonClick={onCloseModal}
          onPrimaryButtonClick={this.onPreview}
          isCancelButtonDisabled={loadingPreview}
          isPrimaryButtonDisabled={loadingPreview}
          primaryButtonContents={loadingPreview ? _t('Loading...') : _t('Continue')}
        />
      </Modal>
    );
  }
}

export default connectToStores<Props, PropsFromCaller>(
  ['ChangeViewSettingsModalStore'],
  ({ ChangeViewSettingsModalStore }) => ({
    selectedBranchId: ChangeViewSettingsModalStore.getSelectedBranchId(),
    selectedGroupId: ChangeViewSettingsModalStore.getSelectedGroupId(),
    selectedContextId: ChangeViewSettingsModalStore.getSelectedContextId(),
    groups: ChangeViewSettingsModalStore.getGroups(),
    branches: ChangeViewSettingsModalStore.getBranches(),
  })
)(ChangeContextBasedCourseViewSettingsModal);
