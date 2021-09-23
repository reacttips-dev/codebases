import {
    Machine,
    interpret
} from 'xstate';
import {
    useService
} from '@xstate/react';
import useApplication from '../hooks/useApplication';
import GlitchApi, {
    GitRepoUnavailableError
} from '../glitch-api';
import {
    captureException
} from '../sentry';
import Project from '../models/project';
import {
    defaultRemixDomain
} from '../data/base-project-domains';
import {
    GRECAPTCHA_SITE_KEY
} from '../env';
import Recaptcha, {
    RecaptchaUnavailable,
    RecaptchaUnavailableError
} from '../recaptcha';
import {
    access
} from '../const';

const setProjectOnApplication = (application, projectMetadata) => {
    if (!projectMetadata) {
        return application.currentProjectIndex(-1);
    }
    const projects = application.projects().filter((existingProject) => existingProject.id() !== projectMetadata.id);
    application.projects([new Project(projectMetadata), ...projects]);
    return application.currentProjectIndex(0);
};

export const projectMachine = Machine({
    id: 'project',
    initial: 'idle',

    states: {
        idle: {},

        createProject: {
            entry: ['removeProjectOnApplication'],
            invoke: {
                src: 'createProject',
                onDone: 'connectToProject',
                onError: 'projectCreateFailed',
            },
        },

        loadProjectMetadata: {
            invoke: {
                src: 'getProjectMetadata',
                onDone: 'loadedProjectMetadata',

                onError: 'projectLoadFailed',
            },
        },

        loadedProjectMetadata: {
            on: {
                CONNECT_TO_PROJECT: 'connectToProject.connecting',
            },
        },

        connectToProject: {
            type: 'compound',
            initial: 'loadProjectMetadata',

            states: {
                loadProjectMetadata: {
                    invoke: {
                        src: 'getProjectMetadata',
                        onDone: 'connecting',
                        onError: 'connectionFailed',
                    },
                },
                connecting: {
                    invoke: {
                        src: 'connectToProjectOnApplication',
                        // TODO: remove importGitHubRepo once we roll out this new flow
                        // If an importGitHubRepo/importGitRepoUrl value has been passed in, we go to that step; otherwise we just connect
                        onDone: [{
                                cond: 'creatingProjectFromGitHubRepo',
                                target: 'importGitHub'
                            },
                            {
                                cond: 'creatingProjectFromGitRepo',
                                target: 'importGitRepo'
                            },
                            {
                                target: 'connected'
                            },
                        ],
                        onError: 'connectionFailed',
                    },
                },

                reconnecting: {
                    invoke: {
                        src: 'reconnectToProjectOnApplication',
                        onDone: 'connected',
                        onError: 'connectionFailed',
                    },
                },

                importGitHub: {
                    invoke: {
                        src: 'importGitHub',
                        onDone: 'connected',
                        onError: 'connectionFailed',
                    },
                },

                importGitRepo: {
                    invoke: {
                        src: 'importGitRepo',
                        onDone: 'connected',
                        onError: 'connectionFailed',
                    },
                },

                connected: {
                    entry: ['setProjectIsLoadedOnApplication'],
                    exit: ['clearProjectIsLoadedOnApplication'],

                    on: {
                        CURRENT_USER_JOINED: {
                            actions: ['clearUserPositionIsRestoredOnApplication'],
                            target: 'connecting',
                        },
                        CURRENT_USER_LEFT: {
                            actions: ['clearUserPositionIsRestoredOnApplication'],
                            target: 'connecting',
                        },
                        REWIND_EXITED: 'connecting',
                        USER_IDLE: {
                            actions: ['disconnectFromProjectOnApplication'],
                            target: 'disconnected',
                        },
                        IMPORT_GITHUB: 'importGitHub',
                    },
                },

                disconnected: {
                    on: {
                        USER_RETURNED: 'reconnecting',
                    },
                },

                connectionFailed: {
                    entry: ['showProjectConnectionFailedNotificationOnApplication'],
                    exit: ['hideProjectConnectionFailedNotificationOnApplication'],
                },
            },
        },

        projectLoadFailed: {
            entry: ['showProjectLoadFailedNotificationOnApplication'],
            exit: ['hideProjectLoadFailedNotificationOnApplication'],
        },

        projectCreateFailed: {
            entry: ['showProjectCreateFailureNotification'],
            exit: ['removeProjectCreateFailureNotification'],
        },
    },
    on: {
        LOAD_PROJECT_METADATA: 'loadProjectMetadata',
        CONNECT_TO_PROJECT: 'connectToProject',
        CREATE_PROJECT: 'createProject',
    },
});

export function projectConfig(application, recaptcha) {
    return {
        actions: {
            disconnectFromProjectOnApplication(_context, _event) {
                application.disconnectFromLogs();
                application.disconnectFromOT();
            },
            clearUserPositionIsRestoredOnApplication(_context, _event) {
                application.userPositionIsRestored(false);
            },
            showProjectLoadFailedNotificationOnApplication(_context, _event) {
                application.notifyProjectLoadFailed(true);
                // TODO: replace this with better default behaviour; for now we always fetch one project via the application.boot() function, so this returns it
                application.loadWelcomeProject();
            },
            hideProjectLoadFailedNotificationOnApplication(_context, _event) {
                application.notifyProjectLoadFailed(false);
            },
            showProjectConnectionFailedNotificationOnApplication(_context, _event) {
                application.notifyProjectConnectionFailed(true);
            },
            hideProjectConnectionFailedNotificationOnApplication(_context, _event) {
                application.notifyProjectConnectionFailed(false);
            },
            setProjectIsLoadedOnApplication(_context, _event) {
                application.updateUrlHashForProject(application.currentProject(), {
                    replace: true
                });
                application.projectIsLoaded(true);
            },
            clearProjectIsLoadedOnApplication(_context, _event) {
                application.projectIsLoaded(false);
            },
            removeProjectOnApplication(_context, _event) {
                setProjectOnApplication(application, null);
            },
            async showProjectCreateFailureNotification(_context, event) {
                const error = event.data;
                const body = await error.response.json();
                if (error instanceof RecaptchaUnavailableError) {
                    application.notifyRecaptchaUnavailable(true);
                } else if (error instanceof GlitchApi.HTTPError && error.response.status === 401) {
                    application.notifyGenericError({
                        message: 'It is not possible to create the project. The project you are remixing is private.'
                    });
                } else if (error instanceof GlitchApi.HTTPError && error.response.status === 422 && body.code === 'NEW_ACCOUNT_RESOURCE_CREATION_LIMIT') {
                    application.notifyGenericError({
                        message: 'New accounts have a project limit. If you would like to create additional projects, please try again in a couple days.',
                    });
                } else if (error instanceof GitRepoUnavailableError) {
                    application.notifyImportingGitRepo(false);
                    application.notifyGitRepositoryNotFoundError({
                        gitRepoUrl: error.gitRepoUrl
                    });
                } else {
                    application.notifyGenericError({
                        message: 'An error occurred when trying to create this project, please try again later.'
                    });
                }

                // eslint-disable-next-line no-underscore-dangle
                window.__CY_APPLICATION_READY__ = true;
                window.location.href = '/edit/#!/';
            },
            removeProjectCreateFailureNotification() {
                application.notifyRecaptchaUnavailable(false);
                application.notifyGenericError(false);
                application.notifyGitRepositoryNotFoundError(false);
            },
        },
        guards: {
            creatingProjectFromGitHubRepo: (_context, event) => event.data.importGitHubRepo,
            creatingProjectFromGitRepo: (_context, event) => event.data.importGitRepoUrl,
        },
        services: {
            connectToProjectOnApplication: (_context, event) =>
                application.connectToProject(application.currentProject()).then(() => ({
                    importGitRepoUrl: event.data.importGitRepoUrl,
                    importGitHubRepo: event.data.importGitHubRepo,
                    env: event.data.env,
                })),

            createProject: async (_context, event) => {
                const {
                    baseProjectDomain,
                    baseProjectId,
                    desiredDomain,
                    env,
                    importGitHubRepo,
                    importGitRepoUrl,
                    projectOwner
                } = event.data;
                if (importGitHubRepo) {
                    application.notifyImportingGitRepo({
                        repoUrl: `https://github.com/${importGitHubRepo}`
                    });
                } else if (importGitRepoUrl) {
                    application.notifyImportingGitRepo({
                        repoUrl: importGitRepoUrl
                    });
                }
                const additionalData = {
                    domain: desiredDomain
                };

                const envVars = Object.keys(env || {});

                // make sure data contains the referrer if it is available
                additionalData.remixReferer = document.referrer;

                try {
                    if (projectOwner.isAnon()) {
                        additionalData.recaptcha = await recaptcha.execute();
                    }
                    if (importGitRepoUrl) {
                        additionalData.gitRepoUrl = importGitRepoUrl;
                    }

                    let projectData;
                    if (baseProjectId) {
                        projectData = await application.glitchApi().remixProject(baseProjectId, additionalData);
                    } else if (baseProjectDomain) {
                        projectData = await application.glitchApi().remixProjectByDomain(baseProjectDomain, additionalData);
                    } else {
                        projectData = await application.glitchApi().remixProjectByDomain(defaultRemixDomain, additionalData);
                    }

                    if (envVars.length > 0) {
                        await application.glitchApi().v0.projectSetEnv(projectData.domain, env);
                    }

                    if (projectData.users == null) {
                        projectData.users = [{
                            id: projectOwner.id(),
                            projectPermission: {
                                accessLevel: access.ADMIN,
                            },
                        }, ];
                    }

                    const project = Project(projectData);
                    application.analytics.setCurrentProject(project); // we have to temporarily override this, as we need to send the analytics event before we set application.currentProject
                    const properties = {};
                    // TODO: base this on the passed in importGitRepoUrl once the new git import is rolled out to everyone
                    const search = new URLSearchParams(application.history.location.search);
                    const repoUrl = search.get('url');
                    if (repoUrl) {
                        const repoUrlObject = new URL(repoUrl);
                        properties.gitDomain = repoUrlObject.hostname;
                    } else if (window.location.hash.includes('import/github')) {
                        properties.gitDomain = 'github.com';
                    }
                    application.analytics.track('Project Created', properties);
                    return {
                        domain: project.domain(),
                        env,
                        importGitHubRepo,
                        importGitRepoUrl
                    };
                } catch (e) {
                    throw e;
                }
            },
            getProjectMetadata: async (context, event) => {
                const {
                    domain,
                    env,
                    importGitHubRepo,
                    importGitRepoUrl
                } = event.data;

                try {
                    const projectMetadata = await application.glitchApi().v0.getProject(domain);
                    if (!projectMetadata) {
                        const url = new URL('/edit/404.html', window.location);
                        url.searchParams.set('projectDomainOrId', domain);
                        window.location = url.href;
                        return null;
                    }
                    // We need to set the project on the application object asap too, as much of the UI still relies on the current project observable
                    setProjectOnApplication(application, projectMetadata);
                    return {
                        env,
                        projectMetadata,
                        importGitHubRepo,
                        importGitRepoUrl
                    };
                } catch (error) {
                    application.notifyGenericError(true);
                    captureException(error);
                    return null;
                }
            },
            importGitHub: async (_context, event) => {
                const {
                    importGitHubRepo,
                    path
                } = event.data;
                const github = application.github();

                try {
                    // will throw error if repo doesn't exist or is empty
                    await github.getRepoContents(importGitHubRepo);

                    // If we get here, the repo is visible to this user and there's at least one file in it.
                    await application.glitchApi().v0.projectGithubImport(application.currentProject().id(), importGitHubRepo, {
                        path
                    });
                    application.analytics.track('GitHub Repository Imported');
                    application.notifyImportingGitRepo(false);
                    application.notifyGitImportSuccess(true);
                } catch (error) {
                    application.notifyImportingGitRepo(false);
                    if (error instanceof GlitchApi.HTTPError === false) {
                        application.notifyGenericError(true);
                        return;
                    }
                    const responseJson = await error.response.json().catch(() => null);
                    if (error.response.status === 404) {
                        if (responseJson && responseJson.message === 'This repository is empty.') {
                            application.notifyGithubEmptyRepositoryError(true);
                        } else {
                            application.notifyGitRepositoryNotFoundError({
                                gitRepoUrl: `https://github.com/${importGitHubRepo}`
                            });
                        }
                    } else {
                        if (responseJson && responseJson.stderr) {
                            captureException(new Error(responseJson.stderr));
                        } else {
                            captureException(new Error('GitHub import failed'));
                        }
                        application.notifyGenericError(true);
                    }
                }
            },
            importGitRepo: async (_context, event) => {
                // To prevent flashing of the old filetree after import, we wipe the files of the originally remixed project
                // The imported git repo filetree will be generated after the import is finished.
                // TODO: remove this step once creation from a git repo is a one-step process.
                application.files([]);
                const {
                    env,
                    importGitRepoUrl
                } = event.data;

                try {
                    await application.glitchApi().v0.importGitRepoIntoProject(application.currentProjectId(), importGitRepoUrl);
                    // we have to create the env file again here because the import wipes the whole /app directory
                    if (Object.keys(env).length > 0) {
                        await application.glitchApi().v0.projectSetEnv(application.currentProjectDomain(), env);
                    }
                    application.notifyImportingGitRepo(false);
                } catch (error) {
                    captureException(error);
                    application.notifyGenericError("We couldn't import this git repo; please try again later");
                    throw error;
                }
            },
            reconnectToProjectOnApplication: async (_context, _event) => {
                application.notifyReconnecting(true);
                await application.connectToProject(application.currentProject());
                application.notifyReconnecting(false);
            },
        },
    };
}

export function createProjectMachine(application) {
    let recaptcha;
    if (window.grecaptcha) {
        recaptcha = new Recaptcha({
            recaptcha: window.grecaptcha,
            container: document.getElementById('__recaptcha'),
            siteKey: GRECAPTCHA_SITE_KEY,
        });
    } else {
        recaptcha = new RecaptchaUnavailable();
    }
    return interpret(projectMachine.withConfig(projectConfig(application, recaptcha)), {
        devTools: true,
    });
}

export function useProjectMachine() {
    const application = useApplication();
    return useService(application.projectMachine);
}