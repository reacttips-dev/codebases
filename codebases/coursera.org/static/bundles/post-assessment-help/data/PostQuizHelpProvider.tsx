import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import user from 'js/lib/user';
import pendo, { LEARNER_API_KEY } from 'js/lib/pendo';
import { isPostQuizHelpEnabled } from 'bundles/post-assessment-help/utils';

import {
  PostQuizHelpV1ByCourseItemIdQuery,
  PostQuizHelpV1ByCourseItemIdQueryVariables,
  SuggestedItem as QuizDataResponseSuggestedItem,
} from 'bundles/post-assessment-help/data/__generated__/PostQuizHelpV1';

import { SuggestedItem, PostQuizSuggestion } from '../types';

type QuizHelpDataProps = {
  loading: boolean;
  error: boolean;
  postQuizSuggestions?: PostQuizSuggestion[];
};

type Props = {
  courseId: string;
  itemId: string;
  children: (props: QuizHelpDataProps) => React.ReactNode;
};

/* eslint-disable graphql/template-strings */
export const PostQuizHelpQuery = gql`
  query PostQuizHelpQuery($courseId: String!, $itemId: String!) {
    PostQuizHelpV1 @naptime {
      byCourseItemId(courseId: $courseId, itemId: $itemId) {
        elements {
          id
          courseId
          courseBranchId
          versionedQuestionId
          versionedAssessmentId
          suggestedItems {
            suggestedItemId
            itemDetails {
              typeName
              definition
            }
            timeCommitment
            title
            url
          }
        }
      }
    }
  }
`;

const reshapeSuggestion = ({
  suggestedItemId,
  title,
  itemDetails: { typeName },
  timeCommitment,
  url,
}: QuizDataResponseSuggestedItem): SuggestedItem => ({
  id: suggestedItemId,
  title,
  typeName,
  timeCommitment,
  url,
});

/**
 * Render prop component that passes post quiz help data
 * to children (suggested material per question). Booleans for error
 * and loading state passed as well - in this case data is undefined.
 */
class PostQuizHelpProvider extends React.Component<Props> {
  componentDidMount() {
    const { external_id: externalId, is_staff: isStaff, is_superuser: isSuperuser } = user.get();
    const { courseId } = this.props;

    if (isPostQuizHelpEnabled(courseId)) {
      pendo.init(
        {
          visitor: {
            id: externalId,
            isStaff,
            isSuperuser,
          },
        },
        LEARNER_API_KEY
      );
    }
  }

  render() {
    const { courseId, itemId, children } = this.props;

    return (
      <Query<PostQuizHelpV1ByCourseItemIdQuery, PostQuizHelpV1ByCourseItemIdQueryVariables>
        query={PostQuizHelpQuery}
        variables={{ courseId, itemId }}
        skip={!isPostQuizHelpEnabled(courseId)}
      >
        {({ loading, error, data }) => {
          if (!isPostQuizHelpEnabled(courseId)) {
            return children({
              error: false,
              loading: false,
            });
          }

          if (error || loading) {
            return children({
              error: !!error,
              loading,
            });
          }
          const elements = data?.PostQuizHelpV1?.byCourseItemId?.elements || [];
          const suggestions = elements.map((element) => {
            return {
              id: element.id,
              courseId: element.courseId,
              courseBranchId: element.courseBranchId,
              versionedQuestionId: element.versionedQuestionId,
              versionedAssessmentId: element.versionedAssessmentId,
              suggestedItems: element.suggestedItems.map(reshapeSuggestion),
            };
          });
          return children({ postQuizSuggestions: suggestions, error: false, loading });
        }}
      </Query>
    );
  }
}

export default PostQuizHelpProvider;
