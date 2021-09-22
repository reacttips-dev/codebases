import React from 'react';
import dompurify from 'isomorphic-dompurify';
import { Button, ButtonSize, ButtonType } from '../../../components/buttons';
import { CommentEditorStyle } from './CommentEditor.style';
export var CommentEditor = function (props) { return (React.createElement(CommentEditorStyle, null,
    React.createElement("div", { className: "comment-edit-field", onInput: props.onUpdateText, contentEditable: true, dangerouslySetInnerHTML: { __html: dompurify.sanitize(props.contentHTML, { ADD_ATTR: ['target'] }) } }),
    React.createElement("div", { className: "edit-buttons-wrapper" },
        React.createElement(Button, { text: "Cancel", className: "cancel-button", type: ButtonType.AltNavyGhost, onClick: props.onCancelClick, size: ButtonSize.Medium }),
        React.createElement(Button, { text: "Update", loading: props.isLoading, disabled: props.isLoading, onClick: props.onUpdateClick, size: ButtonSize.Medium })))); };
//# sourceMappingURL=CommentEditor.js.map