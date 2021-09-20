import ApiService from 'services/api-service';

const contentfulToken = `${CONFIG.contentfulApiKey}`;

const API_V1_URL = `${CONFIG.catalogApiUrl}/v1`;

function resourcePath(endpoint) {
    return [API_V1_URL, endpoint.trim('/')].join('/');
}

export default {
    async getNDFromContentful(key) {
        try {
            return await ApiService.get(
                `https://www.udacity.com/www-proxy/contentful/spaces/2y9b3o528xhq/environments/master/entries?locale=en-US&content_type=pageNdopV0&select=sys.id,fields.slug,fields.key&include=1&fields.key=${key}`,
                '', {
                    headers: {
                        Authorization: `Bearer ${contentfulToken}`,
                    },
                }
            );
        } catch (error) {
            console.error(error, 'failed to fetch nd from contentful');
            return {};
        }
    },

    async getAllNanodegrees() {
        const endpoint = `degrees`;
        try {
            const response = await ApiService.get(resourcePath(endpoint), '', {
                authorizationHeader: false,
                contentType: null,
            });
            return _.get(response, 'degrees') || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },
};