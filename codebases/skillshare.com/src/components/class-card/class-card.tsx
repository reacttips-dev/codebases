var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
import clsx from 'clsx';
import styled from 'styled-components';
import { PlayIcon } from '../../Icons';
import { TrackableEvents } from '../../shared';
import { getClassDuration, getTeacherUrl, getUrlAndOverrideVia } from '../../shared/helpers';
import { useTrackEvent } from '../../shared/hooks';
import { SkillshareOriginalBadge, SkillshareStaffPickBadge } from '../badges';
import { SaveClassButton } from '../save-class';
import { badgeStyle, cardStyle, classDataStyle } from './styles';
export var ClassBadgeType;
(function (ClassBadgeType) {
    ClassBadgeType["Original"] = "ORIGINAL";
    ClassBadgeType["StaffPick"] = "STAFF_PICK";
})(ClassBadgeType || (ClassBadgeType = {}));
export var ClassCardStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    ", "\n    ", "\n"], ["\n    ", "\n    ", "\n    ", "\n"])), cardStyle, badgeStyle, classDataStyle);
export var parentHasClassName = function (element, classname) {
    if (element.className && element.className.toString().split(' ').indexOf(classname) >= 0) {
        return true;
    }
    return (element.parentNode && parentHasClassName(element.parentNode, classname)) || false;
};
export var ClassCard = function (props) {
    var thumbnailStyle = {
        backgroundImage: "url(" + props.largeCoverUrl + ")",
    };
    var _a = __read(useState(false), 2), isActive = _a[0], setIsActive = _a[1];
    var _b = __read(useState(false), 2), isHover = _b[0], setIsHover = _b[1];
    var _c = __read(useTrackEvent(), 1), trackEvent = _c[0];
    var badge = props.badges[0];
    var isSkillshareOriginal = badge && badge.type === ClassBadgeType.Original;
    var isStaffPick = badge && badge.type === ClassBadgeType.StaffPick;
    var teacherUrl = getTeacherUrl(props.teacher, props.via);
    var url = getUrlAndOverrideVia(props.url, props.via);
    var addActiveClass = function (e) {
        if (['a', 'path', 'svg'].indexOf(e.target.tagName.toLowerCase()) === -1) {
            e.stopPropagation();
            setIsActive(true);
            return;
        }
        setIsActive(false);
    };
    var addHoverClass = function (e) {
        if (!parentHasClassName(e.target, 'pop')) {
            setIsHover(true);
        }
    };
    var cssClass = clsx('class-card-inner-wrapper', {
        'class-card-active': isActive,
        'class-card-hover': isHover,
    });
    var removeActiveClass = function () {
        setIsActive(false);
        setIsHover(false);
    };
    var saveClass = function (evt) {
        evt.stopPropagation();
    };
    var onTeacherClick = function (e) {
        e.stopPropagation();
        trackEvent({
            action: props.trackEventTeacher || TrackableEvents['Clicked-SearchResult-Teacher'],
            other: {
                teacherUrl: "" + window.location.origin + teacherUrl,
            },
        });
    };
    var visitClass = function (e) {
        e.stopPropagation();
        trackEvent({
            action: props.trackEventCard || TrackableEvents['Clicked-SearchResult-Class'],
            other: {
                rank: (Number(props.cursor) + 1).toString(),
                sku: props.sku,
            },
        });
        document.location.href = url;
    };
    return (React.createElement(ClassCardStyle, { className: "class-card", onClick: visitClass, onMouseDown: addActiveClass, onMouseEnter: addHoverClass, onMouseUp: removeActiveClass, onMouseLeave: removeActiveClass },
        React.createElement("div", { className: cssClass, role: "button" },
            React.createElement("a", { className: "class-link", href: url, onClick: visitClass }, props.title),
            isSkillshareOriginal && React.createElement(SkillshareOriginalBadge, { gradient: true }),
            isStaffPick && React.createElement(SkillshareStaffPickBadge, { gradient: true }),
            React.createElement("div", { className: "hover-target" },
                React.createElement("div", { className: "thumbnail js-class-preview" },
                    React.createElement("span", { className: "thumbnail-img-holder", style: thumbnailStyle },
                        React.createElement("span", { className: "play-button" },
                            React.createElement(PlayIcon, { width: 40 })))),
                React.createElement("div", { className: "content" },
                    React.createElement("div", { className: "stats" },
                        React.createElement("div", { className: "duration" },
                            React.createElement("span", null, getClassDuration(props.durationInSeconds))),
                        React.createElement("span", { className: "student-count" },
                            props.studentCount,
                            " students")),
                    React.createElement("p", { className: "title" }, props.title))),
            React.createElement("div", { className: "content" },
                React.createElement("div", { className: "teacher-save-container" },
                    React.createElement("div", { className: "teacher-placeholder" },
                        React.createElement("div", { className: "user-information small" },
                            React.createElement("a", { href: teacherUrl, className: "link-main no-bold title-link initialized", "data-ss-username": props.teacher.username, onClick: onTeacherClick }, props.teacher.name))),
                    !props.hideSave && (React.createElement("div", { className: "wishlist-button-container" },
                        React.createElement("a", { onClick: saveClass, className: "sk-icon" },
                            React.createElement(SaveClassButton, { sku: props.sku, classId: props.id, fetchListItems: props.fetchListItems, onClickListItem: props.onClickListItem, onCreateNewList: props.onCreateNewList, saved: props.viewer && props.viewer.hasSavedClass && !props.renderSignupView, renderSignupView: props.renderSignupView, portalContainer: document.querySelector('body') })))))))));
};
var templateObject_1;
//# sourceMappingURL=class-card.js.map