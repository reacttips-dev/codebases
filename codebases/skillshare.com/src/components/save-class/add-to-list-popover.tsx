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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import React, { useEffect, useState } from 'react';
import { CheckmarkIcon } from '../../Icons';
import { InputError, InputField } from '../../Input';
import { TrackableEvents } from '../../shared';
import { useTrackEvent } from '../../shared/hooks';
import { SmallcapsTitle } from '../../SmallcapsTitle';
import { Button, ButtonSize } from '../buttons';
import { AddToListStyle } from './add-to-list-style';
var updateSaveClassToListState = function (listItemsState, customListId) {
    var updatedListState = listItemsState.map(function (item) {
        if (item.customListId === customListId) {
            return __assign(__assign({}, item), { classIsInList: !item.classIsInList });
        }
        return item;
    });
    return updatedListState;
};
var setSaveContext = function (listItemsState, newListItem) {
    var updatedList = __spread([newListItem], listItemsState);
    return updatedList;
};
export var AddToListPopover = function (_a) {
    var fetchListItems = _a.fetchListItems, sku = _a.sku, onClickListItem = _a.onClickListItem, onCreateNewList = _a.onCreateNewList, saveClass = _a.saveClass, unsaveClass = _a.unsaveClass, isSaved = _a.isSaved, setIsSaved = _a.setIsSaved;
    var _b = __read(useState([]), 2), listItemsState = _b[0], setListItemsState = _b[1];
    var _c = __read(useState(true), 2), viewListState = _c[0], setViewListState = _c[1];
    var _d = __read(useState(false), 2), isListError = _d[0], setIsListError = _d[1];
    var _e = __read(useTrackEvent(), 1), trackEvent = _e[0];
    var getListItems = function (sku) {
        if (fetchListItems) {
            fetchListItems(sku).then(function (response) {
                setListItemsState(response);
            });
        }
    };
    var inputCreateListRef = React.createRef();
    var removeClassFromLists = function () {
        var currentSelectedLists = listItemsState.filter(function (item) { return item.classIsInList; });
        currentSelectedLists.forEach(function (listItem) {
            onClickListItem(sku, listItem.customListId, false);
        });
    };
    var onSaveClassToList = function (listItem) { return function () {
        var updatedListState = updateSaveClassToListState(listItemsState, listItem.customListId);
        setListItemsState(updatedListState);
        if (!onClickListItem) {
            return;
        }
        if (listItem.classIsInList) {
            onClickListItem(sku, listItem.customListId, false);
            return;
        }
        onClickListItem(sku, listItem.customListId, true);
    }; };
    var checkListName = function () {
        if (inputCreateListRef.current) {
            var val_1 = inputCreateListRef.current.value;
            var matches = listItemsState.filter(function (item) { return item.title.toLowerCase().trim() === val_1.toLowerCase().trim(); });
            setIsListError(matches.length > 0);
        }
    };
    var onEnterKey = function (event) {
        if (event.keyCode === 13) {
            onSaveList();
        }
    };
    var onToggleSaveToMyClasses = function () {
        if (!isSaved) {
            setIsSaved(true);
            saveClass();
            return;
        }
        setIsSaved(false);
        unsaveClass();
        removeClassFromLists();
        var updatedListState = listItemsState.map(function (item) {
            item.classIsInList = false;
            return item;
        });
        setListItemsState(updatedListState);
    };
    var onToggleCreateList = function () {
        setIsListError(false);
        setViewListState(!viewListState);
    };
    var onSaveList = function () {
        if (inputCreateListRef.current && inputCreateListRef.current.value.length > 0) {
            var title_1 = inputCreateListRef.current.value;
            if (onCreateNewList) {
                onCreateNewList(sku, title_1).then(function (response) {
                    var updatedList = setSaveContext(listItemsState, {
                        title: title_1,
                        customListId: response.id,
                        classIsInList: true,
                    });
                    trackEvent({ action: TrackableEvents.CreatedList });
                    setListItemsState(updatedList);
                    setIsSaved(true);
                    onToggleCreateList();
                });
            }
        }
    };
    var createListTitle = 'Create A New List';
    var popoverTitle = viewListState ? 'Saved To' : createListTitle;
    useEffect(function () {
        getListItems(sku);
    }, []);
    useEffect(function () {
        if (!viewListState && inputCreateListRef.current) {
            inputCreateListRef.current.focus();
        }
    }, [inputCreateListRef, viewListState]);
    return (React.createElement(AddToListStyle, { className: "add-to-list" },
        React.createElement(SmallcapsTitle, { text: popoverTitle }),
        viewListState ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "list-wrapper-container" },
                React.createElement("ul", { className: "list-wrapper" },
                    React.createElement("li", { className: "list-item" },
                        React.createElement("div", { className: "save-my-classes", onClick: onToggleSaveToMyClasses, onKeyPress: onToggleSaveToMyClasses, role: "link", tabIndex: 0 },
                            "My Classes",
                            isSaved && (React.createElement("span", { className: "check" },
                                React.createElement(CheckmarkIcon, { className: "checkmark-icon", strokeColor: "white" }))))),
                    React.createElement("li", { className: "list-break" }),
                    listItemsState.map(function (item, index) {
                        return (React.createElement("li", { className: "list-item list-id-" + item.customListId, key: index, onClick: onSaveClassToList(item) },
                            React.createElement("div", { role: "link" },
                                item.title,
                                item.classIsInList && (React.createElement("span", { className: "check" },
                                    React.createElement(CheckmarkIcon, { className: "checkmark-icon", strokeColor: "white" }))))));
                    }))),
            React.createElement("div", { className: "create-playlist" },
                React.createElement("span", { className: "create-playlist-link", onClick: onToggleCreateList, onKeyPress: onToggleCreateList, role: "link", tabIndex: 0 }, createListTitle)))) : (React.createElement("div", { className: "create-list-form", role: "form" },
            React.createElement(InputField, { "aria-label": "Create List", autoComplete: "off", autoFocus: true, className: "create-list-input " + (isListError ? 'error' : ''), name: "Create List", onKeyDown: onEnterKey, onKeyUp: checkListName, placeholder: "List Name", ref: inputCreateListRef, type: "text" }),
            isListError && React.createElement(InputError, { error: "You already have a list with this name" }),
            React.createElement("div", { className: "nav" },
                React.createElement("span", { className: "back-link", onClick: onToggleCreateList, onKeyPress: onToggleCreateList, role: "link", tabIndex: 0 }, "Back"),
                React.createElement(Button, { className: "save-button", disabled: isListError, onClick: onSaveList, size: ButtonSize.Small, text: "Save" }))))));
};
//# sourceMappingURL=add-to-list-popover.js.map