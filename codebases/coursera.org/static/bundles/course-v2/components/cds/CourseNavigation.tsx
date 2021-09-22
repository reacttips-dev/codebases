import _ from 'underscore';
import React from 'react';
import Retracked from 'js/app/retracked';

import imgix from 'js/lib/imgix';
import classNames from 'classnames';

import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';

import mapProps from 'js/lib/mapProps';
import connectToRouter from 'js/lib/connectToRouter';

import type { Partner } from 'bundles/course-v2/types/Course';
import type { NavigationItem } from 'bundles/course-v2/types/CourseNavigation';

import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';
import CourseHeader from 'bundles/course-v2/components/navigation/cds/CourseHeader';
import CourseNavigationItem from 'bundles/course-v2/components/navigation/cds/CourseNavigationItem';

import OnDemandCoursesV1 from 'bundles/naptimejs/resources/onDemandCourses.v1';
import PartnersV1 from 'bundles/naptimejs/resources/partners.v1';
import CourseNavigationV1 from 'bundles/naptimejs/resources/courseNavigation.v1';

import _t from 'i18n!nls/course-v2';

type Props = {
  className?: string;

  course: {
    id: string;
    name: string;
    brandingImage: string;
    overridePartnerLogos?: Record<string, string>;
  };

  courseSlug: string;
  partners: Array<Partner>;
  showMobileNavigation: boolean;
  navigationItems: Array<NavigationItem>;
};

const CourseNavigation = (props: Props) => {
  const { className, course, partners, courseSlug, navigationItems, showMobileNavigation } = props;

  const defaultNavigationItems = [
    {
      typeName: 'gradesNavigationItem',
    },
  ];

  const hasNavigationItems = navigationItems && navigationItems.length;
  const navItemsToRender = hasNavigationItems ? navigationItems : defaultNavigationItems;

  const partner = partners[0];
  const src =
    !!partner && ((course.overridePartnerLogos && course.overridePartnerLogos[partner.id]) || partner.squareLogo);

  const partnerImage = imgix.processImage(src, { width: '56px', height: '56px' });

  return (
    <div className={classNames(className, { 'mobile-enabled': showMobileNavigation })}>
      <A11yScreenReaderOnly tagName="h2">{_t('Course Navigation')}</A11yScreenReaderOnly>
      <CourseHeader
        name={course.name}
        partners={partners}
        partnerImage={partnerImage}
        brandingImage={course.brandingImage}
      />

      <nav className="items align-self-stretch" aria-label={_t('Course')}>
        {navItemsToRender.map((item) => (
          <CourseNavigationItem
            courseId={course.id}
            key={item.typeName}
            courseSlug={courseSlug}
            navigationItem={item}
          />
        ))}
      </nav>
    </div>
  );
};

export default _.compose(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  Naptime.createContainer(({ courseSlug }: any) => ({
    course: OnDemandCoursesV1.bySlug(courseSlug, {
      fields: ['id', 'name', 'brandingImage', 'overridePartnerLogos'],
      includes: ['partnerIds'],
    }),

    courseNavigation: CourseNavigationV1.get(`${user.get().id}~${courseSlug}`),
  })),
  Naptime.createContainer(({ course }: any) => ({
    partners: PartnersV1.multiGet(course ? course.partnerIds : [], {
      fields: ['name', 'squareLogo'],
    }),
  })),
  // @ts-expect-error TSMIGRATION
  mapProps(({ courseNavigation }) => ({
    ...courseNavigation,
  })),
  // TODO(ankit): Rename page to `course-navigation` and update relevant alerts
  Retracked.createTrackedContainer(() => ({
    namespace: {
      page: 'menu',
    },
  }))
)(CourseNavigation);
