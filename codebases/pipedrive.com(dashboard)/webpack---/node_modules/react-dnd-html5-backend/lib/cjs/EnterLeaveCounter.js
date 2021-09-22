"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discount_lodash_1 = require("./utils/discount_lodash");
var EnterLeaveCounter = /** @class */ (function () {
    function EnterLeaveCounter(isNodeInDocument) {
        this.entered = [];
        this.isNodeInDocument = isNodeInDocument;
    }
    EnterLeaveCounter.prototype.enter = function (enteringNode) {
        var _this = this;
        var previousLength = this.entered.length;
        var isNodeEntered = function (node) {
            return _this.isNodeInDocument(node) &&
                (!node.contains || node.contains(enteringNode));
        };
        this.entered = discount_lodash_1.union(this.entered.filter(isNodeEntered), [enteringNode]);
        return previousLength === 0 && this.entered.length > 0;
    };
    EnterLeaveCounter.prototype.leave = function (leavingNode) {
        var previousLength = this.entered.length;
        this.entered = discount_lodash_1.without(this.entered.filter(this.isNodeInDocument), leavingNode);
        return previousLength > 0 && this.entered.length === 0;
    };
    EnterLeaveCounter.prototype.reset = function () {
        this.entered = [];
    };
    return EnterLeaveCounter;
}());
exports.default = EnterLeaveCounter;
