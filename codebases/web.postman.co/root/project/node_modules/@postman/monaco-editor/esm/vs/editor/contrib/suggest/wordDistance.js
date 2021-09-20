/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { binarySearch, isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { Range } from '../../common/core/range.js';
import { BracketSelectionRangeProvider } from '../smartSelect/bracketSelections.js';
var WordDistance = /** @class */ (function () {
    function WordDistance() {
    }
    WordDistance.create = function (service, editor) {
        return __awaiter(this, void 0, void 0, function () {
            var model, position, ranges, wordRanges;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!editor.getOption(89 /* suggest */).localityBonus) {
                            return [2 /*return*/, WordDistance.None];
                        }
                        if (!editor.hasModel()) {
                            return [2 /*return*/, WordDistance.None];
                        }
                        model = editor.getModel();
                        position = editor.getPosition();
                        if (!service.canComputeWordRanges(model.uri)) {
                            return [2 /*return*/, WordDistance.None];
                        }
                        return [4 /*yield*/, new BracketSelectionRangeProvider().provideSelectionRanges(model, [position])];
                    case 1:
                        ranges = _a.sent();
                        if (!ranges || ranges.length === 0 || ranges[0].length === 0) {
                            return [2 /*return*/, WordDistance.None];
                        }
                        return [4 /*yield*/, service.computeWordRanges(model.uri, ranges[0][0].range)];
                    case 2:
                        wordRanges = _a.sent();
                        return [2 /*return*/, new /** @class */ (function (_super) {
                                __extends(class_1, _super);
                                function class_1() {
                                    return _super !== null && _super.apply(this, arguments) || this;
                                }
                                class_1.prototype.distance = function (anchor, suggestion) {
                                    if (!wordRanges || !position.equals(editor.getPosition())) {
                                        return 0;
                                    }
                                    if (suggestion.kind === 17 /* Keyword */) {
                                        return 2 << 20;
                                    }
                                    var word = typeof suggestion.label === 'string' ? suggestion.label : suggestion.label.name;
                                    var wordLines = wordRanges[word];
                                    if (isFalsyOrEmpty(wordLines)) {
                                        return 2 << 20;
                                    }
                                    var idx = binarySearch(wordLines, Range.fromPositions(anchor), Range.compareRangesUsingStarts);
                                    var bestWordRange = idx >= 0 ? wordLines[idx] : wordLines[Math.max(0, ~idx - 1)];
                                    var blockDistance = ranges.length;
                                    for (var _i = 0, _a = ranges[0]; _i < _a.length; _i++) {
                                        var range = _a[_i];
                                        if (!Range.containsRange(range.range, bestWordRange)) {
                                            break;
                                        }
                                        blockDistance -= 1;
                                    }
                                    return blockDistance;
                                };
                                return class_1;
                            }(WordDistance))];
                }
            });
        });
    };
    WordDistance.None = new /** @class */ (function (_super) {
        __extends(class_2, _super);
        function class_2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_2.prototype.distance = function () { return 0; };
        return class_2;
    }(WordDistance));
    return WordDistance;
}());
export { WordDistance };
