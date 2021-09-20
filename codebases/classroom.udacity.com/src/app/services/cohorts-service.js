import ApiService from './api-service';

function createCohortQuery(ndKey, status) {
    return `query CatalogCohortQuery {
    catalog_cohorts(nanodegree_key: "${ndKey}" status: ${status}) {
      id
      uuid
      nd_unit_id
      nanodegree_key
      nanodegree_locale
      nanodegree_version
      payment_closes_at
      payment_opens_at
      start_at
    }
  }`;
}

export default {
    fetchCohorts(ndKey, status) {
        return ApiService.gql(createCohortQuery(ndKey, status)).then((response) => {
            if (response.errors) {
                throw new Error(response.errors);
            }
            return {
                status,
                nanodegree_key: ndKey,
                cohorts: _.get(response, 'data.catalog_cohorts', []),
            };
        });
    },
};