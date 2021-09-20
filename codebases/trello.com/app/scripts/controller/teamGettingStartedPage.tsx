import React from 'react';
import { renderTopLevelComponent } from 'app/scripts/controller/renderTopLevelComponent';
import { TeamOnboardingPage } from 'app/src/components/TeamOnboarding';
import { ApiError } from 'app/scripts/network/api-error';
import { memberId } from '@trello/session-cookie';
import { TrelloStorage } from '@trello/storage';
import { navigate } from 'app/scripts/controller/navigate';

const BluebirdPromise = require('bluebird');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { getSpinner } = require('app/src/getSpinner');

export const teamGettingStartedPage = (orgId: string) => {
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ModelLoader } = require('app/scripts/db/model-loader');
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ModelCache } = require('app/scripts/db/model-cache');
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { Controller } = require('app/scripts/controller');

  Controller.setViewType(orgId);

  return BluebirdPromise.using(getSpinner(), () => {
    ModelLoader.release('top-level');
    return featureFlagClient.ready().then(() => {
      ModelLoader.for('top-level', 'loadOrganizationMinimal', orgId)
        .then((organization: { get: (s: string) => string }) => {
          Controller.setViewType(organization);
          renderTopLevelComponent(
            <TeamOnboardingPage
              orgId={organization.get('id')}
              orgName={organization.get('name')}
              model={organization}
              modelCache={ModelCache}
            />,
          );
        })
        .catch(ApiError.NotFound, () => {
          // in this case the organization was not found, so let's remove
          // the bit where we make the home button go to `/getting-started`
          TrelloStorage.unset(`home_${memberId}_last_tab_2`);
          // now let's just let the home route do what it normally should do
          navigate('/', { replace: true, trigger: true });
        })
        .catch(ApiError, () => {
          Controller.displayErrorPage();
        });
    });
  });
};
