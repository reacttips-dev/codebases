/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const throttle = require('lodash/throttle');

const {
    default: CodeMirror,
    MODE_CONFIG
} = require('../codemirror');
const {
    ASSET_FILE_PATH
} = require('../const');

// eslint-disable-next-line func-names
module.exports = function(I, self) {
    I = I || /* istanbul ignore next */ {};
    // eslint-disable-next-line global-require
    const JSDiff = self.JSDiff || require('diff');
    // eslint-disable-next-line global-require
    const DiffTool = self.DiffTool || require('../utils/diff-tool')();

    const LINT_OPTIONS = {
        'known-properties': true,
        'empty-rules': true,
        'duplicate-properties': true,
        'display-property-grouping': true,
    };

    let linesRemovedByRewind = [];

    const defaultLineNumberFormatter = (n) => n;

    // eslint-disable-next-line func-names
    const rewindLineNumberFormatter = function(index) {
        const zeroBasedIndex = index - 1;

        let numLower = 0;

        for (const removedRange of linesRemovedByRewind) {
            if (zeroBasedIndex < removedRange.start) {
                break;
            }

            if (removedRange.start <= zeroBasedIndex && zeroBasedIndex <= removedRange.end) {
                break;
            }

            numLower += removedRange.end - removedRange.start + 1;
        }

        return index - numLower;
    };

    /* istanbul ignore next */
    // eslint-disable-next-line func-names, consistent-return
    const isSmallDevice = function() {
        if ((self.isIOS || self.isAndroid) && window.innerWidth < 415) {
            return true;
        }
    };

    /* istanbul ignore next */
    // eslint-disable-next-line func-names
    const conditionalGutters = function() {
        if (isSmallDevice()) {
            return ['CodeMirror-lint-markers'];
            // eslint-disable-next-line no-else-return
        } else {
            return ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'];
        }
    };

    const options = {
        tabSize: 2,
        indentUnit: 2,
        foldGutter: true,
        highlightSelectionMatches: true,
        lint: LINT_OPTIONS,
        styleActiveLine: !self.isIOS,
        matchBrackets: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchTags: {
            bothTags: true,
        },
        keyMap: 'sublime',
        extraKeys: 'extraKeys',
        lineNumbers: !isSmallDevice(),
        gutters: conditionalGutters(),
    };

    const editorElement = document.createElement('article');
    editorElement.id = 'text-editor';
    editorElement.className = 'text-editor';
    editorElement.ontouchend = () => {
        self.closeAllPopOvers();
    };
    const editor = CodeMirror(editorElement, options);

    /* istanbul ignore next */
    editor.on('cursorActivity', throttle(() => self.onCursorActivity(), 200));
    // necessary to capture dragenter events in AssetDragToUpload.jsx
    editor.on('dragenter', (_, e) => e.preventDefault());

    /* istanbul ignore next */
    CodeMirror.commands.undo = () => editor.getDoc().undoHelper();
    /* istanbul ignore next */
    CodeMirror.commands.redo = () => editor.getDoc().redoHelper();

    /* istanbul ignore next */
    // eslint-disable-next-line func-names
    const optionKey = function() {
        if (self.isAppleDevice) {
            return 'Alt';
            // eslint-disable-next-line no-else-return
        } else {
            return 'Ctrl';
        }
    };

    /* istanbul ignore next */
    // eslint-disable-next-line func-names
    const specialKey = function() {
        if (self.isAppleDevice) {
            return 'Cmd';
            // eslint-disable-next-line no-else-return
        } else {
            return 'Ctrl';
        }
    };

    /* istanbul ignore next */
    // eslint-disable-next-line func-names
    const betterTab = function() {
        if (editor.somethingSelected()) {
            return editor.indentSelection('add');
            // eslint-disable-next-line no-else-return
        } else {
            return editor.replaceSelection(Array(editor.getOption('indentUnit') + 1).join(' '), 'end', '+input');
        }
    };

    /* istanbul ignore next */
    editor.setOption('extraKeys', {
        Tab: betterTab,

        [`${optionKey()}-Up`]() {
            return editor.execCommand('goLineStartSmart');
        },

        [`${optionKey()}-Down`]() {
            return editor.execCommand('goLineEnd');
        },

        'Ctrl-G': 'jumpToLine',

        [`${specialKey()}-F`]: 'findPersistent',

        [`${specialKey()}-G`]: 'findNext',
        [`Shift-${specialKey()}-G`]: 'findPrev',
    });

    self.extend({
        editorElement,

        editor() {
            return editor;
        },

        setReadOnly(value) {
            /* istanbul ignore next */
            return editor != null ? editor.setOption('readOnly', value) : undefined;
        },

        getCursor() {
            return editor.getCursor();
        },
        /**
         * @returns CodeMirror doc
         */
        getCurrentSession() {
            return editor.getDoc();
        },

        searchInputIsFocused() {
            return document.activeElement.id !== 'project-search-input';
        },

        setCurrentSession(file, {
            maintainScrollPosition
        } = {}) {
            let sessionPromise;
            CodeMirror.signal(editor, 'file-blur');
            if (self.editorIsPreviewingRewind()) {
                // eslint-disable-next-line func-names
                sessionPromise = file.diffSession.then(function(diffSession) {
                    const cursor = self.editor().getCursor();
                    const scrollInfo = self.editor().getScrollInfo();

                    editor.swapDoc(diffSession.content);

                    if (maintainScrollPosition) {
                        self.editor().scrollTo(scrollInfo.left, scrollInfo.top);
                        self.editor().setCursor(cursor.line, cursor.ch, {
                            scroll: false
                        });
                    }

                    const markLines = (lineRanges, className) =>
                        lineRanges.forEach((lineRange) =>
                            editor.markText({
                                line: lineRange.start,
                                ch: 0,
                            }, {
                                line: lineRange.end + 1,
                                ch: 0,
                            }, {
                                className
                            }, ),
                        );
                    markLines(diffSession.addedLines, 'diff-added-line');
                    markLines(diffSession.removedLines, 'diff-removed-line');
                    // eslint-disable-next-line no-return-assign
                    return (linesRemovedByRewind = diffSession.removedLines);
                });
            } else {
                self.otCodeMirror().open(file.id());
                sessionPromise = Promise.resolve();
            }

            CodeMirror.signal(editor, 'changeCursor'); // doesn't do anything?

            // eslint-disable-next-line func-names
            setTimeout(function() {
                if (!self.searchInputIsFocused() && !self.editorIsEmbedded()) {
                    self.focusEditor();
                }
            }, 0);

            /* istanbul ignore next */
            self.setReadOnly(
                self.editorIsPreviewingRewind() || self.projectIsReadOnlyForCurrentUser() || (self.editorIsEmbedded() && !self.embedEditingEnabled()),
            );

            const lintResults = self.backendLintingResults[file.path()];
            if (lintResults) {
                self.setLintResults(lintResults);
            }

            return sessionPromise.then(() => self.updateEditorModeForFile(file));
        },
        trackFileHelper(file, eventName, properties = {}) {
            if (!file) {
                return;
            }

            if (self.selectedFile().extension() === 'env') {
                if (self.dotenvViewVisible() === true) {
                    properties.editorType = 'gui';
                } else {
                    properties.editorType = 'plaintext';
                }
            }

            self.analytics.track(eventName, {
                ...properties,
                fileTotalLines: self.editor().lineCount(),
                fileId: file.id(),
                fileName: file.name(),
                fileType: self.selectedFile().extension(),
            });
        },
        lintingLoaded: false,
        performLint() {
            if (!self.lintingLoaded) {
                return;
            }
            // eslint-disable-next-line consistent-return
            return editor.performLint();
        },
        setLintResults(results) {
            return editor.setLintResults(results);
        },

        firstFocus: true,
        focusEditor() {
            if (self.firstFocus && self.editorIsEmbedded()) {
                self.firstFocus = false;
                return;
            }
            // eslint-disable-next-line consistent-return
            return editor.focus();
        },

        setEditorOption(option, value) {
            return editor.setOption(option, value);
        },

        refreshEditor() {
            const editorHelper = document.querySelector('.editor-wrap .editor-helper');
            const editorWrap = document.querySelector('.editor-wrap');

            if (editorWrap) {
                const editorRect = document.querySelector('.editor-wrap').getBoundingClientRect();
                let newEditorHeight = editorRect.height;
                let newEditorTop = editorRect.top;

                if (editorHelper) {
                    const editorHelperHeight = editorHelper.getBoundingClientRect().height;
                    newEditorHeight = editorRect.height - editorHelperHeight;
                    newEditorTop = editorRect.top + editorHelperHeight;
                }

                const documentStyle = document.documentElement.style;
                documentStyle.setProperty('--editor-top-position', `${newEditorTop}px`);
                documentStyle.setProperty('--editor-left-position', `${editorRect.left}px`);
                documentStyle.setProperty('--editor-width', `${editorRect.width}px`);
                documentStyle.setProperty('--editor-height', `${newEditorHeight}px`);

                editor.refresh();
            }
        },

        goToLine(lineNumber) {
            const position = {
                line: lineNumber,
                ch: 0,
            };

            const {
                top
            } = editor.charCoords(position, 'local');

            const middleHeight = editor.getScrollerElement().offsetHeight / 2;
            editor.scrollTo(null, top - middleHeight - 5);
            return editor.setSelection(position);
        },

        defaultLineNumberFormatter,
        rewindLineNumberFormatter,

        updateEditorModeForFile(file) {
            /* istanbul ignore next */
            if (!file ||
                ((typeof self.selectedFile === 'function' ? self.selectedFile() : undefined) &&
                    file !== (typeof self.selectedFile === 'function' ? self.selectedFile() : undefined))
            ) {
                return;
            }

            if (self.filesWithDiffTooBig().includes(file.path())) {
                editor.setOption('mode', 'text/plain');
                return;
            }

            if (file.name() !== ASSET_FILE_PATH) {
                const info = CodeMirror.findModeByFileName(file.name());
                if (info) {
                    const config = MODE_CONFIG[info.mode] || {};
                    editor.setOption('mode', { ...config,
                        name: info.mode
                    });
                    CodeMirror.autoLoadMode(editor, info.mode);

                    const lineNumberFormatter = self.editorIsPreviewingRewind() ? rewindLineNumberFormatter : defaultLineNumberFormatter;
                    editor.setOption('lineNumberFormatter', lineNumberFormatter);

                    const noLint =
                        self.editorIsPreviewingRewind() ||
                        file.extension() === 'less' ||
                        file.extension() === 'scss' ||
                        file.extension() === 'sass' ||
                        file.extension() === 'php' ||
                        file.extension() === 'ejs' ||
                        file.extension() === 'ts' ||
                        file.extension() === 'tsx' ||
                        info.mode === 'handlebars';
                    editor.setOption('lint', noLint ? false : LINT_OPTIONS);
                } else {
                    editor.setOption('mode', 'text/plain');
                }
            }

            if (file.path() === '.env') {
                editor.setOption('mode', 'text/x-dotenv');
                CodeMirror.autoLoadMode(editor, 'dotenv');
            }

            if (file.path() === '.eslintrc') {
                editor.setOption('mode', 'application/json');
                CodeMirror.autoLoadMode(editor, 'javascript');
            }

            if (file.path() === '.prettierrc') {
                editor.setOption('mode', 'application/json');
                CodeMirror.autoLoadMode(editor, 'javascript');
            }

            if (file.extension() === 'json') {
                editor.setOption('mode', 'application/json');
                CodeMirror.autoLoadMode(editor, 'javascript');
            }

            if (file.extension() === 'coffee') {
                editor.setOption('mode', 'coffeescript');
                CodeMirror.autoLoadMode(editor, 'coffeescript');
            }

            self.setLineWrapping(file);

            // return
            setTimeout(self.refreshAndLint, 100);
            setTimeout(() => self.setLineHighlights(file), 100);
        },

        // eslint-disable-next-line no-unused-vars
        setLineWrapping(file) {
            if (self.wrapText()) {
                editor.setOption('lineWrapping', true);
            } else {
                editor.setOption('lineWrapping', false);
            }
        },
        /**
         * Highlights editor lines for current embed
         */
        setLineHighlights(file) {
            if (self.highlightFilePath() === file.path()) {
                for (const lineNumber of self.highlights()) {
                    const anchor = {
                        line: lineNumber - 1,
                        ch: 0
                    };
                    const head = {
                        line: lineNumber - 1,
                        ch: null
                    };
                    self.getCurrentSession().markText(anchor, head, {
                        css: 'background: yellow'
                    });
                }
            }
        },

        refreshAndLint() {
            self.refreshEditor();
            return self.performLint();
        },

        // Ensure this file has a session that has been initialized
        ensureSession(file) {
            if (file.addedByRewind()) {
                file.session = Promise.resolve();
            } else {
                // eslint-disable-next-line no-lonely-if
                if (file.session == null) {
                    file.session = self.initSession(file, self.otClient());
                }
            }

            if (self.editorIsPreviewingRewind()) {
                // eslint-disable-next-line no-return-assign
                return file.session.then(() =>
                    file.diffSession != null ? file.diffSession : /* istanbul ignore next */ (file.diffSession = self.initDiffSession(file)),
                );
                // eslint-disable-next-line no-else-return
            } else {
                return file.session;
            }
        },

        trackChange() {
            self.trackFileHelper(self.selectedFile(), 'File Edited');
            return self.touchProject();
        },

        initSession(file, client) {
            // eslint-disable-next-line func-names
            return client.document(file.id()).then(function(doc) {
                // Can't open media files in CodeMirror, don't create an editor session
                if (doc.base64Content != null) {
                    file.base64Content(doc.base64Content);
                    return {};
                }

                const session = self.otCodeMirror().getCMDoc(file.id());
                let updating = true;
                file.content(session.getValue());
                updating = false;

                if (!self.userPositionIsRestored() && self.restorePath() === file.path()) {
                    const line = self.restoreLine();
                    const character = self.restoreCharacter();

                    // Scroll cursor to middle of screen
                    // waiting until viewportChange ensures this runs after the editor has loaded this file
                    // we use .on/.off here because codemirror doesn't support .once
                    editor.on('viewportChange', function handler() {
                        editor.off('viewportChange', handler);
                        editor.setCursor(line - 1, character, {
                            scroll: false
                        });
                        editor.scrollIntoView(editor.getCursor(), editor.getScrollInfo().clientHeight / 2);
                    });

                    self.userPositionIsRestored(true);
                } else {
                    session.setCursor(0, 0);
                }

                // Filetree observable binding
                updating = false;
                // eslint-disable-next-line func-names
                file.content.observe(function(newContent) {
                    if (file.path() === '.env') {
                        const debuggerEnabled = newContent.split('\n').indexOf('GLITCH_DEBUGGER=true') >= 0;
                        self.debuggerEnabled(debuggerEnabled);
                    }

                    if (file.path() === 'watch.json') {
                        self.readWatchJson();
                    }

                    if (file.path() === '.eslintrc.json') {
                        self.readEslintrc();
                    }

                    if (file.path() === '.prettierrc') {
                        self.readPrettierrc();
                    }

                    if (updating) {
                        return;
                    }

                    const lastLine = self.editor().lastLine();
                    const lastCharacter = self.editor().getLine(lastLine).length;

                    // This marks changes to file.content as coming from user
                    // eslint-disable-next-line consistent-return
                    return session.replaceRange(newContent, {
                        line: 0,
                        ch: 0
                    }, {
                        line: lastLine,
                        ch: lastCharacter
                    }, '+input');
                });

                // Bind session and file content
                // eslint-disable-next-line func-names
                session.on('change', function(_, changeObj = {}) {
                    updating = true;
                    file.content(session.getValue());
                    updating = false;

                    // only log if edits come from the current user, otherwise logs are duplicated by other clients
                    if (changeObj.origin === '+input') {
                        self.changeTracker();
                    }

                    /* istanbul ignore next */
                    return typeof self.fileChanged === 'function' ? self.fileChanged(true) : undefined;
                });

                return session;
            });
        },

        applyPatchAndOTs(path, content, otLimit) {
            const patch = self.patchesByPath()[path];
            if (patch) {
                content = JSDiff.applyPatch(content, patch);
            }

            const ots = self.otsByPath()[path];
            if (ots) {
                const {
                    applyEdit
                } = self.otClient().ot();

                let index = 0;
                while (index < ots.length) {
                    const ot = ots[index];
                    if (otLimit != null && ot.index >= otLimit) {
                        break;
                    }

                    // eslint-disable-next-line default-case
                    switch (ot.type) {
                        case 'add':
                            content = '';
                            break;
                        case 'insert':
                        case 'remove':
                            content = applyEdit(content, ot);
                            break;
                        case 'rename':
                            // eslint-disable-next-line no-case-declarations
                            const oldPath = ot.oldPath.substring(2);
                            if (path === oldPath) {
                                // Renaming away from this path, clear contents
                                content = '';
                            } else {
                                // Renaming to this path, calculate the contents of the other file at this time
                                const existingFile = self.fileByPath(oldPath);
                                const currentContent = existingFile ? existingFile.content() : '';
                                content = self.applyPatchAndOTs(oldPath, currentContent, ot.index);
                            }
                            break;
                    }

                    index += 1;
                }
            }
            return content;
        },

        findRenameSessions(path, promises) {
            const ots = self.otsByPath()[path] || [];
            // eslint-disable-next-line func-names, consistent-return
            return ots.forEach(function(ot) {
                if (ot.type === 'rename' && path === ot.newPath.substring(2)) {
                    const oldPath = ot.oldPath.substring(2);
                    const renamedFile = self.fileByPath(oldPath);
                    if (renamedFile) {
                        promises.push(self.ensureSession(renamedFile));
                    }
                    return self.findRenameSessions(oldPath, promises);
                }
            });
        },

        initDiffSession(file) {
            let diffSession;
            const loadPromises = [];
            if (!file.addedByRewind()) {
                loadPromises.push(file.session);
            }

            if (self.filesWithDiffTooBig().includes(file.path())) {
                diffSession = {
                    addedLines: [],
                    removedLines: [],
                };

                diffSession.content = CodeMirror.Doc('The changes to this file are too big to be shown.');
                return Promise.resolve(diffSession);
            }

            // We need to make sure any files that were renamed to this name are already loaded
            self.findRenameSessions(file.path(), loadPromises);

            // eslint-disable-next-line func-names
            return Promise.all(loadPromises).then(function() {
                diffSession = {
                    addedLines: [],
                    removedLines: [],
                };

                const content = self.applyPatchAndOTs(file.path(), file.content());

                const diff = DiffTool.diffLineMode(file.content(), content);
                diffSession = DiffTool.applyDiffInline(diff);
                diffSession.content = CodeMirror.Doc(diffSession.content);
                return diffSession;
            });
        },

        onCursorActivity() {
            // Check for non-empty selections, and switch start/end if they were selected in a backwards direction
            const nonEmptyAscendingSelections = editor
                .listSelections()
                .filter((selection) => !selection.empty())
                .map((selection) => {
                    const startIndex = editor.indexFromPos(selection.anchor);
                    const endIndex = editor.indexFromPos(selection.head);
                    if (endIndex > startIndex) {
                        return {
                            start: startIndex,
                            end: endIndex
                        };
                    }
                    return {
                        start: endIndex,
                        end: startIndex
                    };
                });
            self.editorRangeSelections(nonEmptyAscendingSelections);
        },
    });

    // Don't track every keystroke, once every minute should be fine
    self.changeTracker = throttle(self.trackChange, 60 * 1000);

    return window.addEventListener('resize', self.refreshEditor);
};