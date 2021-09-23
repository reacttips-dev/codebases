import ky from 'ky';
import {
    API_URL
} from './env';
import {
    access
} from './const';

function buildSearchParams(obj) {
    return Object.entries(obj)
        .flatMap(([key, maybeArray]) => {
            if (Array.isArray(maybeArray)) {
                return maybeArray.map((value) => [key, value]);
            }
            const value = maybeArray;
            return [
                [key, value]
            ];
        })
        .filter(([_key, value]) => value !== undefined && value !== null);
}

// For now you can only invite new members to projects as editors.
// TODO: remove this mapping once we start getting the access level from the backend
const defaultProjectInvitePermission = {
    accessLevel: access.MEMBER
};

class GlitchApiV0 {
    constructor(client) {
        this.client = client;
    }
    customDomainPreviewHostName;

    getProject(projectDomainOrId, {
        showDeleted = false,
        ...additionalOpts
    } = {}) {
        return this.client
            .get(`projects/${projectDomainOrId}`, {
                searchParams: buildSearchParams({
                    showDeleted: showDeleted.toString()
                }),
                ...additionalOpts
            })
            .json();
    }

    boot({
        latestProjectOnly = 'false',
        ...additionalOpts
    } = {}) {
        return this.client.get('boot', {
            searchParams: buildSearchParams({
                latestProjectOnly
            }),
            ...additionalOpts
        }).json();
    }

    projectSetEnv(projectDomain, env, additionalOpts = {}) {
        return this.client
            .post(`projects/${projectDomain}/setenv`, {
                json: {
                    env
                },
                ...additionalOpts,
            })
            .json();
    }

    projectExec(projectId, command, additionalOpts = {}) {
        return this.client
            .post(`projects/${projectId}/exec`, {
                json: {
                    command
                },
                timeout: 60000,
                ...additionalOpts,
            })
            .json();
    }

    projectTouch(projectId, data, additionalOpts = {}) {
        return this.client
            .patch(`projects/${projectId}/touch`, {
                json: data,
                ...additionalOpts,
            })
            .json();
    }

    projectEdited(projectId, data, additionalOpts = {}) {
        return this.client.post(`projects/${projectId}/edited`, {
            json: data,
            ...additionalOpts
        }).json();
    }

    projectDomainChanged(projectId, additionalOpts = {}) {
        return this.client
            .post(`project/domainChanged`, {
                searchParams: buildSearchParams({
                    projectId
                }),
                ...additionalOpts,
            })
            .json();
    }

    projectGithubExport(projectId, repo, commitMessage, additionalOpts = {}) {
        return this.client.post('project/githubExport', {
            searchParams: buildSearchParams({
                projectId,
                repo,
                commitMessage
            }),
            timeout: 30000,
            ...additionalOpts,
        });
    }

    projectGithubImport(projectId, repo, {
        path,
        ...additionalOpts
    } = {}) {
        return this.client.post(`project/githubImport`, {
            searchParams: buildSearchParams({
                projectId,
                repo,
                path
            }),
            timeout: 30000,
            ...additionalOpts,
        });
    }

    importGitRepoIntoProject(projectId, repoUrl, { ...additionalOpts
    } = {}) {
        return this.client.post(`projects/${projectId}/git/import`, {
            json: {
                repoUrl
            },
            timeout: 30000,
            ...additionalOpts,
        });
    }

    getProjectGitCommits(projectId, additionalOpts = {}) {
        return this.client
            .get(`projects/${projectId}/git/commits`, {
                timeout: 120 * 1000,
                ...additionalOpts,
            })
            .json();
    }

    getProjectGitDiff(projectId, revisionHash, additionalOpts = {}) {
        return this.client
            .get(`projects/${projectId}/git/diff/${revisionHash}`, {
                timeout: 120 * 1000,
                ...additionalOpts,
            })
            .json();
    }

    projectGitCommitChanges(projectId, additionalOpts = {}) {
        return this.client
            .post(`projects/${projectId}/git/commitChanges`, {
                timeout: 120 * 1000,
                ...additionalOpts,
            })
            .json();
    }

    projectGitRevert(projectId, revisionHash, additionalOpts = {}) {
        return this.client.post(`projects/${projectId}/git/revert/${revisionHash}`, {
            timeout: 120 * 1000,
            json: {
                ots: []
            },
            ...additionalOpts,
        });
    }

    projectJoin(token, additionalOpts = {}) {
        return this.client.post(`projects/${token}/join`, additionalOpts).json();
    }

    createProjectPermission(projectId, userId, accessLevel, additionalOpts = {}) {
        return this.client
            .post(`project_permissions/${projectId}`, {
                json: {
                    userId,
                    projectId,
                    accessLevel
                },
                ...additionalOpts,
            })
            .json();
    }

    teamProjectJoin(teamId, projectId, additionalOpts = {}) {
        return this.client.post(`teams/${teamId}/projects/${projectId}/join`, additionalOpts).json();
    }

    getUser(userId, additionalOpts = {}) {
        return this.client.get(`users/${userId}`, additionalOpts).json();
    }

    getThanks(userId, additionalOpts = {}) {
        return this.client.get(`thanks/${userId}`, additionalOpts).json();
    }
}

export class GitRepoUnavailableError extends Error {
    constructor(gitRepoUrl, ...params) {
        super(...params);
        this.gitRepoUrl = gitRepoUrl;
    }
}
export default class GlitchApi {
    static HTTPError = ky.HTTPError;
    static TimeoutError = ky.TimeoutError;

    constructor(token = null) {
        this.token = token;

        this.client = ky.extend({
            credentials: 'include',
            timeout: 20000,
            prefixUrl: API_URL,
            hooks: {
                beforeRequest: [
                    (request) => {
                        if (this.token !== null) {
                            request.headers.set('Authorization', this.token);
                        }
                    },
                ],
            },
        });

        this.v0 = new GlitchApiV0(this.client);
    }

    setToken(nextToken) {
        this.token = nextToken;
    }

    // - Method Pattern
    // Required parameters are ordered and the last parameter is an object that contains optional parameters and additional properties on the object
    // parameter are spread into the config object passed to ky. For example, `getProject(projectDomainOrId, { showDeleted = false, ...additionalOpts } = {})`:
    // `projectDomainOrId` is a required parameter, `showDeleted` is an optional parameter, `additionalOpts` will be spread into the ky request
    // object. If the endpoint is expected to return JSON, call `.json()` on the return value of the ky request. Do not handle errors here in
    // `GlitchApi`; instead they should be handled where the GlitchApi method is being called. This keeps GlitchApi independent of app state.
    // If a resource is being accessed by its primary identifier, the method should be named in the pattern of "getResource". If it is
    // being accessed by another property, the method should be named in the pattern of "getResourceByProperty". For example, fetching
    // a project by its id would be "getProject", while fetching a project by its domain would be "getProjectByDomain".

    // - Project methods

    getProject(projectId, additionalOpts = {}) {
        return this.client.get(`v1/projects/by/id`, {
            searchParams: buildSearchParams({
                id: projectId
            }),
            ...additionalOpts
        }).json();
    }

    // supports 1 domain string or an array of domain strings
    getProjectsByDomain(projectDomains, additionalOpts = {}) {
        return this.client
            .get('v1/projects/by/domain', {
                searchParams: buildSearchParams({
                    domain: projectDomains
                }),
                timeout: 60000,
                ...additionalOpts,
            })
            .json();
    }

    getProjectCollections(projectId, {
        limit = 10,
        ...additionalOpts
    } = {}) {
        return this.client.get(`v1/projects/by/id/collections`, {
            searchParams: buildSearchParams({
                id: projectId,
                limit
            }),
            ...additionalOpts
        }).json();
    }

    createProject(data, additionalOpts = {}) {
        return this.client
            .post('v1/projects', {
                json: data,
                ...additionalOpts,
            })
            .json();
    }

    remixProject(projectId, data, additionalOpts = {}) {
        return this.client
            .post(`v1/projects/${projectId}/remix`, {
                json: data,
                ...additionalOpts,
            })
            .json()
            .catch((e) => {
                if (e instanceof GlitchApi.HTTPError && e.response.status === 404 && data.gitRepoUrl) {
                    throw new GitRepoUnavailableError(data.gitRepoUrl);
                }
            });
    }

    remixProjectByDomain(projectDomain, data, additionalOpts = {}) {
        return this.client
            .post(`v1/projects/by/domain/${projectDomain}/remix`, {
                json: data,
                ...additionalOpts,
            })
            .json();
    }

    updateProject(projectId, params, additionalOpts = {}) {
        return this.client
            .patch(`v1/projects/${projectId}`, {
                json: params,
                ...additionalOpts,
            })
            .json();
    }

    deleteProject(projectId, additionalOpts = {}) {
        return this.client.delete(`v1/projects/${projectId}`, additionalOpts).json();
    }

    restoreProject(projectId, additionalOpts = {}) {
        return this.client.post(`v1/projects/${projectId}/undelete`, additionalOpts).json();
    }

    deleteProjectUser(projectId, userId, additionalOpts = {}) {
        return this.client.delete(`v1/projects/${projectId}/users/${userId}`, additionalOpts).json();
    }

    transferOwnership(projectId, userId, additionalOpts = {}) {
        return this.client.post(`v1/projects/${projectId}/owner/${userId}`, additionalOpts).json();
    }

    async getPendingInvites(projectId, additionalOpts = {}) {
        const response = await this.client.get(`v1/projects/${projectId}/invites`, additionalOpts).json();
        response.invites = response.invites ? .map((pendingInvite) => {
            return { ...pendingInvite,
                projectPermission: defaultProjectInvitePermission
            };
        });
        return response;
    }

    cancelInvite(projectId, inviteId, additionalOpts = {}) {
        return this.client.delete(`v1/projects/${projectId}/invites/${inviteId}`, additionalOpts).json();
    }

    // inviteUserToProject and inviteEmailToProject should probably be merged into one method. I separated them so I could have an easier time testing them

    async inviteUserToProject(projectId, userId, additionalOpts = {}) {
        const response = await this.client.post(`v1/projects/${projectId}/invites`, {
            json: {
                userId
            },
            ...additionalOpts
        }).json();
        response.projectPermission = defaultProjectInvitePermission;
        return response;
    }

    async inviteEmailToProject(projectId, email, additionalOpts = {}) {
        const response = await this.client.post(`v1/projects/${projectId}/invites`, {
            json: {
                email
            },
            ...additionalOpts
        }).json();
        response.projectPermission = defaultProjectInvitePermission;
        return response;
    }

    // - Project policy getters

    getProjectPolicy(projectId, additionalOpts = {}) {
        return this.client.get(`v1/projects/${projectId}/policy`, additionalOpts).json();
    }

    getProjectAvatarPolicy(projectId, additionalOpts = {}) {
        return this.client.get(`v1/projects/${projectId}/avatar/policy`, additionalOpts).json();
    }

    // - User methods

    createAnonymousUser(additionalOpts = {}) {
        return this.client.post('v1/users/anon', additionalOpts).json();
    }

    getUserGlitchPro(userId, additionalOpts = {}) {
        return this.client.get(`v1/users/${userId}/glitchPro`, additionalOpts).json();
    }

    updateUser(userId, params, additionalOpts = {}) {
        return this.client.patch(`v1/users/${userId}`, {
            json: params,
            ...additionalOpts
        }).json();
    }

    addThanks(userId, additionalOpts = {}) {
        return this.client.put(`v1/users/${userId}/thanks`, additionalOpts).json();
    }

    deleteThanks(userId, additionalOpts = {}) {
        return this.client.delete(`v1/users/${userId}/thanks`, additionalOpts).json();
    }

    // - Glitch Pro methods

    getGlitchPro(additionalOpts = {}) {
        return this.client.get(`v1/payments/glitchPro`, additionalOpts).json();
    }

    // - Collection methods

    getCollection(collectionId, {
        limit,
        ...additionalOpts
    } = {}) {
        return this.client
            .get(`v1/collections/${collectionId}/projects`, {
                searchParams: buildSearchParams({
                    limit
                }),
                ...additionalOpts,
            })
            .json();
    }

    getCollectionByFullUrl(collectionFullUrl, additionalOpts = {}) {
        return this.client
            .get(`v1/collections/by/fullUrl`, {
                searchParams: buildSearchParams({
                    fullUrl: collectionFullUrl
                }),
                ...additionalOpts,
            })
            .json();
    }

    addProjectToCollection(collectionId, projectId, additionalOpts = {}) {
        return this.client.put(`v1/collections/${collectionId}/projects/${projectId}`, additionalOpts).json();
    }

    removeProjectFromCollection(collectionId, projectId, additionalOpts = {}) {
        return this.client.delete(`v1/collections/${collectionId}/projects/${projectId}`, additionalOpts).json();
    }

    getSearchCreds(additionalOpts = {}) {
        return this.client.get('v1/search/creds', additionalOpts).json();
    }

    createAuthorizationToken(domainOrId, additionalOpts = {}) {
        return this.client
            .post('v1/auth/authorizationToken', {
                json: {
                    domainOrId
                },
                ...additionalOpts,
            })
            .json();
    }

    // Project domains
    getProjectDomains(projectId) {
        return this.client.get(`v1/projects/${projectId}/domains`).json();
    }

    addProjectDomain(projectId, domain) {
        return this.client.post(`v1/projects/${projectId}/domains`, {
            json: {
                domain
            }
        }).json();
    }

    removeProjectDomain(projectId, domain) {
        return this.client.delete(`v1/projects/${projectId}/domains`, {
            json: {
                domain
            }
        }).json();
    }
}