import React from 'react';
import _t from 'i18n!nls/course-item-resource-panel';
import PropTypes from 'prop-types';
import ForumPostDataProvider from './__providers__/ForumPostDataProvider';
import ForumThread, { ShimmerState } from './ForumThread';
import ForumReplies from './ForumReplies';

type Props = {
  userId: string;
  courseId: string;
  forumQuestionId: string;
  forumId?: string;
};

type Context = {
  courseId: string;
  questionId: string;
  forumId: string;
};

class ResourcePanelForumThreadContext extends React.Component<Props, {}, Context> {
  static childContextTypes = {
    forumId: PropTypes.string,
    courseId: PropTypes.string,
    questionId: PropTypes.string,
  };

  getChildContext = () => {
    return {
      forumId: this.props.forumId,
      courseId: this.props.courseId,
      questionId: this.props.forumQuestionId,
    };
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default function (props: Props) {
  return (
    <div>
      <ForumPostDataProvider userId={props.userId} courseId={props.courseId} forumQuestionId={props.forumQuestionId}>
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
            const { forumPost, replies } = data;
            if (forumPost && 'content' in forumPost) {
              content = (
                <ResourcePanelForumThreadContext
                  forumId={data?.forumPost?.forumId}
                  forumQuestionId={props.forumQuestionId}
                  courseId={props.courseId}
                  userId={props.userId}
                >
                  <ForumThread forumPost={forumPost} replies={replies}>
                    {({ id, highlightedId, topLevelAnswerCount }) => (
                      <ForumReplies highlightedId={highlightedId} id={id} topLevelAnswerCount={topLevelAnswerCount} />
                    )}
                  </ForumThread>
                </ResourcePanelForumThreadContext>
              );
            }
          }
          return content;
        }}
      </ForumPostDataProvider>
    </div>
  );
}
