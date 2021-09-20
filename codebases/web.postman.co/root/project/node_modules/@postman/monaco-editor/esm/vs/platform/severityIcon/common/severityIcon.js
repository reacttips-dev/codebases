/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import Severity from '../../../base/common/severity.js';
import { registerThemingParticipant } from '../../theme/common/themeService.js';
import { problemsErrorIconForeground, problemsInfoIconForeground, problemsWarningIconForeground } from '../../theme/common/colorRegistry.js';
export var SeverityIcon;
(function (SeverityIcon) {
    function className(severity) {
        switch (severity) {
            case Severity.Ignore:
                return 'severity-ignore codicon-info';
            case Severity.Info:
                return 'codicon-info';
            case Severity.Warning:
                return 'codicon-warning';
            case Severity.Error:
                return 'codicon-error';
        }
        return '';
    }
    SeverityIcon.className = className;
})(SeverityIcon || (SeverityIcon = {}));
registerThemingParticipant(function (theme, collector) {
    var errorIconForeground = theme.getColor(problemsErrorIconForeground);
    if (errorIconForeground) {
        collector.addRule("\n\t\t\t.monaco-editor .zone-widget .codicon-error,\n\t\t\t.markers-panel .marker-icon.codicon-error,\n\t\t\t.extensions-viewlet > .extensions .codicon-error,\n\t\t\t.monaco-dialog-box .dialog-message-row .codicon-error {\n\t\t\t\tcolor: " + errorIconForeground + ";\n\t\t\t}\n\t\t");
    }
    var warningIconForeground = theme.getColor(problemsWarningIconForeground);
    if (errorIconForeground) {
        collector.addRule("\n\t\t\t.monaco-editor .zone-widget .codicon-warning,\n\t\t\t.markers-panel .marker-icon.codicon-warning,\n\t\t\t.extensions-viewlet > .extensions .codicon-warning,\n\t\t\t.extension-editor .codicon-warning,\n\t\t\t.monaco-dialog-box .dialog-message-row .codicon-warning {\n\t\t\t\tcolor: " + warningIconForeground + ";\n\t\t\t}\n\t\t");
    }
    var infoIconForeground = theme.getColor(problemsInfoIconForeground);
    if (errorIconForeground) {
        collector.addRule("\n\t\t\t.monaco-editor .zone-widget .codicon-info,\n\t\t\t.markers-panel .marker-icon.codicon-info,\n\t\t\t.extensions-viewlet > .extensions .codicon-info,\n\t\t\t.extension-editor .codicon-info,\n\t\t\t.monaco-dialog-box .dialog-message-row .codicon-info {\n\t\t\t\tcolor: " + infoIconForeground + ";\n\t\t\t}\n\t\t");
    }
});
