/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// we need to copy this from the watcher directory
const OT = require('@glitchdotcom/glitch-ot');
const ReconnectingWebSocket = require('./reconnecting-websocket');
const {
    captureException
} = require('../sentry');

// eslint-disable-next-line func-names
module.exports = function({
    randomId,
    setTimeoutMock,
    clearTimeoutMock,
    application
}) {
    const setTimeout = setTimeoutMock || global.setTimeout;
    const clearTimeout = clearTimeoutMock || global.clearTimeout;

    const clientId = randomId();

    let ot = null;
    const timeoutHandlers = {};
    let awaitAck = null;
    let pending = null;

    const eventListeners = new Map();

    const opListsReceivedDuringRewind = [];

    // eslint-disable-next-line func-names
    const send = function(msg) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (msg.force || self.ws.isOpen) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            self.ws.send(JSON.stringify(msg));
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return self.ws.isOpen;
    };

    // eslint-disable-next-line func-names
    const sendOpList = function(opList) {
        const strippedOpList = JSON.parse(JSON.stringify(opList));
        ot.stripAddedFields(strippedOpList);
        return send({
            type: 'client-oplist',
            opList: strippedOpList,
        });
    };

    // IMPORTANT!!! Keep this in sync with ot-server.ts in the watcher!!!
    // eslint-disable-next-line func-names
    const revertEdits = function(doc, opLists) {
        let {
            content
        } = doc;

        // eslint-disable-next-line no-plusplus
        for (let i = opLists.length - 1; i >= 0; i--) {
            const opList = opLists[i];
            // eslint-disable-next-line no-plusplus
            for (let j = opList.ops.length - 1; j >= 0; j--) {
                const op = opList.ops[j];
                if (op.docId !== doc.docId) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                // eslint-disable-next-line default-case
                switch (op.type) {
                    case 'insert':
                        content = content.substring(0, op.position) + content.substring(op.position + op.text.length);
                        break;
                    case 'remove':
                        content = content.substring(0, op.position) + op.text + content.substring(op.position);
                        break;
                }
            }
        }

        return content;
    };

    // eslint-disable-next-line func-names, consistent-return
    const sendOfflineEdits = function() {
        const opLists = [awaitAck.opList];
        /* istanbul ignore next */
        if ((pending != null ? pending.opList.ops.length : undefined) > 0) {
            opLists.push(pending.opList);
        }

        const addedIds = {};
        const deletedIds = {};
        const sentContents = {};

        for (const opList of opLists) {
            for (const op of opList.ops) {
                if (op.type === 'unlink') {
                    deletedIds[op.docId] = true;
                }
            }
        }

        const offlineOps = [];

        // For the first edit on each file, we send the whole contents
        // This eliminates race conditions, and also means we handle terminated
        // instances more gracefully
        for (const opList of opLists) {
            for (const op of opList.ops) {
                // Skip ops for files that are deleted later

                // eslint-disable-next-line default-case
                switch (op.type) {
                    case 'add':
                        addedIds[op.docId] = true;

                        if (deletedIds[op.docId]) {
                            // eslint-disable-next-line no-continue
                            continue;
                        }

                        // Don't need to send contents for added files - they start out empty
                        sentContents[op.docId] = true;
                        break;
                    case 'rename':
                        // We need to keep renames for deleted files to figure out the id later,
                        // but if this file was added and later deleted we can get rid of all of
                        // its ops
                        if (addedIds[op.docId] && deletedIds[op.docId]) {
                            // eslint-disable-next-line no-continue
                            continue;
                        }
                        break;
                    case 'unlink':
                        // If the file was deleted later, we won't create it, so don't need the unlink
                        if (addedIds[op.docId]) {
                            // eslint-disable-next-line no-continue
                            continue;
                        }
                        break;
                    case 'insert':
                    case 'remove':
                        if (deletedIds[op.docId]) {
                            // eslint-disable-next-line no-continue
                            continue;
                        }

                        if (!sentContents[op.docId]) {
                            const originalContents = revertEdits(ot.document(op.docId), opLists);
                            const contentsAfterFirstEdit = ot.applyEdit(originalContents, op);
                            op.type = 'set-content';
                            op.content = contentsAfterFirstEdit;
                            delete op.text;

                            sentContents[op.docId] = true;
                        }
                        break;
                }

                offlineOps.push(op);
            }
        }

        if (offlineOps.length > 0) {
            return send({
                type: 'resolve-offline-edits',
                ops: offlineOps,
                force: true,
            });
        }
    };

    // eslint-disable-next-line func-names
    const handleMasterState = function(masterState) {
        if (application.editorIsPreviewingRewind()) {
            application.receivedMasterStateDuringRewind(true);
            return;
        }

        if (awaitAck) {
            // This only happens if the server restarted.  If we lost our network connection
            // and reconnected, then our ot state would still be compatible with the server,
            // and we would get a master-state-update, not a new master-state
            sendOfflineEdits();
        }

        ot = OT({
            state: masterState,
        });

        // eslint-disable-next-line guard-for-in
        for (const id in timeoutHandlers) {
            const handler = timeoutHandlers[id];
            clearTimeout(handler);
            delete timeoutHandlers[id];
        }

        if (awaitAck) {
            awaitAck.resolve();
        }
        if ((pending != null ? pending.opList.ops.length : undefined) > 0) {
            pending.resolve();
        }

        awaitAck = null;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        resetPending();

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        self.ws.isOpen = true;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        sendEvent('connected', self.ws.isOpen);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        sendEvent('new-state', masterState);
    };

    // eslint-disable-next-line func-names
    const handleMasterStateUpdate = function(opLists) {
        let opList;
        if (application.editorIsPreviewingRewind()) {
            application.receivedMasterStateDuringRewind(true);
            return;
        }

        // it might happen that the first opList is the one that is waiting for an ack
        // it happens when we send the opList and then we get disconnected before receiving the ack
        if (opLists[0] && opLists[0].id === awaitAck ? .opList ? .id) {
            ot.setVersion(opLists[0].version + 1);
            opList = opLists.shift();
            awaitAck.resolve(opList);
            awaitAck = null;
        }

        for (opList of opLists) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            handleMasterOpList(opList, {
                doNotHandleQueued: true
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        self.ws.isOpen = true;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        sendEvent('connected', self.ws.isOpen);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        handleQueuedOpLists();
    };

    // eslint-disable-next-line func-names
    const handleMasterOpList = function(opList, {
        doNotHandleQueued
    } = {}) {
        // We don't want other users changing the current state of the project right now - the
        // diffs we get from the server won't match
        if (application.editorIsPreviewingRewind()) {
            opListsReceivedDuringRewind.push(opList);
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        updateOpLists(opList);
        ot.apply(opList);
        ot.setVersion(opList.version + 1);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        sendEvent('oplist', opList);
        if (!doNotHandleQueued) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            handleQueuedOpLists();
        }
    };

    // eslint-disable-next-line func-names
    const handleRegisterDocument = function({
        document: remoteDocument,
        missingDocId
    }) {
        let localDoc;
        if (missingDocId) {
            localDoc = ot.document(missingDocId);
            localDoc.reject(new Error(`document ${localDoc.docId} not found on the server`));
            return;
        }

        localDoc = ot.document(remoteDocument.docId);
        ot.registerDocument(remoteDocument.docId, remoteDocument);
        localDoc.resolve(localDoc);
    };

    // eslint-disable-next-line func-names
    const handleRejectedOpList = function(opList) {
        clearTimeout(timeoutHandlers[opList.id]);
        delete timeoutHandlers[opList.id];
    };

    // eslint-disable-next-line func-names
    const handleAcceptedOpList = function(opList) {
        ot.setVersion(opList.version + 1);
        clearTimeout(timeoutHandlers[opList.id]);
        delete timeoutHandlers[opList.id];
        awaitAck.resolve(opList);
        awaitAck = null;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        handleQueuedOpLists();
    };

    // eslint-disable-next-line func-names
    const handleAcceptedOfflineEdits = function(version) {
        ot.setVersion(version + 1);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        sendEvent('accepted-offline-edits');
    };

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const handleBroadcast = (payload) => sendEvent('broadcast', payload);

    // eslint-disable-next-line func-names
    const handleQueuedOpLists = function() {
        if (!awaitAck && pending.opList.ops.length > 0) {
            awaitAck = pending;
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            resetPending();
        }

        if (awaitAck) {
            awaitAck.opList.id = randomId();
            awaitAck.opList.version = ot.version();
            const sent = sendOpList(awaitAck.opList);
            if (sent) {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                timeoutHandlers[awaitAck.opList.id] = setTimeout(ackTimeout(awaitAck.opList), 5000);
            }
        }
    };

    // eslint-disable-next-line func-names
    const resetPending = function() {
        pending = {
            opList: {
                ops: [],
            },
        };
        // eslint-disable-next-line func-names
        const promise = new Promise(function(resolve, reject) {
            pending.resolve = resolve;
            pending.reject = reject;
        });
        pending.promise = promise;
    };

    const ackTimeout = (opList) =>
        // eslint-disable-next-line func-names
        function() {
            delete timeoutHandlers[opList.id];
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            self.ws.refresh();
        };
    // update both the remote op list and the local op lists
    // eslint-disable-next-line func-names
    const updateOpLists = function(remoteOpList) {
        if (awaitAck) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            self.updateOps(awaitAck.opList.ops, remoteOpList.ops);
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        self.updateOps(pending.opList.ops, remoteOpList.ops);
    };

    const requestMasterState = () =>
        send({
            type: 'master-state',
            clientId,
            lastSync: /* istanbul ignore next */ ot != null ? ot.lastSync() : undefined,
            registeredDocIds: /* istanbul ignore next */ ot != null ? ot.registeredDocIds() : undefined,
            force: true,
        });
    const sendEvent = (type, data = null) => Array.from(eventListeners.values()).map((fn) => fn(type, data));
    // eslint-disable-next-line func-names
    const nameConflictHandler = function(opList) {
        ot.apply(opList);
        sendEvent('oplist', opList);
    };

    const self = {
        ws: new ReconnectingWebSocket(undefined, null, {
            automaticOpen: false,
            timeoutInterval: 15000,
            reconnectInterval: 1000,
            maxReconnectInterval: 5000,
        }),

        handleEvent(event) {
            // eslint-disable-next-line default-case
            switch (event.type) {
                case 'open':
                    requestMasterState();
                    break;
                case 'message':
                    // eslint-disable-next-line no-case-declarations
                    const msg = JSON.parse(event.data); // TODO: don't reassign things changing their types.
                    // eslint-disable-next-line default-case
                    switch (msg.type) {
                        case 'master-state':
                            handleMasterState(msg.state);
                            break;
                        case 'master-state-update':
                            handleMasterStateUpdate(msg.opLists);
                            break;
                        case 'master-oplist':
                            handleMasterOpList(msg.opList);
                            break;
                        case 'register-document':
                            handleRegisterDocument(msg);
                            break;
                        case 'rejected-oplist':
                            handleRejectedOpList(msg.opList);
                            break;
                        case 'accepted-oplist':
                            handleAcceptedOpList(msg.opList);
                            break;
                        case 'accepted-offline-edits':
                            handleAcceptedOfflineEdits(msg.version);
                            break;
                        case 'broadcast':
                            handleBroadcast(msg.payload);
                            break;
                        case 'lint-results':
                            application.updateBackendLintingResults(msg.filePath, msg.results);
                            break;
                        case 'error':
                            if (msg.errorCode === 'OWNER_NOT_IN_GOOD_STANDING') {
                                application.ownerNotInGoodStandingOverlayVisible(true);
                            } else if (msg.errorCode === 'UPTIME_LIMITS_EXCEEDED') {
                                application.uptimeLimitsExceededOverlayVisible(true);
                            } else if (msg.errorCode === 'ANONYMOUS_PROJECT_DELETED') {
                                application.anonymousProjectDeletedOverlayVisible(true);
                            } else if (msg.errorCode === 'GLITCH_SUBSCRIPTION_REQUIRED') {
                                application.glitchSubscriptionRequiredOverlayVisible(true);
                            }
                            self.ws.close(3000);
                            break;
                    }
                    if (msg.canBroadcast != null) {
                        sendEvent('can-broadcast', msg.canBroadcast);
                    }
                    break;
                case 'close':
                    self.ws.isOpen = false;
                    // eslint-disable-next-line guard-for-in
                    for (const id in timeoutHandlers) {
                        const handler = timeoutHandlers[id];
                        clearTimeout(handler);
                        delete timeoutHandlers[id];
                    }
                    sendEvent('connected', self.ws.isOpen);
                    break;
            }
        },

        connect(serverUrl) {
            return new Promise((resolve, reject) => {
                application.notifyConnectionNotEstablished(false);
                application.notifyGenericError(false);
                self.ws.setURL(serverUrl);
                let retries = 3;
                if (self.ws.isOpen) {
                    self.ws.refresh();
                } else {
                    self.ws.open();
                    self.ws.onclose = (event) => {
                        if (event.code !== 1000) {
                            // Error code 1000 means that the connection was closed normally, so we just let the reconnecting websocket do its thing

                            if (
                                event.code === 3000 ||
                                application.uptimeLimitsExceededOverlayVisible() ||
                                application.anonymousProjectDeletedOverlayVisible() ||
                                application.glitchSubscriptionRequiredOverlayVisible()
                            ) {
                                // Error code 3000 indicates a close event after which we shouldn't try to reconnect.
                                // The reconnecting websocket library that we use drops the code (https://github.com/joewalnes/reconnecting-websocket/issues/75),
                                //  so for now we'll also look at whether these error overlays are present.
                                return;
                            }

                            if (!navigator.onLine) {
                                application.notifyGenericError({
                                    message: 'You are offline. Please connect to the Internet and try again.'
                                });
                            }
                        }
                        self.handleEvent(event);
                    };
                    self.ws.onopen = (event) => {
                        self.handleEvent(event);
                    };
                    self.ws.onerror = () => {
                        retries -= 1;
                        if (retries <= 0) {
                            captureException(new Error('Connection Error'), {
                                tags: {
                                    errorType: 'connectionError'
                                }
                            });
                            application.notifyConnectionNotEstablished(true);
                            self.ws.close();
                            reject();
                        }
                    };
                    self.ws.onmessage = (event) => {
                        if (JSON.parse(event.data).type === 'master-state') {
                            resolve();
                        }
                        retries = 3;
                        self.handleEvent(event);
                    };
                }
            });
        },

        disconnect() {
            self.ws.close();
        },

        clientId() {
            return clientId;
        },

        /**
         * Returns OT instance
         */
        ot() {
            return ot;
        },

        isConnected() {
            return self.ws.isOpen;
        },

        sendOps(ops) {
            let promise;
            const opList = {
                id: randomId(),
                version: ot.version(),
                ops: JSON.parse(JSON.stringify(ops)),
            };

            ot.apply(opList, {
                registerOnAdd: true
            });
            // we notify the client that new ops have been applied, so the collapsed filetree can be re-rendered if folders are enabled
            if (opList.ops.some((op) => ['add', 'rename', 'unlink'].includes(op.type))) {
                sendEvent('filetree-updated');
            }

            // When we send offline edits, we'll want to have the right paths around, so keep
            // the modified ops in awaitAck and pending.  Don't need content, though.
            opList.ops.forEach((op) => delete op.content);
            const extendedOpList = {
                id: opList.id,
                version: opList.version,
                ops: opList.ops,
            };

            // the ops we send to the server should not have the info added by apply
            opList.ops = ops;

            if (!awaitAck) {
                awaitAck = {};
                // eslint-disable-next-line func-names
                promise = new Promise(function(resolve, reject) {
                    awaitAck.resolve = resolve;
                    // eslint-disable-next-line no-return-assign
                    return (awaitAck.reject = reject);
                });
                awaitAck.promise = promise;
                awaitAck.opList = extendedOpList;

                const sent = sendOpList(opList);
                if (sent) {
                    timeoutHandlers[opList.id] = setTimeout(ackTimeout(opList), 5000);
                }

                return promise;
                // eslint-disable-next-line no-else-return
            } else {
                pending.opList.ops = pending.opList.ops.concat(extendedOpList.ops);

                return pending.promise;
            }
        },

        sendBroadcast(payload) {
            return send({
                type: 'broadcast',
                payload,
            });
        },

        document(docId) {
            const doc = ot.document(docId);
            if (doc != null ? doc.promise : undefined) {
                return doc.promise;
            }

            // eslint-disable-next-line consistent-return, func-names
            const promise = new Promise(function(resolve, reject) {
                if (!doc) {
                    // TODO this shouldn't be needed, but it is here to fix it twice: case 3315940
                    application.projectMachine.send({
                        type: 'CONNECT_TO_PROJECT',
                        data: {
                            domain: application ? .currentProject() ? .domain()
                        }
                    });
                    return reject(new Error(`document ${docId} not found`));
                }

                doc.resolve = resolve;
                doc.reject = reject;
                const sent = send({
                    type: 'register-document',
                    docId,
                });
                if (!sent) {
                    return reject(new Error('connection is closed, retry'));
                }
            });

            if (doc != null) {
                doc.promise = promise;
            }
            return promise;
        },

        async documentByPath(path) {
            const doc = ot.documentByPath(path);
            if (!doc) {
                throw new Error(`document ${path} not found`);
            }
            // eslint-disable-next-line no-return-await
            return await self.document(doc.docId);
        },

        documentImmediate(docId) {
            return ot.document(docId);
        },

        documentByPathImmediate(path) {
            return ot.documentByPath(path);
        },

        idToPath(docId) {
            return ot.idToPath(docId);
        },

        updateOps(localOps, remoteOps) {
            return localOps.map((localOp) => remoteOps.map((remoteOp) => ot.updateOp(localOp, remoteOp, nameConflictHandler)));
        },

        addEventListener(owner, fn) {
            return eventListeners.set(owner, fn);
        },

        removeEventListener(owner) {
            return eventListeners.delete(owner);
        },

        awaitAck() {
            return awaitAck;
        },
        pending() {
            return pending;
        },
        timeoutHandlers() {
            return timeoutHandlers;
        },
        opListsReceivedDuringRewind() {
            return opListsReceivedDuringRewind;
        },
    };

    return self;
};