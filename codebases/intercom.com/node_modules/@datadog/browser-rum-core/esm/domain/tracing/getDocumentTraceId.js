import { findCommaSeparatedValue, ONE_MINUTE } from '@datadog/browser-core';
export var INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD = 2 * ONE_MINUTE;
export function getDocumentTraceId(document) {
    var data = getDocumentTraceDataFromMeta(document) || getDocumentTraceDataFromComment(document);
    if (!data || data.traceTime <= Date.now() - INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD) {
        return undefined;
    }
    return data.traceId;
}
export function getDocumentTraceDataFromMeta(document) {
    var traceIdMeta = document.querySelector('meta[name=dd-trace-id]');
    var traceTimeMeta = document.querySelector('meta[name=dd-trace-time]');
    return createDocumentTraceData(traceIdMeta && traceIdMeta.content, traceTimeMeta && traceTimeMeta.content);
}
export function getDocumentTraceDataFromComment(document) {
    var comment = findTraceComment(document);
    if (!comment) {
        return undefined;
    }
    return createDocumentTraceData(findCommaSeparatedValue(comment, 'trace-id'), findCommaSeparatedValue(comment, 'trace-time'));
}
export function createDocumentTraceData(traceId, rawTraceTime) {
    var traceTime = rawTraceTime && Number(rawTraceTime);
    if (!traceId || !traceTime) {
        return undefined;
    }
    return {
        traceId: traceId,
        traceTime: traceTime,
    };
}
export function findTraceComment(document) {
    // 1. Try to find the comment as a direct child of the document
    // Note: TSLint advises to use a 'for of', but TS doesn't allow to use 'for of' if the iterated
    // value is not an array or string (here, a NodeList).
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (var i = 0; i < document.childNodes.length; i += 1) {
        var comment = getTraceCommentFromNode(document.childNodes[i]);
        if (comment) {
            return comment;
        }
    }
    // 2. If the comment is placed after the </html> tag, but have some space or new lines before or
    // after, the DOM parser will lift it (and the surrounding text) at the end of the <body> tag.
    // Try to look for the comment at the end of the <body> by by iterating over its child nodes in
    // reverse order, stopping if we come across a non-text node.
    if (document.body) {
        for (var i = document.body.childNodes.length - 1; i >= 0; i -= 1) {
            var node = document.body.childNodes[i];
            var comment = getTraceCommentFromNode(node);
            if (comment) {
                return comment;
            }
            if (!isTextNode(node)) {
                break;
            }
        }
    }
}
function getTraceCommentFromNode(node) {
    if (node && isCommentNode(node)) {
        var match = /^\s*DATADOG;(.*?)\s*$/.exec(node.data);
        if (match) {
            return match[1];
        }
    }
}
function isCommentNode(node) {
    return node.nodeName === '#comment';
}
function isTextNode(node) {
    return node.nodeName === '#text';
}
//# sourceMappingURL=getDocumentTraceId.js.map