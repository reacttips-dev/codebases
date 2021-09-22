/**
 * For SSR this should not be a singleton, and should export the app, not a context instance.
 * However, we need access to the shared context within React components that are within a Backbone view.
 * This gives us a way to do that.
 */

import AliceStore from 'bundles/alice/stores/AliceStore';

// proctor config
import { store as ProctorConfigStore } from 'bundles/assess-common/reducers/ProctorConfigReducer';

// Peer review assignments
import { store as PeerAssignmentStore } from 'bundles/peer/reducers/PeerAssignmentReducer';
import { store as PeerDisplayablePhaseScheduleStore } from 'bundles/peer/reducers/DisplayablePhaseScheduleReducer';
import { store as PeerSubmissionDraftStore } from 'bundles/peer/reducers/PeerSubmissionDraftReducer';
import { store as PeerReviewQueueStore } from 'bundles/peer/reducers/PeerReviewQueueReducer';
import { store as PeerSubmissionAppStateStore } from 'bundles/peer/reducers/PeerSubmissionAppStateReducer';
import { store as PeerPermissionsAndProgressesStore } from 'bundles/peer/reducers/PeerPermissionsAndProgressesReducer';
import { store as PeerViewSubmissionStore } from 'bundles/peer/reducers/PeerViewSubmissionReducer';

import ChangeViewSettingsModalStore from 'bundles/ondemand/stores/ChangeViewSettingsModalStore';
import ClassmatesProfileStore from 'bundles/classmates/stores/ClassmatesProfileStore';
import ComputedModelStore from 'bundles/course/stores/ComputedModelStore';
import CourseReferencesStore from 'bundles/course-home/page-course-references/stores/CourseReferencesStore';
import GroupEventsStore from 'bundles/group-events/stores/GroupEventsStore';
import GroupSettingStore from 'bundles/group-enroll/stores/GroupSettingStore';
import NaptimeStore from 'bundles/naptimejs/stores/NaptimeStore';
import CertificateStore from 'bundles/ondemand/stores/CertificateStore';
import CoursePresentGradeStore from 'bundles/ondemand/stores/CoursePresentGradeStore';
import CourseViewGradeStore from 'bundles/ondemand/stores/CourseViewGradeStore';
import CourseScheduleStore from 'bundles/ondemand/stores/CourseScheduleStore';
import CourseStore from 'bundles/ondemand/stores/CourseStore';
import HonorsUserPreferencesStore from 'bundles/ondemand/stores/HonorsUserPreferencesStore';
import ProgressStore from 'bundles/ondemand/stores/ProgressStore';
import SessionFilterStore from 'bundles/discussions/stores/SessionFilterStore';
import S12nStore from 'bundles/ondemand/stores/S12nStore';
import VerificationStore from 'bundles/ondemand/stores/VerificationStore';
import PeerAdminStore from 'bundles/peer-admin/stores/PeerAdminStore';
import ProfileStore from 'bundles/profile/stores/ProfileStore';
import ApplicationStore from 'bundles/ssr/stores/ApplicationStore';
import CourseMembershipStore from 'bundles/ondemand/stores/CourseMembershipStore';
import SessionStore from 'bundles/course-sessions/stores/SessionStore';
import MenuStore from 'bundles/ondemand/stores/MenuStore';
import ModuleLearningObjectivesStore from 'bundles/learner-learning-objectives/stores/ModuleLearningObjectivesStore';
import ItemFeedbackStore from 'bundles/content-feedback/stores/ItemFeedbackStore';
import ProgrammingGradingProblemsStore from 'bundles/content-feedback/stores/ProgrammingGradingProblemsStore';
import { store as WidgetManagerStore } from 'bundles/widget/reducers/WidgetManagerReducer';
import UngradedLabItemStore from 'bundles/item-ungraded-lab/stores/UngradedLabItemStore';
import WorkspaceItemStore from 'bundles/item-workspace/stores/WorkspaceItemStore';
import HighlightingUIPanelVisibilityPreferenceStore from 'bundles/video-highlighting/utils/HighlightingUIPanelVisibilityPreferenceStore';
import Fluxible from 'vendor/cnpm/fluxible.v0-4/index';
import batchedUpdatePlugin from 'vendor/cnpm/fluxible.v0-4/addons/batchedUpdatePlugin';
import routesFactory from 'bundles/ondemand/ondemandRoutes';

function appEnvFactory() {
  const app = new Fluxible({
    component: routesFactory(),
  });

  app.registerStore(AliceStore);
  app.registerStore(ApplicationStore);
  app.registerStore(CertificateStore);
  app.registerStore(ChangeViewSettingsModalStore);
  app.registerStore(ClassmatesProfileStore);
  app.registerStore(ComputedModelStore);
  app.registerStore(CourseMembershipStore);
  app.registerStore(CoursePresentGradeStore);
  app.registerStore(CourseReferencesStore);
  app.registerStore(CourseScheduleStore);
  app.registerStore(CourseStore);
  app.registerStore(CourseViewGradeStore);
  app.registerStore(GroupEventsStore);
  app.registerStore(GroupSettingStore);
  app.registerStore(HighlightingUIPanelVisibilityPreferenceStore);
  app.registerStore(HonorsUserPreferencesStore);
  app.registerStore(ItemFeedbackStore);
  app.registerStore(MenuStore);
  app.registerStore(ModuleLearningObjectivesStore);
  app.registerStore(NaptimeStore);
  app.registerStore(PeerAdminStore);
  app.registerStore(ProfileStore);
  app.registerStore(ProgrammingGradingProblemsStore);
  app.registerStore(ProgressStore);
  app.registerStore(S12nStore);
  app.registerStore(SessionFilterStore);
  app.registerStore(SessionStore);
  app.registerStore(UngradedLabItemStore);
  app.registerStore(VerificationStore);
  app.registerStore(WidgetManagerStore);
  app.registerStore(WorkspaceItemStore);

  // proctor config
  app.registerStore(ProctorConfigStore);

  // peer review assignments
  app.registerStore(PeerAssignmentStore);
  app.registerStore(PeerDisplayablePhaseScheduleStore);
  app.registerStore(PeerSubmissionDraftStore);
  app.registerStore(PeerReviewQueueStore);
  app.registerStore(PeerSubmissionAppStateStore);
  app.registerStore(PeerPermissionsAndProgressesStore);
  app.registerStore(PeerViewSubmissionStore);

  app.plug(batchedUpdatePlugin());

  return app;
}

export default appEnvFactory;
