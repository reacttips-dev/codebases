import React from 'react';
import _ from 'underscore';
import ForumsConnectedReplyCMLInput from 'bundles/discussions/components/repliesList/ForumsConnectedReplyCMLInput';
import NextViewLink from 'bundles/discussions/components/NextViewLink';
import ModerationDropdown from 'bundles/discussions/components/ModerationDropdown';
import { answers } from 'bundles/discussions/constants';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import connectToRouter from 'js/lib/connectToRouter';
import routerConnectToCurrentForum from 'bundles/discussions/utils/routerConnectToCurrentForum';
import OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import OnDemandMentorForumsV1 from 'bundles/naptimejs/resources/onDemandMentorForums.v1';
import GroupForumsV1 from 'bundles/naptimejs/resources/groupForums.v1';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';

import { CMLContent } from 'bundles/compound-assessments/types/FormParts';

type ForumTypes = OnDemandCourseForumsV1 | OnDemandMentorForumsV1 | GroupForumsV1;
type Question = {
  content: {
    question: CMLContent;
  };
  state: { deleted: boolean };
};
type Props = {
  questionId: string;
  sort: string;
  page: number;
  backLink: string;
  authenticated: boolean;
  isSuperuser: boolean;
  answerSavingState: string;
  answerId: string;
  commentId: string;
  question: Question;
  isClosed: boolean;
  isPinned: boolean;
  latestNewThreadId: string;
  contextId: string;
  userId: number;
  courseId: string;
  courseSlug: string;
  currentForum: ForumTypes;
  currentForumUrl: string;
  hasModerationRole: boolean;
  dontNotify?: boolean;
  editReason?: string;
  showEditor: boolean;
};

type AnswerSavingState = Record<string, unknown>; // TODO: figure out a more detailed type

type PropsFromStores = {
  question;
  courseId: string;
  courseSlug: string;
  answerSavingState: AnswerSavingState;
  isClosed: boolean;
  isPinned: boolean;
  latestNewThreadId: string;
  userId: string;
  authenticated: boolean;
  isSuperuser: boolean;
};

type PropsFromCaller = {
  forumQuestionId: string;
  forumType: string;
  groupId: string;
};

type PropsToComponent = PropsFromCaller & PropsFromStores;

export type ThreadDetailsProps = Props;

export const withThreadDetails = _.compose(
  connectToStores<PropsToComponent, PropsFromCaller>(
    ['ThreadDetailsStore', 'ThreadsStore', 'ThreadSettingsStore', 'CourseStore', 'ApplicationStore'],
    ({ ThreadDetailsStore, ThreadsStore, ThreadSettingsStore, CourseStore, ApplicationStore }, { forumQuestionId }) => {
      const question = ThreadDetailsStore.getQuestion(forumQuestionId);
      const newThreadId = ThreadsStore.threadToInsert && ThreadsStore.threadToInsert.questionId;
      return {
        question,
        courseId: CourseStore.getCourseId(),
        courseSlug: CourseStore.getCourseSlug(),
        answerSavingState: question && ThreadDetailsStore.savingStates[question.id],
        isClosed: ThreadSettingsStore.isClosed(),
        isPinned: ThreadSettingsStore.isPinned(),
        latestNewThreadId: newThreadId,
        userId: ApplicationStore.getUserData().id,
        authenticated: ApplicationStore.isAuthenticatedUser(),
        isSuperuser: ApplicationStore.isSuperuser(),
      };
    }
  ),
  discussionsForumsHOC({
    fields: ['link', 'title'],
    subcomponents: [ModerationDropdown],
  }),
  connectToRouter(routerConnectToCurrentForum)
);
