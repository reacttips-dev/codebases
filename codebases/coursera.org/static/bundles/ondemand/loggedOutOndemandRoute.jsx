import React from 'react';
import { Route } from 'react-router';
import loadOnRoute from 'bundles/common/components/loadOnRoute';

const OndemandLoggedOutApp = loadOnRoute(() => import('bundles/ondemand/components/OndemandLoggedOutApp'));
const OndemandLoggedOutCdpRedirector = loadOnRoute(() =>
  import('bundles/ondemand/components/OndemandLoggedOutCdpRedirector')
);
const OndemandLoggedOutRedirector = loadOnRoute(() =>
  import('bundles/ondemand/components/OndemandLoggedOutRedirector')
);

export default (
  <Route path="/learn/:courseSlug" name="loggedOut" getComponent={OndemandLoggedOutApp}>
    {/* note that logged out videos are handled by a separate app */}
    {/*
      These routes are relevant to logged out users. Backwards compatibile behavior specifies to route
      these back to the CDP.
      TODO (ANY FLEX ENGINEER): Re-evaluate whether or not we should just pop up the AuthenticationModal
      like we do on item pages.
    */}
    <Route path="home/welcome" getComponent={OndemandLoggedOutCdpRedirector} />
    <Route path="home/info" getComponent={OndemandLoggedOutCdpRedirector} />

    {/* End for backwards compatibility */}
    <Route path="*" getComponent={OndemandLoggedOutRedirector} />
  </Route>
);
