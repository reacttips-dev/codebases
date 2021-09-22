export var OrderMessageRoleEnum;
(function (OrderMessageRoleEnum) {
    OrderMessageRoleEnum["customer"] = "CUSTOMER";
    OrderMessageRoleEnum["operator"] = "OPERATOR";
    OrderMessageRoleEnum["seller"] = "SELLER";
    OrderMessageRoleEnum["other"] = "OTHER";
})(OrderMessageRoleEnum || (OrderMessageRoleEnum = {}));
export var OrderMessageSellerEnum;
(function (OrderMessageSellerEnum) {
    OrderMessageSellerEnum["marketplace"] = "MARKETPLACE";
    OrderMessageSellerEnum["bestbuy"] = "BESTBUY";
})(OrderMessageSellerEnum || (OrderMessageSellerEnum = {}));
export var MessageStatus;
(function (MessageStatus) {
    MessageStatus[MessageStatus["pending"] = 0] = "pending";
    MessageStatus[MessageStatus["sending"] = 1] = "sending";
    MessageStatus[MessageStatus["sent"] = 2] = "sent";
    MessageStatus[MessageStatus["error"] = 3] = "error";
})(MessageStatus || (MessageStatus = {}));
//# sourceMappingURL=orderMessageHistoryEnums.js.map