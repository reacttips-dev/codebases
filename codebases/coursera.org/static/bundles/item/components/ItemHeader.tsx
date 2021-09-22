import React from 'react';
import _ from 'underscore';
import PageHeader from 'bundles/page/components/PageHeader';
import { InCourseSearchBar } from 'bundles/in-course-search/index';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import waitForStores from 'bundles/phoenix/lib/waitForStores';
import useRouter from 'js/lib/useRouter';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type Course from 'pages/open-course/common/models/course';

type Props = {
  course: Course;
};

const ItemHeader = ({ course }: Props) => {
  const router = useRouter();

  let courseJSON;
  if (course && course.get('brandingImage')) {
    courseJSON = {
      id: course.get('id'),
      name: course.get('name'),
      brandingImageUrl: course.get('brandingImage'),
    };
  }

  return (
    <div className="rc-ItemHeader">
      <PageHeader
        hasCatalogButton
        hideEnterprise
        hideSearch={true}
        catalogSubBannerProps={{ hidePromoBanner: true }}
        course={courseJSON}
        logoWrapper="div"
        injectedSearchBar={<InCourseSearchBar referrer={router.location.pathname} />}
      />
    </div>
  );
};

export default _.compose(
  waitForStores(['CourseStore'], ({ CourseStore }: $TSFixMe, props: $TSFixMe) => {
    return {
      course: CourseStore.getMetadata(),
      courseId: CourseStore.getCourseId(),
    };
  })
)(ItemHeader);
