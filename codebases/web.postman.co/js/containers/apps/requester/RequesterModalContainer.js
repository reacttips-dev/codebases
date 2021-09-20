import React, { Component } from 'react';

import AddRequestToCollectionContainer from '@@runtime-repl/request-http/modals/AddRequestToCollectionContainer';
import AddMultipleRequestsToCollectionContainer from '@@runtime-repl/collection/modals/AddMultipleRequestsToCollectionContainer';
import ForkRecommendationModalContainer from '../../collections/ForkRecommendationModalContainer';
import ForkCollectionModalContainer from '../../collections/ForkCollectionModalContainer';
import DeleteCollectionModalContainer from '@@runtime-repl/collection/modals/DeleteCollectionModalContainer';
import ExportCollectionModalContainer from '@@runtime-repl/collection/modals/ExportCollectionModalContainer';
import DeleteFolderModalContainer from '@@runtime-repl/folder/modals/DeleteFolderModalContainer';
import DeleteRequestModalContainer from '@@runtime-repl/request-http/modals/DeleteRequestModalContainer';
import DeleteRequestMethodModalContainer from '@@runtime-repl/request-http/modals/DeleteRequestMethodModalContainer';
import ImportCollectionConflictModalContainer from '../../import/ImportCollectionConflictModalContainer';
import ManageHeaderPresetModalContainer from '@@runtime-repl/header-preset/ManageHeaderPresetModalContainer';
import DeleteHeaderPresetContainer from '@@runtime-repl/header-preset/DeleteHeaderPresetContainer';
import UserSignOutModalContainer from '../../user/UserSignOutModalContainer';
import OpenExternalLinkModal from '@postman-app-monolith/renderer/js/external-navigation/OpenExternalLinkModalContainer';
import UserInvalidSessionModalContainer from '../../user/UserInvalidSessionModalContainer';
import SettingsModalContainer from '../../settings/SettingsModalContainer';
import CookiesManagementModalContainer from '@@runtime-repl/cookies/CookiesManagementModalContainer';
import ProxySettingsModalContainer from '../../proxy/ProxySettingsModalContainer';
import SyncConflictModalContainer from '../../sync/SyncConflictModalContainer';
import SyncIssueModalContainer from '../../sync/SyncIssueModalContainer';
import RequesterTabCloseUnsavedModalContainer from '../../tabs/RequesterTabCloseUnsavedModalContainer';
import UpdateModalContainer from '../../update/UpdateModalContainer';
import DiffModalView from '../../../components/base/diff/DiffModalView';
import DeleteMonitorConfirmation from '../../../components/collections/browser/monitors/DeleteMonitorConfirmation';
import DeleteMockConfirmation from '../../../components/collections/browser/mocks/DeleteMockConfirmation';
import ExampleDeleteConfirmation from '@@runtime-repl/example/ExampleDeleteConfirmation';
import ConfirmationModal from '../../common/ConfirmationModalContainer';
import ForceCloseAllTabsConfirmation from '../../../components/tabs/ForceCloseAllTabsConfirmation';
import DeleteHistoryConfirmation from '@@runtime-repl/history/DeleteHistoryConfirmation';
import PublishDocsSignedoutModal from '../../../components/collections/PublishDocsSignedoutModal';
import SwitchAccountConfirmationModal from '../../../containers/user/SwitchAccountConfirmationModal';
import AddAccountConfirmationModal from '../../../containers/user/AddAccountConfirmationModal';
import OAuth2ManageTokensModalContainer from '@@runtime-repl/auth/OAuth2ManageTokensModalContainer';
import OAuth2WaitingModalContainer from '@@runtime-repl/auth/OAuth2WaitingModalContainer';
import SyncTokenConfirmationContainer from '@@runtime-repl/auth/SyncTokenConfirmationContainer';

import CreateNewMonitorModalContainer from '../../../containers/new-button/CreateNewMonitorModalContainer';
import CreateNewMockModalContainer from '../../../containers/new-button/CreateNewMockModalContainer';
import CreateNewDocumentationModalContainer from '../../../containers/new-button/CreateNewDocumentationModalContainer';
import CustomizeTemplateModalContainer from '../../../containers/new-button/CustomizeTemplateModalContainer';
import ActivityFeedModalContainer from '../../../containers/new-button/ActivityFeedModalContainer';
import WorkspaceJoinModalContainer from '../../../containers/workspaces/WorkspaceJoinModalContainer';
import MissingCurrentWorkspaceModalContainer from '../../../containers/workspaces/MissingCurrentWorkspaceModalContainer';

import CreateNewWorkspaceModalContainer from '../../../containers/workspaces/CreateNewWorkspaceModalContainer';
import WorkspaceDetailsModalContainer from '../../../containers/workspaces/WorkspaceDetailsModalContainer';
import BulkAddToWorkspaceModalContainer from '../../../containers/workspaces/BulkAddToWorkspaceModalContainer';
import DeleteEnvironmentContainer from '@@runtime-repl/environment/modals/DeleteEnvironmentContainer';
import DeleteWorkspaceContainer from '../../../containers/workspaces/DeleteWorkspaceContainer';
import LeaveWorkspaceContainer from '../../../containers/workspaces/LeaveWorkspaceContainer';
import InviteModalContainer from '../../../containers/invite-flows/InviteModalContainer';
import UpgradeTeamModal from '../../../../onboarding/src/features/Homepage/components/UpgradeTeamModal';
import InvitationSentModalContainer from '../../../containers/invite-flows/InvitationSentModalContainer';
import SignedOutInviteModalContainer from '../../../containers/invite-flows/SignedOutInviteModalContainer';
import SetupTeamContainer from '../../../containers/invite-flows/SetupTeamContainer';
import ContextualSignInModalContainer from '../../empty-states/sign-in/ContextualSignInModalContainer';
import SignInModalContainer from '../../empty-states/sign-in/SignInModalContainer';
import InAppModal from '../../../components/messaging/InAppModal';
import UserLoginMigrationModalContainer from '../../../containers/user/UserLoginMigrationModalContainer';
import ChangelogModal from '../../../../schema/components/ChangelogModal';
import CommentDeleteConfirmation from '../../../components/comments/CommentDeleteConfirmation';
import CommentResolveConfirmation from '../../../../collaboration/components/comments/CommentResolveConfirmation';

import RequestToJoinModal from '../../../../onboarding/src/features/Homepage/components/RequestToJoinModal';

import SwitchDirtyVersionModalContainer from '../../../../api-dev/components/api-version/SwitchDirtyVersionModal/SwitchDirtyVersionModalContainer';
import SwitchDeletedVersionModalContainer from '../../../../api-dev/components/api-version/SwitchDeletedVersionModal/SwitchDeletedVersionModalContainer';
import SwitchConflictedVersionModalContainer from '../../../../api-dev/components/api-version/SwitchConflictedVersionModal/SwitchConflictedVersionModalContainer';
import RemoveFromWorkspaceModalContainer from '../../../../collaboration/containers/sharing/RemoveFromWorkspaceModalContainer';
import APIImportCompleteModal from '../../../../api-dev/components/api-import/APIImportCompleteModal/APIImportCompleteModal';
import DeleteAPIContainer from '../../../../api-dev/components/common/DeleteAPIContainer/DeleteAPIContainer';
import CreateAPIVersionModal from '../../../../api-dev/components/api-version/CreateAPIVersionModal/CreateAPIVersionModal';
import { ModalViewManager } from '../../../modules/controllers/ViewHierarchyController';
import UnjoinedWorkspaceModal from '../../../../collaboration/components/workspace/artemis/UnjoinedWorkspaceModal';
import UpdateUserProfileModal from '../../../components/UpdateUserProfileModal/UpdateUserProfileModal';
import UpdateTeamProfileModal from '../../../../team/profile/components/UpdateTeamProfileModal';

import LanguageSettingsModal from '../../../../documentation/components/LanguageSettings/LanguageSettingsModal';
import SnippetModal from '../../../../documentation/components/entity/Request/SnippetModal';
import NotEnoughPermissionsModal from '../../../../collaboration/containers/NotEnoughPermissionsModal';
import TableModal from '../../../../documentation/components/TableModal';
import { BuildV2ModalWrapper } from '../../../../appsdk/modals/BuildV2ModalWrapper';
import UserSignOutWebModal from '../../user/UserSignOutWebModal';
import RequestToActionModal from '../../../../collaboration/containers/request-to-action/RequestToActionModal';
import ScratchpadSetupModal from '../../../../appsdk/scratchpad/components/ScratchpadSetupModal';
import ScratchpadSetupProgressModal from '../../../../appsdk/scratchpad/components/ScratchpadSetupProgressModal';
import EmptyOverlay from '../../scratchpad/EmptyOverlay';
import RunInPostmanWorkspaceSelectModal from '../../../../apinetwork/common/RunInPostmanWorkspaceSelectModal';
import { CreatingTeamModal } from '../../../../onboarding/src/features/TeamOnboarding/pages/CreatingTeam/index';
import { UpgradePlanModal } from '../../../../onboarding/src/features/Modals/UpgradePlanModal/UpgradePlanModal';
import { EnableAutoFlexModal } from '../../../../onboarding/src/features/Modals/UpgradePlanModal/EnableAutoFlexModal';
import StartTrialConfirmationModal from '../../../../onboarding/src/features/FreeTrial/components/StartTrialConfirmationModal';
import { MultiUserTeamModal } from '../../../components/workspaces/experiment/MultiUserTeamModal';
import TeamDiscoveryModal from '../../../../onboarding/src/features/Modals/TeamDiscoveryModal';
import DiscoveryErrorModals from '../../../../onboarding/src/features/TeamOnboarding/pages/TeamProfile/DiscoveryErrorModals';
import { TeamFeatureOverviewModal } from '../../../../onboarding/src/features/FeatureOverview';
import AddApiModal from '../../../../apinetwork/components/PrivateNetwork/modals/AddApiModal';

import SchemaImportConfirmationModal from '../../../../schema/components/SchemaImportConfirmationModal';
import CreateNewPublicWorkspaceModal from '../../../../documentation/components/DocumentationPublishView/ShareToWorkspace/CreateNewPublicWorkspaceModal';
import FlowDeleteConfirmationContainer from '../../../../flow-runner/components/_base/FlowDeleteConfirmationContainer';

export default class RequesterModalContainer extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    ModalViewManager.hasMounted(true);
  }


  render () {
    return (
      <div>
        <AddRequestToCollectionContainer />
        <AddMultipleRequestsToCollectionContainer />
        <ForkRecommendationModalContainer />
        <DeleteCollectionModalContainer />
        <ForkCollectionModalContainer />
        <ExportCollectionModalContainer />
        <DeleteFolderModalContainer />
        <DeleteRequestModalContainer />
        <DeleteRequestMethodModalContainer />
        <FlowDeleteConfirmationContainer />
        <ManageHeaderPresetModalContainer />
        <OpenExternalLinkModal />
        <CookiesManagementModalContainer />
        <SyncConflictModalContainer />
        <SyncIssueModalContainer />
        <RequesterTabCloseUnsavedModalContainer />
        <UpdateModalContainer />
        <ImportCollectionConflictModalContainer />
        <DiffModalView />
        <DeleteMonitorConfirmation />
        <DeleteMockConfirmation />
        <ExampleDeleteConfirmation />
        <ForceCloseAllTabsConfirmation />
        <DeleteHistoryConfirmation />
        <PublishDocsSignedoutModal />
        <SwitchAccountConfirmationModal />
        <AddAccountConfirmationModal />
        <ActivityFeedModalContainer />
        <OAuth2ManageTokensModalContainer />
        <OAuth2WaitingModalContainer />
        <SyncTokenConfirmationContainer />
        <CreateNewMonitorModalContainer />
        <CreateNewMockModalContainer />
        <CreateNewDocumentationModalContainer />
        <CustomizeTemplateModalContainer />
        <WorkspaceJoinModalContainer />
        <RemoveFromWorkspaceModalContainer />
        <WorkspaceDetailsModalContainer />
        <BulkAddToWorkspaceModalContainer />
        <MissingCurrentWorkspaceModalContainer />
        <DeleteEnvironmentContainer />
        <DeleteWorkspaceContainer />
        <LeaveWorkspaceContainer />
        <DeleteHeaderPresetContainer />
        <InviteModalContainer />
        <UpgradeTeamModal />
        <InvitationSentModalContainer />
        <SetupTeamContainer />
        <SignedOutInviteModalContainer />
        <InAppModal />
        <UserLoginMigrationModalContainer />
        <ScratchpadSetupProgressModal />
        <ScratchpadSetupModal />
        <SwitchDirtyVersionModalContainer />
        <SwitchDeletedVersionModalContainer />
        <SwitchConflictedVersionModalContainer />
        <ChangelogModal />
        <RequestToJoinModal />
        <CommentDeleteConfirmation />
        <CommentResolveConfirmation />
        <APIImportCompleteModal />
        <DeleteAPIContainer />
        <CreateAPIVersionModal />
        <UpdateUserProfileModal />
        <UpdateTeamProfileModal />
        <RequestToActionModal />
        <SettingsModalContainer />
        <EmptyOverlay />
        <RunInPostmanWorkspaceSelectModal />
        <CreatingTeamModal />
        <UpgradePlanModal />
        <TeamFeatureOverviewModal />
        <EnableAutoFlexModal />
        <StartTrialConfirmationModal />
        <MultiUserTeamModal />
        <TeamDiscoveryModal />
        <DiscoveryErrorModals />
        <SchemaImportConfirmationModal />
        <CreateNewPublicWorkspaceModal />
        <AddApiModal />

        { /* Add any modal above this, since Confirmation modal should be above all normal modals */}
        <ConfirmationModal />

        {/* Sign-in modals have higher priority than confirmation modals,
            but lower priority than sign-out modals */}
        <ContextualSignInModalContainer />
        <SignInModalContainer />

        { /* Add any modal above this, since sign-out modal takes the highest priority */}
        <UserInvalidSessionModalContainer />
        <UserSignOutWebModal />
        <UserSignOutModalContainer />
        <UnjoinedWorkspaceModal />
        <NotEnoughPermissionsModal />
        <LanguageSettingsModal />
        <SnippetModal />
        <TableModal />

        <BuildV2ModalWrapper />
      </div>
    );
  }
}
