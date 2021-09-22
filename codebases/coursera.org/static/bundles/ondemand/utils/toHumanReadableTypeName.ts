import type { ContentSummary } from 'bundles/course-v2/types/ContentSummary';

import Tracks from 'pages/open-course/common/models/tracks';
import _t from 'i18n!nls/ondemand';

/**
 * Given a onDemandCourseMaterialItems.v2 type name, return
 * a human readable type name.
 * @deprecated All learner-side views of items should go through
 * bundles/learner-progress.
 */
export default function toHumanReadableTypeName(
  typeName: string,
  trackId?: string,
  contentSummary?: ContentSummary,
  isGuidedProject?: boolean
): string {
  // using contentSummary[typeName] for graphql query response in degree-home/utils/ItemState.js
  // @ts-ignore TODO: contentSummary[typeName] is casted to any for typeName: string
  const itemContentSummary = (contentSummary && (contentSummary.definition || contentSummary[typeName])) || {};

  switch (typeName) {
    case 'assessOpenSinglePage':
    case 'quiz':
      return _t('Practice Quiz');
    case 'peer':
      return _t('Practice Peer-graded Assignment');
    case 'closedPeer':
    case 'gradedPeer':
    case 'phasedPeer':
      if (itemContentSummary.isMentorGraded) {
        return _t('Mentor Graded Assignment');
      } else if (trackId === Tracks.HONORS_TRACK) {
        return _t('Honors Peer-graded Assignment');
      } else {
        return _t('Peer-graded Assignment');
      }
    case 'ungradedProgramming':
      return _t('Practice Programming Assignment');
    case 'gradedProgramming':
    case 'programming':
      if (trackId === Tracks.HONORS_TRACK) {
        return _t('Honors Programming Assignment');
      } else {
        return _t('Programming Assignment');
      }
    case 'exam':
      if (trackId === Tracks.HONORS_TRACK) {
        return _t('Honors Quiz');
      } else {
        return _t('Quiz');
      }
    case 'splitPeerReviewItem':
      return _t('Review Your Peers');
    case 'discussionPrompt':
      return _t('Discussion Prompt');
    case 'gradedDiscussionPrompt':
      return _t('Graded Discussion Prompt');
    case 'teammateReview':
      return _t('Teammate Review');
    case 'staffGraded':
      if (itemContentSummary.isTeamSubmissionEnabled) {
        return _t('Graded Team Assignment');
      } else {
        return _t('Graded Assignment');
      }
    case 'lessonChoice':
      return _t('Lesson Choice');
    case 'assignmentGroup':
      return _t('Assignment Group');
    case 'workspaceLauncher':
      return _t('Workspace');
    case 'ungradedLab':
      return _t('Lab');
    case 'supplement':
      return _t('Reading');
    case 'lecture':
      return _t('Video');
    case 'notebook':
      return _t('Notebook');
    case 'singleQuestionSubmit':
    case 'ungradedLti':
      if (isGuidedProject) {
        return _t('Guided Project');
      } else {
        return _t('Ungraded External Tool');
      }
    case 'gradedLti':
      if (isGuidedProject) {
        return _t('Guided Project');
      } else {
        return _t('Graded External Tool');
      }
    case 'wiseFlow':
      return _t('External Item from WISEflow');
    case 'placeholder':
      return _t('Deprecated Item');
    default:
      if (trackId === Tracks.HONORS_TRACK) {
        return _t('Honors');
      } else {
        return '';
      }
  }
}
