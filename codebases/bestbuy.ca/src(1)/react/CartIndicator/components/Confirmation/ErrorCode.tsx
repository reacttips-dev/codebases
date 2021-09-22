import messages from "./translations/messages";
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["GeneralError"] = "1003";
    ErrorCode["ParentOrderLimitExceeded"] = "1010";
    ErrorCode["ChildOrderLimitExceeded"] = "1011";
})(ErrorCode || (ErrorCode = {}));
export const ErrorMappings = new Map([
    [ErrorCode.GeneralError,
        { subject: messages.addToCartConfirmationFailure,
            text: messages.addOfferToCartFailedSubText,
        },
    ],
    [ErrorCode.ParentOrderLimitExceeded,
        { subject: messages.addToCartFailedLimit,
            text: messages.addToCartFailedParentLimit,
        },
    ],
    [ErrorCode.ChildOrderLimitExceeded,
        { subject: messages.addToCartFailedLimit,
            text: messages.addToCartFailedChildLimit,
        },
    ],
]);
//# sourceMappingURL=ErrorCode.js.map