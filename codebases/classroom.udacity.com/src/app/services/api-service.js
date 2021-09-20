import $ from 'jquery';
import ApiError from 'errors/api-error';
import AuthenticationService from 'services/authentication-service';
import {
    i18n
} from 'services/localization-service';

export default {
    _isApiPath(path) {
        return path.startsWith('/api/');
    },

    _isFullUrl(path) {
        return path.startsWith('http://') || path.startsWith('https://');
    },

    _makeValidPath(path) {
        path = path || '';
        if (this._isFullUrl(path) || this._isApiPath(path)) {
            return path;
        }
        return `${CONFIG.serverUrl}${path}`;
    },

    _apiRequest(type, path, data = {}, opts = {}) {
        opts = {
            timeout: 0,
            authorizationHeader: true,
            ...opts
        };
        type = type.toUpperCase();

        if (_.includes(['PATCH', 'POST', 'PUT'], type)) {
            data = JSON.stringify(data);
        }

        const headers = {
            Accept: 'application/json',
            ...opts.headers,
        };
        const bearerToken = opts.bearerToken || AuthenticationService.getJWTToken();
        if (opts.authorizationHeader && bearerToken) {
            headers['Authorization'] = 'Bearer ' + bearerToken;
        } else if (opts.authorizationHeader && !bearerToken) {
            const missingJwtError = new Error(
                `${type} request to ${path} requires a JWT but none is present`
            );
            console.error(missingJwtError);
            // TODO: gracefully handle/recover or outright reject the request if misconfigured
            // return Promise.reject(missinJwtError);
        }

        return Promise.resolve(
            this.ajaxPromise({
                url: this._makeValidPath(path),
                type,
                data,
                headers,
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                ...opts,
            })
        );
    },

    ajaxPromise(...args) {
        return Promise.resolve($.ajax(...args));
    },

    get(path, queryParams, opts = {}) {
        return this._apiRequest('GET', path, queryParams, opts);
    },

    patch(path, data, opts = {}) {
        return this._apiRequest('PATCH', path, data, opts);
    },

    put(path, data, opts = {}) {
        return this._apiRequest('PUT', path, data, opts);
    },

    post(path, data, opts = {}) {
        return this._apiRequest('POST', path, data, opts);
    },

    delete(path, data, opts = {}) {
        return this._apiRequest('DELETE', path, data, opts);
    },

    gql(
        query,
        variables = null,
        locale = i18n.getLocale(),
        fullPath = null, //If null, then this gql request is going to classroom-content
        opts = {}
    ) {
        // Locale is default to the user's browser setting.
        const path = fullPath || `${CONFIG.serverUrl}/v1/graphql`;
        return this.post(path, {
            query,
            variables,
            locale
        }, opts).then(
            (response) => {
                const {
                    errors
                } = response;
                if (errors && errors.length > 0) {
                    throw new ApiError({
                        message: errors[0].message,
                        status: errors[0].status,
                    });
                } else {
                    return response;
                }
            }
        );
    },
};