/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// 💁 invoked with timers from index.coffee

const pick = require('lodash/pick');
const messages = require('../utils/messages');

// eslint-disable-next-line func-names
module.exports = function(application) {
    let self;
    // eslint-disable-next-line no-return-assign
    return (self = {
        userBroadcast() {
            application.broadcastUser();
            return application.removeStaleUsers();
        },

        activityCheck(document) {
            const maxIdle = 30 * 60 * 1000; // Thirty minutes
            let lastActive = Date.now();

            // eslint-disable-next-line func-names
            document.addEventListener('keydown', function() {
                lastActive = Date.now();
                return application.userIsIdle(false);
            });

            // eslint-disable-next-line func-names
            document.addEventListener('mousemove', function() {
                lastActive = Date.now();
                return application.userIsIdle(false);
            });

            // eslint-disable-next-line consistent-return, func-names
            return function() {
                const currentTime = Date.now();
                const delta = currentTime - lastActive;
                if (delta > maxIdle) {
                    return application.userIsIdle(true);
                }
            };
        },

        notifyAnonUserLimitsVisible() {
            const project = application.currentProject();
            if (!project) {
                return;
            }

            const projectUsers = project.users();
            const projectHasLoggedInUsers = projectUsers.some((user) => user.login);
            const loggedIn = application.currentUser().loggedIn();
            const readOnly = application.projectIsReadOnlyForCurrentUser();

            if (!(readOnly || loggedIn)) {
                if (!projectHasLoggedInUsers) {
                    // eslint-disable-next-line consistent-return
                    return application.notifyAnonProjectLimits(true);
                    // eslint-disable-next-line no-else-return
                } else {
                    // eslint-disable-next-line consistent-return
                    return application.notifyAnonUserLimits(true);
                }
            }
        },

        editorOrigin(editorWindow = window) {
            // window assignment is for the unit test
            // port check is to support http://localhost:8000 local dev environment
            if (editorWindow.location.port) {
                return `http://${editorWindow.location.hostname}:${editorWindow.location.port}`;
                // eslint-disable-next-line no-else-return
            } else {
                return `https://${editorWindow.location.hostname}`;
            }
        },

        loginFromCommunityAuth(data) {
            // login success handled by application.handleStorage()
            const authFrame = document.querySelector('#community-auth-iframe');
            if (!data.success) {
                application.signInCodeIsValid(false);
            } else {
                application.closeAllPopOvers();
            }
            authFrame.remove();
            application.userIsLoggingIn(false);
        },

        receivePostMessage(event) {
            const {
                source,
                origin,
                data
            } = event;

            // Discard messages not from our origin or from a parent window.
            // Public messages go after this.
            if (origin !== self.editorOrigin() && source !== window.parent) {
                return;
            }

            // Keep "GoToMessage" type here for compat.
            if (data.type === messages.GO_TO_LINE || data.type === 'GoToMessage') {
                const {
                    filePath,
                    line
                } = data.payload;
                const file = application.fileByPath(filePath);
                if (!file) {
                    return;
                }
                application.selectFileByUuid(file.uuid()).then(() => {
                    application.goToLine(line);
                });
            }

            // Discard messages that aren't specifically from our origin (https://glitch.com:443).
            // Private Glitch-only messages go after this.
            if (origin !== self.editorOrigin()) {
                return;
            }

            if (data.type === messages.UPDATE_EMBED_STATE) {
                const props = pick(data.payload, [
                    'embedAppPreviewSize',
                    'embedSelectedFilePath',
                    'embedAttributionHidden',
                    'embedParentIsGlitch',
                    'embedSidebarCollapsed',
                ]);
                const updates = Object.entries(props);
                updates.forEach(([key, value]) => {
                    application[key](value);
                });
                if (updates.length > 0) {
                    application.refreshEditor();
                }
            }
        },

        mouseenter() {
            application.applicationHovered(true);
        },

        mouseleave() {
            application.applicationHovered(false);
        },

        // eslint-disable-next-line no-unused-vars
        focus(e) {
            application.applicationFocused(true);
        },

        // eslint-disable-next-line no-unused-vars
        blur(e) {
            application.applicationFocused(false);
            application.updateUrlWithPosition();
        },

        refreshCheck(e) {
            const {
                key
            } = e;

            // This is a weird and fun hack to swoop in before a refresh triggers
            // and to update the url. We can't update the url in beforeunload for
            // "security reasons".
            // If someone has non-standard hotkeys then they may not refresh to the same location
            if (key === 'F5') {
                application.updateUrlWithPosition();
            }
        },

        /**
         * Store a list of CSP violations in case we need to react to any of them.
         */
        securitypolicyviolation(event) {
            application.cspViolations.push({
                violatedDirective: event.violatedDirective,
                blockedURI: event.blockedURI,
            });
        },
    });
};