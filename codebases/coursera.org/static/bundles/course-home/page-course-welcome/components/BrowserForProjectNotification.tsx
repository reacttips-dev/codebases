import React from 'react';
import connectToRouter from 'js/lib/connectToRouter';
import { compose } from 'recompose';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import IENotificationForGuidedProject from 'bundles/common/components/IENotificationForGuidedProject';

type Props = {
  courseTypeMetadata: string;
};

const BrowserForProjectNotification = (props: Props) => {
  const { courseTypeMetadata } = props;
  const isProject = courseTypeMetadata === 'rhymeProject';
  return <IENotificationForGuidedProject isProject={isProject} />;
};

const CourseQuery = gql`
  query CourseQueryForProjectNotification($courseSlug: String!) {
    CoursesV1Resource(courseSlug: $courseSlug)
      @rest(
        type: "CoursesV1ResourceWithTypeMetadata"
        path: "courses.v1/?q=slug&slug={args.courseSlug}&fields=courseTypeMetadata.v1(courseTypeMetadata)&includes=courseTypeMetadata"
        method: "GET"
      ) {
      linked @type(name: "CourseWithTypeMetadataLinked") {
        courseTypeMetadataV1 @type(name: "CourseTypeMetadata") {
          id
          courseTypeMetadata
        }
      }
    }
  }
`;

type InnerProps = {
  courseTypeMetadata: string | null;
};

type CourseQueryData = {
  CoursesV1Resource: {
    linked: {
      courseTypeMetadataV1: {
        courseTypeMetadata: {
          typeName: string;
        };
        id: string;
      }[];
    };
  };
};

type CourseQueryVariables = {
  courseSlug: string;
};

type PropsFromRouter = {
  courseSlug: string;
};

export default compose<Props, {}>(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  graphql<PropsFromRouter, CourseQueryData, CourseQueryVariables, InnerProps>(CourseQuery, {
    options: ({ courseSlug }) => ({
      variables: { courseSlug },
      errorPolicy: 'all',
    }),

    props: ({ data }) => {
      const courseTypeMetadata =
        data?.CoursesV1Resource?.linked?.courseTypeMetadataV1?.[0]?.courseTypeMetadata?.typeName || null;
      return {
        courseTypeMetadata,
      };
    },
  })
)(BrowserForProjectNotification);
