import React from 'react';

import {
  SvgUngradedAssignment,
  SvgSlideshow,
  SvgQuiz,
  SvgProgrammingAssignment,
  SvgGradedAssignment,
  SvgNotes,
  SvgDiscussionForum,
  SvgReviewYourPeers,
  SvgReading,
  SvgBrowser,
} from '@coursera/coursera-ui/svg';

import CourseMaterialNextUpVideoThumbnail from 'bundles/course-home/page-course-welcome/next-step-card/v2/components/CourseMaterialNextUpVideoThumbnail';

import type { CourseMaterialContentSummary } from 'bundles/naptimejs/resources/__generated__/GuidedCourseNextStepsV1';
import type { Svg } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/course-home';

type NextUpContent = {
  icon: React.ReactElement;
  label: string;
};

const getIcon = (Component: Svg) => {
  return <Component size={30} color="black" style={{ flexShrink: 0, marginRight: 10 }} />;
};

export default (
  courseId: string,
  itemId: string,
  typeName: CourseMaterialContentSummary['typeName']
): NextUpContent => {
  switch (typeName) {
    case 'lecture':
      return {
        icon: <CourseMaterialNextUpVideoThumbnail courseId={courseId} itemId={itemId} />,
        label: _t('Video'),
      };
    case 'assessOpenSinglePage':
      return {
        icon: getIcon(SvgQuiz),
        label: _t('Single-page assessment'),
      };
    case 'closedPeer':
      return {
        icon: getIcon(SvgReviewYourPeers),
        label: _t('Review your peers'),
      };
    case 'discussionPrompt':
      return {
        icon: getIcon(SvgDiscussionForum),
        label: _t('Discussion prompt'),
      };
    case 'exam':
      return {
        icon: getIcon(SvgQuiz),
        label: _t('Exam'),
      };
    case 'gradedDiscussionPrompt':
      return {
        icon: getIcon(SvgGradedAssignment),
        label: _t('Discussion prompt'),
      };
    case 'gradedLti':
      return {
        icon: getIcon(SvgGradedAssignment),
        label: _t('LTI'),
      };
    case 'gradedPeer':
      return {
        icon: getIcon(SvgGradedAssignment),
        label: _t('Peer-graded assignment'),
      };
    case 'gradedProgramming':
      return {
        icon: getIcon(SvgGradedAssignment),
        label: _t('Programming assignment'),
      };
    case 'gradedWidget':
      return {
        icon: getIcon(SvgGradedAssignment),
        label: _t('Widget'),
      };
    case 'notebook':
      return {
        icon: getIcon(SvgNotes),
        label: _t('Notebook'),
      };
    case 'peer':
    case 'phasedPeer':
      return {
        icon: getIcon(SvgGradedAssignment),
        label: _t('Peer-graded assignment'),
      };
    case 'programming':
      return {
        icon: getIcon(SvgProgrammingAssignment),
        label: _t('Programming assignment'),
      };
    case 'quiz':
      return {
        icon: getIcon(SvgQuiz),
        label: _t('Quiz'),
      };
    case 'singleQuestionSubmit':
      return {
        icon: getIcon(SvgQuiz),
        label: _t('Single-question submission'),
      };
    case 'slideshow':
      return {
        icon: getIcon(SvgSlideshow),
        label: _t('Slideshow'),
      };
    case 'staffGraded':
      return {
        icon: getIcon(SvgGradedAssignment),
        label: _t('Staff-graded assignment'),
      };
    case 'supplement':
      return {
        icon: getIcon(SvgReading),
        label: _t('Reading'),
      };
    case 'teammateReview':
      return {
        icon: getIcon(SvgReading),
        label: _t('Teammate Review'),
      };
    case 'ungradedLab':
      return {
        icon: getIcon(SvgProgrammingAssignment),
        label: _t('Lab'),
      };
    case 'ungradedLti':
      return {
        icon: getIcon(SvgUngradedAssignment),
        label: _t('LTI'),
      };
    case 'ungradedProgramming':
      return {
        icon: getIcon(SvgUngradedAssignment),
        label: _t('Programming assignment'),
      };
    case 'ungradedWidget':
      return {
        icon: getIcon(SvgUngradedAssignment),
        label: _t('Widget'),
      };
    case 'workspaceLauncher':
      return {
        icon: getIcon(SvgBrowser),
        label: _t('Lab'),
      };
    default:
      return { icon: <div />, label: '' };
  }
};
