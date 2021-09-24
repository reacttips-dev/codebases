/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// The root of our entire application

const Observable = require('o_0');
const {
    createHashHistory
} = require('history');
const stripJsonComments = require('strip-json-comments');
const {
    EventEmitter
} = require('events');
const moment = require('moment');
const debounce = require('lodash/debounce');
const defaults = require('lodash/defaults');
const Comlink = require('comlink');

const OTClient = require('../otfs/ot-client');
const OTCodeMirror = require('../otfs/ot-codemirror');

const Model = require('../model');

const File = require('./file');
const Folder = require('./folder');
const Filetree = require('./filetree');
const Github = require('./github').default;
const Project = require('./project');
const User = require('./user');
const {
    randomId,
    pathIsInvalid,
    readFile
} = require('../util');
const {
    setSentryTag,
    captureException
} = require('../sentry');

const {
    ASSET_FILE_PATH,
    access,
    BOOSTED_APPS_COLLECTION_NAME
} = require('../const');
const {
    getBaseProjectDomains,
    defaultRemixDomain
} = require('../data/base-project-domains');

const makeAnalytics = require('../analytics').default;
const browserPredicates = require('./browser');

const {
    sortedIntersectionOfSorted
} = require('../algorithm');
const messages = require('../utils/messages');

const {
    GITHUB_CLIENT_ID,
    API_URL,
    ENVIRONMENT
} = require('../env');

const isolatedUserMachine = require('../machines/User').isolatedUserMachine;
const CurrentUserShim = require('../shims/CurrentUserShim').default;
const createProjectMachine = require('../machines/Project').createProjectMachine;
const GlitchApi = require('../glitch-api').default;

const userAgent = navigator.userAgent || navigator.vendor || window.opera;

// eslint-disable-next-line func-names
const Application = function(I = {}, self = undefined) {
    I = I || /* istanbul ignore next */ {};
    self = self || Model(I);
    defaults(I, {
        logger: console,
        currentProjectIndex: -1,
        projects: [],
        privateFileUuids: [],
        privateFileUuidsToCopy: [],
        environment: ENVIRONMENT, // 'development', 'production'
        refreshPreviewOnChanges: true,
    });

    self.attrModels('projects', Project);
    self.attrObservable('currentProjectIndex', 'fileChanged', 'privateFileUuidsToCopy', 'privateFileUuids', 'refreshPreviewOnChanges');

    self.attrReader('environment');

    // eslint-disable-next-line global-require
    self.include(require('./assets'));
    self.extend(browserPredicates(userAgent));
    // eslint-disable-next-line global-require
    self.include(require('./ot-socket'));
    // eslint-disable-next-line global-require
    self.include(require('./codemirror-shim'));
    // eslint-disable-next-line global-require
    self.include(require('./log-socket'));
    // eslint-disable-next-line global-require
    const {
        rewind
    } = require('./rewind');
    self.include(rewind);
    // eslint-disable-next-line global-require
    self.include(require('../utils/storage').shim);
    // eslint-disable-next-line global-require
    self.include(require('../utils/project-import-export'));

    // eslint-disable-next-line global-require
    self.include(require('./log-element').default);

    // eslint-disable-next-line global-require
    self.include(require('./rollouts').default);

    // eslint-disable-next-line global-require
    self.include(require('./app-type-config').default);

    // eslint-disable-next-line global-require
    self.projectAvatarUtils = require('../utils/project-avatar')(self);
    // eslint-disable-next-line global-require
    self.packageUtils = require('../utils/package-utils')(self);
    // eslint-disable-next-line global-require
    self.newStuffLog = require('../new-stuff-log')(self);
    // eslint-disable-next-line global-require
    self.actionInterface = require('../utils/action-interface')(self);
    // eslint-disable-next-line global-require
    self.fileSearch = require('../utils/file-search')(self);

    // eslint-disable-next-line prefer-const
    let editorIsEmbedded = Observable(window.location.pathname.startsWith('/embed'));

    // eslint-disable-next-line no-unused-vars
    const RECENTLY_EDITED_TIMEOUT = 30 * 1000; // 30 seconds

    const userMachine = isolatedUserMachine();
    const currentUserShim = CurrentUserShim(userMachine);

    const projectMachine = createProjectMachine(self);

    self.extend({
        history: createHashHistory({
            hashType: 'hashbang'
        }),
        currentUser: () => currentUserShim,
        currentUserShim,
        userMachine,

        projectMachine,

        start() {
            projectMachine.start();
            userMachine.start();
        },

        logger() {
            return I.logger;
        },

        production() {
            return I.environment.match(/prod/);
        },
        // eslint-disable-next-line consistent-return
        hiddenOnProduction() {
            if (self.production()) {
                return 'hidden';
            }
        },

        containerPath: Observable(),

        booting: Observable(false),
        booted: Observable(false),
        cspViolations: Observable([]),

        // State
        firstLoad: Observable(true),
        userIsLoggingIn: Observable(false),
        projectIsLoaded: Observable(false),
        projectListIsLoaded: Observable(false),
        userIsIdle: Observable(false),
        redirectingToLogin: Observable(false),
        projectIsRenaming: Observable(false),
        markdownPreviewVisible: Observable(true),
        dotenvViewVisible: Observable(true),
        projectRuntimeInfo: Observable(''),
        projectAppType: Observable(null),
        restorePath: Observable(''),
        restoreLine: Observable('1'),
        highlights: Observable([]),
        highlightFilePath: Observable(''),
        restoreCharacter: Observable('0'),
        userPositionIsRestored: Observable(false),
        appPreviewIsCollapsed: Observable(false),
        appPreviewVisible: Observable(undefined),
        appPreviewUrlPath: Observable('/'),
        userIsDraggingText: Observable(false),
        applicationWidth: Observable(true),
        currentLicense: Observable(undefined),
        lastDeletedProject: Observable(undefined),
        newProjectTemplates: Observable([]),
        signInCodeIsValid: Observable(true),
        connectionErrorDetails: Observable(null),
        applicationFocused: Observable(false),
        applicationHovered: Observable(false),
        consoleWelcomeDisplayed: Observable(false),
        // eslint-disable-next-line no-prototype-builtins
        sidebarIsCollapsed: Observable(self.getUserPrefs().hasOwnProperty('sidebarIsCollapsed') ? self.getUserPrefs().sidebarIsCollapsed : self.isMobile),
        // eslint-disable-next-line no-prototype-builtins
        sidebarWidth: Observable(self.getUserPrefs().hasOwnProperty('sidebarWidth') ? self.getUserPrefs().sidebarWidth : 250), // default width currently set in CSS
        appPreviewSize: Observable(0),
        fileAddedAndNotAnimated: Observable(null),
        formattingCodeInProgress: Observable(false),
        fullScreenSparkleEffectVisible: Observable(false),

        // Embeds
        embedAppPreviewSize: Observable(0),
        embedSelectedFilePath: Observable(''),
        embedAttributionHidden: Observable(false),
        embedBottombarCollapsed: Observable(false),
        // eslint-disable-next-line object-shorthand
        editorIsEmbedded: editorIsEmbedded,
        embedEditingEnabled: Observable(false),
        embedParentIsGlitch: Observable(false),
        embedSidebarCollapsed: Observable(false),
        embedHelperHeight: Observable(null),

        // Settings
        wrapText: Observable(false),
        maxLogs: Observable(2000),
        eslintrc: Observable(null),
        prettierrc: Observable(null),
        watchJson: Observable(null),

        // New Stuff Updates
        newStuffNotificationVisible: Observable(false),
        newStuff: Observable([]),

        // debuggerEnabled means that it is turned on in .env
        debuggerEnabled: Observable(false),
        // debuggerReady means that it is listening
        debuggerReady: Observable(false),

        jiggleAssetFiletreeEntry: Observable(false),

        // Panels
        logsPanelVisible: Observable(false),
        consolePanelVisible: Observable(false),

        // Privacy and Access Control
        projectPrivacy() {
            return self.currentProject() ? .privacy();
        },
        projectAccessLevelForCurrentUser() {
            return self.currentProject() ? .accessLevel(self.currentUser());
        },
        projectIsHelperOrLessForCurrentUser() {
            return self.projectAccessLevelForCurrentUser() <= access.HELPER;
        },
        projectIsMemberOrMoreForCurrentUser() {
            return self.projectAccessLevelForCurrentUser() >= access.MEMBER;
        },
        projectIsMemberForCurrentUser() {
            return self.projectAccessLevelForCurrentUser() === access.MEMBER;
        },
        projectIsAdminForCurrentUser() {
            return self.projectAccessLevelForCurrentUser() === access.ADMIN;
        },
        projectIsReadOnlyForCurrentUser() {
            return self.projectAccessLevelForCurrentUser() === access.NONE;
        },

        // Project
        projectContainerStatus: Observable('ok'), // ok, building, error
        projectRemixes: Observable(0), // ^

        // Project Reources
        projectContainerResourcesStatus: Observable('ok'), // 'warn', 'error'
        projectContainerResourcesData: Observable({
            quotaUsagePercent: 0,
            memoryUsagePercent: 0,
            diskUsagePercent: 0,
        }),
        projectContainerResourcesDataLoaded: Observable(false),
        projectContainerCpuStatus: Observable('ok'),
        projectContainerMemoryStatus: Observable('ok'),
        projectContainerDiskStatus: Observable('ok'),

        // Collaborator Pops
        collaboratorPositionTop: Observable(0),
        collaboratorPositionLeft: Observable(0),

        // Packages
        checkingForPackageUpdates: Observable(false),
        packagesOutdated: self.packageUtils.outdatedPackages,

        // Search
        projectSearchBoxValue: Observable(''),

        // Features
        editorVisible: Observable(true),
        editorWrapVisible: Observable(true),
        assetsWrapVisible: Observable(false),
        mediaWrapVisible: Observable(false),
        mediaElement: Observable(null),
        appTypeConfigWrapVisible: Observable(false),

        // Assets
        assets: Observable([]),
        draggedTextFile: Observable({}),

        // Pop Overs
        aboutPopVisible: Observable(false),
        addPackagePopVisible: Observable(false),
        accountPopVisible: Observable(false),
        projectPopVisible: Observable(false),
        projectsSelectPopVisible: Observable(false),
        projectAvatarPopVisible: Observable(false),
        personPopVisible: Observable(false),
        projectSearchPopVisible: Observable(false),
        shareButtonsPopVisible: Observable(false),
        sharePopVisible: Observable(false),
        embedSharePopVisible: Observable(false),
        gitImportExportPopVisible: Observable(false),
        smallViewportOptionsPopVisible: Observable(false),
        changeLicensePopVisible: Observable(false),
        signInTop: Observable(''),
        signInLeft: Observable(''),
        newProjectPopVisible: Observable(false),
        projectContainerStatusPopVisible: Observable(false),
        newFilePopVisible: Observable(false),
        customDomainPopVisible: Observable(false),
        toolsPopVisible: Observable(false),
        showAppPopVisible: Observable(false),
        appPreviewUrlPopVisible: Observable(false),
        teamPopCurrentTeam: Observable(null), // team model to show team pop for that team, null to not show team pop

        // Panels
        containerStatsPanelVisible: Observable(false),

        // Overlays
        assetOverlayAssetUUID: Observable(null), // uuid of asset to show in overlay, null to show nothing
        keyboardShortcutsOverlayVisible: Observable(false),
        dragToUploadOverlayVisible: Observable(false),
        newStuffOverlayVisible: Observable(false),
        projectIsSuspendedOverlayVisible: Observable(false),
        shareEmbedOverlayVisible: Observable(false),
        connectionErrorOverlayVisible: Observable(false),
        projectSearchFilesOverlayVisible: Observable(false),
        ownerNotInGoodStandingOverlayVisible: Observable(false),
        recaptchaOverlayCallback: Observable(false),
        uptimeLimitsExceededOverlayVisible: Observable(false),
        glitchSubscriptionRequiredOverlayVisible: Observable(false),
        anonymousProjectDeletedOverlayVisible: Observable(false),
        shareProjectOverlayVisible: Observable(false),

        // Notifications
        notifyAutosave: Observable(false),
        notifyConnectionError: Observable(false),
        notifyProjectVisitorCannotUploadAssets: Observable(false),
        notifyConnectionNotEstablished: Observable(false),
        notifyReconnecting: Observable(false),
        notifyInvalidFileName: Observable(false),
        notifyInvalidFolderName: Observable(false),
        notifyPreviewWindowOpened: Observable(false),
        notifyAnonProjectLimits: Observable(false),
        notifyAnonUserLimits: Observable(false),
        notifyGitImportUrlInvalid: Observable(false),
        notifyImportingGitRepo: Observable(false),
        notifyGithubExporting: Observable(false),
        notifyGitImportSuccess: Observable(false),
        notifyInvalidGitRepository: Observable(false),
        notifyGithubExportFailure: Observable(false),
        notifyGithubEmptyRepositoryError: Observable(false),
        notifyGitRepositoryNotFoundError: Observable(false),
        notifyGithubExportSuccess: Observable(false),
        notifyGithubExportNoRepoScopeError: Observable(false),
        notifyGenericError: Observable(false),
        notifyReconnected: Observable(false),
        notifyUploadFailure: Observable(false),
        notifyJoinedProject: Observable(false),
        notifyLeftProject: Observable(false),
        notifyTakeActionToEdit: Observable(false),
        notifyPrettierFirstRun: Observable(false),
        notifyDeletedProject: Observable(false),
        notifyEditorIsPreviewingRewind: self.editorIsPreviewingRewind,
        notifyEditorRewoundProject: Observable(false),
        notifyEditorIsRewindingProject: self.editorIsRewindingProject,
        notifyFileHiddenByGitIgnore: Observable(false),
        notifyCanEdit: Observable(false),
        notifyOpenInFullEditor: Observable(false),
        notifyCanEditInEmbedRemixedEmbed: Observable(false),
        notifyUploading: Observable(false),
        notifyCloneError: Observable(false),
        notifyDebuggerIsChromeOnly: Observable(false),
        notifyPrettierParseError: Observable(false),
        notifyPrettierLoadError: Observable(false),
        notifyFirstSwitchToStatic: Observable(false),
        notifyFirstSwitchToNonStatic: Observable(false),

        jiggleTakeActionToEditNotification: Observable(false),
        jigglePreviewingRewindNotification: Observable(false),

        // dotenv
        notifyDotenvRemovedVariable: Observable(false),
        notifyDotenvUpdatesAsYouType: Observable(false),

        notifyProjectConnectionFailed: Observable(false),
        notifyProjectLoadFailed: Observable(false),

        // recaptcha
        notifyRecaptchaUnavailable: Observable(false),

        // Stores linting results for files as sent from the backend
        // { [filePath: String]: LintingResults[] }
        backendLintingResults: {},

        // Global Glitch Pro state
        boostedCollection: Observable(null),
        boostedProjects: Observable(null),

        // Onboarding Tips
        // eslint-disable-next-line no-prototype-builtins
        showTipForUserAvatar: Observable(self.getUserPrefs().hasOwnProperty('showTipForUserAvatar') ? self.getUserPrefs().showTipForUserAvatar : true),

        // Upload Status
        pendingUploads: Observable([]),

        printConsoleWarning(log, href) {
            href = href || window.location.href;
            log = log || self.logger().log.bind(self.logger());
            if (!self.consoleWelcomeDisplayed() && href.includes('/edit')) {
                log('%cWelcome to the console', 'color: #e100d8');
                log(
                    'If you’re following someone else’s instructions make sure you trust them. If in doubt post a question in our forum https://support.glitch.com',
                );
                self.consoleWelcomeDisplayed(true);
            }
        },

        uploadProgress() {
            // Integer between 0..100
            const pendingUploads = self.pendingUploads();
            const numberOfPendingUploads = pendingUploads.length;

            const progress = pendingUploads.reduce((value, {
                ratio
            }) => value + ratio(), 0);

            // eslint-disable-next-line no-bitwise
            return ((progress / numberOfPendingUploads) * 100) | 0;
        },

        clearAssetOverlayAssetUUID() {
            self.assetOverlayAssetUUID(null);
        },

        closeAllPopOversEmitter: new EventEmitter(),
        onCloseAllPopOvers(listener) {
            self.closeAllPopOversEmitter.on('close', listener);

            return () => {
                self.closeAllPopOversEmitter.off('close', listener);
            };
        },
        closeAllPopOvers(el) {
            self.closeAllPopOversEmitter.emit('close', el);

            self.aboutPopVisible(false);
            self.addPackagePopVisible(false);
            self.accountPopVisible(false);
            self.projectPopVisible(false);
            self.projectsSelectPopVisible(false);
            self.projectAvatarPopVisible(false);
            self.personPopVisible(false);
            self.toolsPopVisible(false);

            /* istanbul ignore if */
            if (typeof self.fileOptionsPopVisible === 'function') {
                self.fileOptionsPopVisible(false);
            }
            self.projectSearchPopVisible(false);
            self.gitImportExportPopVisible(false);
            self.shareButtonsPopVisible(false);
            self.sharePopVisible(false);
            self.embedSharePopVisible(false);
            self.smallViewportOptionsPopVisible(false);
            self.changeLicensePopVisible(false);
            self.newProjectPopVisible(false);
            self.projectContainerStatusPopVisible(false);
            self.newFilePopVisible(false);
            self.customDomainPopVisible(false);
            self.showAppPopVisible(false);
            self.appPreviewUrlPopVisible(false);
            self.teamPopCurrentTeam(null);

            // Overlays
            self.assetOverlayAssetUUID(null);
            self.keyboardShortcutsOverlayVisible(false);
            self.dragToUploadOverlayVisible(false);
            self.newStuffOverlayVisible(false);
            self.shareEmbedOverlayVisible(false);
            self.projectSearchFilesOverlayVisible(false);
            self.ownerNotInGoodStandingOverlayVisible(false);
            self.uptimeLimitsExceededOverlayVisible(false);
            self.glitchSubscriptionRequiredOverlayVisible(false);
            self.shareProjectOverlayVisible(false);
        },

        selectTextFile() {
            self.assetsWrapVisible(false);
            self.appTypeConfigWrapVisible(false);
            self.editorWrapVisible(true);
            self.mediaWrapVisible(false);
        },

        selectMediaFile(file) {
            let element;
            if (file.extensionType() === 'audio') {
                element = document.createElement('audio');
                element.controls = true;
                element.src = `data:audio/mp3;base64,${file.base64Content()}`;
            } else if (file.extensionType() === 'image') {
                element = document.createElement('img');
                element.src = `data:image/png;base64,${file.base64Content()}`;
            } else if (file.extensionType() === 'pdf') {
                element = document.createElement('iframe');
                element.style = 'width: 100%; height: 100%; border: none';
                element.src = `data:application/pdf;base64,${file.base64Content()}`;
            } else {
                element = document.createElement('div');
                element.textContent = 'Cannot display this type of binary file';
            }

            self.mediaElement(element);

            self.assetsWrapVisible(false);
            self.appTypeConfigWrapVisible(false);
            self.editorWrapVisible(false);
            return self.mediaWrapVisible(true);
        },

        currentDocument() {
            // eslint-disable-next-line one-var
            const array = self.recentFiles(),
                file = array[array.length - 1];

            /* istanbul ignore next */
            return file != null ? file.uuid() : undefined;
        },

        // eslint-disable-next-line consistent-return
        currentDocumentIsTextFile() {
            if (self.editorWrapVisible() && self.assetsWrapVisible() === false) {
                return true;
            }
        },

        currentFileInfo() {
            const uuid = self.currentDocument();
            const file = self.fileByUuid(uuid);
            // eslint-disable-next-line prefer-const
            let info = {};
            if (file && self.projectIsLoaded()) {
                info.path = file.path();
                info.folders = file.folders();
                info.extension = file.extension();
            }
            return info;
        },

        currentTheme: Observable(self.getUserPrefs().theme || 'sugar'),

        setPreferredTheme(theme) {
            self.updateUserPrefs('theme', theme);
            self.currentTheme(theme);
        },

        analytics: makeAnalytics(userAgent, editorIsEmbedded),

        // eslint-disable-next-line consistent-return, no-unused-vars
        touchClass(event) {
            if (self.isMobile) {
                return 'touch';
            }
        },

        projectName() {
            return self.currentProject() ? .name();
        },

        // The user may be associated with multiple teams, and the project may be associated with multiple
        // teams. In order to get as narrow a list as possible, we compute the intersection of the current
        // user's teams and the current project's teams here. The intersection may still be multiple teams.
        // In that case we return the sorted team ids, separated by commas. There is not enough information
        // to guarantee that we can get it down to a single unique team.
        relevantTeams() {
            // eslint-disable-next-line prefer-const
            let currentProject = self.currentProject();
            // eslint-disable-next-line prefer-const
            let currentUser = self.currentUser();
            if (!currentProject || !currentUser) {
                return '0';
            }
            // eslint-disable-next-line prefer-const
            let userTeams = currentUser
                .teams()
                .map((t) => t.id())
                .sort();
            // eslint-disable-next-line prefer-const
            let projectTeams = currentProject
                .teams()
                .map((t) => t.id())
                .sort();
            // eslint-disable-next-line prefer-const
            let bothTeams = sortedIntersectionOfSorted(userTeams, projectTeams);
            if (bothTeams.length > 0) {
                return bothTeams.join(',');
                // eslint-disable-next-line no-else-return
            } else {
                return '0';
            }
        },

        projectFilePaths() {
            return self
                .currentProject() ?
                .files()
                .map((file) => file.path());
        },

        // eslint-disable-next-line consistent-return
        touchProject() {
            if (!self.projectIsReadOnlyForCurrentUser()) {
                return self.currentProject() ? .touch(self);
            }
        },

        globalclick(event) {
            if (event.target.closest('button')) {
                event.target.parentElement.blur();
                event.target.blur();
            }

            if (event.defaultPrevented) {
                return;
            }

            if (!event.target.closest('.pop-over, .opens-pop-over, .overlay, [data-module="Notification"]')) {
                self.closeAllPopOvers(event.target);
            }
        },

        projectNameFromPath(path) {
            const project = /[^?]*/; // all characters until '?'
            return path.match(project)[0];
        },

        refreshPreview() {
            if (self.editorIsEmbedded()) {
                self.updateAppPreview();
            } else {
                self.preview();
            }
        },

        // eslint-disable-next-line consistent-return
        setRestorePosition(queryPath) {
            const positionMatch = /:[0-9]+/g; // captures groups of :123
            const position = queryPath.match(positionMatch);
            const line = position != null ? position[0] : undefined;
            const character = position != null ? position[1] : undefined;

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            self.restorePath(getPathFromQueryPath(queryPath));
            if (line) {
                self.restoreLine(line.slice(1, line.length));
            }
            if (character) {
                return self.restoreCharacter(character.slice(1, character.length));
            }
        },
        /**
         * Set lines to be highlighted
         */
        setHighlightLines(lines, queryPath) {
            if (!queryPath || queryPath.length === 0) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            self.highlightFilePath(getPathFromQueryPath(queryPath));
            self.highlights(lines);
        },

        // Get user projects from auth server
        boot() {
            if (self.booting()) {
                return Promise.resolve();
            }

            self.booting(true);

            return (
                Promise.resolve()
                // eslint-disable-next-line func-names
                .then(function() {
                    // eslint-disable-next-line func-names
                    return self.fetchLatestProject().catch(function(e) {
                        self.notifyConnectionError(true);
                        throw e;
                    });
                })
                // eslint-disable-next-line func-names
                .then(function() {
                    self.analytics.identify(self.currentUser());
                    self.connectionErrorOverlayVisible(false);
                    self.refreshEditor();
                    self.fetchBoostedCollection();
                    self.booted(true);
                })
                .then(() => {
                    // Once we've fetched the user, lets apply any feature flags based on their ID
                    self.appPreviewVisible.toggle();
                })
                .catch(async (error) => {
                    const responseJson = await error.response
                        .json()
                        .catch(() => ({
                            status: 'Unknown',
                            error: 'Server error',
                            message: 'An unexpected error has occurred.'
                        }));

                    // We failed to boot, assume that auth/backend is down
                    self.logger().log(error);
                    self.logger().log(responseJson);
                    self.connectionErrorDetails(responseJson);
                    return self.connectionErrorOverlayVisible(true);
                })
            );
        },

        fetchLatestProject() {
            return (
                self
                .glitchApi()
                .v0.boot({
                    latestProjectOnly: true
                })
                .then((boot) => boot.projects[0] || null)
                .then((project) => {
                    if (project !== null) {
                        self.projects([Project(project)]);
                    }
                })
                // eslint-disable-next-line func-names
                .catch(function(error) {
                    if (error.response.status === 401) {
                        self.logout();

                        throw Error('User is unauthorized');
                    } else {
                        throw error;
                    }
                })
                .finally(() => self.checkForNewStuff())
            );
        },

        /**
         * Set newStuffNotificationVisible to true or false depending on whether we
         * want to show the user that there are new updates.
         */
        checkForNewStuff() {
            // Only display the new stuff cat if there's unread updates
            // eslint-disable-next-line prefer-const, no-unused-vars
            let isNewStuffUnread = false;
            const newStuffReadId = self.getUserPref('newStuffReadId');
            if (newStuffReadId != null) {
                const newStuffLatestId = self.newStuffLog.updates()[0].id;
                if (newStuffLatestId <= newStuffReadId) {
                    self.newStuffNotificationVisible(false);
                    return;
                }
            }

            // Only notify logged-in users
            if (!self.currentUser().loggedIn()) {
                self.newStuffNotificationVisible(false);
                return;
            }

            // Do not show the new stuff cat for brand-new users
            const DAYS_LOGGED_IN = 2;
            const created = new Date(self.currentUser().createdAt());
            const today = new Date();
            const difference = moment(today).diff(created, 'days');
            if (difference <= DAYS_LOGGED_IN) {
                self.newStuffNotificationVisible(false);
                return;
            }

            // Don't show new stuff if the user has disabled it
            if (!self.getUserPref('showNewStuff')) {
                self.newStuffNotificationVisible(false);
                return;
            }

            self.newStuffNotificationVisible(true);
        },

        fetchUserProjects() {
            self.projectListIsLoaded(false);

            return self
                .glitchApi()
                .v0.boot({
                    latestProjectOnly: false
                })
                .then((boot) => boot.projects)
                .then((projects) => {
                    projects = projects.filter((p) => p.id !== self.currentProject().id());
                    return self.projects([self.currentProject()].concat(projects.map((project) => Project(project))));
                })
                .finally(() => self.projectListIsLoaded(true));
        },

        focusOnGlobalSearch() {
            document.getElementById('project-search-input').focus();
        },

        updateUserThanks(user) {
            return user.updateThanks(self);
        },

        // Sort with directories first, alphabetically.
        // This function can be used with File models or pure objects (the latter is for pre-sorting the file tree for a single bulk update)
        alphabeticalize(fileA, fileB) {
            const a = typeof fileA.path === 'function' ? fileA.path().split('/') : fileA.path.split('/');
            const b = typeof fileB.path === 'function' ? fileB.path().split('/') : fileB.path.split('/');

            const lengthA = a.length;
            const lengthB = b.length;
            const l = Math.max(lengthA, lengthB);

            let i = 0;
            while (i < l) {
                // Directories before files
                if (lengthA - 1 === i) {
                    // a is file
                    if (lengthB > lengthA) {
                        return +1;
                    }
                }
                if (lengthB - 1 === i) {
                    // b is file
                    if (lengthA > lengthB) {
                        return -1;
                    }
                }

                if (a[i] > b[i]) {
                    return +1;
                }
                if (a[i] < b[i]) {
                    return -1;
                }
                i += 1;
            }

            return 0;
        },

        persistentToken() {
            return self.currentUser() ? .persistentToken();
        },

        setDestinationAfterAuth() {
            self.storeLocal('destinationAfterAuth', {
                expires: moment().add(10, 'minutes').toISOString(),
                to: {
                    pathname: window.location.pathname,
                    search: window.location.search,
                    hash: window.location.hash,
                },
            });
        },

        projectDownloadUrl() {
            const projectId = self.currentProjectId();
            const userToken = self.persistentToken();
            return `${API_URL}/project/download/?authorization=${userToken}&projectId=${projectId}`;
        },

        getGitHubLoginUrl: (scopes = 'user:email') => {
            return Github.authorizationUrl(GITHUB_CLIENT_ID, scopes);
        },

        redirectToGitHubLogin: /* istanbul ignore next: typescript port */ (scopes) => {
            self.redirectingToLogin(true);
            self.setDestinationAfterAuth();
            window.location = self.getGitHubLoginUrl(scopes);
        },

        logout() {
            // eslint-disable-next-line dot-notation
            global['analytics'].reset();
            self.removeLocal('cachedUser');
            // clear cookies used for community site ssr
            document.cookie = `hasLogin=; path=/; expires=${new Date()}`;
            document.cookie = `hasProjects=; path=/; expires=${new Date()}`;

            window.location = '//glitch.com';
        },

        // eslint-disable-next-line consistent-return
        updateEmbedSidebarCollapsed(parent) {
            if (self.embedParentIsGlitch()) {
                const value = self.sidebarIsCollapsed();
                parent = parent || /* istanbul ignore next */ window.parent; // parent param is just for the unit test
                parent.postMessage(messages.updateEmbedState({
                    embedSidebarCollapsed: value
                }), '*');
                return self.updateUserPrefs('embedSidebarCollapsed', value);
            }
        },

        currentUserIsLoggedIn() {
            return self.currentUser().loggedIn();
        },

        removeStaleUsers() {
            const currentTime = +new Date();
            return (
                self.currentRemoteUsers
                .filter((user) => currentTime - user.lastSeen() > 30 * 1000)
                // eslint-disable-next-line func-names, consistent-return
                .forEach(function(user) {
                    self.currentRemoteUsers.remove(user);
                })
            );
        },

        currentRemoteUsers: Observable([]),

        async updateRemoteUser(remoteUserData) {
            let user;
            if (remoteUserData.invited) {
                self.updateInvitedUser(remoteUserData);
                return;
            }

            if (remoteUserData.left) {
                self.updateLeftUser(remoteUserData);
                return;
            }

            if (remoteUserData.id !== self.currentUser().id()) {
                let indexOfExisting = -1;
                // eslint-disable-next-line consistent-return, func-names, no-shadow
                self.currentRemoteUsers.forEach(function(user, i) {
                    if (user.id() === remoteUserData.id) {
                        // eslint-disable-next-line no-return-assign
                        return (indexOfExisting = i);
                    }
                });

                if (indexOfExisting >= 0) {
                    user = self.currentRemoteUsers()[indexOfExisting];
                    user.update(remoteUserData);
                } else {
                    // note that the currentProject().users() array takes plain user objects with projectPermission data
                    // (which is already available in these broadcast messages) and not User model objects.
                    if (remoteUserData.projectPermission.accessLevel >= access.MEMBER) {
                        self.currentProject().users().push(remoteUserData);
                    }
                    user = User(remoteUserData);
                    self.currentRemoteUsers.push(user);
                    await self.updateUserThanks(user);
                    // we have a new user: broadcast ourselves!
                    self.broadcastUser();
                }

                user.lastSeen(Date.now());
            } else {
                user = self.currentUser();
            }

            if (remoteUserData.thankedBy) {
                user.thanksCount.increment(1);
                user.thanksReceived(true);
                return;
            }

            if (remoteUserData.unThankedBy) {
                user.thanksCount.decrement(1);
                // eslint-disable-next-line no-useless-return
                return;
            }
        },

        autoJoin() {
            const userData = self.currentUser().broadcastData();
            userData.projectPermission = {
                accessLevel: access.MEMBER
            };
            return self.updateInvitedUser(userData);
        },

        updateInvitedUser(userData) {
            const user = User(userData);

            // check if the user was already invited
            if (self.currentProject().accessLevel(user) > 0) {
                return;
            }

            const now = new Date().toISOString();
            self.currentProject().users.push({
                avatarUrl: user.userAvatarUrl(),
                emails: user.emails,
                id: user.id(),
                login: user.login(),
                name: user.name(),
                projectPermission: {
                    userId: user.id(),
                    projectId: self.currentProject().id(),
                    createdAt: now,
                    updatedAt: now,
                    accessLevel: userData.projectPermission.accessLevel,
                },
            });

            // update ourselves
            if (userData.id === self.currentUser().id()) {
                self.analytics.track('Project Joined');
                self.currentUser().awaitingInvite(false);
                self.broadcastUser({
                    invited: true
                });
                self.projectMachine.send({
                    type: 'CURRENT_USER_JOINED'
                });
                // eslint-disable-next-line consistent-return
                return self.notifyJoinedProject(true);
            }
        },

        updateLeftUser(userData) {
            const nextProjectUsers = self.currentProject().users.filter(({
                id
            }) => id !== userData.id);
            self.currentProject().users(nextProjectUsers);

            if (userData.id === self.currentUser().id()) {
                self.broadcastUser({
                    left: true
                });
                self.projectMachine.send({
                    type: 'CURRENT_USER_LEFT'
                });
                self.notifyLeftProject(true);
            }
        },

        remoteUserByClientId(clientId) {
            return self.currentRemoteUsers().find((user) => user.lastCursor() ? .clientId === clientId);
        },

        updateProjectName(newName) {
            self.currentProject().domain(newName);
            self.updateUrlHashForProject(self.currentProject(), {
                replace: true
            });
            self.updatePreview();
        },

        currentUsers() {
            const currentUsers = [self.currentUser()].concat(self.currentRemoteUsers());
            return currentUsers;
        },

        offlineMembers() {
            if (!self.currentProject()) {
                return [];
            }

            const currentUsers = self.currentUsers();
            // eslint-disable-next-line func-names
            const offlineUsers = self.currentProject().users.filter(function({
                id
            }) {
                const [online] = Array.from(currentUsers.filter((curr) => id === curr.id()));
                return !online;
            });
            // eslint-disable-next-line func-names
            return offlineUsers.map(function(userData) {
                const user = User(userData);
                user.isOnline(false);
                return user;
            });
        },

        // eslint-disable-next-line consistent-return
        projectInviteUrl() {
            const project = self.currentProject();
            if (project) {
                return `https://${window.location.host}/edit/#!/join/${project.inviteToken()}`;
            }
        },

        projectAvatarImage() {
            return self.currentProject() && self.currentProject().avatarUrl();
        },

        currentProject() {
            const projects = self.projects();
            const index = self.currentProjectIndex();
            return projects[index];
        },

        /**
         * Return 'Admin' if the user is a member of the current project, 'Reader'
         * if they are not, and null if there is no current project.
         * TODO: Tidy this up once we have true user permissions and roles
         */
        currentUserRole() {
            const currentProject = self.currentProject();
            if (!currentProject) {
                return null;
            }

            const projectUser = currentProject.projectUser(self.currentUser().id());
            if (projectUser) {
                return 'Admin';
                // eslint-disable-next-line no-else-return
            } else {
                return 'Reader';
            }
        },

        currentUserOnAnyCurrentProjectTeam() {
            const projectTeams = self.currentProject() ? self.currentProject().teams() : [];
            const userTeams = self.currentUser().teams();

            return projectTeams.some((projectTeam) => userTeams.some((userTeam) => userTeam.id() === projectTeam.id()));
        },

        publishedUrl() {
            return self.currentProject() ? .publishedUrl();
        },

        editorUrl() {
            return self.currentProject() ? .editorUrl(self);
        },

        embedUrl(options) {
            const path = (options != null ? options.path : undefined) || self.embedSelectedFilePath();
            const sidebarCollapsed = (options != null ? options.sidebarCollapsed : undefined) || self.getUserPref('embedSidebarCollapsed');
            return self.currentProject() ? .embedUrl({
                path,
                previewSize: options != null ? options.previewSize : undefined,
                attributionHidden: options != null ? options.attributionHidden : undefined,
                previewFirst: options != null ? options.previewFirst : undefined,
                sidebarCollapsed,
            });
        },

        currentUrl() {
            if (self.editorIsEmbedded()) {
                return self.embedUrl();
                // eslint-disable-next-line no-else-return
            } else {
                return self.editorUrl();
            }
        },

        glitchApi() {
            return new GlitchApi(self.persistentToken() || null);
        },

        containerExec(command) {
            const projectId = self.currentProjectId();

            return self.glitchApi().v0.projectExec(projectId, command);
        },

        setProjectEnv(domain, env) {
            return self.glitchApi().v0.projectSetEnv(domain, env);
        },

        remixURL() {
            return self.currentProject() ? .remixUrl();
        },

        async remixCurrentProject(e) {
            if (e != null) {
                e.preventDefault();
            }
            self.history.push(`/remix/${self.currentProjectDomain()}`);
        },

        resetProjectContainerPerformanceData() {
            self.projectContainerStatus('ok');
            self.projectContainerResourcesData({
                quotaUsagePercent: 0,
                memoryUsagePercent: 0,
                diskUsagePercent: 0,
            });
            return self.projectContainerResourcesDataLoaded(false);
        },

        showRecaptchaOverlay() {
            return new Promise((resolve, reject) => {
                let cleanup;

                const callback = (token) => {
                    resolve(token);
                    cleanup();
                };

                const observableHandler = (nextValue) => {
                    if (nextValue !== callback) {
                        reject(new Error('Recaptcha closed'));
                        cleanup();
                    }
                };

                self.recaptchaOverlayCallback(callback);
                self.recaptchaOverlayCallback.observe(observableHandler);
                cleanup = () => {
                    if (self.recaptchaOverlayCallback() === callback) {
                        self.recaptchaOverlayCallback(null);
                    }
                    self.recaptchaOverlayCallback.stopObserving(observableHandler);
                };
            });
        },

        filetree() {
            return self.currentProject() ? .filetree() || Filetree();
        },

        // eslint-disable-next-line consistent-return
        files() {
            if (self.filetree()) {
                return self.filetree().files();
            }
        },

        // List of Folder and File instances to display in the sidebar when folders are enabled
        collapsedFiletree: Observable([]),

        openFolderIds: Observable(new Set()),

        changeOpenFolderIds(incomingFolderId) {
            if (!self.openFolderIds().has(incomingFolderId)) {
                self.openFolderIds().add(incomingFolderId);
            } else {
                self.openFolderIds().delete(incomingFolderId);
            }

            self.openFolderIds(new Set(self.openFolderIds())); // trigger observable
        },

        generateCollapsedFiletree() {
            if (!self.editorIsPreviewingRewind() && !self.editorIsRewindingProject()) {
                const otState = self.otClient() && self.otClient().ot().state().documents;
                if (!otState) {
                    console.error('application.otClient() not available yet');
                    return false;
                }

                if (!self.files().length) {
                    console.error('application.files() empty. This is required for verifying which files should be displayed');
                    return false;
                }

                const rootDirId = otState.root.children['.'];

                // eslint-disable-next-line consistent-return
                const recursivelyGetFolder = (folderId) => {
                    // eslint-disable-next-line prefer-destructuring
                    const children = otState[folderId].children;
                    if (children) {
                        const folder = Folder({
                            uuid: folderId,
                            name: otState[folderId].name,
                            level: self.otClient().idToPath(folderId).split('/').length - 2, // path includes ./ at the start; we want the next level to be 0
                        });
                        for (const childId of Object.values(children)) {
                            const child = otState[childId];
                            if (child.docType === 'file') {
                                folder.children().push(self.fileByUuid(child.docId));
                            } else {
                                folder.children().push(recursivelyGetFolder(child.docId));
                            }
                        }

                        // don't return the directory if it doesn't have visible children
                        // non-visible children return undefined
                        folder.children(folder.children().filter((child) => !!child));
                        if (folder.children().length) {
                            return folder;
                        }
                    }
                };

                const outputFolder = recursivelyGetFolder(rootDirId);
                self.collapsedFiletree(outputFolder.children());

                // Adding this here so that if the active file was renamed as an input to this regeneration, any new folder locations
                // are opened.
                // TODO: Remove this once we have better global state for folders
                if (self.selectedFile()) {
                    self.openContainingFolder(self.selectedFile());
                }
            } else {
                // If the editor is previewing rewind, we can't use OT to build the filetree - we have to use filepaths instead
                // self.files() returns every individual File in the project. To build the collapsed file tree, we iterate over
                // the folders in each file (denoted by /folder), create Folders objects for each one (or reuse already-created
                // ones), and place the file as a child of its direct parent folder.
                const collapsedFiletree = self.files().reduce((filetree, currentFile) => {
                    let currentChildren = filetree;
                    let currentPath = '';
                    const folders = currentFile.folders();

                    while (folders && folders.length > 0) {
                        const currentFolder = folders.shift();

                        // Check whether a match exists at the current level in the filetree for this part of the file's folder path
                        const existingFolder = currentChildren.find((child) => {
                            return child.type() !== 'file' && child.name() === currentFolder;
                        });
                        if (!existingFolder) {
                            const newEntry = Folder({
                                name: currentFolder,
                                level: currentPath.split('/').length - 1, // this isn't an OT path, so there's no ./ at the start
                                children: [],
                                // eslint-disable-next-line prefer-template
                                rewindPreviewPath: currentPath + currentFolder + '/', // only used where the folder might not exist in OT, like here
                            });
                            currentChildren.push(newEntry);
                            currentChildren = newEntry.children();
                            currentPath = newEntry.rewindPreviewPath();
                        } else {
                            currentChildren = existingFolder.children();
                            currentPath = existingFolder.rewindPreviewPath();
                        }
                    }

                    currentChildren.push(currentFile);
                    return filetree;
                }, []);

                self.collapsedFiletree(collapsedFiletree);
                // Adding this here so that if the active file was renamed as an input to this regeneration, any new folder locations
                // are opened.
                // TODO: Remove this once we have better global state for folders
                if (self.selectedFile()) {
                    self.openContainingFolder(self.selectedFile());
                }
            }
            return true;
        },

        openContainingFolder(filetreeItem) {
            if (self.otClient()) {
                const otItem = self.otClient().documentImmediate(filetreeItem.id());
                if (otItem) {
                    let otParent = self.otClient().documentImmediate(otItem.parentId);
                    while (otParent.name !== '.') {
                        if (!self.openFolderIds().has(otParent.docId)) {
                            self.changeOpenFolderIds(otParent.docId);
                        }
                        otParent = self.otClient().documentImmediate(otParent.parentId);
                    }
                }
            }
        },

        currentUserAvatarUrl() {
            return self.currentUser().userAvatarUrl();
        },

        consoleUrl() {
            return `https://${document.location.host}/edit/console.html?${self.currentProject()?.domain()}`;
        },

        openConsole() {
            return window.open(self.consoleUrl());
        },

        readEslintrc() {
            return self
                .otClient()
                .documentByPath('.eslintrc.json')
                .then(({
                    content
                }) => content)
                .then(stripJsonComments)
                .then(JSON.parse)
                .catch(() => null)
                .then(self.eslintrc)
                .finally(() => self.performLint());
        },

        readWatchJson() {
            return self
                .otClient()
                .documentByPath('watch.json')
                .then(({
                    content
                }) => content)
                .then(stripJsonComments)
                .then(JSON.parse)
                .catch(() => null)
                .then(self.watchJson);
        },

        readPrettierrc() {
            return self
                .otClient()
                .documentByPath('.prettierrc')
                .then(({
                    content
                }) => content)
                .then(JSON.parse)
                .catch(() => null)
                .then(self.prettierrc);
        },

        readDebuggerSetting() {
            return (
                self
                .otClient()
                .documentByPath('.env')
                // eslint-disable-next-line func-names
                .then(function({
                    content,
                    docId
                }) {
                    const enabled = content.split('\n').indexOf('GLITCH_DEBUGGER=true') >= 0;
                    self.debuggerEnabled(enabled);

                    return {
                        content,
                        docId,
                        enabled,
                    };
                })
                // eslint-disable-next-line func-names
                .catch(function() {
                    // No .env file
                    self.debuggerEnabled(false);

                    return {
                        content: '',
                        enabled: false,
                    };
                })
            );
        },

        openDebugger() {
            if (!self.isChrome || !!self.isAndroid) {
                self.notifyDebuggerIsChromeOnly(true);
                return;
            }

            window.open(`https://${document.location.host}/edit/debugger.html?${self.currentProjectId()}`);

            // eslint-disable-next-line consistent-return, consistent-return, func-names
            return self.readDebuggerSetting().then(async function({
                content,
                docId,
                enabled
            }) {
                if (!self.debuggerReady()) {
                    if (!enabled) {
                        let currentFile;
                        if (docId) {
                            currentFile = self.selectedFile();
                            // eslint-disable-next-line func-names
                            return self.selectFileByUuid(docId).then(function() {
                                // eslint-disable-next-line no-control-regex
                                const newContent = `GLITCH_DEBUGGER=true\n${content.replace(new RegExp('GLITCH_DEBUGGER=?(true)?\n?', 'g'), '')}`;
                                self.fileById(docId).content(newContent);
                                /* istanbul ignore next */
                                return currentFile && self.selectFileByUuid(currentFile.id());
                            });
                            // eslint-disable-next-line no-else-return
                        } else {
                            const envFile = await self.newFile('.env', 'GLITCH_DEBUGGER=true\n');
                            /* istanbul ignore next */
                            return envFile.session.then(() => currentFile && self.selectFileByUuid(currentFile.id()));
                        }
                    }
                }
            });
        },

        disableDebugger() {
            return (
                self
                .otClient()
                .documentByPath('.env')
                // eslint-disable-next-line func-names, consistent-return
                .then(function({
                    content,
                    docId
                }) {
                    if (content.split('\n').indexOf('GLITCH_DEBUGGER=true') >= 0) {
                        const currentFile = self.selectedFile();
                        // eslint-disable-next-line no-control-regex
                        const newContent = content.replace(new RegExp('GLITCH_DEBUGGER=true\n?', 'g'), '');
                        // eslint-disable-next-line func-names
                        return self.selectFileByUuid(docId).then(function() {
                            self.fileById(docId).content(newContent);
                            self.debuggerReady(false);
                            /* istanbul ignore next */
                            return currentFile && self.selectFileByUuid(currentFile.id());
                        });
                    }
                })
            );
        },

        previewWindow: null,

        previewWindowIsOpen() {
            return self.previewWindow !== null && !self.previewWindow.closed;
        },

        preview() {
            if (self.previewWindowIsOpen()) {
                self.previewWindow.focus();
                return false;
            }
            const preview = window.open(self.publishedUrl(), '_blank');
            self.previewWindow = preview;
            return true;
        },

        // eslint-disable-next-line func-names
        updateAppPreview: debounce(function(doc = document) {
            const embeddedIFrame = doc.querySelector('.app-preview iframe');
            if (embeddedIFrame) {
                embeddedIFrame.src = self.previewURL();
            }
        }, 200),

        updatePreview() {
            if (!self.refreshPreviewOnChanges()) {
                return;
            }
            if (self.previewWindowIsOpen()) {
                self.previewWindow.location = self.publishedUrl();
            }
            if (self.appPreviewVisible()) {
                self.updateAppPreview();
            }
        },

        // eslint-disable-next-line consistent-return
        previewURL() {
            const publishedUrl = self.publishedUrl();
            if (publishedUrl) {
                return `${publishedUrl}${self.appPreviewUrlPath()}`;
            }
        },

        fileByPath(path) {
            const [result] = Array.from(self.files().filter((file) => file.path() === path));

            return result;
        },

        fileByUuid(uuid) {
            const [result] = Array.from(self.files().filter((file) => file.uuid() === uuid));

            return result;
        },

        fileById(id) {
            return self.fileByUuid(id);
        },

        selectFileByUuid(uuid, parent) {
            parent = parent || window.parent; // parent param is just for the unit test
            const file = self.fileByUuid(uuid);
            self.selectedFile(file);
            if (self.editorIsEmbedded()) {
                parent.postMessage(messages.updateEmbedState({
                    embedSelectedFilePath: file.path()
                }), '*');
            }

            return self.selectedFile().session;
        },

        selectFileByPathOrDefaultFile(path) {
            self.projectSearchPopVisible(false);
            self.projectSearchBoxValue('');
            const file = self.fileByPath(path);
            if (file) {
                // If we're editing an embed in place, the selectedFileId doesn't change and we need to make sure it reinitiates the session.
                if (file === self.selectedFile()) {
                    self.updateSelectedFile(file.id());
                } else {
                    self.selectedFile(file);
                }
            } else {
                self.selectDefaultFile();
            }
        },

        selectFileByLogPath(logPath) {
            const separatorPosition = logPath.indexOf(':');
            if (separatorPosition === -1) {
                self.selectFileByPathOrDefaultFile(logPath);
            } else {
                const path = logPath.slice(0, separatorPosition);
                self.selectFileByPathOrDefaultFile(path);

                // eslint-disable-next-line func-names
                self.selectedFile().session.then(function() {
                    const line = logPath.slice(separatorPosition + 1, logPath.length);
                    return self.goToLine(line - 1);
                });
            }
            return self.focusEditor();
        },

        isFileInCurrentProject(file) {
            return self
                .currentProject()
                .files()
                .some((projectFile) => file.id() === projectFile.id());
        },

        selectDefaultFile() {
            // eslint-disable-next-line one-var
            let defaultFile, isInCurrentProject;
            const previousFile = self.fileByUuid(self.currentDocument());

            if (previousFile) {
                isInCurrentProject = self.isFileInCurrentProject(previousFile);
            }

            if (previousFile && isInCurrentProject) {
                defaultFile = previousFile;
            } else {
                defaultFile = self.currentProject() ? .defaultFile();
            }

            self.selectedFile(defaultFile);
            /* istanbul ignore next */
            return defaultFile != null ? defaultFile.session.then(() => self.performLint()) : undefined;
        },

        // eslint-disable-next-line consistent-return
        deleteFile(file, {
            silent = false
        } = {}) {
            self.filetree().files.remove(file);

            if (file && file.id() === self.selectedFileId()) {
                self.selectDefaultFile();
            }

            if ((file != null ? file.path() : undefined) === '.env') {
                self.debuggerEnabled(false);
            }

            if ((file != null ? file.path() : undefined) === '.eslintrc.json') {
                self.eslintrc(null);
                self.performLint();
            }

            if ((file != null ? file.path() : undefined) === 'watch.json') {
                self.watchJson(null);
            }

            if ((file != null ? file.path() : undefined) === '.prettierrc') {
                self.prettierrc(null);
            }

            if (!silent) {
                return self.OTDeleteFile(file);
            }
        },

        deleteFolder(folderId, folderPath, {
            silent = false
        } = {}) {
            if (!folderPath) {
                return;
            } // a null folder path means that the folder has already been deleted
            const tempFiletree = self.currentProject().filetree().I.files;
            const mapped = tempFiletree.filter((file) => {
                if (file.path.startsWith(folderPath)) {
                    return false;
                    // eslint-disable-next-line no-else-return
                } else {
                    return true;
                }
            });
            self.currentProject().filetree(Filetree({
                files: mapped
            }));

            if (!silent) {
                self.OTDeleteFolder(folderId, folderPath);
            }
        },

        uploadNewFile: /* istanbul ignore next: typescript port */ (file, select = true) => {
            return readFile(file).then(async (content) => self.newFile(file.name, content, select));
        },

        async newFile(path, content = '', select = true) {
            self.analytics.track('File Created', {
                fileUploaded: content !== '',
            });
            let file;
            if (pathIsInvalid(path)) {
                self.notifyInvalidFileName(true);
                return;
            }

            const existingFile = self.fileByPath(path);

            // TODO: clean this up once we have one filetree representation
            // Even if we do not find an existing file, we have to check ot state to see if the file exists,
            // because ot state also includes gitignored files, and we don't want to accidentally overwrite it.

            if (existingFile) {
                if (!window.confirm(`File at ${path} exists, overwrite?`)) {
                    return;
                }
                file = existingFile;
            } else if (self.otClient().documentByPathImmediate(path)) {
                self.notifyFileHiddenByGitIgnore(true);
                return;
            } else {
                file = File({
                    path,
                });

                self.filetree().files.push(file);
                self.OTNewFile(file);
            }

            await self.writeToFile(file, content);
            if (select) {
                self.fileAddedAndNotAnimated(file.id());
                self.selectedFile(file);
            }

            if (path.endsWith('.md')) {
                self.markdownPreviewVisible(false);
            }

            // eslint-disable-next-line consistent-return
            return file;
        },

        writeToFile(file, newContent) {
            // eslint-disable-next-line consistent-return, func-names
            return self.ensureSession(file).then(function() {
                const currFile = self.selectedFile();
                self.setCurrentSession(file);
                file.content(newContent);
                if (currFile) {
                    return self.setCurrentSession(currFile);
                }
            });
        },

        // Get an S3 upload policy for the current project
        getPolicy() {
            return self.glitchApi().getProjectPolicy(self.currentProjectId());
        },

        // Get an S3 upload policy for the current project avatar
        getProjectAvatarPolicy(project) {
            return self.glitchApi().getProjectAvatarPolicy(project.id());
        },

        joinProjectWithToken(token) {
            return (
                self
                .glitchApi()
                .v0.projectJoin(token)
                // eslint-disable-next-line func-names
                .catch(function(e) {
                    if (e.response.status === 404) {
                        window.alert('The invite token was not found or is no longer valid, please ask the project owner for a new one');
                    } else {
                        window.alert('An error occurred while trying to join the project. Try again?');
                    }

                    throw e;
                })
                .then(Project)
                // eslint-disable-next-line func-names
                .then(function(project) {
                    self.projectMachine.send({
                        type: 'CONNECT_TO_PROJECT',
                        data: {
                            domain: project.domain()
                        }
                    });
                })
                .catch(() => self.loadWelcomeProject())
            );
        },

        async deleteCurrentProject() {
            self.notifyDeletedProject(false);

            const deletedProjectProperties = {
                projectId: self.currentProjectId(),
                projectName: self.projectName(),
                projectType: self.currentProject() ? .getType(),
                projectVisibility: self.currentProject() ? .private() ? 'private' : 'public',
                numberProjectMembers: self.currentProject() ? .users().length,
                numberTeams: self.currentProject() ? .teams().length,
            };

            // Deleting the current project requires that we have loaded every project
            // in case we need to switch to an unloaded project.
            await self.fetchUserProjects();

            const projectToDelete = self.currentProject();
            const nextProject = self.projects().find((project) => project.id() !== projectToDelete.id());

            // Start switching to a new/existing project now before we attempt the
            // delete.
            if (nextProject) {
                self.history.replace(`/${nextProject.domain()}`);
            } else {
                self.history.push(`/remix/${defaultRemixDomain}`);
            }

            try {
                await self.glitchApi().deleteProject(projectToDelete.id());
                self.lastDeletedProject(projectToDelete);
                const nextProjectsList = self.projects().filter((project) => project.id() !== projectToDelete.id());
                self.projects(nextProjectsList);
                self.analytics.track('Project Deleted', deletedProjectProperties);
                self.notifyDeletedProject(true);
            } catch (error) {
                captureException(error);
                self.notifyGenericError(true);
            }
        },

        undeleteLastDeletedProject() {
            const project = self.lastDeletedProject();
            self.closeAllPopOvers();
            return self
                .glitchApi()
                .restoreProject(project.id())
                .then(() => {
                    self.history.push(`/${project.domain()}`);
                });
        },

        leaveCurrentProject: /* istanbul ignore next: typescript port */ (user = self.currentUser()) => {
            const project = self.currentProject();
            self.currentProject().users(project.users().filter((existingUser) => existingUser.id !== user.id()));
            self.currentRemoteUsers(self.currentRemoteUsers().filter((existingUser) => existingUser.id() !== user.id()));
            return (
                self
                .glitchApi()
                .deleteProjectUser(project.id(), user.id())
                // eslint-disable-next-line func-names
                .then(async function() {
                    const msg = {
                        user: user.broadcastData()
                    };
                    msg.user.left = true;

                    self.broadcast(msg);

                    return self.updateRemoteUser(msg.user);
                })
            );
        },

        async changeProjectPrivacy(newProjectPrivacy) {
            self.currentProject().privacy(newProjectPrivacy);
            self.analytics.track('Project Privacy Changed');
            return self.currentProject().saveImmediate(self.glitchApi());
        },

        transferProjectOwner(user) {
            const project = self.currentProject();
            const updatedUsers = project.users().map((userDetails) => {
                if (userDetails.id === self.currentUser().id()) {
                    userDetails.projectPermission.accessLevel = access.MEMBER;
                } else if (userDetails.id === user.id()) {
                    userDetails.projectPermission.accessLevel = access.ADMIN;
                }
                return userDetails;
            });
            project.users(updatedUsers);
            return self.glitchApi().transferOwnership(project.id(), user.id());
        },

        inviteUserToProject(userId) {
            const project = self.currentProject();
            return self.glitchApi().inviteUserToProject(project.id(), userId);
        },

        inviteEmailToProject(email) {
            const project = self.currentProject();
            return self.glitchApi().inviteEmailToProject(project.id(), email);
        },

        // Load a welcome project if the current user doesn't have any projects
        // otherwise switch to the users current project
        loadWelcomeProject() {
            if (self.projects().length === 0) {
                self.history.replace(`/remix/glitch-hello-node`);
            } else {
                self.history.replace(`/${self.projects()[0].domain()}`);
            }
        },

        updateUrlHashForProject(project, {
            replace
        } = {}) {
            const urlPath = project.domain();

            if (replace) {
                self.history.replace(`/${urlPath}`);
            } else {
                self.history.push(`/${urlPath}`);
            }
        },

        switchToProjectDomain(domain) {
            if (domain) {
                self.history.push(`/${domain}`);
            } else {
                self.history.push('/');
            }
        },

        selectedFileId: Observable(null),

        selectedFile(newFile = undefined) {
            if (newFile === null) {
                self.selectedFileId(null);
            } // allow this value to be set to null
            else if (newFile) {
                self.selectedFileId(newFile.id());
            }
            return self.fileByUuid(self.selectedFileId());
        },

        // Don't remove - It looks like this is unused in the code, but it's used by our bookmarklet
        selectedFilePromise: null,

        editorRangeSelections: Observable([]),

        async formatCode({
            withAnimation,
            actionTrigger
        }) {
            self.notifyPrettierParseError(false);
            self.notifyPrettierLoadError(false);
            self.formattingCodeInProgress(true);
            const file = self.selectedFile();

            // Log usage of the formatting feature
            self.trackFileHelper(file, 'File Formatted', {
                actionTrigger,
                formatSelection: self.editorRangeSelections.length > 0 ? 'selection' : 'file',
            });
            const initialCursorPosition = self.editor().getCursor();
            const selectedRange = self.editorRangeSelections()[0];

            const options = self.buildPrettierOptions({
                file,
                initialCursorPosition,
                selectedRange
            });
            let prettierResult = await self.runPrettier({
                file,
                options
            });
            // If this function returns undefined, it's because it's taken too long - we'll try again without the cursor
            if (!prettierResult) {
                prettierResult = await self.runPrettier({
                    file,
                    options: { ...options,
                        cursorOffset: undefined
                    }
                });
            }

            if (prettierResult.success) {
                self.handlePrettierResult({
                    formattedResult: prettierResult,
                    file,
                    initialCursorPosition,
                    selectedRange
                });
                if (withAnimation) {
                    self.fullScreenSparkleEffectVisible(true);
                }
            } else {
                self[prettierResult.errorType](prettierResult.error);
            }

            self.formattingCodeInProgress(false);
        },

        buildPrettierOptions({
            file,
            initialCursorPosition,
            selectedRange
        }) {
            // Build the Prettier options object. Note that providing the file name allows Prettier to determine which parser to use from the file extension.
            // We also pass in the .prettierrc overrides if they exist.
            let options = {
                filepath: file.name(),
                ...self.prettierrc()
            };

            // We always try to format with cursor first, so we need to get the cursor index from the start of the file so that Prettier can tell us where in the file to put the cursor after formatting.
            // eslint-disable-next-line one-var
            let cursorOffset, rangeStart, rangeEnd;
            if (selectedRange) {
                // For formatting a selection: we don't have a true cursor position, as that's wiped when the selection happens, and in order to do the selection replacement, we need to know where the end of the selection will be after formatting.
                // So we always represent the cursor as the end of the selection.
                rangeStart = selectedRange.start;
                rangeEnd = selectedRange.end;
                cursorOffset = rangeEnd;
            } else {
                cursorOffset = self.editor().indexFromPos({
                    line: +initialCursorPosition.line,
                    ch: +initialCursorPosition.ch
                }); // make sure these are integers; apparently this is not always the case
            }

            options = {
                ...options,
                cursorOffset,
                rangeStart,
                rangeEnd,
            };

            return options;
        },

        async runPrettier({
            file,
            options
        }) {
            // Set up the prettier worker, and wrap it with Comlink to make communication easier
            let prettierWorker;
            let prettierWorkerProxy;
            try {
                prettierWorker = new Worker('../workers/prettier.worker.js', {
                    type: 'module'
                });
                prettierWorkerProxy = Comlink.wrap(prettierWorker);
            } catch (error) {
                return {
                    success: false,
                    errorType: 'notifyPrettierLoadError',
                    error
                };
            }

            return new Promise(async (resolve, reject) => {
                    // If we have a cursor position, set a timeout for the maximum duration we'll allow the formatWithCursor function to run.
                    if (options.cursorOffset !== undefined) {
                        setTimeout(reject, 5000);
                    }
                    // Run prettier, and process the response when it comes back
                    const response = await prettierWorkerProxy.runPrettier({
                        code: file.content(),
                        options
                    });
                    resolve(response);
                })
                .then(async (response) => {
                    // Clean up process
                    await prettierWorkerProxy.close();
                    if (response.error !== undefined) {
                        return {
                            success: false,
                            errorType: 'notifyPrettierParseError',
                            error: response.error
                        };
                    }
                    if (!self.getUserPref('hasRunPrettier')) {
                        self.notifyPrettierFirstRun(true);
                        self.updateUserPrefs('hasRunPrettier', true);
                    }
                    return {
                        success: true,
                        ...response
                    };
                })
                .catch(() => {
                    console.log('formatWithCursor is taking too long; fall back to format');
                    prettierWorkerProxy[Comlink.releaseProxy]();
                    prettierWorker.terminate();
                    return undefined;
                });
        },

        handlePrettierResult({
            formattedResult,
            file,
            initialCursorPosition,
            selectedRange
        }) {
            const {
                formatted,
                cursorOffset
            } = formattedResult;

            // Set the file content to the prettier output, and update the cursor according to what information we have
            if (!selectedRange) {
                file.content(formatted);
            } else {
                const rangeStartPos = self.editor().posFromIndex(selectedRange.start);
                const rangeEndPos = self.editor().posFromIndex(selectedRange.end);
                self.editor().replaceRange(formatted.substring(selectedRange.start, cursorOffset), rangeStartPos, rangeEndPos);
            }

            self.editor().setCursor(cursorOffset !== undefined ? self.editor().posFromIndex(cursorOffset) : initialCursorPosition);

            self.editor().scrollIntoView(self.editor().getCursor(), self.editor().getScrollInfo().clientHeight / 2); // scroll the active cursor line into the middle of the screen
            self.focusEditor(); // if this was run with a button click, we'll have lost editor focus, so this brings it back.
        },

        selectedFolder: Observable(null),

        saved: Observable(true),

        saveApplicationState() {
            self.storeLocal('applicationData', self);
        },

        reset() {
            self.removeLocal('applicationData');
        },

        getLicenseOrCodeOfConductBody(type, meta) {
            const github = self.github();

            if (type === 'license') {
                return github.getLicense(meta.id);
            }
            if (type === 'codeOfConduct') {
                return github.getCodeOfConduct(meta.id);
            }
            throw new Error('unknown type');
        },

        github() {
            return new Github(self.currentUser().githubToken());
        },

        // The tokens we get from Github are scoped only to get email addresses when you log in (scope "user:email"),
        // and then to "repo" once you need to export to the repo. We therefore need to check for this repo permission
        // in the cases where we need it. See https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
        // for the full list of scopes.
        async currentUserHasGithubRepoScope() {
            if (!self.currentUser().githubToken()) {
                return false;
            }

            try {
                const scopes = await self.github().getOAuthScopes();
                return scopes.some((scope) => scope === 'repo');
            } catch {
                return false;
            }
        },

        publishGitHubRepo(repoName, message) {
            const github = self.github();

            return new Promise(async (resolve, reject) => {
                // Get the Github login, because we don't have it yet. This can be something to add to a Github class down the line
                const ghUser = await github.getUser();
                try {
                    // will throw error if repo doesn't exist or is empty
                    await github.getRepoContents(repoName);

                    // Check to see if the user has permission to write to this repo
                    const {
                        permission
                    } = await github.getProjectPermissionsForUser(repoName, ghUser.login);
                    if (permission === 'admin' || permission === 'write') {
                        try {
                            await self.glitchApi().v0.projectGithubExport(self.currentProject().id(), repoName, message);
                            resolve();
                        } catch (error) {
                            captureException(error);
                            reject(error);
                        }
                    } else {
                        reject(new Error("You don't have permission to write to this repo"));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        },

        currentUserId() {
            return self.currentUser().id();
        },

        currentUserColor() {
            return self.currentUser().color();
        },

        currentProjectDomain() {
            return self.currentProject() ? .domain();
        },

        currentProjectId() {
            return self.currentProject() ? .id();
        },

        broadcastUser({
            invited,
            left,
            stopAsking
        } = {}) {
            const msg = {
                user: self.currentUser().broadcastData({
                    project: self.currentProject()
                })
            };
            msg.user.invited = !!invited;
            msg.user.left = !!left;
            msg.user.stopAsking = !!stopAsking;

            return self.broadcast(msg);
        },

        broadcastProjectName() {
            self.broadcast({
                projectName: self.currentProject().name(),
            });

            // Tell the container its name has changed
            return self.glitchApi().v0.projectDomainChanged(self.currentProject().id());
        },

        askToJoinProject() {
            self.closeAllPopOvers();

            const user = self.currentUser();
            const project = self.currentProject();

            // If the project belongs to a team we're on, just join
            let teamId = null;
            if (project != null) {
                project.teams().forEach((projTeam) =>
                    // eslint-disable-next-line consistent-return, func-names
                    user.I.teams.forEach(function(userTeam) {
                        if (projTeam.id() === userTeam.id) {
                            // eslint-disable-next-line no-return-assign
                            return (teamId = userTeam.id);
                        }
                    }),
                );
            }

            if (teamId) {
                return self
                    .glitchApi()
                    .v0.teamProjectJoin(teamId, self.currentProject().id())
                    .then(() => self.autoJoin());
                // eslint-disable-next-line no-else-return
            } else if (self.currentUser().isSupport()) {
                return self
                    .glitchApi()
                    .v0.createProjectPermission(self.currentProject().id(), self.currentUser().id(), access.MEMBER)
                    .then(() => self.autoJoin());
            } else {
                user.awaitingInvite(true);
                return self.broadcast({
                    user: user.broadcastData(),
                });
            }
        },

        cancelInviteRequest() {
            const user = self.currentUser();
            user.awaitingInvite(false);

            return self.broadcast({
                user: user.broadcastData(),
            });
        },

        acceptInviteRequest: /* istanbul ignore next: typescript port */ (user, {
            accessLevel
        } = {
            accessLevel: access.MEMBER
        }) => {
            return (
                self
                .glitchApi()
                .v0.createProjectPermission(self.currentProject().id(), user.id(), accessLevel)
                // eslint-disable-next-line func-names
                .then(function() {
                    user.awaitingInvite(false);

                    // we don't pass the project here as the access level is not updated yet
                    // it will be updated in updateRemoteUser
                    const msg = {
                        user: user.broadcastData()
                    };
                    msg.user.invited = true;
                    msg.user.projectPermission = {
                        accessLevel
                    };

                    return self.broadcast(msg);
                })
            );
        },

        setFilePrivacy(file, isPublic) {
            return self.OTConnection.setFilePrivacy(file, isPublic);
        },

        initializeProject(project) {
            if (!project) {
                captureException('No project to initialize');
                throw new Error('No current project available to initialize');
            }
            self.connectToLogs(project, self.persistentToken());

            return self.initializePackageJson();
        },

        initializePackageJson() {
            const file = self.fileByPath('package.json');
            if (!file) {
                return;
            } // Skip if no package.json

            // eslint-disable-next-line consistent-return
            return self.ensureSession(file);
        },

        connectToProject(project) {
            if (!project) {
                return;
            }
            self.analytics.setCurrentUser(self.currentUser());

            if (project.suspendedReason()) {
                self.projectIsSuspendedOverlayVisible(true);
                // eslint-disable-next-line no-underscore-dangle
                window.__CY_APPLICATION_READY__ = true;
                return;
            }

            self.containerStatsPanelVisible(false);
            self.rewindPanelVisible(false);
            self.resetProjectContainerPerformanceData();

            // Clear invite request
            self.cancelInviteRequest();

            // Create a new avatar if needed
            /* istanbul ignore else */
            if (!project.hasAvatar() && project.accessLevel(self.currentUser()) >= access.MEMBER) {
                self.projectAvatarUtils.random().then((avatar) =>
                    self.uploadProjectAvatarAsset(avatar, project).catch((e) =>
                        // only log the error
                        self.logger().log(e),
                    ),
                );
            }

            // Clear remote users
            self.currentRemoteUsers([]);
            self.assets([]);

            // Disconnect from old logs and ot websocket
            self.disconnectFromLogs();
            self.disconnectFromOT();

            // Clear linting results
            self.backendLintingResults = {};

            if (self.firstLoad()) {
                self.firstLoad(false);
                self.updateUrlHashForProject(project, {
                    replace: true
                });
            }

            // eslint-disable-next-line consistent-return
            return (
                Promise.resolve()
                .then(() => {
                    return self.setProjectBoostStatus(project);
                })
                // eslint-disable-next-line func-names
                .then(async function() {
                    if (self.otCodeMirror()) {
                        self.otCodeMirror().disconnect();
                    }

                    const otClient = new OTClient({
                        application: self,
                        randomId,
                    });
                    const otCodeMirror = new OTCodeMirror({
                        application: self,
                        editor: self.editor(),
                        otClient,
                    });
                    otCodeMirror.connect();

                    return self.connectToOT(project, otClient, otCodeMirror);
                })
                .then(() => {
                    self.initializeProject(project);
                })
                .then(self.touchProject)
                // eslint-disable-next-line func-names
                .then(function() {
                    return self.glitchApi().v0.projectEdited(self.currentProject().id(), {
                        editor_embedded_access_count: (self.editorIsEmbedded() && 1) || undefined,
                        editor_embedding_page: (self.editorIsEmbedded() && document.referrer) || undefined,
                    });
                })
                .then(() => {
                    // eslint-disable-next-line no-underscore-dangle
                    window.__CY_APPLICATION_READY__ = true;
                    setSentryTag('project-domain', self.currentProject().domain());
                    if (!self.editorIsEmbedded() || (self.editorIsEmbedded() && self.embedAppPreviewSize() < 100)) {
                        self.analytics.track('Project Source Viewed');
                    }
                })
                .catch((error) => {
                    self.notifyGenericError(error);
                })
            );
        },

        // Get the list of the user's recent files for the current project
        recentFiles() {
            return self
                .currentUser()
                .recentFiles()
                .filter((file) => file.projectId() === self.currentProjectId());
        },

        // eslint-disable-next-line consistent-return
        renameFile: /* istanbul ignore next: typescript port */ (file, newPath, notifyOT = true) => {
            // Here we always assume paths are valid, do not call with invalid paths!
            file.path(newPath);
            self.updateEditorModeForFile(file);
            if (notifyOT) {
                return self.OTRenameFile(file);
            }
        },

        // eslint-disable-next-line consistent-return
        renameFolder: (folderId, oldPath, newName, notifyOT = true) => {
            if (!oldPath.match(/\/$/)) {
                oldPath += '/';
            } // ot does not have trailing slashes, so let's make sure this is consistent.
            const tempFiletree = self.currentProject().filetree().I.files;
            const mapped = tempFiletree.map((file) => {
                const newFile = {};
                Object.assign(newFile, file);
                const fileObj = File(file);
                if (fileObj.path().startsWith(oldPath)) {
                    // If the paths match, we take the folder part, and switch out the last folder name
                    // for the new folder name. We then add back on the rest of the folders in the file,
                    //  and the file name.
                    const folderPathFolders = oldPath.split('/');
                    const filePathFolders = fileObj.folders();
                    // note oldPath has a trailing slash, so we take off the last two elements
                    const newPath = [...folderPathFolders.slice(0, -2), newName, ...filePathFolders.slice(folderPathFolders.length - 1), fileObj.name()].join(
                        '/',
                    );
                    newFile.path = newPath;
                }
                return newFile;
            });

            mapped.sort(self.alphabeticalize);
            self.currentProject().filetree(Filetree({
                files: mapped
            }));

            if (notifyOT) {
                return self.OTRenameFolder(folderId, newName);
            }
        },

        locationFragment(path, line, character) {
            /* istanbul ignore if */
            if (path == null) {
                path = self.restorePath();
            }
            /* istanbul ignore if */
            if (line == null) {
                line = self.restoreLine();
            }
            /* istanbul ignore if */
            if (character == null) {
                character = self.restoreCharacter();
            }

            return `${path}:${line}:${character}`;
        },

        // eslint-disable-next-line consistent-return
        updateUrlWithPosition(path, line, character) {
            if (!self.currentProject()) {
                return;
            }

            /* istanbul ignore else */
            if (path == null) {
                path = self.restorePath();
            }
            /* istanbul ignore else */
            if (line == null) {
                line = self.restoreLine();
            }
            /* istanbul ignore else */
            if (character == null) {
                character = self.restoreCharacter();
            }

            if (path && line != null && character != null) {
                const searchParams = new URLSearchParams(self.history.location.search);
                searchParams.set('path', self.locationFragment(path, line, character));
                self.history.replace({
                    ...self.history.location,
                    search: searchParams.toString(),
                });
            }
        },

        updateCurrentPositionState() {
            const path = self.selectedFile() ? .path() || '';
            const line = self.editor().getCursor().line + 1;
            const character = self.editor().getCursor().ch;

            self.restorePath(path);
            self.restoreLine(line);
            return self.restoreCharacter(character);
        },

        updateSidebarWidth(newWidth) {
            self.updateUserPrefs('sidebarWidth', newWidth);
            self.sidebarWidth(newWidth);
        },

        showAssets(event) {
            if (event && event.type === 'keyup' && event.key !== 'Enter') {
                // eslint-disable-next-line no-unused-vars
                return Promise.reject(new Error('Key press was not with Enter key')).catch((error) => {
                    // eslint-disable-next-line no-useless-return
                    return;
                });
            }
            // eslint-disable-next-line func-names
            return Promise.resolve().then(function() {
                document.title = `assets – ${self.currentProjectDomain()}`;

                if (self.editorIsPreviewingRewind()) {
                    self.selectedFile(self.fileByPath(ASSET_FILE_PATH));
                    return self.editor().setOption('mode', 'text/plain');
                    // eslint-disable-next-line no-else-return
                } else {
                    self.selectedFile(null);
                    self.assetsWrapVisible(true);
                    self.appTypeConfigWrapVisible(false);
                    self.editorWrapVisible(false);
                    self.mediaWrapVisible(false);
                    return self.assetSession();
                }
            });
        }, // Make sure asset session is initialized

        showAppTypeConfig() {
            document.title = `app type config – ${self.currentProjectDomain()}`;

            self.selectedFile(null);
            self.assetsWrapVisible(false);
            self.appTypeConfigWrapVisible(true);
            self.editorWrapVisible(false);
            self.mediaWrapVisible(false);
            // TODO: update whatever needs to be updated so this re-opens on reload

            return self.appTypeConfigSession();
        },

        updateSelectedFile(fileId) {
            if (!fileId) {
                return Promise.resolve();
            }
            const file = self.fileByUuid(fileId);

            // eslint-disable-next-line no-return-assign, func-names
            return (self.selectedFilePromise = self.ensureSession(file).then(function() {
                if (file.isMedia()) {
                    self.selectMediaFile(file);
                } else {
                    self.selectTextFile();

                    self.setCurrentSession(file);
                }

                self.updateCurrentPositionState();

                self.currentUser().addRecentFile(file, self.currentProjectId());

                if (!self.editorIsEmbedded() || (self.editorIsEmbedded() && self.embedAppPreviewSize() < 100)) {
                    self.trackFileHelper(file, 'File Viewed');
                }
                self.openContainingFolder(file);
                return true;
            }));
        },

        async getNewProjectTemplates() {
            // we always use the prod api here, because these projects only exist on prod
            // only send the token when it'll be valid (so, on prod)
            const domains = getBaseProjectDomains(true);
            return self
                .glitchApi()
                .getProjectsByDomain(domains)
                .then((response) => {
                    self.newProjectTemplates(domains.map((domain) => response[domain]));
                });
        },

        backendLintingEnabled() {
            const watchJson = self.watchJson();
            if (watchJson && watchJson.lintingEnabled) {
                return true;
            }

            return false;
        },

        updateBackendLintingResults(filePath, results) {
            self.backendLintingResults[filePath] = results;
            const selectedFile = self.selectedFile();
            if (selectedFile && selectedFile.path() === filePath) {
                self.setLintResults(results);
            }
        },

        currentProjectBackend() {
            return self.currentProject() ? .hostingBackend();
        },

        async setProjectBoostStatus(project) {
            try {
                // Pull boost status from API. This is based on the presence of a feature name.
                const {
                    [project.id()]: projectResponse
                } = await self.glitchApi().getProject(project.id());
                project.isBoosted(projectResponse.allFeatureNames.includes('pufferfish_boosted_collection'));
            } catch (error) {
                captureException(error);
                project.isBoosted(false);
            }
        },

        currentProjectIsBoosted() {
            return self.currentProject() ? .isBoosted();
        },

        async boostCurrentProject() {
            if (self.currentProjectIsBoosted()) {
                return;
            }

            const currentProject = self.currentProject();
            const collection = self.boostedCollection();
            await self.glitchApi().addProjectToCollection(collection.id, currentProject.id());
            await self.fetchBoostedCollection();
        },

        async unBoostCurrentProject() {
            if (!self.currentProjectIsBoosted()) {
                return;
            }

            const currentProject = self.currentProject();
            const collection = self.boostedCollection();
            await self.glitchApi().removeProjectFromCollection(collection.id, currentProject.id());
            await self.fetchBoostedCollection();
        },

        async fetchBoostedCollection() {
            const currentUserLogin = self.currentUser() ? .login();
            if (!currentUserLogin) {
                return;
            }

            const fullUrl = `${currentUserLogin}/${BOOSTED_APPS_COLLECTION_NAME}`;
            let response = await self.glitchApi().getCollectionByFullUrl(fullUrl);
            const collection = response[fullUrl];
            if (!collection) {
                self.boostedCollection(null);
                self.boostedProjects(null);
                return;
            }

            response = await self.glitchApi().getCollection(collection.id, {
                limit: collection.maxProjects
            });
            const projects = response.items;
            self.boostedCollection(collection);
            self.boostedProjects(projects);
        },
    });

    self.closeAllPopOversEmitter.setMaxListeners(Infinity);

    // eslint-disable-next-line func-names
    (function(pref) {
        // Use the saved pref if it exists
        if (pref != null) {
            self.refreshPreviewOnChanges(pref);
        }

        // Bind changes to update the pref
        return self.refreshPreviewOnChanges.observe((value) => self.updateUserPrefs('refreshPreviewOnChanges', value));
    })(self.getUserPref('refreshPreviewOnChanges'));

    ((pref) => self.wrapText(pref))(self.getUserPref('wrapText'));

    self.selectedFileId.observe(self.updateSelectedFile);

    // eslint-disable-next-line func-names
    self.markdownPreviewVisible.observe(function(value) {
        if (value === false) {
            // Need to tell codemirror that its file content may have changed after markdown preview
            setTimeout(() => {
                self.refreshEditor();
                self.focusEditor();
            }, 0);
        }

        // update markdown user prefs
        const projectId = self.currentProjectId();
        // eslint-disable-next-line no-new-object
        const markdownPrefs = self.getUserPref('markdownPreviewVisible') || new Object();
        markdownPrefs[projectId] = value;
        return self.updateUserPrefs('markdownPreviewVisible', markdownPrefs);
    });

    // eslint-disable-next-line no-unused-vars
    self.containerStatsPanelVisible.observe((value) => setTimeout(() => self.refreshEditor(), 0));

    // eslint-disable-next-line func-names
    self.userIsIdle.observe(function(idle) {
        if (idle) {
            self.projectMachine.send({
                type: 'USER_IDLE'
            });
        } else {
            self.projectMachine.send({
                type: 'USER_RETURNED'
            });
        }
    });

    // eslint-disable-next-line consistent-return, func-names
    self.wrapText.observe(function(value) {
        self.updateUserPrefs('wrapText', value);

        const file = self.selectedFile();
        if (file) {
            return self.setLineWrapping(file);
        }
    });

    self.projectName = Observable(self.projectName);
    // Used to track websocket reconnections.
    // We compare lastProjectName and projectName to determine if it's a connection to a different project or a reconnection.
    self.lastProjectName = Observable('');
    self.projectFilePaths = Observable(self.projectFilePaths);

    self.projectName.observe((name) => {
        self.analytics.setCurrentProject(self.currentProject());

        const link = document.getElementById('oembed');
        if (link === null) {
            return;
        }
        link.setAttribute('href', `https://api.glitch.com/projects/${name}/oembed`);
        link.setAttribute('title', `${name} oembed link`);
    });

    self.debuggerReady.observe((ready) => self.currentProject() && self.storeLocal(`${self.currentProjectId()}_debuggerReady`, ready));

    self.projectContainerStatus.observe(
        (status) => self.currentProject() && self.storeLocal(`${self.currentProjectId()}_projectContainerStatus`, status),
    );

    self.currentTheme.observe((newTheme) => {
        // document.querySelectorAll returns a NodeList and NodeList#forEach isn't supported in Internet Explorer.
        // Using Array.prototype.forEach on one works just fine though.
        [].forEach.call(document.querySelectorAll('link.theme'), (link) => {
            if (new RegExp(newTheme).test(link.href)) {
                link.setAttribute('rel', 'stylesheet');
            } else {
                link.removeAttribute('rel');
            }
        });
    });

    self.pendingUploads.observe((pendingUploads) => {
        // filter out assets not uploaded by user and set the value of notifyUploading to be the number of files
        const numUserUploadedFiles = pendingUploads.filter((uploadData) => uploadData.isUploadedByUser === true).length;
        if (numUserUploadedFiles > 0) {
            self.notifyUploading({
                numFiles: numUserUploadedFiles
            });
        } else {
            self.notifyUploading(false);
        }
    });

    // Update document title when selected file changes
    Observable(() => {
        const selectedFile = self.selectedFile();
        if (!selectedFile) {
            return;
        }

        const fileName = selectedFile.path().split('/').pop();
        document.title = `${fileName} – ${self.projectName()}`;
    });

    // Update the hasProjects cookie used for ~community server side rendering
    Observable(() => {
        const currentUserId = self.currentUser().id();
        return self.projects().some((project) => project.users().some(({
            id
        }) => id === currentUserId));
    }).observe((hasProjects) => {
        if (hasProjects) {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            document.cookie = `hasProjects=true; path=/; expires=${expires}`;
        } else {
            document.cookie = `hasProjects=; path=/; expires=${new Date()}`;
        }
    });

    userMachine.onTransition(function bootWhenUserIsReady(state) {
        if (state.matches('active')) {
            self.boot();
            userMachine.off(bootWhenUserIsReady);
        }
        if (state.matches('error')) {
            window.alert('There was an error starting the editor. Maybe try to reload?');
            // We have an invalid token, so we need to log the user out
            self.logout();
        }
    });

    let themeClass = null;
    const onThemeChange = (theme) => {
        if (themeClass !== null) {
            document.body.classList.remove(themeClass);
        }
        themeClass = `theme-${theme}`;
        document.body.classList.add(`theme-${theme}`);
    };

    self.currentTheme.observe(onThemeChange);
    onThemeChange(self.currentTheme());

    // If an embed frame has the app as the default view, we want to show that
    // immediately so there's no perceived lag due to the editor loading.
    // We set embedAppPreviewSize as early as possible (manually parsing it from
    // the URL hash) to avoid a flash of loading screen on initial load.
    const hashUrl = new URL(window.location.hash.slice(2), window.location);
    const hashParams = new URLSearchParams(hashUrl.search);
    const previewSize = hashParams.get('previewSize');
    if (previewSize) {
        self.embedAppPreviewSize(parseInt(previewSize, 10));
    }

    return self;
};

module.exports = Application;

function getPathFromQueryPath(queryPath) {
    const pathMatch = /[^:]*/; // all characters before ':'
    return queryPath.match(pathMatch)[0];
}