import color from 'color';
import Observable from 'o_0';
import randomColor from 'randomcolor';
import {
    isEqual
} from 'lodash';

const randomUserColor = () => randomColor({
    luminosity: 'light'
});

function RecentFileShim(recentFile) {
    return {
        uuid: () => recentFile.uuid,
        path: () => recentFile.path,
        projectId: () => recentFile.projectId,
        extensionType: () => '',
        name: () => recentFile.path.replace(/(.*\/)/g, ''),
    };
}

function CurrentUserTeamShim(team) {
    return {
        id: () => team.id,
        name: () => team.name,
        url: () => team.url,
        description: () => team.description,
        backgroundColor: () => team.backgroundColor,
        createdAt: () => team.createdAt,
        updatedAt: () => team.updatedAt,
        hasCoverImage: () => team.hasCoverImage,
        location: () => team.location,
        isVerified: () => team.isVerified,
        hasAvatarImage: () => team.hasAvatarImage,
        avatarUrl(size, app = global.application) {
            // app assignment is just for unit test
            size = size || 'small';
            if (team.hasAvatarImage && app.environment() === 'development') {
                return `https://s3.amazonaws.com/hyperdev-development/team-avatar/${team.id}/${size}`;
            }
            if (team.hasAvatarImage) {
                return `https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/team-avatar/${team.id}/${size}`;
            }
            return 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-team-avatar.svg?1503510366819';
        },
        teamPageUrl() {
            return `/@${team.url}`;
        },
    };
}

export default function CurrentUserShim(userMachine) {
    const user = Observable(null);
    const awaitingInvite = Observable(false);
    const lastCursor = Observable(null);
    const recentFiles = Observable([]);
    const teams = Observable([]);
    let userData = null;
    let recentFilesData = null;
    let teamsData = null;

    userMachine.onTransition((nextState) => {
        if (nextState.matches('active') === false) {
            user(null);
            awaitingInvite(false);
            lastCursor(null);
            recentFiles([]);
            teams([]);
            userData = null;
            recentFilesData = null;
            teamsData = null;
            return;
        }

        lastCursor(nextState.context.lastCursor || null);

        if (userData !== nextState.context.user) {
            userData = nextState.context.user;
            user(userData);
        }

        if (awaitingInvite() !== userMachine.state.matches('active.awaitingInvite.active')) {
            awaitingInvite(userMachine.state.matches('active.awaitingInvite.active'));
        }

        if (recentFilesData !== nextState.context.recentFiles) {
            recentFilesData = nextState.context.recentFiles;
            recentFiles(Array.isArray(recentFilesData) ? recentFilesData.map((recentFile) => RecentFileShim(recentFile)) : []);
        }

        if (teamsData !== nextState.context.user.teams) {
            teamsData = nextState.context.user.teams;
            teams(Array.isArray(teamsData) ? teamsData.map((team) => CurrentUserTeamShim(team)) : []);
        }
    });

    const accessor = (name, fallback) =>
        Observable(() => {
            const currentUser = user();
            if (currentUser && name in currentUser) {
                return currentUser[name];
            }
            return fallback;
        });

    const self = {
        get I() {
            return {
                ...userData,
                awaitingInvite: userMachine.state.matches('active.awaitingInvite.active'),
                recentFiles: recentFilesData,
                teams: teamsData,
            };
        },

        avatarThumbnailUrl: accessor('avatarThumbnailUrl', null),
        avatarUrl: accessor('avatarUrl', null),
        githubToken: accessor('githubToken'),
        facebookToken: accessor('facebookToken'),
        login: accessor('login', null),
        name: accessor('name', null),
        color: accessor('color', randomUserColor()),
        createdAt: accessor('createdAt'),
        tabId: accessor('tabId', `${Math.floor(Math.random() * 65536)}`),
        facebookId: accessor('facebookId'),
        isSupport: accessor('isSupport'),
        description: accessor('description', ''),

        thanksReceived: accessor('thanksReceived'),
        thanksCount: accessor('thanksCount'),
        isThankedByCurrentUser: accessor('isThankedByCurrentUser'),
        isOnline: accessor('isOnline', true),
        emails: accessor('emails', []),
        id: accessor('id', -Math.floor(Math.random() * 65536)),
        lastSeen: accessor('lastSeen', Date.now()),
        readOnly: accessor('readOnly', null),
        hasLikedCurrentProject: accessor('hasLikedCurrentProject', false),
        paidPlan: accessor('paidPlan'),
        isFetching: accessor('isFetching'),
        gitUser: accessor('gitUser', null),
        isGlitchRewind: accessor('isGlitchRewind', false),
        features: accessor('features', []),
        gitAccessToken: accessor('gitAccessToken', null),
        persistentToken: accessor('persistentToken'),

        recentFiles() {
            return recentFiles();
        },

        awaitingInvite(...args) {
            if (args.length === 0) {
                return awaitingInvite();
            }
            const [next] = args;
            if (awaitingInvite() !== next) {
                userMachine.send('TOGGLE_AWAITING_INVITE');
            }
            return undefined;
        },

        lastCursor(...args) {
            if (args.length === 0) {
                return lastCursor();
            }
            const [next] = args;
            if (!isEqual(lastCursor(), next)) {
                userMachine.send({
                    type: 'TEXT_SELECTED',
                    data: next
                });
            }
            return undefined;
        },

        addRecentFile(file, projectId) {
            const fileData = {
                uuid: file.uuid(),
                path: file.path(),
                projectId,
            };

            if (fileData.path !== '.env' && fileData.path.startsWith('.data/') === false) {
                userMachine.send({
                    type: 'FILE_OPENED',
                    data: fileData
                });
            }
        },

        teams() {
            return teams();
        },

        broadcastData({
            project
        } = {}) {
            const data = {
                avatarUrl: self.avatarUrl(),
                avatarThumbnailUrl: self.avatarThumbnailUrl(),
                awaitingInvite: self.awaitingInvite(),
                id: self.id(),
                name: self.name(),
                login: self.login(),
                color: self.color(),
                lastCursor: self.lastCursor(),
                readOnly: self.readOnly(),
                thanksReceived: false,
                tabId: self.tabId(),
                teams: self.teams(),
            };

            if (project) {
                data.projectPermission = {
                    userId: self.id(),
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
            const lastRecentFile = self.recentFiles().slice(-1)[0];
            if (lastRecentFile) {
                return lastRecentFile.uuid();
            }
            const cursor = self.lastCursor();
            if (cursor) {
                return cursor.documentId;
            }
            return undefined;
        },

        secondaryColor() {
            return color(self.color())
                .darken(0.1)
                .rgbString();
        },

        loggedIn() {
            return !!self.login();
        },

        isAnon() {
            return self.login() === null;
        },

        userAvatarUrl(size) {
            size = size || 'small';
            if (self.isAnon()) {
                return undefined;
            }
            if (size === 'large') {
                return self.avatarUrl();
            }
            return self.avatarThumbnailUrl();
        },

        profileUrl() {
            if (self.login()) {
                return `/@${self.login()}`;
            }
            return `/user/${self.id()}`;
        },

        updateThanks() {
            // noop. This function makes an HTTP request in the user model to fetch the latest thanks count,
            // however we're already receiving thanks over the OT socket, so it's unnecessary.
        },
    };

    return self;
}