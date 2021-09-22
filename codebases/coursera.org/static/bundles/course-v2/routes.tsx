//
import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import loadOnRoute from 'bundles/common/components/loadOnRoute';
import homeRoutes from 'bundles/course-v2/homeRoutes';
import itemRoutes from 'bundles/item/routes';
import labsRoutes from 'bundles/labs/routes';

const NotFound = loadOnRoute(() => import('bundles/phoenix/components/NotFound'));

const Course = loadOnRoute(() => import('bundles/course-v2/components/Course'));

const ItemGroupDescriptionPage = loadOnRoute(() => import('bundles/item/components/ItemGroupDescriptionPage'));
const S12NUpgradeDashboard = loadOnRoute(() => import('bundles/ondemand/components/s12n-upgrade/S12NUpgradeDashboard'));

const ActAsLearnerUnauthorizedPage = loadOnRoute(
  () => import('bundles/course-staff-impersonation/components/ActAsLearnerUnauthorizedPage')
);

// TODO: migrate LegacyDataFetch to GraphQL / Naptime
const LegacyDataFetch = loadOnRoute(() => import('bundles/course/components/LegacyDataFetch'));
const DeferToClientSideRender = loadOnRoute(() => import('bundles/course-v2/components/DeferToClientSideRender'));

export default (
  <Route path="/learn">
    <Route path="specialization/upgrade/:s12nIds" getComponent={S12NUpgradeDashboard} />
    <Route path=":courseSlug" getComponent={Course}>
      {homeRoutes}

      <Route path="act-as-learner-unauthorized" getComponent={ActAsLearnerUnauthorizedPage} />
      <Route getComponent={LegacyDataFetch}>
        <Route getComponent={DeferToClientSideRender}>
          {itemRoutes}
          {labsRoutes}
          <Route path="choices/:item_group_id" name="choices" getComponent={ItemGroupDescriptionPage} />
        </Route>
      </Route>

      <IndexRedirect to="home/welcome" />
      <Route path="*" status={404} getComponent={NotFound} />
    </Route>
  </Route>
);
