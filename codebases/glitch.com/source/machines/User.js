import {
    Machine,
    assign,
    interpret
} from 'xstate';
import {
    useService
} from '@xstate/react';
import useApplication from '../hooks/useApplication';
import * as Storage from '../utils/storage';
import GlitchApi from '../glitch-api';

// #region Helper functions
const CACHED_USER_KEY = 'cachedUser';
const RECENT_FILES_KEY = (userId) => `editor.user.${userId}.recentFiles`;
const RECENT_FILES_MAX = 100;

function getCachedUser() {
    const parsed = Storage.get(CACHED_USER_KEY);
    if (parsed !== null && typeof parsed === 'object' && 'persistentToken' in parsed) {
        return parsed;
    }
    return null;
}

function getRecentFiles(userId) {
    const parsed = Storage.get(RECENT_FILES_KEY(userId));
    if (Array.isArray(parsed) === false) {
        return [];
    }
    return parsed;
}

function saveCachedUser(user) {
    return Storage.set(CACHED_USER_KEY, user);
}

function saveRecentFiles(userId, recentFiles) {
    return Storage.set(RECENT_FILES_KEY(userId), recentFiles);
}
// #endregion Helper functions

export const userMachine = Machine({
    id: 'user',
    initial: 'loading',
    context: {
        error: null,
        user: null,
        recentFiles: null
    },

    states: {
        // Load user from cache or create anonymous user if none is found,
        // then fetch the user's recent files, then transition to the
        // active state.
        loading: {
            invoke: {
                src: 'fetchOrCreateUser',
                onDone: {
                    target: 'active',
                    actions: ['assignUser', 'fetchAndAssignRecentFiles']
                },
                onError: 'error',
            },
        },

        // User is logged in and editing.
        active: {
            type: 'parallel',
            entry: 'saveToCache',

            states: {
                awaitingInvite: {
                    initial: 'idle',

                    states: {
                        idle: {
                            on: {
                                TOGGLE_AWAITING_INVITE: 'active'
                            },
                        },

                        active: {
                            on: {
                                TOGGLE_AWAITING_INVITE: 'idle'
                            },
                        },
                    },
                },
            },

            on: {
                FILE_OPENED: {
                    actions: ['addRecentFile', 'saveToCache'],
                },
                TEXT_SELECTED: {
                    actions: ['assignLastCursor'],
                },
                CACHED_USER_CHANGE: [{
                        cond: 'persistentTokenIsSame',
                        actions: ['assignUser'],
                    },
                    {
                        cond: 'notInCypress',
                        actions: ['reloadPage'],
                    },
                ],
            },
        },

        // Failed to load user or create anonymous user.
        error: {
            entry: 'assignError',

            on: {
                RETRY: 'loading',
            },
        },
    },
});

export function userConfig() {
    return {
        actions: {
            assignError: assign({
                error: (_context, event) => event.data,
            }),

            assignLastCursor: assign({
                lastCursor: (_context, event) => event.data,
            }),

            assignUser: assign({
                user: (_context, event) => event.data,
            }),

            addRecentFile: assign({
                recentFiles: (context, event) => {
                    const file = event.data;
                    const currentRecentFiles = context.recentFiles || [];
                    const filteredRecentFiles = currentRecentFiles.filter(
                        (recentFile) => recentFile.path !== file.path || recentFile.projectId !== file.projectId,
                    );
                    const nextRecentFiles = filteredRecentFiles.concat(file).slice(-RECENT_FILES_MAX);
                    return nextRecentFiles;
                },
            }),

            fetchAndAssignRecentFiles: assign({
                recentFiles: (context, _event) => {
                    const recentFiles = getRecentFiles(context.user.id);
                    return recentFiles;
                },
            }),

            reloadPage: () => {
                window.document.location.reload();
            },

            saveToCache: (context) => {
                try {
                    saveCachedUser(context.user);
                    saveRecentFiles(context.user.id, context.recentFiles);
                } catch (e) {
                    console.error('Could not set cachedUser in localStorage');
                }
            },
        },

        services: {
            fetchOrCreateUser: async () => {
                let currentUser = getCachedUser();
                const glitchApi = new GlitchApi(currentUser && currentUser.persistentToken);

                if (currentUser !== null) {
                    try {
                        // use latestProjectOnly here for ~speed~
                        const boot = await glitchApi.v0.boot({
                            latestProjectOnly: true
                        });
                        currentUser = boot.user;

                        // anon users can't be pro users
                        if (currentUser.login) {
                            const subscription = await glitchApi.getGlitchPro();
                            currentUser.isProUser = subscription ? .isActive;
                        }
                    } catch (e) {
                        if (e instanceof GlitchApi.HTTPError === false || e.response.status >= 500) {
                            throw e;
                        }
                        currentUser = null;
                    }
                }

                if (currentUser === null) {
                    currentUser = await glitchApi.createAnonymousUser();
                }

                return currentUser;
            },
        },

        guards: {
            persistentTokenIsSame: (context, event) => event.data && context.user.persistentToken === event.data.persistentToken,
            notInCypress: (_context, _event) => 'Cypress' in window === false,
        },
    };
}

export function useUserMachine() {
    const application = useApplication();
    return useService(application.userMachine);
}

export function useCurrentUser() {
    const [userState] = useUserMachine();
    return userState ? .context ? .user;
}

export function isolatedUserMachine() {
    return interpret(userMachine.withConfig(userConfig()), {
        devTools: true,
    });
}