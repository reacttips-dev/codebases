import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import loadOnRoute from 'bundles/common/components/loadOnRoute';

import { SubmissionTableRoute } from 'bundles/peer-admin/constants/constants';

// eslint-disable-next-line @coursera/restrict-imports/no-cross-scope-imports
import discussionsRoutes from 'bundles/course-home/page-discussion-forums/routes';
// eslint-disable-next-line @coursera/restrict-imports/no-cross-scope-imports
import courseReferencesRoutes from 'bundles/course-home/page-course-references/courseReferencesRoutes';

import { isCDSAdoptionQ2ABTestEnabled } from './featureFlags';

const NotFound = loadOnRoute(() => import('bundles/phoenix/components/NotFound'));

const Home = loadOnRoute(() =>
  isCDSAdoptionQ2ABTestEnabled()
    ? import('bundles/course-v2/components/cds/Home')
    : import('bundles/course-v2/components/Home')
);

const Welcome = loadOnRoute(() => import('bundles/course-home/page-course-welcome/components/Welcome'));

const CourseInfo = loadOnRoute(() => import('bundles/course-home/page-course-info/components/CourseInfoPage2016'));

const NotesReviewPage = loadOnRoute(() => import('bundles/video-highlighting/review-page/NotesReviewPage'));

const AssignmentsPage = loadOnRoute(() => import('bundles/course-home/page-course-grades/components/AssignmentsPage'));

const PeriodPage = loadOnRoute(() => import('bundles/course-home/page-course-week/components/PeriodPage'));

const ItemRedirector = loadOnRoute(() => import('bundles/item/components/ItemRedirector'));

const CourseManagerPage = loadOnRoute(() => import('bundles/course-manager/components/CourseManagerPage'));

const CourseInboxPage = loadOnRoute(() => import('bundles/course-home/page-course-inbox/components/CourseInboxPage'));

const OfficeHoursPage = loadOnRoute(() => import('bundles/group-events/components/OfficeHoursPage'));

const GroupClassmatesPage = loadOnRoute(() => import('bundles/group-roster/components/GroupClassmatesPage'));

const ProfileApp = loadOnRoute(() => import('bundles/profile/components/ProfileApp'));

const TeamworkPageV2 = loadOnRoute(() => import('bundles/course-teamwork/components/TeamworkPageV2'));

const PeerReviewAdminLearnContainer = loadOnRoute(
  () => import('bundles/peer-admin/components/PeerReviewAdminLearnContainer')
);

const LegacyDataFetch = loadOnRoute(() => import('bundles/course/components/LegacyDataFetch'));
const DeferToClientSideRender = loadOnRoute(() => import('bundles/course-v2/components/DeferToClientSideRender'));

export default (
  <Route getComponent={Home}>
    <Route path="home">
      <Route path="welcome" name="welcome" getComponent={Welcome} />
      <Route path="notes" name="notes" getComponent={NotesReviewPage} />

      {/* All of these routes are CSR. LegacyDataFetch makes sure they all get relevant course data. */}
      <Route getComponent={LegacyDataFetch}>
        <Route getComponent={DeferToClientSideRender}>
          <Route path="info" name="CDP" getComponent={CourseInfo} />
          <Route path="week/:week" name="week" getComponent={PeriodPage} />
          <Route path="assignments" name="assignments" getComponent={AssignmentsPage} />
        </Route>
      </Route>

      <IndexRedirect to="welcome" />
      <Route path="*" status={404} getComponent={NotFound} />
    </Route>

    <Route getComponent={LegacyDataFetch}>
      <Route getComponent={DeferToClientSideRender}>
        {discussionsRoutes}
        {courseReferencesRoutes}

        <Route path="office-hours" name="office-hours" getComponent={OfficeHoursPage} />
        <Route path="classmates" name="classmates" getComponent={GroupClassmatesPage} />
        <Route path="course-manager" name="course-manager" getComponent={CourseManagerPage} />
        <Route path="teamwork" name="teamwork" getComponent={TeamworkPageV2} />
        <Route
          path="peer-admin/:itemId(/:slug)"
          name={SubmissionTableRoute}
          getComponent={PeerReviewAdminLearnContainer}
        />

        <Route path="course-inbox" name="course-inbox" getComponent={CourseInboxPage} />
        <Route path="profiles/:id" getComponent={ProfileApp} />

        <Route
          getComponent={ItemRedirector}
          path="item/:id(/:a(/:b(/:c(/:d(/:e(/:f(/:g(/:h(/:i(/:j(/:k(/:l))))))))))))"
        />
      </Route>
    </Route>
  </Route>
);
