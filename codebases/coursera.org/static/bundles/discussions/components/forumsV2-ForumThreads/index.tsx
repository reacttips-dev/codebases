/* @jsx jsx */
import React from 'react';
import _t from 'i18n!nls/discussions';
import PropTypes from 'prop-types';
import store from 'js/lib/coursera.store';
import _ from 'underscore';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import connectToRouter from 'js/lib/connectToRouter';
import { fetchThread, fetchAnswers } from 'bundles/discussions/actions/ThreadDetailsActions';
import routerConnectToCurrentForum from 'bundles/discussions/utils/routerConnectToCurrentForum';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import ForumsConnectedReplyCMLInput from 'bundles/discussions/components/repliesList/ForumsConnectedReplyCMLInput';
import NextViewLink from 'bundles/discussions/components/NextViewLink';
import ModerationDropdown from 'bundles/discussions/components/ModerationDropdown';
import type OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import type OnDemandMentorForumsV1 from 'bundles/naptimejs/resources/onDemandMentorForums.v1';
import type GroupForumsV1 from 'bundles/naptimejs/resources/groupForums.v1';
import type { ForumPostWithCreator } from 'bundles/discussions/components/forumsV2-ForumThreads/__providers__/ForumPostDataProvider/__types__';
import { savingStates } from 'bundles/discussions/constants';
import { getPostIdFromQuestion } from 'bundles/discussions/utils/threadUtils';
import { css, jsx } from '@emotion/react';
import ThreadSettingsWithData from 'bundles/discussions/components/threadSettings/ThreadSettingsWithData';
import { withTheme } from '@coursera/cds-core';
import type { Theme } from '@coursera/cds-core';
import ForumPostDataProvider from './__providers__/ForumPostDataProvider';
import ForumThread, { ShimmerState } from './ForumThread';
import ForumReplies from './ForumReplies';

type PropsFromCaller = {
  questionId: string;
  courseId: string;
  forumQuestionId: string;
  sort: string;
  page: number;
};

type PropsFromStores = {
  userId: number;
  answerSavingState: string;
  question: ForumPostWithCreator;
  courseSlug: string;
  enableThreadSettings: boolean;
  allAnswerSavingStates: Record<string, string>;
  retryCml: Record<string, string>;
};

type Props = PropsFromCaller &
  PropsFromStores & {
    forumId?: string;
    contextId: string;
    currentForum: OnDemandCourseForumsV1 | OnDemandMentorForumsV1 | GroupForumsV1;
    currentForumUrl: string;
    isPinned: boolean;
    theme: Theme;
  };

type ForumThreadContextProps = {
  courseId: string;
  forumQuestionId: string;
  forumId?: string;
  userId: string;
  currentForumUrl: string;
};

type Context = {
  courseId: string;
  questionId: string;
  forumId: string;
  currentForumUrl: string;
};

class ForumThreadContext extends React.Component<ForumThreadContextProps, {}, Context> {
  static childContextTypes = {
    forumId: PropTypes.string,
    courseId: PropTypes.string,
    questionId: PropTypes.string,
    currentForumUrl: PropTypes.string,
  };

  getChildContext = () => {
    return {
      forumId: this.props.forumId,
      courseId: this.props.courseId,
      questionId: this.props.forumQuestionId,
      currentForumUrl: this.props.currentForumUrl,
    };
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}

class DiscussionsForumThread extends React.Component<Props> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { questionId, sort, page, userId, contextId, currentForum, courseId, courseSlug } = this.props;

    this.context.executeAction(fetchThread, {
      questionId,
      userId,
      contextId,
      sort,
      page,
      forumType: currentForum?.forumType.typeName,
    });

    this.context.executeAction(fetchAnswers, {
      questionId,
      userId,
      courseId,
      courseSlug,
      contextId,
      sort,
      page,
      forumType: currentForum && currentForum.forumType.typeName,
      includeDeleted: false, // TODO: implement  this.props.hasModerationRole,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { questionId, userId, courseId, courseSlug, contextId, sort, page, currentForum } = nextProps;
    if (nextProps.sort !== this.props.sort || nextProps.page !== this.props.page) {
      this.context.executeAction(fetchAnswers, {
        questionId,
        userId,
        courseId,
        courseSlug,
        contextId,
        sort,
        page,
        forumType: currentForum && currentForum.forumType.typeName,
        includeDeleted: false, // TODO: implement  this.props.hasModerationRole,
      });
    } else if (
      this.props.answerSavingState === savingStates.SAVING &&
      nextProps.answerSavingState === savingStates.SAVED
    ) {
      this.context.executeAction(fetchAnswers, {
        questionId,
        userId,
        courseId,
        courseSlug,
        contextId,
        sort,
        page,
        forumType: currentForum && currentForum.forumType.typeName,
        includeDeleted: false, // TODO: implement this.props.hasModerationRole,
      });
    }
  }

  render() {
    const userId = this.props.userId.toString();
    const { courseId, forumQuestionId, question, currentForumUrl, allAnswerSavingStates, retryCml } = this.props;
    store.set('discussionsV2Context', {
      courseId,
      userId,
      question,
      answerSavingStates: allAnswerSavingStates,
      retryCml,
    });

    return (
      <div>
        <ForumPostDataProvider userId={userId} courseId={courseId} forumQuestionId={forumQuestionId}>
          {({ loading, error, data }) => {
            let content: JSX.Element | null = null;

            if (loading) {
              content = (
                <div>
                  <ShimmerState />
                </div>
              );
            }

            if (error) {
              content = <div>{_t('error state')}</div>;
            }

            if (typeof data === 'object' && 'forumPost' in data) {
              const { forumPost } = data;
              if (forumPost && 'content' in forumPost) {
                content = (
                  <ForumThreadContext
                    forumId={question?.forumId}
                    forumQuestionId={question?.forumQuestionId}
                    courseId={courseId}
                    userId={userId}
                    currentForumUrl={currentForumUrl}
                  >
                    <div
                      className="discussion-content"
                      css={css`
                        position: relative;
                      `}
                    >
                      {this.props.enableThreadSettings && (
                        <div
                          css={css`
                            position: absolute;
                            right: 0px;
                            top: 30px;
                          `}
                        >
                          <ThreadSettingsWithData
                            question={question}
                            shouldShowMoveThread={true}
                            courseSlug={this.props.courseSlug}
                          />
                        </div>
                      )}
                      <ForumThread forumPost={question} isPinned={this.props.isPinned}>
                        {({ id, highlightedId, topLevelAnswerCount }) => (
                          <ForumReplies
                            highlightedId={highlightedId}
                            id={id}
                            topLevelAnswerCount={topLevelAnswerCount}
                          />
                        )}
                      </ForumThread>
                    </div>
                  </ForumThreadContext>
                );
              }
            }
            return content;
          }}
        </ForumPostDataProvider>
      </div>
    );
  }
}

export default _.compose(
  connectToStores<PropsFromCaller & PropsFromStores, PropsFromCaller>(
    ['ThreadDetailsStore', 'ThreadSettingsStore', 'CourseStore', 'ApplicationStore'],
    ({ ThreadDetailsStore, ThreadSettingsStore, CourseStore, ApplicationStore }, { forumQuestionId }) => {
      const question = ThreadDetailsStore.getQuestion(forumQuestionId);
      return {
        courseSlug: CourseStore.getCourseSlug(),
        question: { ...question, questionId: getPostIdFromQuestion(question) }, // making all question objects contain a questionId, instead of other variations.
        answerSavingState: question && ThreadDetailsStore.savingStates[question.id],
        isClosed: ThreadSettingsStore.isClosed(),
        isPinned: ThreadSettingsStore.isPinned(),
        enableThreadSettings: true,
        userId: ApplicationStore.getUserData().id,
        allAnswerSavingStates: ThreadDetailsStore.savingStates,
        retryCml: ThreadDetailsStore.retryCml,
      };
    }
  ),
  discussionsForumsHOC({
    fields: ['link', 'title'],
    subcomponents: [NextViewLink, ForumsConnectedReplyCMLInput, ModerationDropdown],
  }),
  connectToRouter(routerConnectToCurrentForum)
)(withTheme(DiscussionsForumThread));
