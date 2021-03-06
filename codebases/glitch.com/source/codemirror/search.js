/* eslint-disable */

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Define search commands. Depends on dialog.js or another
// implementation of the openDialog method.

// Replace works a little oddly -- it will do the replace on the next
// Ctrl-G (or whatever is bound to findNext) press. You prevent a
// replace by making sure the match is no longer selected when hitting
// Ctrl-G.
import CodeMirror from 'codemirror';

function searchOverlay(query, caseInsensitive) {
    if (typeof query == 'string') query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), caseInsensitive ? 'gi' : 'g');
    else if (!query.global) query = new RegExp(query.source, query.ignoreCase ? 'gi' : 'g');

    return {
        token: function(stream) {
            query.lastIndex = stream.pos;
            var match = query.exec(stream.string);
            if (match && match.index == stream.pos) {
                stream.pos += match[0].length || 1;
                return 'searching';
            } else if (match) {
                stream.pos = match.index;
            } else {
                stream.skipToEnd();
            }
        },
    };
}

function SearchState() {
    this.posFrom = this.posTo = this.lastQuery = this.query = null;
    this.overlay = null;
}

function getSearchState(cm) {
    return cm.state.search || (cm.state.search = new SearchState());
}

function queryCaseInsensitive(query) {
    return typeof query == 'string' && query == query.toLowerCase();
}

function getSearchCursor(cm, query, pos) {
    // Heuristic: if the query string is all lowercase, do a case insensitive search.
    return cm.getSearchCursor(query, pos, queryCaseInsensitive(query));
}

function persistentDialog(cm, text, deflt, onEnter, onKeyDown) {
    var searchField = document.getElementsByClassName('CodeMirror-search-field')[0];

    // If input query has multiple new lines, strip them out before displaying the search box
    if (deflt && deflt.indexOf('\n') > 0) {
        deflt = deflt.substring(0, deflt.indexOf('\n'));
    }

    if (!searchField) {
        cm.openDialog(text, onEnter, {
            value: deflt,
            selectValueOnOpen: true,
            closeOnEnter: false,
            onClose: function() {
                clearSearch(cm);
            },
            onKeyDown: onKeyDown,
            closeOnBlur: false,
        });

        searchField = document.getElementsByClassName('CodeMirror-search-field')[0];

        var dialog = document.getElementsByClassName('CodeMirror-dialog')[0];
        var closeButton = dialog.getElementsByClassName('close')[0];

        CodeMirror.on(searchField, 'keyup', function(e) {
            if (e.keyCode !== 13 && searchField.value.length > 1) {
                // not enter and more than 1 character to search
                startSearch(cm, getSearchState(cm), searchField.value);
            }
        });

        CodeMirror.on(closeButton, 'click', function() {
            clearSearch(cm);
            dialog.parentNode.removeChild(dialog);
            cm.focus();
        });

        var upArrow = dialog.getElementsByClassName('up-arrow')[0];
        CodeMirror.on(upArrow, 'click', function() {
            CodeMirror.commands.findPrev(cm);
            searchField.blur();
            cm.focus();
        });

        var downArrow = dialog.getElementsByClassName('down-arrow')[0];
        CodeMirror.on(downArrow, 'click', function() {
            CodeMirror.commands.findNext(cm);
            searchField.blur();
            cm.focus();
        });
    } else {
        searchField.value = deflt;

        searchField.focus();
        searchField.select();
    }
}

function dialog(cm, text, shortText, deflt, f) {
    if (cm.openDialog) cm.openDialog(text, f, {
        value: deflt,
        selectValueOnOpen: true
    });
    else f(prompt(shortText, deflt));
}

var lastSelectedIndex = 0;

function confirmDialog(cm, text, shortText, fs) {
    if (cm.openConfirm) cm.openConfirm(text, fs);
    else if (confirm(shortText)) fs[0]();

    var dialog = document.getElementsByClassName('CodeMirror-dialog')[0];
    var buttons = dialog.getElementsByTagName('button');
    buttons[lastSelectedIndex].focus();
    for (var i = 0; i < buttons.length; i += 1) {
        (function(index) {
            var button = buttons[index];
            button.addEventListener('focus', function(e) {
                lastSelectedIndex = index === buttons.length - 1 ? 0 : index;
            });
            button.addEventListener('keyup', function(e) {
                if (e.keyCode === 37) {
                    // arrow left
                    var prevButton = index === 0 ? buttons.length - 1 : index - 1;
                    buttons[prevButton].focus();
                }
                if (e.keyCode === 39) {
                    // arrow right
                    var nextButton = index === buttons.length - 1 ? 0 : index + 1;
                    buttons[nextButton].focus();
                }
                if (e.keyCode === 27) {
                    // esc
                    cm.focus();
                }
            });
            button.addEventListener('click', function() {
                if (index === buttons.length - 1) {
                    // "done"
                    lastSelectedIndex = 0;
                }
            });
        })(i);
    }
}

function parseString(string) {
    return string.replace(/\\(.)/g, function(_, ch) {
        if (ch == 'n') return '\n';
        if (ch == 'r') return '\r';
        return ch;
    });
}

function parseQuery(query) {
    var isRE = query.match(/^\/(.*)\/([a-z]*)$/);
    if (isRE) {
        try {
            query = new RegExp(isRE[1], isRE[2].indexOf('i') == -1 ? '' : 'i');
        } catch (e) {} // Not a regular expression after all, do a string search
    } else {
        query = parseString(query);
    }
    if (typeof query == 'string' ? query == '' : query.test('')) query = /x^/;
    return query;
}

var queryDialog =
    '<input type="text" class="search-input CodeMirror-search-field"/>' +
    '<div class="button-wrap">' +
    '<span class="CodeMirror-search-button icon up-arrow prev"></span>' +
    '<span class="CodeMirror-search-button icon down-arrow next"></span>' +
    '</div><div class="close icon"></div>';

function startSearch(cm, state, query) {
    state.queryText = query;
    state.query = parseQuery(query);
    cm.removeOverlay(state.overlay, queryCaseInsensitive(state.query));
    state.overlay = searchOverlay(state.query, queryCaseInsensitive(state.query));
    cm.addOverlay(state.overlay);
    if (cm.showMatchesOnScrollbar) {
        if (state.annotate) {
            state.annotate.clear();
            state.annotate = null;
        }
        state.annotate = cm.showMatchesOnScrollbar(state.query, queryCaseInsensitive(state.query));
    }
}

function doSearch(cm, rev, persistent, immediate, ignoreQuery) {
    var state = getSearchState(cm);
    if (!ignoreQuery && state.query) return findNext(cm, rev);
    var q = cm.getSelection() || state.lastQuery;
    if (persistent && cm.openDialog) {
        var hiding = null;
        var searchNext = function(query, event) {
            CodeMirror.e_stop(event);
            if (!query) return;
            if (query != state.queryText) {
                startSearch(cm, state, query);
                state.posFrom = state.posTo = cm.getCursor();
            }
            if (hiding) hiding.style.opacity = 1;
            findNext(cm, event.shiftKey, function(_, to) {
                var dialog;
                application.analytics.track('Project Searched', {
                    searchTarget: 'In file',
                    searchTerm: query
                });
                if (
                    to.line < 3 &&
                    document.querySelector &&
                    (dialog = cm.display.wrapper.querySelector('.CodeMirror-dialog')) &&
                    dialog.getBoundingClientRect().bottom - 4 > cm.cursorCoords(to, 'window').top
                )
                    (hiding = dialog).style.opacity = 0.4;
            });
        };
        persistentDialog(cm, queryDialog, q, searchNext, function(event, query) {
            var keyName = CodeMirror.keyName(event);
            var cmd = CodeMirror.keyMap[cm.getOption('keyMap')][keyName];
            if (!cmd) cmd = cm.getOption('extraKeys')[keyName];
            if (cmd == 'findNext' || cmd == 'findPrev' || cmd == 'findPersistentNext' || cmd == 'findPersistentPrev') {
                CodeMirror.e_stop(event);
                startSearch(cm, getSearchState(cm), query);
                cm.execCommand(cmd);
            } else if (cmd == 'find' || cmd == 'findPersistent') {
                CodeMirror.e_stop(event);
                searchNext(query, event);
            }
        });
        if (immediate && q) {
            startSearch(cm, state, q);
            findNext(cm, rev);
        }
    } else {
        dialog(cm, queryDialog, 'Search for:', q, function(query) {
            if (query && !state.query)
                cm.operation(function() {
                    startSearch(cm, state, query);
                    state.posFrom = state.posTo = cm.getCursor();
                    findNext(cm, rev);
                });
        });
    }
}

function findNext(cm, rev, callback) {
    cm.operation(function() {
        var state = getSearchState(cm);
        var cursor = getSearchCursor(cm, state.query, rev ? state.posFrom : state.posTo);
        if (!cursor.find(rev)) {
            cursor = getSearchCursor(cm, state.query, rev ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
            if (!cursor.find(rev)) return;
        }
        cm.setSelection(cursor.from(), cursor.to());
        cm.scrollIntoView({
            from: cursor.from(),
            to: cursor.to()
        }, cm.getScrollInfo().clientHeight / 2);
        state.posFrom = cursor.from();
        state.posTo = cursor.to();
        if (callback) callback(cursor.from(), cursor.to());
    });
}

function clearSearch(cm) {
    cm.operation(function() {
        var state = getSearchState(cm);
        state.lastQuery = state.query;
        if (!state.query) return;
        state.query = state.queryText = null;
        cm.removeOverlay(state.overlay);
        if (state.annotate) {
            state.annotate.clear();
            state.annotate = null;
        }
    });
}

var replaceQueryDialog = '<input type="text" class="search-input CodeMirror-search-field"/><div class="close icon"></div>';

var replacementQueryDialog = 'With: <input type="text" class="replace-input CodeMirror-search-field"/>';
var doReplaceConfirm = 'Replace? <button>Yes</button> <button>No</button> <button>All</button> <button>Stop</button>';

function replaceAll(cm, query, text) {
    cm.operation(function() {
        for (var cursor = getSearchCursor(cm, query); cursor.findNext();) {
            if (typeof query != 'string') {
                var match = cm.getRange(cursor.from(), cursor.to()).match(query);
                cursor.replace(
                    text.replace(/\$(\d)/g, function(_, i) {
                        return match[i];
                    }),
                );
            } else cursor.replace(text);
        }
    });
}

function replace(cm, all) {
    var prevDialog = document.getElementsByClassName('CodeMirror-dialog')[0];
    if (prevDialog) {
        clearSearch(cm);
        prevDialog.parentNode.removeChild(prevDialog);
        cm.focus();
    }
    if (cm.getOption('readOnly')) return;
    var query = cm.getSelection() || getSearchState(cm).lastQuery;
    var dialogText = all ? 'Replace all:' : 'Replace:';
    dialog(cm, dialogText + replaceQueryDialog, dialogText, query, function(query) {
        if (!query) return;
        query = parseQuery(query);
        dialog(cm, replacementQueryDialog, 'Replace with:', '', function(text) {
            text = parseString(text);
            if (all) {
                replaceAll(cm, query, text);
            } else {
                clearSearch(cm);
                var cursor = getSearchCursor(cm, query, cm.getCursor('from'));
                var advance = function() {
                    var start = cursor.from(),
                        match;
                    if (!(match = cursor.findNext())) {
                        cursor = getSearchCursor(cm, query);
                        if (!(match = cursor.findNext()) || (start && cursor.from().line == start.line && cursor.from().ch == start.ch)) return;
                    }
                    cm.setSelection(cursor.from(), cursor.to());
                    cm.scrollIntoView({
                        from: cursor.from(),
                        to: cursor.to()
                    }, 60);
                    confirmDialog(cm, doReplaceConfirm, 'Replace?', [
                        function() {
                            doReplace(match);
                        },
                        advance,
                        function() {
                            replaceAll(cm, query, text);
                        },
                    ]);
                };
                var doReplace = function(match) {
                    cursor.replace(
                        typeof query == 'string' ?
                        text :
                        text.replace(/\$(\d)/g, function(_, i) {
                            return match[i];
                        }),
                    );
                    advance();
                };
                advance();
            }
        });
    });
}

CodeMirror.commands.find = function(cm) {
    doSearch(cm);
};
CodeMirror.commands.findPersistent = function(cm) {
    doSearch(cm, false, true, false, true);
};
CodeMirror.commands.findPersistentNext = function(cm) {
    doSearch(cm, false, true, true);
};
CodeMirror.commands.findPersistentPrev = function(cm) {
    doSearch(cm, true, true, true);
};
CodeMirror.commands.findNext = doSearch;
CodeMirror.commands.findPrev = function(cm) {
    doSearch(cm, true);
};
CodeMirror.commands.clearSearch = clearSearch;
CodeMirror.commands.replace = replace;
CodeMirror.commands.replaceAll = function(cm) {
    replace(cm, true);
};