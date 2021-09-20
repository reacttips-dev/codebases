/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { flatten, coalesce } from '../../../base/common/arrays.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { registerModelAndPositionCommand } from '../../browser/editorExtensions.js';
import { DefinitionProviderRegistry, ImplementationProviderRegistry, TypeDefinitionProviderRegistry, DeclarationProviderRegistry, ReferenceProviderRegistry } from '../../common/modes.js';
function getLocationLinks(model, position, registry, provide) {
    var provider = registry.ordered(model);
    // get results
    var promises = provider.map(function (provider) {
        return Promise.resolve(provide(provider, model, position)).then(undefined, function (err) {
            onUnexpectedExternalError(err);
            return undefined;
        });
    });
    return Promise.all(promises)
        .then(flatten)
        .then(coalesce);
}
export function getDefinitionsAtPosition(model, position, token) {
    return getLocationLinks(model, position, DefinitionProviderRegistry, function (provider, model, position) {
        return provider.provideDefinition(model, position, token);
    });
}
export function getDeclarationsAtPosition(model, position, token) {
    return getLocationLinks(model, position, DeclarationProviderRegistry, function (provider, model, position) {
        return provider.provideDeclaration(model, position, token);
    });
}
export function getImplementationsAtPosition(model, position, token) {
    return getLocationLinks(model, position, ImplementationProviderRegistry, function (provider, model, position) {
        return provider.provideImplementation(model, position, token);
    });
}
export function getTypeDefinitionsAtPosition(model, position, token) {
    return getLocationLinks(model, position, TypeDefinitionProviderRegistry, function (provider, model, position) {
        return provider.provideTypeDefinition(model, position, token);
    });
}
export function getReferencesAtPosition(model, position, compact, token) {
    var _this = this;
    return getLocationLinks(model, position, ReferenceProviderRegistry, function (provider, model, position) { return __awaiter(_this, void 0, void 0, function () {
        var result, resultWithoutDeclaration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, provider.provideReferences(model, position, { includeDeclaration: true }, token)];
                case 1:
                    result = _a.sent();
                    if (!compact || !result || result.length !== 2) {
                        return [2 /*return*/, result];
                    }
                    return [4 /*yield*/, provider.provideReferences(model, position, { includeDeclaration: false }, token)];
                case 2:
                    resultWithoutDeclaration = _a.sent();
                    if (resultWithoutDeclaration && resultWithoutDeclaration.length === 1) {
                        return [2 /*return*/, resultWithoutDeclaration];
                    }
                    return [2 /*return*/, result];
            }
        });
    }); });
}
registerModelAndPositionCommand('_executeDefinitionProvider', function (model, position) { return getDefinitionsAtPosition(model, position, CancellationToken.None); });
registerModelAndPositionCommand('_executeDeclarationProvider', function (model, position) { return getDeclarationsAtPosition(model, position, CancellationToken.None); });
registerModelAndPositionCommand('_executeImplementationProvider', function (model, position) { return getImplementationsAtPosition(model, position, CancellationToken.None); });
registerModelAndPositionCommand('_executeTypeDefinitionProvider', function (model, position) { return getTypeDefinitionsAtPosition(model, position, CancellationToken.None); });
registerModelAndPositionCommand('_executeReferenceProvider', function (model, position) { return getReferencesAtPosition(model, position, false, CancellationToken.None); });
