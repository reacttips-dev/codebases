/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var escapeCodiconsRegex = /(\\)?\$\([a-z0-9\-]+?(?:~[a-z0-9\-]*?)?\)/gi;
export function escapeCodicons(text) {
    return text.replace(escapeCodiconsRegex, function (match, escaped) { return escaped ? match : "\\" + match; });
}
var markdownEscapedCodiconsRegex = /\\\$\([a-z0-9\-]+?(?:~[a-z0-9\-]*?)?\)/gi;
export function markdownEscapeEscapedCodicons(text) {
    // Need to add an extra \ for escaping in markdown
    return text.replace(markdownEscapedCodiconsRegex, function (match) { return "\\" + match; });
}
var renderCodiconsRegex = /(\\)?\$\((([a-z0-9\-]+?)(?:~([a-z0-9\-]*?))?)\)/gi;
export function renderCodicons(text) {
    return text.replace(renderCodiconsRegex, function (_, escaped, codicon, name, animation) {
        return escaped
            ? "$(" + codicon + ")"
            : "<span class=\"codicon codicon-" + name + (animation ? " codicon-animation-" + animation : '') + "\"></span>";
    });
}
