import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import type { CourseContentDataRenderProps } from 'bundles/video-highlighting/review-page/types';

import type {
  OnDemandCourseMaterialsV2SlugQuery,
  OnDemandCourseMaterialsV2SlugQueryVariables,
} from 'bundles/video-highlighting/review-page/data/__generated__/OnDemandCourseMaterialsV2';

/* eslint-disable graphql/template-strings */
export const courseMaterialsQuery = gql`
  query VideoCourseMaterialsQuery($slug: String!) {
    OnDemandCourseMaterialsV2 @naptime {
      slug(slug: $slug, showHidden: true, includes: "modules") {
        elements {
          id
          name
        }
        linked {
          onDemandCourseMaterialModulesV1 {
            id
            name
          }
        }
      }
    }
  }
`;
/* eslint-enable graphql/template-strings */

export const CourseContentDataProvider = ({
  courseSlug,
  children,
}: {
  courseSlug: string;
  children: (renderProps: CourseContentDataRenderProps) => React.ReactNode;
}) => {
  return (
    <Query<OnDemandCourseMaterialsV2SlugQuery, OnDemandCourseMaterialsV2SlugQueryVariables>
      query={courseMaterialsQuery}
      variables={{ slug: courseSlug }}
    >
      {({ loading, error, data }) => {
        if (error || loading)
          return children({
            course: null,
            modules: null,
            error: !!error,
            loading: !!loading,
          });

        // @ts-expect-error TSMIGRATION-3.9
        const { slug } = data.OnDemandCourseMaterialsV2 || {};
        // @ts-expect-error TSMIGRATION-3.9
        const courseId = (slug || {}).elements[0].id;
        // @ts-expect-error TSMIGRATION-3.9
        const courseName = (slug || {}).elements[0].name;
        // @ts-expect-error TSMIGRATION-3.9
        const modules = ((slug || {}).linked || {}).onDemandCourseMaterialModulesV1;

        return children({
          course: { id: courseId, name: courseName, slug: courseSlug },
          modules,
          error: false,
          loading: false,
        });
      }}
    </Query>
  );
};

export default CourseContentDataProvider;
