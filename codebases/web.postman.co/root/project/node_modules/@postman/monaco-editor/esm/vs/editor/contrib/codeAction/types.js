/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { startsWith } from '../../../base/common/strings.js';
var CodeActionKind = /** @class */ (function () {
    function CodeActionKind(value) {
        this.value = value;
    }
    CodeActionKind.prototype.equals = function (other) {
        return this.value === other.value;
    };
    CodeActionKind.prototype.contains = function (other) {
        return this.equals(other) || this.value === '' || startsWith(other.value, this.value + CodeActionKind.sep);
    };
    CodeActionKind.prototype.intersects = function (other) {
        return this.contains(other) || other.contains(this);
    };
    CodeActionKind.prototype.append = function (part) {
        return new CodeActionKind(this.value + CodeActionKind.sep + part);
    };
    CodeActionKind.sep = '.';
    CodeActionKind.None = new CodeActionKind('@@none@@'); // Special code action that contains nothing
    CodeActionKind.Empty = new CodeActionKind('');
    CodeActionKind.QuickFix = new CodeActionKind('quickfix');
    CodeActionKind.Refactor = new CodeActionKind('refactor');
    CodeActionKind.Source = new CodeActionKind('source');
    CodeActionKind.SourceOrganizeImports = CodeActionKind.Source.append('organizeImports');
    CodeActionKind.SourceFixAll = CodeActionKind.Source.append('fixAll');
    return CodeActionKind;
}());
export { CodeActionKind };
export function mayIncludeActionsOfKind(filter, providedKind) {
    // A provided kind may be a subset or superset of our filtered kind.
    if (filter.include && !filter.include.intersects(providedKind)) {
        return false;
    }
    if (filter.excludes) {
        if (filter.excludes.some(function (exclude) { return excludesAction(providedKind, exclude, filter.include); })) {
            return false;
        }
    }
    // Don't return source actions unless they are explicitly requested
    if (!filter.includeSourceActions && CodeActionKind.Source.contains(providedKind)) {
        return false;
    }
    return true;
}
export function filtersAction(filter, action) {
    var actionKind = action.kind ? new CodeActionKind(action.kind) : undefined;
    // Filter out actions by kind
    if (filter.include) {
        if (!actionKind || !filter.include.contains(actionKind)) {
            return false;
        }
    }
    if (filter.excludes) {
        if (actionKind && filter.excludes.some(function (exclude) { return excludesAction(actionKind, exclude, filter.include); })) {
            return false;
        }
    }
    // Don't return source actions unless they are explicitly requested
    if (!filter.includeSourceActions) {
        if (actionKind && CodeActionKind.Source.contains(actionKind)) {
            return false;
        }
    }
    if (filter.onlyIncludePreferredActions) {
        if (!action.isPreferred) {
            return false;
        }
    }
    return true;
}
function excludesAction(providedKind, exclude, include) {
    if (!exclude.contains(providedKind)) {
        return false;
    }
    if (include && exclude.contains(include)) {
        // The include is more specific, don't filter out
        return false;
    }
    return true;
}
var CodeActionCommandArgs = /** @class */ (function () {
    function CodeActionCommandArgs(kind, apply, preferred) {
        this.kind = kind;
        this.apply = apply;
        this.preferred = preferred;
    }
    CodeActionCommandArgs.fromUser = function (arg, defaults) {
        if (!arg || typeof arg !== 'object') {
            return new CodeActionCommandArgs(defaults.kind, defaults.apply, false);
        }
        return new CodeActionCommandArgs(CodeActionCommandArgs.getKindFromUser(arg, defaults.kind), CodeActionCommandArgs.getApplyFromUser(arg, defaults.apply), CodeActionCommandArgs.getPreferredUser(arg));
    };
    CodeActionCommandArgs.getApplyFromUser = function (arg, defaultAutoApply) {
        switch (typeof arg.apply === 'string' ? arg.apply.toLowerCase() : '') {
            case 'first': return "first" /* First */;
            case 'never': return "never" /* Never */;
            case 'ifsingle': return "ifSingle" /* IfSingle */;
            default: return defaultAutoApply;
        }
    };
    CodeActionCommandArgs.getKindFromUser = function (arg, defaultKind) {
        return typeof arg.kind === 'string'
            ? new CodeActionKind(arg.kind)
            : defaultKind;
    };
    CodeActionCommandArgs.getPreferredUser = function (arg) {
        return typeof arg.preferred === 'boolean'
            ? arg.preferred
            : false;
    };
    return CodeActionCommandArgs;
}());
export { CodeActionCommandArgs };
