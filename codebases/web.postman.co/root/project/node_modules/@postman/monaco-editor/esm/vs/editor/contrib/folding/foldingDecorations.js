/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ModelDecorationOptions } from '../../common/model/textModel.js';
var FoldingDecorationProvider = /** @class */ (function () {
    function FoldingDecorationProvider(editor) {
        this.editor = editor;
        this.autoHideFoldingControls = true;
        this.showFoldingHighlights = true;
    }
    FoldingDecorationProvider.prototype.getDecorationOption = function (isCollapsed) {
        if (isCollapsed) {
            return this.showFoldingHighlights ? FoldingDecorationProvider.COLLAPSED_HIGHLIGHTED_VISUAL_DECORATION : FoldingDecorationProvider.COLLAPSED_VISUAL_DECORATION;
        }
        else if (this.autoHideFoldingControls) {
            return FoldingDecorationProvider.EXPANDED_AUTO_HIDE_VISUAL_DECORATION;
        }
        else {
            return FoldingDecorationProvider.EXPANDED_VISUAL_DECORATION;
        }
    };
    FoldingDecorationProvider.prototype.deltaDecorations = function (oldDecorations, newDecorations) {
        return this.editor.deltaDecorations(oldDecorations, newDecorations);
    };
    FoldingDecorationProvider.prototype.changeDecorations = function (callback) {
        return this.editor.changeDecorations(callback);
    };
    FoldingDecorationProvider.COLLAPSED_VISUAL_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        afterContentClassName: 'inline-folded',
        linesDecorationsClassName: 'codicon codicon-chevron-right'
    });
    FoldingDecorationProvider.COLLAPSED_HIGHLIGHTED_VISUAL_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        afterContentClassName: 'inline-folded',
        className: 'folded-background',
        isWholeLine: true,
        linesDecorationsClassName: 'codicon codicon-chevron-right'
    });
    FoldingDecorationProvider.EXPANDED_AUTO_HIDE_VISUAL_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        linesDecorationsClassName: 'codicon codicon-chevron-down'
    });
    FoldingDecorationProvider.EXPANDED_VISUAL_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        linesDecorationsClassName: 'codicon codicon-chevron-down alwaysShowFoldIcons'
    });
    return FoldingDecorationProvider;
}());
export { FoldingDecorationProvider };
