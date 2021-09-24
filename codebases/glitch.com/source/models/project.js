/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const Observable = require('o_0');
const debounce = require('lodash/debounce');
const defaults = require('lodash/defaults');
const pick = require('lodash/pick');
const moment = require('moment');

const Filetree = require('./filetree');
const Team = require('./team');
const Model = require('../model');
const {
    ASSET_FILE_PATH,
    access
} = require('../const');
const {
    baseProjectIds,
    importFromRepoId
} = require('../data/base-project-domains');

const {
    captureException
} = require('../sentry');
const {
    PROJECT_URL,
    CDN_URL,
    API_URL
} = require('../env');

const whitelistProperties = ['avatarUpdatedAt', 'description', 'domain', 'private', 'privacy'];

const basePathname = () => document.location.pathname.replace(/^\/embed/, '/edit');

// eslint-disable-next-line func-names
const Project = function(I = {}, self) {
    I = I || /* istanbul ignore next */ {};
    self = self || Model(I);
    defaults(I, {
        name: 'hello-world',
        domain: 'hello-world',
        description: '',
        users: [],
        teams: [],
        projectOnProductionOnly: false,
    });

    self.attrModel('filetree', Filetree);
    self.attrModels('teams', Team);
    self.attrObservable(
        'avatarUpdatedAt',
        'description',
        'avatarUrl',
        'gitRepoUrl',
        'domain',
        'privacy',
        'private',
        'updatedAt',
        'users',
        'projectOnProductionOnly',
        'suspendedReason',
        'isBoosted',
        'hostingBackend',
        'appType',
    );
    self.attrReader('id', 'baseId', 'createdAt', 'inviteToken');

    self.extend({
        name() {
            return self.domain();
        },

        publishedUrl() {
            return PROJECT_URL.replace('%s', self.domain());
        },

        editorUrl() {
            const basePath = `${document.location.origin}${basePathname()}`;
            return `${basePath}#!/${self.domain()}`;
        },

        remixUrl() {
            const basePath = `${document.location.origin}${basePathname()}`;
            return `${basePath}#!/remix/${self.domain()}`;
        },

        gitAccessToken() {
            // eslint-disable-next-line dot-notation
            return `${global['application'].currentUser().gitAccessToken()}`;
        },

        readGitUrl() {
            return `${API_URL}/git/${self.domain()}`;
        },

        previewSizeQuery(previewSize) {
            if (previewSize || previewSize === 0) {
                return `&previewSize=${Math.round(previewSize)}`;
                // eslint-disable-next-line no-else-return
            } else {
                return '';
            }
        },

        attributionHiddenQuery(attributionHidden) {
            if (attributionHidden) {
                return `&attributionHidden=${attributionHidden}`;
                // eslint-disable-next-line no-else-return
            } else {
                return '';
            }
        },

        previewFirstQuery(previewFirst) {
            if (previewFirst) {
                return `&previewFirst=${previewFirst}`;
                // eslint-disable-next-line no-else-return
            } else {
                return '';
            }
        },

        sidebarCollapsedQuery(sidebarCollapsed) {
            if (sidebarCollapsed) {
                return `&sidebarCollapsed=${sidebarCollapsed}`;
                // eslint-disable-next-line no-else-return
            } else {
                return '';
            }
        },

        embedUrl(options) {
            const basePath = `${document.location.origin}/embed/#!/embed/${self.domain()}`;
            const previewSize = self.previewSizeQuery(options.previewSize);
            const attributionHidden = self.attributionHiddenQuery(options.attributionHidden);
            const previewFirst = self.previewFirstQuery(options.previewFirst);
            const sidebarCollapsed = self.sidebarCollapsedQuery(options.sidebarCollapsed);

            return `${basePath}?path=${options.path}${previewSize}${attributionHidden}${previewFirst}${sidebarCollapsed}`;
        },

        files() {
            return self.filetree().files();
        },

        accessLevel(user) {
            if (user.isSupport()) {
                return access.ADMIN;
            }

            const [member] = Array.from(self.users().filter(({
                id
            }) => id === user.id()));

            if (!member) {
                return 0;
            }

            return member.projectPermission.accessLevel;
        },

        readOnlyFor(user) {
            return self.accessLevel(user) === 0;
        },

        temporaryAvatar: Observable(null),

        avatarUrl() {
            // eslint-disable-next-line no-unused-vars
            const basePath = `${document.location.origin}${basePathname()}`;
            const timestamp = +new Date(self.avatarUpdatedAt());
            const query = timestamp ? `?${timestamp}` : '';
            if (self.projectOnProductionOnly()) {
                const PROD_URL = 'https://cdn.glitch.com';
                return `${PROD_URL}/project-avatar/${self.id()}.png${query}`;
                // eslint-disable-next-line no-else-return
            } else {
                return `${CDN_URL}/project-avatar/${self.id()}.png${query}`;
            }
        },

        hasAvatar() {
            if (!self.avatarUpdatedAt()) {
                return false;
            }

            const lastUpdated = moment(self.updatedAt());
            const avatarSupportDate = Project.AVATAR_SUPPORT_DATE;
            const diff = lastUpdated.diff(avatarSupportDate);

            return diff > 0;
        },

        // eslint-disable-next-line consistent-return
        avatar() {
            const temporaryAvatar = self.temporaryAvatar();
            const avatar = self.avatarUrl();
            const hasAvatar = self.hasAvatar();

            if (temporaryAvatar) {
                return temporaryAvatar;
                // eslint-disable-next-line no-else-return
            } else if (hasAvatar) {
                return avatar;
            }
        },

        defaultFile() {
            // eslint-disable-next-line func-names
            const files = self.files().filter(function(file) {
                const path = file.path();

                return !(path === '.env' || path === ASSET_FILE_PATH || path.startsWith('.data/'));
            });

            const [readmeFile] = Array.from(
                // eslint-disable-next-line func-names
                files.filter(function(f) {
                    const path = f.path().toLowerCase();
                    return path.match(/^(glitch_)?readme\.(md|mdown|markdown)$/i);
                }),
            );

            const [serverFile] = Array.from(
                // eslint-disable-next-line func-names
                files.filter(function(f) {
                    const path = f.path().toLowerCase();

                    return path === 'server.js';
                }),
            );

            return readmeFile || serverFile || files[0];
        },

        saveData(overrides) {
            const data = { ...I,
                ...overrides
            };
            const whitelistedData = pick(data, whitelistProperties);
            return whitelistedData;
        },

        saveImmediate(api, overrides = {}) {
            // ugh... requires global application, but needed to avoid errors in console!
            // untestable because it requires a global application object
            /* istanbul ignore next */
            // eslint-disable-next-line dot-notation
            if (global['application'].projectIsReadOnlyForCurrentUser()) {
                return null;
            }

            const id = self.id();
            const data = self.saveData(overrides);

            return api.updateProject(id, data);
        },

        adminUsers() {
            return self.users();
        },

        getOwner() {
            // If there are multiple admins, we want to return the one with the first-created
            // projectPermission
            const usersByMembershipDate = self.users().sort((a, b) => {
                return a.projectPermission.createdAt > b.projectPermission.createdAt ? 1 : -1;
            });
            const firstAdmin = usersByMembershipDate.filter((user) => user.projectPermission.accessLevel === access.ADMIN)[0];

            if (!firstAdmin) {
                // Return the first member if there's no admins on the project (some projects like
                // ~button) fall into this situation
                return usersByMembershipDate.filter((user) => user.projectPermission.accessLevel === access.MEMBER)[0];
            }
            return firstAdmin;
        },

        getType() {
            // Used for analytics.js. We categorise the type of app this is based on what it was remixed from.
            // TODO: Add baseProjectDomains as an extra check here once the backend is returning baseDomain as well as baseId for us.
            if (self.baseId() === importFromRepoId) {
                return 'gitImport';
            }
            if (baseProjectIds.includes(self.baseId())) {
                return 'starterProject';
            }
            return 'remix';
        },

        projectUser(id) {
            // eslint-disable-next-line radix
            id = parseInt(id);
            const [projectUser] = Array.from(self.users().filter((user) => user.id === id));

            return projectUser;
        },

        // eslint-disable-next-line consistent-return
        touchImmediate(application) {
            const id = self.id();

            const data = {};
            if (application.editorIsEmbedded()) {
                data.isEmbedded = true;
            }

            if (!application.projectIsReadOnlyForCurrentUser()) {
                return application
                    .glitchApi()
                    .v0.projectTouch(id, data)
                    .catch((error) => captureException(error)); // not a user-visible issue so we don't alert them
            }
        },

        // eslint-disable-next-line consistent-return
        hasTeams() {
            if (self.teams().length) {
                return true;
            }
        },

        // community methods

        projectPageUrl() {
            return `/~${self.domain()}`;
        },
    });

    self.save = debounce(self.saveImmediate, 1000);
    self.touch = debounce(self.touchImmediate, 5000, {
        leading: true
    });

    return self;
};

Project.AVATAR_SUPPORT_DATE = moment('2016-10-27T01:31:53.559Z');

module.exports = Project;