import Naptime from 'bundles/naptimejs';

import React from 'react';
import _ from 'underscore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandCoursesV1 from 'bundles/naptimejs/resources/onDemandCourses.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
import user from 'js/lib/user';

type Props = {
  courses?: Array<OnDemandCoursesV1>;
  s12n?: OnDemandSpecializationsV1;
  courseId?: string;
  s12nId?: string;
};

function withCatalogSubscriptionBySlug(Component: any) {
  class CatalogSubscriptionBySlug extends React.Component<Props> {
    render() {
      if (!user.isAuthenticatedUser()) {
        return <Component {...this.props} />;
      }

      const { s12n, courses, s12nId, courseId } = this.props;

      return (
        <Component
          s12nId={s12nId || (s12n && s12n.id)}
          courseId={courseId || (courses && !_(courses).isEmpty() && courses[0].id)}
          {...this.props}
        />
      );
    }
  }

  type NaptimeProps = {
    s12nSlug?: string;
    courseSlug?: string;
  };

  const Container = Naptime.createContainer(CatalogSubscriptionBySlug, ({ s12nSlug, courseSlug }: NaptimeProps) => ({
    ...(s12nSlug && {
      s12n: OnDemandSpecializationsV1.bySlug(s12nSlug, {
        fields: ['productVariant'],
      }),
    }),
    ...(courseSlug && {
      courses: OnDemandCoursesV1.finder('slug', {
        params: {
          slug: courseSlug,
        },
      }),
    }),
  }));

  return Container;
}

export default withCatalogSubscriptionBySlug;
