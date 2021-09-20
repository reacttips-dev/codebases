import {
  fetchEntities
} from '../../../../../../apinetwork/components/explore/services/ExploreService';
import { EXPLORE_ENTITIES_LIMIT } from './components/ExploreCards/ExploreCardsConstants';
import { transformPopularEntitiesResponse } from './components/ExploreCards/ExploreCardsUtils';
import { getStringifiedQueryParams } from '../../../../../../js/common/utils/url';
import { HTTPGatewayService } from '../../../../common/apis/HTTPGatewayService';
import { fetchWithTimeout } from '../../utils';

const getPopularTeams = async () => {
  try {
    const response = await fetchEntities({ type: 'team', limit: 4 });
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const getPopularEntities = async (utm_params, traceId) => {
  const path = 'v1/api/networkentity/home',
    params = { limit: EXPLORE_ENTITIES_LIMIT, referrer: 'home', ...utm_params };

  try {
    let response = await HTTPGatewayService.request({
      data: {
        service: 'publishing',
        method: 'get',
        path: `/${path}?${getStringifiedQueryParams(params)}`
      }
    });

    const transformedData = transformPopularEntitiesResponse(response.body, traceId);
    return [transformedData, null];
  } catch (error) {
    return [null, error];
  }
};

const getSpotlightData = async () => {
  const path = 'v1/api/curated-list/home',
    params = { referrer: 'home' };

  try {
    let response = await HTTPGatewayService.request({
      data: {
        service: 'publishing',
        method: 'get',
        path: `/${path}?${getStringifiedQueryParams(params)}`
      }
    });

    let data = response.body.data;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
};

/**
 * check if the given email is already registered
 * @param {*} email
 * @returns
 */
const validateEmail = async (email) => {
  const requestUrl = `${pm.identityUrl}/authentication/validate-email`,
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    },
    timeout = 500;

  try {
    let response = await fetchWithTimeout(requestUrl, options, timeout)
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        throw err;
      });

    return response.success;
  } catch (error) {
    return true;
  }
};

export { getPopularEntities, getPopularTeams, getSpotlightData, validateEmail };
