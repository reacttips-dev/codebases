/**
 * @constant
 * Contains list of trace messages
 */

export const TraceConstants = Object.freeze({
    Start: 'A0',
    AddingGciPayload: 'A1',
    AddedGciPayload: 'A2',
    AddGciPayloadToStore: 'A3',
    GciUpdateFetchStatus: 'A4',
    PrefetchStart: 'A5',
    CardAblInStore: 'A6',
    AddingPrefetchCardToStore: 'A7',
    CannotAddCardData: 'A8',
    PrefetchSuccess: 'A9',
    PrefetchFailed: 'A10',
    PrefetchUpdFetchStatusNotLoaded: 'A11',
    PrefetchFinish: 'A12',
    Finish: 'A13',
});

/**
 * @constant
 * Contains list of Error types
 */

export const Error = Object.freeze({
    ItemArrayLengthMismatch: 'A0',
    NoCardAfterFetch: 'A1',
    MailStoreNotFound: 'A2',
});

/**
 * @constant
 * Contains list of Warning types
 */

export const Warning = Object.freeze({
    AddCardDuplicate: 'AMA_W0',
    JsonParseIssue: 'AMA_W1',
    NoCardPresent: 'AMA_W2',
    FetchCatchBlock: 'AMA_W3',
    FetchNoExtProp: 'AMA_W4',
});
