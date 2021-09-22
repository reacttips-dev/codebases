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
import React from 'react';
import { merge } from 'lodash';
import { Avatar, AvatarSizes } from '../../../Avatar';
import { SmallcapsTitle } from '../../../SmallcapsTitle';
import { SearchBoxDisplayModes } from './display-modes';
import { SearchBoxResultsMenuStyle2020 } from './results-menu-style2020';
export var SearchBoxResultsMenu = function (_a) {
    var query = _a.query, data = _a.data, displayMode = _a.displayMode, onQuerySubmit = _a.onQuerySubmit, activeSuggestionIndex = _a.activeSuggestionIndex;
    var SearchBoxResultsStyle = SearchBoxResultsMenuStyle2020;
    data = merge(data, {
        skills: [],
        teachers: [],
    });
    var skills = data.skills, teachers = data.teachers;
    var skillsSectionProps = {
        style: {
            display: skills.length > 0 ? 'block' : 'none',
        },
    };
    var teachersSectionProps = {
        style: {
            display: teachers.length > 0 ? 'block' : 'none',
        },
    };
    var menuWrapperStyle = {};
    if (displayMode === SearchBoxDisplayModes.Compact) {
        menuWrapperStyle = {
            zIndex: 100,
        };
    }
    else if (skills.length === 0 && teachers.length === 0) {
        menuWrapperStyle = {
            display: 'none',
        };
    }
    var onSearchSelect = function (query) { return function () {
        if (onQuerySubmit) {
            onQuerySubmit(query);
        }
    }; };
    var linkIndex = 0;
    var getClassNameForIndex = function (index, otherClassNames) {
        return "" + otherClassNames + (activeSuggestionIndex === index ? ' active' : '');
    };
    var highlightSubstring = function (fullString) {
        if (query) {
            var fullStringLowercase = fullString.toLowerCase();
            var queryLowercase = query.toLowerCase();
            var startIndex = fullStringLowercase.indexOf(queryLowercase);
            if (startIndex >= 0) {
                var endIndex = startIndex + query.length;
                return (React.createElement("span", null,
                    fullString.substr(0, startIndex),
                    React.createElement("strong", null, fullString.substr(startIndex, query.length)),
                    fullString.substr(endIndex, fullString.length)));
            }
        }
        return fullString;
    };
    return (React.createElement("div", { className: "search-results-menu", style: menuWrapperStyle },
        React.createElement(SearchBoxResultsStyle, null,
            React.createElement("div", { className: "results-list-wrapper" },
                React.createElement("div", __assign({ className: "results-list skills-results-list" }, skillsSectionProps), skills.map(function (skill) {
                    linkIndex++;
                    var linkId = "skill-item-" + skill.id;
                    var linkKey = skill.id;
                    return (React.createElement("a", { id: linkId, key: linkKey, href: "/search?query=" + encodeURIComponent(skill.name) + "&searchMethod=autocomplete", className: getClassNameForIndex(linkIndex, 'list-item'), onClick: onSearchSelect(skill.name) }, highlightSubstring(skill.name)));
                })),
                React.createElement("div", __assign({ className: "results-list teachers-results-list" }, teachersSectionProps),
                    React.createElement(SmallcapsTitle, { text: 'Teachers' }),
                    teachers.map(function (teacher) {
                        linkIndex++;
                        var linkId = "teacher-item-" + teacher.id;
                        var linkKey = teacher.id;
                        return (React.createElement("a", { id: linkId, key: linkKey, href: teacher.url, className: getClassNameForIndex(linkIndex, 'list-item') },
                            React.createElement(Avatar, { src: teacher.avatar, size: AvatarSizes.Small, alt: teacher.name }),
                            ' ',
                            highlightSubstring(teacher.name)));
                    }))))));
};
//# sourceMappingURL=results-menu.js.map