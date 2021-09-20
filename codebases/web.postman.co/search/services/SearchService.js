import PostmanGatewayService from '../../js/utils/PostmanGatewayService';
import { RECENT_SEARCH_SIZE } from '../constants';

export default {
  async getCrossRankedSearchData (searchBody) {
    let response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        service: 'search',
        method: 'POST',
        path: '/search-all',
        body: searchBody
      })
    });

    return response;
  },
  async getSearchData (searchBody) {
    let response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        service: 'search',
        method: 'POST',
        path: '/search',
        body: searchBody
      })
    });

    return response;
  },
  async getSearchCount (searchBody) {
    let response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        service: 'search',
        method: 'POST',
        path: '/count',
        body: searchBody
      })
    });

    return response;
  },
  async getCollectionCategories () {
    let response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        service: 'publishing',
        method: 'GET',
        path: '/v1/api/category?type=collection'
      })
    });

    return response;
  },
  async getRecentSearchesData () {
    let response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        service: 'search',
        method: 'POST',
        path: '/fetch-recent',
        body: {
          size: RECENT_SEARCH_SIZE
        }
      })
    });

    return response;
  },
  async postRecentSearchesData (recentSearchBody) {
    let response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        service: 'search',
        method: 'POST',
        path: '/recent-search',
        body: recentSearchBody
      })
    });

    return response;
  },
  async getSRPConfigData () {
    let response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        service: 'search',
        method: 'GET',
        path: '/configuration/srp'
      })
    });

    return response;
  },

  /**
   * Fetches related public collections wrt to a url
   *
   * @param {String} requestUrl
   * @param {String} traceId
   * @param {String} collectionUid
   * @param {String} requestOrigin
   * @returns {Object} List of related collection inside response body
   */
  async getRequestRelatedCollections (requestUrl, traceId, collectionUid, requestOrigin, count = 5, offset = 0) {
    let searchBody = {
      queryText: requestUrl,
      queryIndex: 'runtime.collectionRequestUrl',
      domain: 'public',
      from: offset,
      size: count,
      clientTraceId: traceId,
      queryContext: {
        collectionId: collectionUid,
        isRecommendation: true
      },
      requestOrigin
    };

    let response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        service: 'search',
        method: 'POST',
        path: '/search',
        body: searchBody
      })
    });

    return response;
  }
};

