import React from 'react';
import { Dialog } from '@material-ui/core';
import { ProjectContent } from '../ProjectContent';
export var ProjectModal = function (props) {
    var redirectTo = window.location.href;
    return (React.createElement(Dialog, { maxWidth: "lg", keepMounted: true, fullWidth: true, open: props.isModalOpen, onClose: props.onCloseModal }, props.isModalOpen && React.createElement(ProjectContent, { projectKey: props.projectKey, redirectTo: redirectTo, isModal: true })));
};
//# sourceMappingURL=ProjectModal.js.map