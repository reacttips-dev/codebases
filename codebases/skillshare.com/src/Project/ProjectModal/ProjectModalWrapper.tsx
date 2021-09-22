var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useState } from 'react';
import { ProjectModalWrapperStyle } from '../../components/projects/modal-wrapper-style';
import { ProjectModal } from './ProjectModal';
export var ProjectModalWrapper = function (props) {
    var _a = __read(useState(false), 2), isModalOpen = _a[0], toggleModal = _a[1];
    var openModal = function () {
        window.onpopstate = function () {
            toggleModal(false);
        };
        toggleModal(true);
    };
    var closeModal = function () {
        window.history.back();
    };
    return (React.createElement(ProjectModalWrapperStyle, { onClick: openModal },
        React.createElement(ProjectModal, __assign({ isModalOpen: isModalOpen, onCloseModal: closeModal }, props))));
};
//# sourceMappingURL=ProjectModalWrapper.js.map