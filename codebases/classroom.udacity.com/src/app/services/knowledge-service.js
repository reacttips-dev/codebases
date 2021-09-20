import ApiService from 'services/api-service';
import {
    i18n
} from 'services/localization-service';

const KnowledgeService = {
    fetchIsEnabled(ndKey, locale) {
        return ApiService.get(
                `${CONFIG.knowledgeApiUrl}/v2/check-access`,
                `ndKey=${ndKey}&locale=${locale}`
            )
            .then((resp) => _.get(resp, 'data.enabled', false))
            .catch(console.error);
    },

    fetchUnreads() {
        const query = `
      query PostsToRead {
        postsToRead {
          posts {
            id
          }
        }
      }
    `;

        return ApiService.gql(
                query,
                null,
                i18n.getLocale(),
                `${CONFIG.knowledgeApiUrl}/graphql`
            )
            .then((res) => res.data)
            .catch(console.error);
    },
};

export default KnowledgeService;