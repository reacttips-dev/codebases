var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { color, typography } from '../../themes/utils';
import { SaveClassIcon, SavedClassIcon } from '../icons';
import { Popover } from '../popover';
import { AddToListPopover } from './add-to-list-popover';
import { useSaveClassButtonState } from './save-class-button.state';
import { useSaveClassState } from './save-class.state';
var SaveClassStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", ";\n    color: ", ";\n    cursor: pointer;\n"], ["\n    ", ";\n    color: ", ";\n    cursor: pointer;\n"])), typography(function (t) { return t.normal; }), color(function (c) { return c.charcoal; }));
export var SaveClassButton = function (props) {
    var _a = useSaveClassState(props.sku), saveClass = _a.saveClass, unsaveClass = _a.unsaveClass;
    var _b = useSaveClassButtonState(props), updateSaveState = _b.updateSaveState, isSaved = _b.isSaved, renderPopoverContent = _b.renderPopoverContent, setIsSaved = _b.setIsSaved;
    var saveIcon = props.saveIcon || React.createElement(SaveClassIcon, null);
    var savedIcon = props.savedIcon || React.createElement(SavedClassIcon, null);
    var icon = isSaved ? savedIcon : saveIcon;
    return (React.createElement(SaveClassStyle, null,
        React.createElement(Popover, { click: true, position: "bottom", portalContainer: props.portalContainer, targetContent: React.createElement("div", { onClick: updateSaveState, className: "save-class", role: "button" }, icon), renderPopoverContent: renderPopoverContent, popoverContent: React.createElement(AddToListPopover, { fetchListItems: props.fetchListItems, onClickListItem: props.onClickListItem, onCreateNewList: props.onCreateNewList, setIsSaved: setIsSaved, isSaved: isSaved, saveClass: saveClass, unsaveClass: unsaveClass, sku: props.sku }) })));
};
var templateObject_1;
//# sourceMappingURL=save-class-button.js.map