/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const color = require('color');
const defaults = require('lodash/defaults');
const randomColor = require('randomcolor');

const File = require('./file');
const Model = require('../model');
const Team = require('./team');

const RECENT_FILES_MAX = 100;

const randomUserColor = () => randomColor({
    luminosity: 'light'
});

const sameFile = (a, b) => a.uuid() === b.uuid() && a.projectId() === b.projectId();

const pushRecent = (list, item, itemsMax) =>
    list
    .filter((listItem) => !sameFile(item, listItem))
    .concat([item])
    .slice(-itemsMax);
// eslint-disable-next-line func-names
const User = function(I = {}, self) {
    I = I || /* istanbul ignore next */ {};
    self = self || Model(I);
    defaults(I, {
        avatarThumbnailUrl: null,
        avatarUrl: null,
        awaitingInvite: false,
        color: randomUserColor(),
        hasLikedCurrentProject: false,
        id: -Math.floor(Math.random() * 65536), // negative so they don't conflict with real ids
        lastSeen: Date.now(),
        login: null,
        name: null,
        recentFiles: [],
        isOnline: true, // true by default as it is easier to tell when it is offline
        teams: [],
        tabId: `${Math.floor(Math.random() * 65536)}`,
        gitUser: null,
        isGlitchRewind: false,
        emails: [],
        features: [],
        gitAccessToken: null,
        description: '',
    });

    const REMOVE_AWAITING_INVITE_TIMEOUT = I.removeAwaitingInviteTimeout != null ? I.removeAwaitingInviteTimeout : 15 * 1000;

    self.attrAccessor(
        'avatarThumbnailUrl',
        'avatarUrl',
        'githubToken',
        'facebookToken',
        'login',
        'name',
        'color',
        'createdAt',
        'tabId',
        'facebookId',
        'isSupport',
        'description',
    );
    self.attrObservable(
        'thanksReceived',
        'thanksCount',
        'isThankedByCurrentUser',
        'isOnline',
        'awaitingInvite',
        'emails',
        'id',
        'lastSeen',
        'hasLikedCurrentProject',
        'paidPlan',
        'isFetching',
        'gitUser',
        'isGlitchRewind',
        'features',
        'gitAccessToken',
        'persistentToken',
    );
    self.attrModels('recentFiles', File);
    self.attrModels('teams', Team);

    // documentId: uuid
    // cursor:
    //   line: int
    //   ch: int
    self.attrObservable('lastCursor');

    // gh location string, user role (collaborator, owner),

    self.extend({
        broadcastData({
            project
        } = {}) {
            const data = {
                avatarUrl: self.avatarUrl(),
                avatarThumbnailUrl: self.avatarThumbnailUrl(),
                awaitingInvite: self.awaitingInvite(),
                id: I.id,
                name: I.name,
                login: I.login,
                color: I.color,
                lastCursor: self.lastCursor(),
                thanksReceived: false,
                tabId: self.tabId(),
                teams: self.teams(),
            };
            if (project) {
                data.readOnly = project.readOnlyFor(self);
                data.projectPermission = {
                    userId: I.id,
                    projectId: project.id(),
                    accessLevel: project.accessLevel(self),
                };
            }

            return data;
        },

        primaryEmail() {
            return self.emails().find((e) => e.verified && e.primary);
        },

        currentDocument() {
            return self.recentFiles.last() ? .uuid() || self.lastCursor() ? .documentId;
        },

        secondaryColor() {
            return color(I.color)
                .darken(0.1)
                .rgbString();
        },

        // eslint-disable-next-line consistent-return
        addRecentFile(file, projectId) {
            const strippedFile = File({
                uuid: file.uuid(),
                path: file.path(),
                projectId,
            });

            const files = self.recentFiles();

            if (file.path() !== '.env' && !file.path().startsWith('.data/')) {
                return self.recentFiles(pushRecent(files, strippedFile, RECENT_FILES_MAX));
            }
        },

        loggedIn() {
            return !!self.login();
        },

        registerAnon(api) {
            // eslint-disable-next-line func-names, no-shadow
            return api.post('v1/users/anon').then(function({
                id,
                persistentToken,
                color
            }) {
                self.persistentToken(persistentToken);
                self.id(id);
                return self.color(color);
            });
        },

        update(data) {
            // eslint-disable-next-line func-names
            return Object.keys(data).forEach(function(name) {
                // Only skip lastCursor data if we already have a clientId set
                if (name === 'lastCursor' && self.lastCursor() ? .clientId) {
                    // If this is for a different client (or null), skip it
                    if (!data[name] || self.lastCursor().clientId !== data[name].clientId) {
                        return;
                    }
                }

                // this might be this: an user is awaiting to be invited but it has 2 or more windows open
                // this means that we want to wait at least another heartbeat before we are sure they stop asking
                if (name === 'awaitingInvite' && self.awaitingInvite()) {
                    if (!data.awaitingInvite) {
                        if (!self.removeAwaitingInviteHandler) {
                            // eslint-disable-next-line func-names
                            self.removeAwaitingInviteHandler = setTimeout(function() {
                                self.removeAwaitingInviteHandler = null;
                                return self.awaitingInvite(false);
                            }, REMOVE_AWAITING_INVITE_TIMEOUT);
                        }
                    } else {
                        clearTimeout(self.removeAwaitingInviteHandler);
                        self.removeAwaitingInviteHandler = null;
                        self.awaitingInvite(true);
                    }
                    return;
                }

                if (self[name]) {
                    // promotes teams data to teams model
                    // path for nested model properties
                    /* istanbul ignore next */
                    if (name === 'teams') {
                        // eslint-disable-next-line consistent-return
                        return self[name](data[name].map((item) => Team(item)));
                        // eslint-disable-next-line no-else-return
                    } else {
                        // eslint-disable-next-line consistent-return
                        return self[name](data[name]);
                    }
                }
            });
        },

        // eslint-disable-next-line consistent-return
        isAnon() {
            if (!self.login()) {
                return true;
            }
        },

        userAvatarUrl(size) {
            size = size || 'small'; // 'large'
            if (self.isAnon()) {
                return undefined;
                // eslint-disable-next-line no-else-return
            } else if (size === 'large') {
                return self.avatarUrl();
            } else {
                return self.avatarThumbnailUrl();
            }
        },

        // community methods

        profileUrl() {
            if (self.login()) {
                return `/@${self.login()}`;
                // eslint-disable-next-line no-else-return
            } else {
                return `/user/${self.id()}`;
            }
        },

        // thank methods 👏

        updateThanks(application) {
            return (
                application
                .glitchApi()
                .v0.getThanks(self.id())
                // eslint-disable-next-line func-names
                .then(function(thanks) {
                    self.thanksCount(thanks.length);
                    const [currentUserThank] = Array.from(thanks.filter(({
                        thankerUserId
                    }) => thankerUserId === application.currentUser().id()));
                    return self.isThankedByCurrentUser(!!currentUserThank);
                })
                // eslint-disable-next-line func-names
                .catch(function(error) {
                    console.warn(`Could not fetch updated thanks count for @${self.login()}: ${error.response.status} ${error.response.statusText}`);
                })
            );
        },

        addThanks(application) {
            self.isThankedByCurrentUser(true);
            self.thanksCount.increment(1);
            return (
                application
                .glitchApi()
                .addThanks(self.id())
                // eslint-disable-next-line func-names
                .then(function() {
                    const msg = {
                        user: self.broadcastData()
                    };
                    msg.user.thankedBy = application.currentUser().id();
                    return application.broadcast(msg);
                })
            );
        },

        removeThanks(application) {
            self.isThankedByCurrentUser(false);
            self.thanksCount.decrement(1);
            return (
                application
                .glitchApi()
                .deleteThanks(self.id())
                // eslint-disable-next-line func-names
                .then(function() {
                    const msg = {
                        user: self.broadcastData()
                    };
                    msg.user.unThankedBy = application.currentUser().id();
                    return application.broadcast(msg);
                })
            );
        },
    });

    return self;
};

module.exports = User;

User.Anon = User({
        login: 'I should sign in',
        name: 'Anonymous',
    },
    null,
);