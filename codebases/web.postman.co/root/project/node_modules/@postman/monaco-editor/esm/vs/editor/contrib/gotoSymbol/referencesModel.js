/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { localize } from '../../../nls.js';
import { Emitter } from '../../../base/common/event.js';
import { basename } from '../../../base/common/resources.js';
import { dispose, DisposableStore } from '../../../base/common/lifecycle.js';
import * as strings from '../../../base/common/strings.js';
import { defaultGenerator } from '../../../base/common/idGenerator.js';
import { Range } from '../../common/core/range.js';
var OneReference = /** @class */ (function () {
    function OneReference(isProviderFirst, parent, _range, _rangeCallback) {
        this.isProviderFirst = isProviderFirst;
        this.parent = parent;
        this._range = _range;
        this._rangeCallback = _rangeCallback;
        this.id = defaultGenerator.nextId();
    }
    Object.defineProperty(OneReference.prototype, "uri", {
        get: function () {
            return this.parent.uri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OneReference.prototype, "range", {
        get: function () {
            return this._range;
        },
        set: function (value) {
            this._range = value;
            this._rangeCallback(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OneReference.prototype, "ariaMessage", {
        get: function () {
            return localize('aria.oneReference', "symbol in {0} on line {1} at column {2}", basename(this.uri), this.range.startLineNumber, this.range.startColumn);
        },
        enumerable: true,
        configurable: true
    });
    return OneReference;
}());
export { OneReference };
var FilePreview = /** @class */ (function () {
    function FilePreview(_modelReference) {
        this._modelReference = _modelReference;
    }
    FilePreview.prototype.dispose = function () {
        this._modelReference.dispose();
    };
    FilePreview.prototype.preview = function (range, n) {
        if (n === void 0) { n = 8; }
        var model = this._modelReference.object.textEditorModel;
        if (!model) {
            return undefined;
        }
        var startLineNumber = range.startLineNumber, startColumn = range.startColumn, endLineNumber = range.endLineNumber, endColumn = range.endColumn;
        var word = model.getWordUntilPosition({ lineNumber: startLineNumber, column: startColumn - n });
        var beforeRange = new Range(startLineNumber, word.startColumn, startLineNumber, startColumn);
        var afterRange = new Range(endLineNumber, endColumn, endLineNumber, 1073741824 /* MAX_SAFE_SMALL_INTEGER */);
        var before = model.getValueInRange(beforeRange).replace(/^\s+/, '');
        var inside = model.getValueInRange(range);
        var after = model.getValueInRange(afterRange).replace(/\s+$/, '');
        return {
            value: before + inside + after,
            highlight: { start: before.length, end: before.length + inside.length }
        };
    };
    return FilePreview;
}());
export { FilePreview };
var FileReferences = /** @class */ (function () {
    function FileReferences(parent, uri) {
        this.parent = parent;
        this.uri = uri;
        this.children = [];
    }
    FileReferences.prototype.dispose = function () {
        dispose(this._preview);
        this._preview = undefined;
    };
    Object.defineProperty(FileReferences.prototype, "preview", {
        get: function () {
            return this._preview;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileReferences.prototype, "failure", {
        get: function () {
            return this._loadFailure;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileReferences.prototype, "ariaMessage", {
        get: function () {
            var len = this.children.length;
            if (len === 1) {
                return localize('aria.fileReferences.1', "1 symbol in {0}, full path {1}", basename(this.uri), this.uri.fsPath);
            }
            else {
                return localize('aria.fileReferences.N', "{0} symbols in {1}, full path {2}", len, basename(this.uri), this.uri.fsPath);
            }
        },
        enumerable: true,
        configurable: true
    });
    FileReferences.prototype.resolve = function (textModelResolverService) {
        var _this = this;
        if (this._resolved) {
            return Promise.resolve(this);
        }
        return Promise.resolve(textModelResolverService.createModelReference(this.uri).then(function (modelReference) {
            var model = modelReference.object;
            if (!model) {
                modelReference.dispose();
                throw new Error();
            }
            _this._preview = new FilePreview(modelReference);
            _this._resolved = true;
            return _this;
        }, function (err) {
            // something wrong here
            _this.children.length = 0;
            _this._resolved = true;
            _this._loadFailure = err;
            return _this;
        }));
    };
    return FileReferences;
}());
export { FileReferences };
var ReferencesModel = /** @class */ (function () {
    function ReferencesModel(links, title) {
        var _this = this;
        this._disposables = new DisposableStore();
        this.groups = [];
        this.references = [];
        this._onDidChangeReferenceRange = new Emitter();
        this.onDidChangeReferenceRange = this._onDidChangeReferenceRange.event;
        this._links = links;
        this._title = title;
        // grouping and sorting
        var providersFirst = links[0];
        links.sort(ReferencesModel._compareReferences);
        var current;
        for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
            var link = links_1[_i];
            if (!current || current.uri.toString() !== link.uri.toString()) {
                // new group
                current = new FileReferences(this, link.uri);
                this.groups.push(current);
            }
            // append, check for equality first!
            if (current.children.length === 0 || !Range.equalsRange(link.range, current.children[current.children.length - 1].range)) {
                var oneRef = new OneReference(providersFirst === link, current, link.targetSelectionRange || link.range, function (ref) { return _this._onDidChangeReferenceRange.fire(ref); });
                this.references.push(oneRef);
                current.children.push(oneRef);
            }
        }
    }
    ReferencesModel.prototype.dispose = function () {
        dispose(this.groups);
        this._disposables.dispose();
        this._onDidChangeReferenceRange.dispose();
        this.groups.length = 0;
    };
    ReferencesModel.prototype.clone = function () {
        return new ReferencesModel(this._links, this._title);
    };
    Object.defineProperty(ReferencesModel.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReferencesModel.prototype, "isEmpty", {
        get: function () {
            return this.groups.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReferencesModel.prototype, "ariaMessage", {
        get: function () {
            if (this.isEmpty) {
                return localize('aria.result.0', "No results found");
            }
            else if (this.references.length === 1) {
                return localize('aria.result.1', "Found 1 symbol in {0}", this.references[0].uri.fsPath);
            }
            else if (this.groups.length === 1) {
                return localize('aria.result.n1', "Found {0} symbols in {1}", this.references.length, this.groups[0].uri.fsPath);
            }
            else {
                return localize('aria.result.nm', "Found {0} symbols in {1} files", this.references.length, this.groups.length);
            }
        },
        enumerable: true,
        configurable: true
    });
    ReferencesModel.prototype.nextOrPreviousReference = function (reference, next) {
        var parent = reference.parent;
        var idx = parent.children.indexOf(reference);
        var childCount = parent.children.length;
        var groupCount = parent.parent.groups.length;
        if (groupCount === 1 || next && idx + 1 < childCount || !next && idx > 0) {
            // cycling within one file
            if (next) {
                idx = (idx + 1) % childCount;
            }
            else {
                idx = (idx + childCount - 1) % childCount;
            }
            return parent.children[idx];
        }
        idx = parent.parent.groups.indexOf(parent);
        if (next) {
            idx = (idx + 1) % groupCount;
            return parent.parent.groups[idx].children[0];
        }
        else {
            idx = (idx + groupCount - 1) % groupCount;
            return parent.parent.groups[idx].children[parent.parent.groups[idx].children.length - 1];
        }
    };
    ReferencesModel.prototype.nearestReference = function (resource, position) {
        var nearest = this.references.map(function (ref, idx) {
            return {
                idx: idx,
                prefixLen: strings.commonPrefixLength(ref.uri.toString(), resource.toString()),
                offsetDist: Math.abs(ref.range.startLineNumber - position.lineNumber) * 100 + Math.abs(ref.range.startColumn - position.column)
            };
        }).sort(function (a, b) {
            if (a.prefixLen > b.prefixLen) {
                return -1;
            }
            else if (a.prefixLen < b.prefixLen) {
                return 1;
            }
            else if (a.offsetDist < b.offsetDist) {
                return -1;
            }
            else if (a.offsetDist > b.offsetDist) {
                return 1;
            }
            else {
                return 0;
            }
        })[0];
        if (nearest) {
            return this.references[nearest.idx];
        }
        return undefined;
    };
    ReferencesModel.prototype.referenceAt = function (resource, position) {
        for (var _i = 0, _a = this.references; _i < _a.length; _i++) {
            var ref = _a[_i];
            if (ref.uri.toString() === resource.toString()) {
                if (Range.containsPosition(ref.range, position)) {
                    return ref;
                }
            }
        }
        return undefined;
    };
    ReferencesModel.prototype.firstReference = function () {
        for (var _i = 0, _a = this.references; _i < _a.length; _i++) {
            var ref = _a[_i];
            if (ref.isProviderFirst) {
                return ref;
            }
        }
        return this.references[0];
    };
    ReferencesModel._compareReferences = function (a, b) {
        return strings.compare(a.uri.toString(), b.uri.toString()) || Range.compareRangesUsingStarts(a.range, b.range);
    };
    return ReferencesModel;
}());
export { ReferencesModel };
