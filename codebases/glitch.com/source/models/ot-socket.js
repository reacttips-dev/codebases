/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const Observable = require('o_0');
const Ignore = require('ignore');
const File = require('./file');
const {
    GITIGNORE_GLOBAL,
    LINE_BREAK_REGEX,
    RESOURCE_USAGE_ERROR_THRESHOLD,
    RESOURCE_USAGE_WARNING_THRESHOLD
} = require('../const');
const {
    API_URL
} = require('../env');
const {
    captureException
} = require('../sentry');

const WEBSOCKET_URL = API_URL.replace(/^http/, 'ws');

// eslint-disable-next-line func-names
module.exports = function(I, self) {
    let anyConnectionError;
    // eslint-disable-next-line no-undef-init
    let otClient = undefined;
    // eslint-disable-next-line no-undef-init
    let otCodeMirror = undefined;
    let otConnectResolve = null;
    // eslint-disable-next-line no-unused-vars
    let otConnectReject = null;
    let ignore = Ignore();
    const idToPath = (id) => {
        return otClient.idToPath(id).substring(2);
    };

    self.extend({
        clearConnectionErrors() {
            return Object.keys(self.connectionErrors).forEach((error) => self.connectionErrors[error](false));
        },

        canBroadcast: Observable(true),
        viewerCount: Observable(0),

        connectionErrors: {
            desyncError: Observable(false),
            socketClosed: Observable(false),
            socketError: Observable(false),
        },

        otClient() {
            return otClient;
        },

        otCodeMirror() {
            return otCodeMirror;
        },

        broadcast(data) {
            if (!self.canBroadcast() && !self.currentUser().awaitingInvite()) {
                return;
            }

            // eslint-disable-next-line consistent-return
            return otClient != null ? otClient.sendBroadcast(data) : undefined;
        },

        async connectToOT(project, _otClient, _otCodeMirror) {
            // eslint-disable-next-line func-names
            return new Promise(function(resolve, reject) {
                otConnectResolve = resolve;
                otConnectReject = reject;

                otClient = _otClient;
                otCodeMirror = _otCodeMirror;

                self.clearConnectionErrors();

                // eslint-disable-next-line consistent-return, func-names
                otClient.addEventListener(self, async function(ev, data) {
                    // eslint-disable-next-line default-case
                    switch (ev) {
                        case 'connected':
                            if (data) {
                                // connected
                                self.connectionErrors.socketClosed(false);
                                self.connectionErrors.socketError(false);
                                return self.broadcastUser();
                                // eslint-disable-next-line no-else-return
                            } else {
                                // disconnected
                                return self.connectionErrors.socketClosed(true);
                            }

                        case 'new-state':
                            return self.initFromMasterState(data, otConnectResolve);

                        case 'can-broadcast':
                            return self.canBroadcast(data);

                        case 'oplist':
                            return self.handleOpList(data);

                        case 'broadcast':
                            return self.handleBroadcast(data); // async function

                        case 'filetree-updated':
                            return self.generateCollapsedFiletree();
                    }
                });

                // Note that the /ot endpoint on the proxy specifies that you should provide a domain, but it actually also accepts project ID
                // We use ID to make sure that if the project is renamed, this doesn't change the websocket connection that's needed.
                return otClient.connect(`${WEBSOCKET_URL}/${project.id()}/ot?authorization=${self.persistentToken()}`);
            });
        },

        // eslint-disable-next-line consistent-return
        disconnectFromOT() {
            if (otClient) {
                otClient.removeEventListener(self);
                return otClient.disconnect();
            }
        },

        pathIgnored(path) {
            return ignore.ignores(path) && path !== '.gitignore' && path !== '.env' && path !== '.glitch-assets';
        },

        registerAllDirectories(parentId, files) {
            // eslint-disable-next-line func-names
            return otClient.document(parentId).then(function(parent) {
                const dirs = [];
                // eslint-disable-next-line guard-for-in, prefer-const
                for (let name in parent.children) {
                    const id = parent.children[name];
                    const doc = otClient.documentImmediate(id);
                    const path = idToPath(doc.docId);
                    if (doc.docType === 'directory') {
                        dirs.push(doc);
                    } else {
                        // eslint-disable-next-line no-lonely-if
                        if (!self.pathIgnored(path)) {
                            files.push(doc);
                        }
                    }
                }

                return Promise.all(dirs.map((dir) => self.registerAllDirectories(dir.docId, files)));
            });
        },

        loadGitIgnores(gitIgnoreDoc) {
            ignore = Ignore();
            ignore.add(GITIGNORE_GLOBAL);

            if (gitIgnoreDoc) {
                const customPatterns = gitIgnoreDoc.content.split(LINE_BREAK_REGEX).filter((line) => line.length > 0 && !line.startsWith('#'));
                ignore.add(customPatterns);
            }

            return ignore;
        },

        loadAllFilesIfEmbedded(files) {
            if (!self.editorIsEmbedded()) {
                return Promise.resolve();
            }

            return Promise.all(files.map((file) => self.ensureSession(file, otClient)));
        },

        // eslint-disable-next-line no-shadow
        initFromMasterState(masterState, otConnectResolve) {
            let files = [];
            const rootDirId = masterState.documents.root.children['.'];

            ignore = Ignore();
            // We have to register the root before registering .gitignore, or ot gets confused
            return (
                otClient
                .document(rootDirId)
                // eslint-disable-next-line consistent-return, func-names
                .then(function() {
                    // eslint-disable-next-line guard-for-in, prefer-const
                    for (let _ in masterState.documents) {
                        const doc = masterState.documents[_];
                        if (doc.name === '.gitignore' && doc.docType === 'file') {
                            return otClient.document(doc.docId);
                        }
                    }
                })
                // eslint-disable-next-line no-return-assign
                .then((gitIgnoreDoc) => (ignore = self.loadGitIgnores(gitIgnoreDoc)))
                .then(() => self.registerAllDirectories(rootDirId, files))
                // eslint-disable-next-line func-names
                .then(function() {
                    files = files
                        .map((file) => ({
                            path: idToPath(file.docId),
                            uuid: file.docId,
                        }))
                        .filter((file) => !self.pathIgnored(file.path))
                        .map(File);

                    files.sort(self.alphabeticalize);

                    // TODO: When we rethink application state for the filetree and rewind, we can remove all these observables and build
                    // the filetree purely from OT (and OT-style filetree for rewind) updates, rather than observing changes to the flat file lists
                    self.filetree().files.observe(self.generateCollapsedFiletree);
                    if (self.currentProject()) {
                        self
                            .currentProject()
                            .filetree()
                            .files.observe(self.generateCollapsedFiletree);
                        self.currentProject().filetree.observe(self.generateCollapsedFiletree);
                    }
                    // During rewind preview, we have to build the filetree from local application.files(), which isn't connected to OT IDs
                    // We therefore need to make sure the filetree is regenerated once rewind is no longer being previewed.
                    self.editorIsPreviewingRewind.observe(self.generateCollapsedFiletree);
                    self.editorIsRewindingProject.observe(self.generateCollapsedFiletree);

                    self.filetree().files(files);

                    return self.loadAllFilesIfEmbedded(files);
                })
                .then(async () => {
                    // We have to set this here because it's triggered on container restarts, which happen as a result of the boost flag being added/removed
                    // after a project is added to or removed from the user's boosted collection
                    if (self.currentProject()) {
                        return self.setProjectBoostStatus(self.currentProject());
                    }
                    return Promise.resolve();
                })
                // eslint-disable-next-line func-names
                .then(function() {
                    self.readDebuggerSetting();
                    self.readEslintrc();
                    self.readWatchJson();
                    self.readPrettierrc();

                    // don't change the markdown preview settings if we are editing an .md file
                    if (
                        self
                        .selectedFile() ?
                        .path()
                        .toLowerCase()
                        .endsWith('.md')
                    ) {
                        const projectId = self.currentProjectId();
                        const markdownPrefs = self.getUserPref('markdownPreviewVisible');
                        /* istanbul ignore next */
                        const pref = (markdownPrefs != null ? markdownPrefs[projectId] : undefined) || true;
                        self.markdownPreviewVisible(pref);
                    }

                    self.selectCurrentFile();

                    return otConnectResolve();
                })
                .catch((error) => {
                    self.notifyGenericError(true);
                    captureException(error);
                })
            );
        },

        selectCurrentFile() {
            if (self.restorePath()) {
                self.userPositionIsRestored(false);
                self.selectFileByPathOrDefaultFile(self.restorePath());
            } else {
                self.selectDefaultFile();
            }
        },

        handleOpList(oplist) {
            // eslint-disable-next-line consistent-return, func-names
            oplist.ops.forEach(function(op) {
                let files;
                let oldDirPath;
                if (op.docType === 'directory') {
                    // eslint-disable-next-line default-case
                    switch (op.type) {
                        case 'add':
                            files = [];

                            // eslint-disable-next-line no-case-declarations
                            const dirPath = idToPath(op.docId);
                            // eslint-disable-next-line prefer-template
                            if (!self.pathIgnored(dirPath + '/')) {
                                // eslint-disable-next-line func-names
                                return self.registerAllDirectories(op.docId, files).then(function() {
                                    files.forEach((file) =>
                                        self.filetree().files.push(
                                            File({
                                                path: idToPath(file.docId),
                                                uuid: file.docId,
                                            }),
                                        ),
                                    );
                                });
                            }
                            break;

                        case 'unlink':
                            // The server appears to send additional messages about folder deletes - if there's no path, we know
                            // it's already gone from OT and therefore pass a null path, so that no further action has to be taken
                            // to clean up local files.
                            oldDirPath = op.oldPath ? op.oldPath.substring(2) : null;
                            return self.deleteFolder(op.docId, oldDirPath, {
                                silent: true
                            });

                        case 'rename':
                            // eslint-disable-next-line no-case-declarations, no-unused-vars
                            const idsToRename = [];
                            oldDirPath = op.oldPath.substring(2);
                            // eslint-disable-next-line prefer-template
                            if (self.pathIgnored(oldDirPath + '/')) {
                                files = [];
                                // eslint-disable-next-line func-names
                                return self.registerAllDirectories(op.docId, files).then(function() {
                                    files.forEach((file) =>
                                        self.filetree().files.push(
                                            File({
                                                path: idToPath(file.docId),
                                                uuid: file.docId,
                                            }),
                                        ),
                                    );
                                });
                                // eslint-disable-next-line no-else-return
                            } else {
                                return self.renameFolder(op.docId, oldDirPath, op.newName, false);
                            }
                    }
                } else {
                    // eslint-disable-next-line default-case
                    switch (op.type) {
                        case 'add':
                            // eslint-disable-next-line no-case-declarations
                            const parentPath = idToPath(op.parentId);
                            // eslint-disable-next-line no-case-declarations, prefer-template
                            const newPath = parentPath ? parentPath + '/' + op.name : op.name;
                            if (!self.pathIgnored(newPath)) {
                                const newFile = File({
                                    path: newPath,
                                    uuid: op.docId,
                                });
                                self.filetree().files.push(newFile);
                            }
                            break;

                        case 'unlink':
                            return self.deleteFile(self.fileById(op.docId), {
                                silent: true
                            });

                        case 'rename':
                            return self.handleRename(op.docId);
                    }
                }
            });
        },

        handleRename(docId) {
            // Could be renaming over an existing file, and ops have already been applied to ot,
            // so we can get the new path this way
            const newPath = idToPath(docId);
            const oldFile = self.fileByPath(newPath);
            if (oldFile) {
                self.deleteFile(oldFile, {
                    silent: true
                });
            }

            const file = self.fileById(docId);

            // if file does not exist, it means its old path was ignored
            if (!file && !self.pathIgnored(newPath)) {
                const newFile = File({
                    path: idToPath(docId),
                    uuid: docId,
                });
                self.filetree().files.push(newFile);
            } else if (self.pathIgnored(newPath)) {
                self.deleteFile(file, {
                    silent: true
                });
            } else {
                self.renameFile(file, newPath, false);
            }
        },

        resourceState(usagePercent) {
            if (usagePercent > RESOURCE_USAGE_ERROR_THRESHOLD) {
                return 'error';
                // eslint-disable-next-line no-else-return
            } else if (usagePercent > RESOURCE_USAGE_WARNING_THRESHOLD) {
                return 'warning';
            } else {
                return 'ok';
            }
        },

        overallResourceState() {
            if (
                self.projectContainerCpuStatus() === 'error' ||
                self.projectContainerMemoryStatus() === 'error' ||
                self.projectContainerDiskStatus() === 'error'
            ) {
                return 'error';
                // eslint-disable-next-line no-else-return
            } else if (
                self.projectContainerCpuStatus() === 'warning' ||
                self.projectContainerMemoryStatus() === 'warning' ||
                self.projectContainerDiskStatus() === 'warning'
            ) {
                return 'warning';
            } else {
                return 'ok';
            }
        },

        handleProjectPerformanceStats(message) {
            message.diskUsagePercent = (message.diskUsage / message.diskSize) * 100;
            message.memoryUsagePercent = (message.memoryUsage / message.memoryLimit) * 100;
            if (message.quotaUsagePercent == null) {
                message.quotaUsagePercent = 0;
            }
            message.quotaUsagePercent *= 100;
            self.projectContainerResourcesData(message);
            self.projectContainerResourcesDataLoaded(true);
            self.projectContainerCpuStatus(self.resourceState(message.quotaUsagePercent));
            self.projectContainerMemoryStatus(self.resourceState(message.memoryUsagePercent));
            self.projectContainerDiskStatus(self.resourceState(message.diskUsagePercent));
            return self.projectContainerResourcesStatus(self.overallResourceState());
        },

        // eslint-disable-next-line consistent-return
        async handleBroadcast(message) {
            const {
                user,
                viewerCount,
                projectName,
                remoteConnected,
                type
            } = message;

            if (type === 'project-stats') {
                self.handleProjectPerformanceStats(message);
            }
            // selection broadcasts are handled in ot-codemirror
            if (user && !self.editorIsEmbedded()) {
                await self.updateRemoteUser(user);
            } else if (projectName) {
                self.updateProjectName(projectName);
            }

            if (viewerCount != null) {
                self.viewerCount(viewerCount);
            }

            if (remoteConnected != null && remoteConnected !== otClient.clientId()) {
                return self.broadcastUser();
            }
        },

        OTNewFile(file) {
            return otCodeMirror.createFile(file);
        },

        OTDeleteFile(file) {
            return otCodeMirror.deleteFile(file);
        },

        OTDeleteFolder(folderId) {
            return otCodeMirror.deleteFolder(folderId);
        },

        OTRenameFile(file) {
            return otCodeMirror.renameFile(file);
        },

        OTRenameFolder(folderId, newName) {
            return otCodeMirror.renameFolder(folderId, newName);
        },

        checkIfSevereDisconnection() {
            self.notifyReconnecting(false);
            const errors = anyConnectionError();
            return self.notifyConnectionError(errors);
        },
    });

    // eslint-disable-next-line no-multi-assign
    self.anyConnectionError = anyConnectionError = () => Object.keys(self.connectionErrors).some((error) => self.connectionErrors[error]());

    // eslint-disable-next-line func-names, consistent-return
    Observable(anyConnectionError).observe(function(errors) {
        // check if it is a socket disconnect
        if (self.connectionErrors.socketClosed() || self.notifyReconnecting()) {
            self.userPositionIsRestored(false);
            self.notifyReconnecting(errors);
            self.notifyReconnected(!errors);
            if (errors) {
                return setTimeout(self.checkIfSevereDisconnection, 30000);
            }
        } else {
            return self.notifyConnectionError(errors);
        }
    });

    return self;
};