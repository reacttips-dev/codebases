/* eslint-disable @trello/disallow-filenames */
import {
  atlassianApiGateway,
  siteDomain,
  wacUrl,
  clientVersion,
} from '@trello/config';
import { EnterpriseModel, MemberModel, TeamModel } from '../types/models';
import { AvailableSitesResponse } from '@atlassiansox/cross-flow-plugins';
import { Analytics } from '@trello/atlassian-analytics';
import { TargetType, Targets } from '@atlassiansox/cross-flow-support';

export const getTenantlessProductStoreUrl = () => {
  const url = new URL(atlassianApiGateway);
  url.pathname = 'gpa-product-store/tenantless.html';
  return url.toString();
};

export const getTenantlessCrossFlowUrl = () => {
  const url = new URL(atlassianApiGateway);
  url.pathname = 'gpa-cross-flow/';
  return url.toString();
};

interface UtmParams {
  campaign: UtmCampaign;
}

export enum UtmCampaign {
  ATLASSIAN_SWITCHER = 'atlassian_switcher',
  PRODUCT_STORE = 'product_store',
  CROSSFLOW_ESSENTIALS = 'cross_flow_essentials_v2',
  TOUCHPOINTS_JSW_BOARD = 'trello_jsw_touchpoints_board',
  TOUCHPOINTS_JSW_POWERUPS = 'trello_jsw_touchpoints_powerups',
  TOUCHPOINTS_JSW_SWITCHER = 'trello_jsw_touchpoints_switcher',
  TOUCHPOINTS_CONFLUENCE_SWITCHER = 'trello_confluence_touchpoints_switcher',
  TOUCHPOINTS_CONFLUENCE_POWERUPS = 'trello_confluence_touchpoints_powerups',
}

const getUtmQueryParams = ({ campaign }: UtmParams) =>
  `utm_source=trello&utm_medium=in_product_ad&utm_campaign=${campaign}`;

export const setLocationToWacSoftware = (params: UtmParams): void => {
  const utmQueryParams = getUtmQueryParams(params);
  window.open(`${wacUrl}/software?${utmQueryParams}`, '_blank');
};

export const setLocationToTryProduct = (
  productKey: TargetType,
  utmParams: UtmParams,
): void => {
  const utmQueryParams = getUtmQueryParams(utmParams);

  if (productKey === Targets.OPSGENIE) {
    window.open(`${wacUrl}/software/opsgenie/try?${utmQueryParams}`, '_blank');
    return;
  }
  const bundles: Record<string, string> = {
    [Targets.JIRA_SOFTWARE]: 'jira-software',
    [Targets.JIRA_SERVICE_DESK]: 'jira-service-desk',
    [Targets.CONFLUENCE]: 'confluence',
  };
  const bundleKey = bundles[productKey];
  if (bundleKey) {
    window.open(
      `${wacUrl}/try/cloud/signup?bundle=${bundleKey}&edition=free&${utmQueryParams}`,
      '_blank',
    );
  } else {
    setLocationToWacSoftware(utmParams);
  }
};

export const getSuggestedSiteNames = (
  enterprises: EnterpriseModel[],
  teams: TeamModel[],
  user?: MemberModel,
) => {
  const suggestedNames = [];

  function addToNamesArray(value: string) {
    if (suggestedNames.length < 5) {
      suggestedNames.push(value);
    }
  }

  for (const enterprise of enterprises) {
    if (suggestedNames.length === 5) {
      break;
    }

    suggestedNames.push(enterprise.displayName); // Add enterprise names

    const enterpriseTeams = teams.filter(
      (team: TeamModel) => team.idEnterprise === enterprise.id,
    );
    enterpriseTeams.forEach((team: TeamModel) => {
      addToNamesArray(`${enterprise.displayName}-${team.displayName}`); // Add enterprise-teamname names
    });
    enterpriseTeams.forEach((team: TeamModel) => {
      addToNamesArray(team.displayName);
    }); // Add team names that belong to the enterprise
  }

  teams.forEach((team: TeamModel) => {
    if (!team.idEnterprise) {
      addToNamesArray(team.displayName); // Add teams that don't belong to enterprise
    }
  });

  if (user && user.name) {
    addToNamesArray(user.name); // add user name
  }

  return suggestedNames;
};

export const getCrossFlowEssentialsV2Props = (flag: string) => {
  switch (flag) {
    case 'variation-free':
      return { isCrossFlowV2Enabled: true, edition: 'free' };
    case 'variation-standard':
      return { isCrossFlowV2Enabled: true, edition: 'standard' };
    default:
      return { isCrossFlowV2Enabled: false };
  }
};

export const SWITCHER_AVAILABLE_PRODUCTS_URL = `${atlassianApiGateway}gateway/api/available-products/api/available-products`;

export const AVAILABLE_SITES_PROXY_URL = `${siteDomain}/proxy/experiment-api/trello-cross-product-join/available-sites`;

export const getAvailableSites = async (
  isAaMastered: boolean,
): Promise<AvailableSitesResponse> => {
  try {
    const url = isAaMastered
      ? SWITCHER_AVAILABLE_PRODUCTS_URL
      : AVAILABLE_SITES_PROXY_URL;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Trello-Client-Version': clientVersion,
      },
    });

    if (response.ok) {
      return response.json();
    }

    throw new Error('unauthorized');
  } catch (error) {
    Analytics.sendOperationalEvent({
      action: 'errored',
      actionSubject: 'fetchAvailableSites',
      source: 'crossFlowEssentials',
    });
    return { sites: [] };
  }
};
