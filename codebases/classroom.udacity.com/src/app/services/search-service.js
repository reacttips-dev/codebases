import ApiService from 'services/api-service';
import SemanticTypes from 'constants/semantic-types';

export default {
    search({
        term,
        root,
        partKeys
    }) {
        let queryString = `q=${term}&root_node_key=${root.key}&version=${root.version}&locale=${root.locale}`;

        if (root.semantic_type === SemanticTypes.NANODEGREE) {
            queryString += `&parts=${partKeys.join(',')}`;
        }

        return ApiService.get(`${CONFIG.searchApiUrl}/search?${queryString}`).then(
            (result) => result.data
        );
    },
};