import React from 'react';
import CourseTypeMetadataV1 from 'bundles/naptimejs/resources/courseTypeMetadata.v1';
import ViewCertLink from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/ViewCertLink';
import CourseRatingAdapterSharing from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseRatingAdapterSharing';
import CourseRatingShareCertificate from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseRatingShareCertificate';
import _t from 'i18n!nls/course-home';

import { Button } from '@coursera/coursera-ui';
import { SvgShare } from '@coursera/coursera-ui/svg';

type Props = {
  enrolledCourseIds: Array<string> | undefined;
  course: {
    id: string;
    name: string;
    slug: string;
    courseType: 'v2.ondemand' | 'v2.capstone' | 'v1.session' | 'v1.capstone';
    courseTypeMetadata?: CourseTypeMetadataV1;
  };
};

const ViewOrShareCourseCompletion: React.SFC<Props> = props => {
  const { enrolledCourseIds, course } = props;
  return (
    <div className="view-or-share-certificate">
      <div className="view-cert-link">
        <ViewCertLink courseId={course.id}>
          <Button type="primary" size="sm">
            <SvgShare color="#FFFFFF" size={12} />
            {_t('View your Certificate')}
          </Button>
        </ViewCertLink>
      </div>
      <div className="rate-share-certificate">
        <CourseRatingAdapterSharing enrolledCourseIds={enrolledCourseIds} course={course} />
        <span> |</span>
        <CourseRatingShareCertificate courseId={course.id} />
      </div>
    </div>
  );
};

export default ViewOrShareCourseCompletion;
