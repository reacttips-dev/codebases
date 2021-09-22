import React from 'react';
import _ from 'underscore';
import connectToRouter from 'js/lib/connectToRouter';
import Retracked from 'js/app/retracked';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import PageHeader from 'bundles/page/components/PageHeader';
import { InCourseSearchBar } from 'bundles/in-course-search/index';

import 'css!./__styles__/CoursePageHeader';

type Props = {
  course: {
    id: string;
    name?: string;
    brandingImageUrl: string;
  };
  onMobileNavigationToggle: () => void;
  showAccountDropdown?: boolean;
  pathname: string;
};

export const CoursePageHeader = ({ course, onMobileNavigationToggle, showAccountDropdown, pathname }: Props) => {
  return (
    <div className="rc-CoursePageHeader">
      <PageHeader
        hasCatalogButton={false}
        hideEnterprise
        hideSearch={true}
        toggleMobileMenu={onMobileNavigationToggle}
        catalogSubBannerProps={{ hidePromoBanner: true }}
        course={course.brandingImageUrl ? course : undefined}
        logoWrapper="div"
        showAccountDropdown={showAccountDropdown}
        injectedSearchBar={<InCourseSearchBar referrer={pathname} />}
      />
    </div>
  );
};

/* eslint-disable graphql/template-strings */
const CourseBySlugQuery = gql`
  query CourseBySlugQuery($courseSlug: String!) {
    CoursesV1 @naptime {
      slug(slug: $courseSlug, showHidden: true) {
        elements {
          id
          brandingImageUrl
        }
      }
    }
  }
`;

export default _.compose(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
    pathname: router.location.pathname,
  })),
  graphql(CourseBySlugQuery, {
    options: ({ courseSlug }: any) => ({
      variables: { courseSlug },
    }),
    props: ({ data }: any) => {
      const result = ((data || {}).CoursesV1 || {}).slug || {};
      const { id, brandingImageUrl } = (result.elements || [])[0] || {};

      return {
        course: {
          id,
          brandingImageUrl,
        },
      };
    },
  }),
  Retracked.createTrackedContainer(() => ({
    namespace: {
      page: 'course_page_header',
    },
  }))
)(CoursePageHeader);
