import ApiService from './api-service';
import Queries from './_queries';

function createPartConceptsUserStatesQuery(
    id,
    nanodegreeKey,
    version = '',
    locale = ''
) {
    return `
    query PartConceptsUserStatesQuery {
      nanodegree(key: "${nanodegreeKey}" version: "${version}" locale: "${locale}") {
        parts(id: ${id}) {
          id
          key
          version
          locale
          locked_reason
          locked_until
          modules {
            key
            lessons {
              key
              concepts {
                key
                ${Queries.userState}
              }
            }
          }
        }
      }
    }
  `;
}

export default {
    fetchConceptsUserStates(id, nanodegreeKey, contentVersion, contentLocale) {
        return ApiService.gql(
            createPartConceptsUserStatesQuery(
                id,
                nanodegreeKey,
                contentVersion,
                contentLocale
            )
        ).then((response) => {
            return _.get(response, 'data.nanodegree.parts', null);
        });
    },
};