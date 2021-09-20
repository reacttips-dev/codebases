import React, { FunctionComponent } from 'react';
import {
  getSuggestedSiteNames,
  getAvailableSites,
} from 'app/gamma/src/util/cross-flow-essentials';
import { atlassianApiGateway, environment } from '@trello/config';
import TrelloCrossFlowProvider from '@atlassiansox/cross-flow-support/trello';
import { Analytics } from '@trello/atlassian-analytics';
import {
  createGetSuggestedSiteNamesPlugin,
  createGetAvailableSitesPlugin,
} from '@atlassiansox/cross-flow-plugins';
import { sendErrorEvent } from '@trello/error-reporting';
import { useCrossFlowProviderQuery } from './CrossFlowProviderQuery.generated';

const env = environment === 'prod' ? 'production' : 'staging';

// eslint-disable-next-line @trello/no-module-logic
const edgePrefix = atlassianApiGateway.endsWith('/')
  ? // eslint-disable-next-line @trello/no-module-logic
    atlassianApiGateway.substr(0, atlassianApiGateway.length - 1)
  : atlassianApiGateway;

export const CrossFlowProvider: FunctionComponent<object> = ({ children }) => {
  const { data } = useCrossFlowProviderQuery({
    variables: { memberId: 'me' },
  });

  const me = data && data?.member;
  const ent = me?.enterprises ?? [];
  const team = me?.organizations ?? [];

  const isAaMastered = Boolean(me?.isAaMastered);

  const member = {
    id: me?.id || '',
    idPremOrgsAdmin: me?.idPremOrgsAdmin || [],
    isAaMastered,
    name: me?.fullName || '',
    enterprises: ent,
  };
  const locale = me?.prefs?.locale || 'en';

  const suggestedSiteNamesPlugin = createGetSuggestedSiteNamesPlugin(async () =>
    getSuggestedSiteNames(ent, team, member),
  );

  const availableSitesPlugin = createGetAvailableSitesPlugin(async () =>
    getAvailableSites(isAaMastered),
  );

  return (
    <TrelloCrossFlowProvider
      analyticsClient={Analytics.dangerouslyGetAnalyticsWebClient()}
      locale={locale}
      edgePrefix={edgePrefix}
      isAaMastered={isAaMastered}
      env={env}
      plugins={[suggestedSiteNamesPlugin, availableSitesPlugin]}
      // eslint-disable-next-line react/jsx-no-bind
      onError={(err: Error) => {
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-workflowers',
          },
          extraData: {
            component: 'CrossFlowProvider',
          },
        });
      }}
    >
      {children}
    </TrelloCrossFlowProvider>
  );
};
