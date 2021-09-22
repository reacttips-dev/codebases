import React from 'react';
import PropTypes from 'prop-types';

import _ from 'underscore';
import connectToRouter from 'js/lib/connectToRouter';

import { NavigationItem } from 'bundles/course-v2/types/CourseNavigation';

import AdminButton from 'bundles/course-v2/components/navigation/AdminButton';
import withShowEnrollmentStateBanner from 'bundles/preview/containers/withShowEnrollmentStateBanner';

import InboxNavigationItem from 'bundles/course-v2/components/navigation/cds/InboxNavigationItem';
import DefaultNavigationItem from 'bundles/course-v2/components/navigation/cds/DefaultNavigationItem';
import WeekCollectionNavigationItem from 'bundles/course-v2/components/navigation/cds/WeekCollectionNavigationItem';
import ReferenceCollectionNavigationItem from 'bundles/course-v2/components/navigation/cds/ReferenceCollectionNavigationItem';

type Props = {
  courseId: string;
  courseSlug: string;
  navigationItem: NavigationItem;
  showEnrollmentStateBanner: boolean;
};

class CourseNavigationItem extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  render() {
    const { router } = this.context;
    const { courseId, courseSlug, navigationItem, showEnrollmentStateBanner } = this.props;

    if (navigationItem.typeName === 'adminNavigationItem') {
      if (showEnrollmentStateBanner) {
        return null;
      } else {
        return <AdminButton courseSlug={courseSlug} />;
      }
    } else if (navigationItem.typeName === 'weeksNavigationItem') {
      return (
        <WeekCollectionNavigationItem
          navigationItem={navigationItem}
          courseId={courseId}
          courseSlug={courseSlug}
          router={router}
        />
      );
    } else if (navigationItem.typeName === 'resourcesNavigationItem') {
      return (
        <ReferenceCollectionNavigationItem
          navigationItem={navigationItem}
          courseId={courseId}
          courseSlug={courseSlug}
          router={router}
        />
      );
    } else if (navigationItem.typeName === 'inboxNavigationItem') {
      return (
        <InboxNavigationItem
          navigationItem={navigationItem}
          courseId={courseId}
          courseSlug={courseSlug}
          router={router}
        />
      );
    }

    return (
      <DefaultNavigationItem
        navigationItem={navigationItem}
        courseId={courseId}
        courseSlug={courseSlug}
        router={router}
      />
    );
  }
}

export default _.compose(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  withShowEnrollmentStateBanner()
)(CourseNavigationItem);

export const BaseComp = CourseNavigationItem;
