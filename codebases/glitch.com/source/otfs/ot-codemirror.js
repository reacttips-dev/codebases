/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
    default: CodeMirror
} = require('../codemirror');

// eslint-disable-next-line func-names
module.exports = function({
    application,
    editor,
    otClient,
    randomId
}) {
    let self;
    if (randomId == null) {
        // eslint-disable-next-line global-require
        ({
            randomId
        } = require('../util'));
    }
    const noDoc = CodeMirror.Doc('');

    const UNDO_LIMIT = 500;
    let isReadOnly = false;

    const cmDocuments = {};

    let ignoreNextChanges = false;
    let changeInProgress = false;

    let sendOpsPromise = Promise.resolve();
    let lastSelectionSent = {};

    let broadcastTimer = null;
    const remoteSelections = {};

    // eslint-disable-next-line func-names
    const otOpsToCMChanges = function(cmDoc, ops, origin = '') {
        let operation;
        if (cmDoc.getEditor()) {
            ignoreNextChanges = true;
        }

        if (cmDoc.getEditor()) {
            operation = cmDoc.getEditor().operation.bind(cmDoc.getEditor());
        } else {
            operation = (cb) => cb();
        }

        return operation(() =>
            (() => {
                const result = [];
                // eslint-disable-next-line prefer-const
                for (let op of ops) {
                    // eslint-disable-next-line no-var, one-var, vars-on-top
                    var endPos, startPos;
                    if (op.type === 'insert' || op.type === 'remove') {
                        startPos = cmDoc.posFromIndex(op.position);
                        endPos = cmDoc.posFromIndex(op.position + op.text.length);
                    }
                    switch (op.type) {
                        case 'insert':
                            result.push(cmDoc.replaceRange(op.text, startPos, startPos, origin));
                            break;
                        case 'remove':
                            result.push(cmDoc.replaceRange('', startPos, endPos, origin));
                            break;
                        case 'unlink':
                            result.push(self.close(cmDoc.docId));
                            break;
                            /* istanbul ignore next */
                        default:
                            result.push(undefined);
                    }
                }
                return result;
            })(),
        );
    };

    // eslint-disable-next-line func-names
    const handleOpList = function(opList) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const opsByDocId = splitOps(opList.ops);
        // eslint-disable-next-line guard-for-in, prefer-const
        for (let docId in opsByDocId) {
            const ops = opsByDocId[docId];
            otOpsToCMChanges(cmDocuments[docId], ops);
            // if one of the ops is "unlink", we don't have it any more
            if (cmDocuments[docId]) {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                updateHistoryStack(cmDocuments[docId].undoStack, JSON.parse(JSON.stringify(ops)));
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                updateHistoryStack(cmDocuments[docId].redoStack, ops);
            }
        }
        return sendOpsPromise.then(self.renderRemoteSelections);
    };

    // eslint-disable-next-line vars-on-top, no-var, func-names
    var updateHistoryStack = function(stack, remoteOps) {
        if (!stack) {
            return;
        }
        // eslint-disable-next-line consistent-return
        return stack.map((localOps) => otClient.updateOps(localOps, remoteOps));
    };

    // eslint-disable-next-line vars-on-top, no-var, func-names
    var splitOps = function(ops) {
        const usefulOpTypes = ['insert', 'remove', 'unlink'];

        const opsByDocId = {};

        // eslint-disable-next-line prefer-const
        for (let op of ops) {
            if (op.clientId) {
                // eslint-disable-next-line no-continue
                continue;
            }

            if (!cmDocuments[op.docId]) {
                // eslint-disable-next-line no-continue
                continue;
            }

            if (usefulOpTypes.indexOf(op.type) < 0) {
                // eslint-disable-next-line no-continue
                continue;
            }

            if ((op.type === 'insert' || op.type === 'remove') && op.text.length === 0) {
                // eslint-disable-next-line no-continue
                continue;
            }

            if (!opsByDocId[op.docId]) {
                opsByDocId[op.docId] = [];
            }
            opsByDocId[op.docId].push(op);
        }

        return opsByDocId;
    };

    // eslint-disable-next-line no-unused-vars
    const handleNewState = (state) => self.close();

    // eslint-disable-next-line func-names
    const updateRemoteUserLastCursor = function(remoteUser, selection) {
        /* istanbul ignore next */
        if (!remoteUser ||
            (!remoteUser.readOnly &&
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                !!__guard__(remoteUser.lastCursor(), (x) => x.clientId) &&
                remoteUser.lastCursor().clientId !== selection.clientId)
        ) {
            return;
        }

        if (selection.selection) {
            // eslint-disable-next-line consistent-return
            return remoteUser.lastCursor({
                documentId: selection.selection.docId,
                cursor: selection.selection.cursor,
                clientId: selection.clientId,
            });
            // eslint-disable-next-line no-else-return
        } else {
            // eslint-disable-next-line consistent-return
            return remoteUser.lastCursor(null);
        }
    };

    // eslint-disable-next-line func-names
    const handleBroadcast = function({
        selection
    }) {
        if (selection) {
            const remoteUser = application.remoteUserByClientId(selection.clientId);

            if (selection.selection) {
                if (!remoteSelections[selection.clientId]) {
                    remoteSelections[selection.clientId] = {};
                }
                remoteSelections[selection.clientId].selection = selection.selection;
            } else {
                /* istanbul ignore next */
                if (remoteSelections[selection.clientId] != null ? remoteSelections[selection.clientId].marker : undefined) {
                    remoteSelections[selection.clientId].marker.clear();
                }
                delete remoteSelections[selection.clientId];
            }

            updateRemoteUserLastCursor(remoteUser, selection);

            sendOpsPromise.then(self.renderRemoteSelections);
        }
    };

    // eslint-disable-next-line func-names, no-shadow
    const handleCMChanges = function(editor, changes) {
        if (application.editorIsPreviewingRewind()) {
            return;
        }

        if (!ignoreNextChanges) {
            let base;

            const [ops, inverseOps] = Array.from(self.cmChangesToOps(editor.getDoc(), changes));
            sendOpsPromise = otClient.sendOps(ops);
            /* istanbul ignore else */
            // eslint-disable-next-line no-cond-assign
            if ((base = editor.getDoc()).undoStack == null) {
                base.undoStack = [];
            }
            self.addOpsToStack(editor.getDoc().undoStack, inverseOps, UNDO_LIMIT);
            editor.getDoc().redoStack = [];
        }

        ignoreNextChanges = false;
        changeInProgress = false;
        // eslint-disable-next-line consistent-return, @typescript-eslint/no-use-before-define
        return handleCMCursorActivity();
    };

    // eslint-disable-next-line func-names
    const evaluateInverseOps = function(ops) {
        const inverseOps = [];
        // eslint-disable-next-line prefer-const
        for (let op of ops) {
            inverseOps.unshift({
                docId: op.docId,
                text: op.text,
                position: op.position,
                type: op.type === 'insert' ? 'remove' : 'insert',
            });
        }
        return inverseOps;
    };

    // eslint-disable-next-line func-names
    const updateCursorAfterHistoryChange = function(cmDoc, ...rest) {
        // eslint-disable-next-line one-var
        const array = rest[0],
            lastOp = array[array.length - 1];
        if (lastOp.type === 'insert') {
            cmDoc.setCursor(cmDoc.posFromIndex(lastOp.position + lastOp.text.length));
        } else {
            cmDoc.setCursor(cmDoc.posFromIndex(lastOp.position));
        }
        return editor.scrollIntoView(null, 200);
    };

    // eslint-disable-next-line func-names
    const remoteCursorWidget = function(color, focus) {
        const container = document.createElement('div');
        container.style.display = 'inline-block';
        // eslint-disable-next-line no-multi-assign
        container.style.width = container.style.height = 0;

        const cursor = document.createElement('div');
        cursor.style.position = 'relative';
        cursor.style.top = `-${editor.defaultTextHeight() * 0.75}px`;
        cursor.style.left = '-1px';
        cursor.style.width = '2px';
        cursor.style.height = `${editor.defaultTextHeight()}px`;
        cursor.style.backgroundColor = color;
        if (!focus) {
            cursor.style.filter = 'grayscale(50%)';
        }

        container.appendChild(cursor);
        return container;
    };

    // "cursorActivity" is sent before "changes", but after "change", this is why we flag
    // if there is a change in progress, then in handleCMChanges we call
    // handleCMCursorActivity manually (with the updated selection!)
    // eslint-disable-next-line func-names, consistent-return
    const handleCMChange = function() {
        if (!application.editorIsPreviewingRewind()) {
            // eslint-disable-next-line no-return-assign
            return (changeInProgress = true);
        }
    };

    // eslint-disable-next-line vars-on-top, no-var, consistent-return, func-names
    var handleCMCursorActivity = function() {
        application.updateCurrentPositionState();
        if (!changeInProgress) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return debounce(self.broadcastSelection, 100);
        }
    };

    // Please notice: you can only debounce 1 function in this way.
    let debouncingHandler = null;
    // eslint-disable-next-line vars-on-top, no-var, func-names
    var debounce = function(fn, timeout) {
        if (debouncingHandler) {
            clearTimeout(debouncingHandler);
        }
        // eslint-disable-next-line no-return-assign
        return (debouncingHandler = setTimeout(fn, timeout));
    };

    // eslint-disable-next-line no-return-assign
    return (self = {
        connect() {
            CodeMirror.commands.undo = self.undo;
            CodeMirror.commands.redo = self.redo;
            editor.on('change', handleCMChange);
            editor.on('changes', handleCMChanges);
            editor.on('cursorActivity', handleCMCursorActivity);
            otClient.addEventListener(self, self.handleOTEvent);
            editor.swapDoc(noDoc);
            editor.setOption('readOnly', true);

            /* istanbul ignore next */
            // eslint-disable-next-line no-return-assign
            return (broadcastTimer = setInterval(() => self.broadcastSelection({
                force: true
            }), 15000));
        },

        disconnect() {
            editor.off('change', handleCMChange);
            editor.off('changes', handleCMChanges);
            editor.off('cursorActivity', handleCMCursorActivity);
            otClient.removeEventListener(self);
            clearInterval(broadcastTimer);

            editor.swapDoc(noDoc);
            return editor.setOption('readOnly', true);
        },

        // Walks a path, creating ops for any dirs that are missing, and
        // returns the add ops for those dirs, and the id of the leaf dir
        createPathOps(path) {
            const ops = [];
            let parent = otClient.documentByPathImmediate('.');
            let parentId = parent.docId;

            // eslint-disable-next-line func-names
            path.forEach(function(segment) {
                let childId;
                // eslint-disable-next-line no-cond-assign
                if (parent && (childId = parent.children[segment])) {
                    // Walking existing dirs
                    parent = otClient.documentImmediate(childId);
                    // eslint-disable-next-line no-return-assign
                    return (parentId = parent.docId);
                    // eslint-disable-next-line no-else-return
                } else {
                    // Creating new dirs
                    const newDirId = randomId();
                    ops.push({
                        type: 'add',
                        name: segment,
                        docId: newDirId,
                        docType: 'directory',
                        parentId,
                    });

                    parent = null;
                    // eslint-disable-next-line no-return-assign
                    return (parentId = newDirId);
                }
            });

            const leafId = parent ? parent.docId : parentId;

            return {
                ops,
                leafId,
            };
        },

        createFile(file) {
            const cmDoc = CodeMirror.Doc('');
            cmDoc.docId = file.id();
            cmDocuments[file.id()] = cmDoc;

            const path = file.path().split('/');
            const filename = path.pop();
            const {
                ops,
                leafId
            } = self.createPathOps(path);

            ops.push({
                type: 'add',
                name: filename,
                docId: file.id(),
                docType: 'file',
                parentId: leafId,
            });

            return otClient.sendOps(ops);
        },

        deleteFile(file) {
            return otClient.sendOps([{
                type: 'unlink',
                docId: file.id(),
            }, ]);
        },

        deleteFolder(folderId) {
            return otClient.sendOps([{
                type: 'unlink',
                docId: folderId,
            }, ]);
        },

        renameFile(file) {
            const path = file.path().split('/');
            const filename = path.pop();
            const {
                ops,
                leafId
            } = self.createPathOps(path);

            ops.push({
                type: 'rename',
                docId: file.id(),
                newName: filename,
                newParentId: leafId,
            });

            return otClient.sendOps(ops);
        },

        renameFolder(folderId, newName) {
            const folder = otClient.documentImmediate(folderId);
            return otClient.sendOps([{
                type: 'rename',
                docId: folderId,
                // eslint-disable-next-line object-shorthand
                newName: newName,
                newParentId: folder.parentId,
            }, ]);
        },

        getCMDoc(docId) {
            let cmDoc;
            if (cmDocuments[docId]) {
                // eslint-disable-next-line no-return-assign
                return (cmDoc = cmDocuments[docId]);
                // eslint-disable-next-line no-else-return
            } else {
                if (!otClient.ot().isRegistered(docId)) {
                    throw new Error(`document ${docId} not registered`);
                }

                const doc = otClient.ot().document(docId);
                cmDoc = CodeMirror.Doc(doc.content);
                cmDoc.docId = docId;
                // eslint-disable-next-line no-return-assign
                return (cmDocuments[docId] = cmDoc);
            }
        },

        open(docId) {
            const cmDoc = self.getCMDoc(docId);

            editor.swapDoc(cmDoc);
            editor.setOption('readOnly', isReadOnly);
            // Don't send focus back to the editor if the logs panel is focused right now
            if (!application.editorIsEmbedded() && !(document.activeElement === document.querySelector('.console-frame'))) {
                editor.focus();
            }
            self.renderRemoteSelections();
            self.broadcastSelection({
                force: true
            });

            return cmDoc;
        },

        close(docId) {
            if (docId == null) {
                ({
                    docId
                } = editor.getDoc());
            }
            if (!cmDocuments[docId]) {
                return;
            }

            const cmDoc = cmDocuments[docId];
            delete cmDocuments[docId];

            // is it the current document?
            if (cmDoc.getEditor()) {
                editor.swapDoc(noDoc);
                // eslint-disable-next-line consistent-return
                return editor.setOption('readOnly', true);
            }
        },

        // eslint-disable-next-line consistent-return
        handleOTEvent(type, data) {
            // eslint-disable-next-line default-case
            switch (type) {
                case 'oplist':
                    return handleOpList(data);
                case 'new-state':
                    return handleNewState(data);
                case 'broadcast':
                    return handleBroadcast(data);
            }
        },

        // TODO compare selections in a clever way!
        selectionAlreadySent(selection) {
            if ((selection && !lastSelectionSent) || (!selection && lastSelectionSent)) {
                return false;
            }

            return (
                lastSelectionSent.docId === selection.docId &&
                lastSelectionSent.startIndex === selection.startIndex &&
                lastSelectionSent.endIndex === selection.endIndex
            );
        },

        broadcastSelection({
            force
        } = {}) {
            if (!otClient.ot() || !application.canBroadcast()) {
                return undefined;
            }

            if (typeof sendOpsPromise.then === 'function') {
                // eslint-disable-next-line func-names
                return sendOpsPromise.then(function() {
                    let selection;
                    const currentUser = application.currentUser();
                    const doc = editor.getDoc();

                    if (doc === noDoc) {
                        selection = null;
                        currentUser.lastCursor(null);
                    } else {
                        // eslint-disable-next-line one-var
                        let endIndex, startIndex;
                        const range = editor.listSelections()[0];
                        const anchorIndex = editor.indexFromPos(range.anchor);
                        const headIndex = editor.indexFromPos(range.head);
                        if (anchorIndex <= headIndex) {
                            [startIndex, endIndex] = Array.from([anchorIndex, headIndex]);
                        } else {
                            [startIndex, endIndex] = Array.from([headIndex, anchorIndex]);
                        }

                        const cursor = doc.posFromIndex(startIndex);
                        selection = {
                            docId: doc.docId,
                            startIndex,
                            endIndex,
                            cursor,
                            version: otClient.ot().version(),
                            color: /* istanbul ignore next */ typeof currentUser.color === 'function' ? currentUser.color() : undefined,
                            focus: document.hasFocus(),
                            readOnly: application.projectIsReadOnlyForCurrentUser(),
                        };

                        currentUser.lastCursor({
                            cursor,
                            documentId: doc.docId,
                            clientId: otClient.clientId(),
                        });

                        if (!force && self.selectionAlreadySent(selection)) {
                            return;
                        }
                    }

                    lastSelectionSent = selection;
                    // eslint-disable-next-line consistent-return
                    return otClient.sendBroadcast({
                        selection: {
                            clientId: otClient.clientId(),
                            userId: application.currentUser().id(),
                            selection,
                        },
                    });
                });
            }
            return undefined;
        },

        renderRemoteSelections() {
            return (() => {
                const result = [];
                // eslint-disable-next-line guard-for-in, prefer-const
                for (let clientId in remoteSelections) {
                    // eslint-disable-next-line no-var, vars-on-top
                    var options;
                    const sel = remoteSelections[clientId];
                    const {
                        marker,
                        selection
                    } = sel;
                    // Don't render selection from outdated clients, nor readonly users
                    if (selection.version !== otClient.ot().version() || selection.readOnly) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }

                    // TODO optimize
                    if (marker != null) {
                        marker.clear();
                    }

                    if (!cmDocuments[selection.docId]) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }

                    const cmDoc = cmDocuments[selection.docId];

                    if (selection.startIndex === selection.endIndex) {
                        options = {
                            inclusiveRight: true,
                            clearWhenEmpty: false,
                            replacedWith: remoteCursorWidget(selection.color, selection.focus),
                        };
                    } else {
                        options = {
                            // eslint-disable-next-line spaced-comment
                            css: `background-color: ${selection.color}`, //; height: 20px; display: inline-block"
                            inclusiveRight: true,
                        };
                    }
                    // TODO replace with class
                    // unless selection.focus
                    //   options.css += "; filter: grayscale(50%)"

                    const [startPos, endPos] = Array.from([cmDoc.posFromIndex(selection.startIndex), cmDoc.posFromIndex(selection.endIndex)]);
                    result.push((sel.marker = cmDoc.markText(startPos, endPos, options)));
                }
                return result;
            })();
        },

        cmChangesToOps(cmDoc, changes) {
            // taken from ot.js and ported to CoffeeScript

            // Approach: Replay the changes, beginning with the most recent one, and
            // construct the operation and its inverse. We have to convert the position
            // in the pre-change coordinate system to an index. We have a method to
            // convert a position in the coordinate system after all changes to an index,
            // namely CodeMirror's `indexFromPos` method. We can use the information of
            // a single change object to convert a post-change coordinate system to a
            // pre-change coordinate system. We can now proceed inductively to get a
            // pre-change coordinate system for all changes in the linked list.
            // A disadvantage of this approach is its complexity `O(n^2)` in the length
            // of the list of changes.

            const ops = [];
            const inverseOps = [];

            let indexFromPos = (pos) => cmDoc.indexFromPos(pos);

            const last = (arr) => arr[arr.length - 1];

            // eslint-disable-next-line func-names
            const sumLengths = function(strArr) {
                if (strArr.length === 0) {
                    return 0;
                }

                let sum = 0;
                // eslint-disable-next-line prefer-const
                for (let str of strArr) {
                    sum += str.length;
                }
                return sum + strArr.length - 1;
            };

            // eslint-disable-next-line func-names
            const cmpPos = function(a, b) {
                if (a.line < b.line) {
                    return -1;
                }
                if (a.line > b.line) {
                    return 1;
                }
                if (a.ch < b.ch) {
                    return -1;
                }
                if (a.ch > b.ch) {
                    return 1;
                }
                return 0;
            };

            const posLe = (a, b) => cmpPos(a, b) <= 0;

            // eslint-disable-next-line no-shadow
            const updateIndexFromPos = (indexFromPos, change) =>
                // eslint-disable-next-line func-names
                function(pos) {
                    let ch;
                    if (posLe(pos, change.from)) {
                        return indexFromPos(pos);
                    }
                    if (posLe(change.to, pos)) {
                        if (change.to.line < pos.line) {
                            ({
                                ch
                            } = pos);
                        } else if (change.text.length <= 1) {
                            ch = pos.ch - (change.to.ch - change.from.ch) + sumLengths(change.text);
                        } else {
                            ch = pos.ch - change.to.ch + last(change.text).length;
                        }
                        return (
                            indexFromPos({
                                line: pos.line + change.text.length - 1 - (change.to.line - change.from.line),
                                ch,
                            }) +
                            sumLengths(change.removed) -
                            sumLengths(change.text)
                        );
                    }

                    if (change.from.line === pos.line) {
                        return indexFromPos(change.from) + pos.ch - change.from.ch;
                    }

                    return indexFromPos(change.from) + sumLengths(change.removed.slice(0, pos.line - change.from.line)) + 1 + pos.ch;
                };
            // eslint-disable-next-line no-plusplus
            for (let i = changes.length - 1; i >= 0; i--) {
                const change = changes[i];
                indexFromPos = updateIndexFromPos(indexFromPos, change);

                const fromIndex = indexFromPos(change.from);
                const insertedText = change.text.join('\n');
                const removedText = change.removed.join('\n');

                if (insertedText.length > 0) {
                    ops.unshift({
                        docId: cmDoc.docId,
                        type: 'insert',
                        text: insertedText,
                        position: fromIndex,
                    });

                    inverseOps.push({
                        docId: cmDoc.docId,
                        type: 'remove',
                        text: insertedText,
                        position: fromIndex,
                    });
                }

                // do remove op and inverse remove op
                if (removedText.length > 0) {
                    ops.unshift({
                        docId: cmDoc.docId,
                        type: 'remove',
                        text: removedText,
                        position: fromIndex,
                    });

                    inverseOps.push({
                        docId: cmDoc.docId,
                        type: 'insert',
                        text: removedText,
                        position: fromIndex,
                    });
                }
            }

            return [ops, inverseOps];
        },

        // eslint-disable-next-line consistent-return
        addOpsToStack(stack, inverseOps, limit) {
            const fullOps = inverseOps.concat(stack[0]);
            if (stack.length > 0 && self.continuousOps(fullOps)) {
                stack[0] = fullOps;
            } else {
                stack.unshift(inverseOps);
            }

            if (limit && stack.length > limit) {
                return stack.splice(limit);
            }
        },

        continuousOps(ops) {
            const firstOp = ops[0];
            const isSpace = ops[0].text.match(/\s/);
            const firstType = ops[0].type;
            let lastPos = ops[0].position;
            // eslint-disable-next-line prefer-const
            for (let op of ops) {
                if (op !== firstOp) {
                    if (op.type === 'remove' && op.position + op.text.length !== lastPos) {
                        return false;
                    }
                    if (op.type === 'insert' && op.position - op.text.length !== lastPos) {
                        return false;
                    }
                    lastPos = op.position;
                }
                if (op.type !== firstType) {
                    return false;
                }
                if (op.text.length > 1) {
                    return false;
                }
                if (isSpace && !op.text.match(/\s/)) {
                    return false;
                }
                if (!isSpace && op.text.match(/\s/)) {
                    return false;
                }
            }
            return true;
        },

        setReadOnly(readOnly) {
            // eslint-disable-next-line no-return-assign
            return (isReadOnly = readOnly);
        },

        undo() {
            const cmDoc = editor.getDoc();
            if (!((cmDoc.undoStack != null ? cmDoc.undoStack.length : undefined) > 0)) {
                return;
            }
            const undoOps = cmDoc.undoStack.shift();
            otOpsToCMChanges(cmDoc, undoOps, '+input');
            updateCursorAfterHistoryChange(cmDoc, undoOps);
            cmDoc.redoStack.unshift(evaluateInverseOps(undoOps));
            // eslint-disable-next-line no-return-assign, consistent-return
            return (sendOpsPromise = otClient.sendOps(undoOps));
        },

        redo() {
            const cmDoc = editor.getDoc();
            if (!((cmDoc.redoStack != null ? cmDoc.redoStack.length : undefined) > 0)) {
                return;
            }
            const redoOps = cmDoc.redoStack.shift();
            otOpsToCMChanges(cmDoc, redoOps, '+input');
            updateCursorAfterHistoryChange(cmDoc, redoOps);
            cmDoc.undoStack.unshift(evaluateInverseOps(redoOps));
            // eslint-disable-next-line consistent-return, no-return-assign
            return (sendOpsPromise = otClient.sendOps(redoOps));
        },

        cmDocuments() {
            return cmDocuments;
        },
        remoteSelections() {
            return remoteSelections;
        },
    });
};

// eslint-disable-next-line no-underscore-dangle
function __guard__(value, transform) {
    return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}