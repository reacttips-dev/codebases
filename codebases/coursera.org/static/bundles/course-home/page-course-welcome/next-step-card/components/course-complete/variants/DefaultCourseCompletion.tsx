import React from 'react';
import _t from 'i18n!nls/course-home';
import CourseTypeMetadataV1 from 'bundles/naptimejs/resources/courseTypeMetadata.v1';
import OldCourseRatingAdapter from 'bundles/course-home/page-course-welcome/next-step-card/components/OldCourseRatingAdapter';
import ViewCertLink from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/ViewCertLink';
import PurchaseCourse from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/PurchaseCourse';
import CompleteVerification from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CompleteVerification';

type Props = {
  canViewCertificate: boolean;
  canUpgrade: boolean;
  canSubscribe: boolean;
  canCompleteVerificationProfile: boolean;
  enrolledCourseIds: Array<string> | undefined;
  course: {
    id: string;
    name: string;
    slug: string;
    courseType: 'v2.ondemand' | 'v2.capstone' | 'v1.session' | 'v1.capstone';
    courseTypeMetadata?: CourseTypeMetadataV1;
  };
};

const DefaultCourseCompletion: React.SFC<Props> = (props) => {
  const {
    canViewCertificate,
    canUpgrade,
    canSubscribe,
    canCompleteVerificationProfile,
    course,
    enrolledCourseIds,
  } = props;
  return (
    <div>
      <a className="primary" target="_blank" rel="noopener noreferrer" href={`/learn/${course.slug}/reviews`}>
        {_t('Read course reviews')}
      </a>

      <div className="completed-course-rating horizontal-box align-items-absolute-center">
        <OldCourseRatingAdapter enrolledCourseIds={enrolledCourseIds} course={course} />
      </div>

      <div className="vertical-box align-items-absolute-center">
        {canViewCertificate && <ViewCertLink courseId={course.id} />}
        {canUpgrade && <PurchaseCourse courseId={course.id} canSubscribe={canSubscribe} />}
        {canCompleteVerificationProfile && <CompleteVerification />}
      </div>
    </div>
  );
};

export default DefaultCourseCompletion;
