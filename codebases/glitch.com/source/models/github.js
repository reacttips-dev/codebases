import ky from 'ky';
import {
    API_URL
} from '../env';

export default class GithubApi {
    static HTTPError = ky.HTTPError;
    static TimeoutError = ky.TimeoutError;

    constructor(token = null) {
        this.token = token;

        this.client = ky.extend({
            credentials: 'omit',
            prefixUrl: 'https://api.github.com',
            hooks: {
                beforeRequest: [
                    (request) => {
                        if (window.Cypress && token) {
                            request.headers.set('Authorization', `Basic ${btoa(`glitch-test:${token}`)}`);
                            return;
                        }

                        if (this.token !== null) {
                            request.headers.set('Authorization', `token ${this.token}`);
                        }
                    },
                ],
            },
        });
    }

    setToken(token) {
        this.token = token;
    }

    async getOAuthScopes() {
        const response = await this.client.head('');
        const scopes = response.headers.get('X-OAuth-Scopes') || '';
        return scopes.split(', ');
    }

    getRepo(repoName) {
        return this.client.get(`repos/${repoName}`).json();
    }

    getUser() {
        return this.client.get('user').json();
    }

    getRepoContents(repoName) {
        return this.client.get(`repos/${repoName}/contents`).json();
    }

    ensureRepoExists(repoName) {
        return this.client.head(`repos/${repoName}`).then(() => true, () => false);
    }

    getProjectPermissionsForUser(repoName, login) {
        return this.client.get(`repos/${repoName}/collaborators/${login}/permission`).json();
    }

    // the Github endpoints used to get licenses are in
    // beta and require custom headers
    // https://developer.github.com/v3/licenses/
    getLicense(licenseId) {
        return this.client
            .get(`licenses/${licenseId}`, {
                headers: {
                    accept: 'application/vnd.github.drax-preview+json',
                },
            })
            .json();
    }

    // the Github endpoint used to get code of conducts
    // are in beta and require custom headers
    // https://developer.github.com/v3/codes_of_conduct/
    getCodeOfConduct(codeOfConductId) {
        return this.client
            .get(`codes_of_conduct/${codeOfConductId}`, {
                headers: {
                    accept: 'application/vnd.github.scarlet-witch-preview+json',
                },
            })
            .json();
    }

    static authorizationUrl(clientId, scope = 'user:email') {
        const callbackURL = `https://${window.location.hostname}/login/github`;
        const encodedCallbackURL = encodeURIComponent(callbackURL);
        return `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodedCallbackURL}`;
    }

    static codeToUserUrl(code) {
        return `${API_URL}/auth/github/${code}`;
    }

    static providerName() {
        return 'GitHub';
    }
}