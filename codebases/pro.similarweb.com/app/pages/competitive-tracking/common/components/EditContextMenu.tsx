import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import _ from "lodash";
import { ReactIconButton } from "components/React/ReactIconButton/ReactIconButton";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { Dropdown, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

// TODO: this is lo sababa, we should move it to a proper place
const onEditClick = (trackerId) => () => {
    TrackWithGuidService.trackWithGuid("competitive.tracking.edit.click", "click", {
        tracker: trackerId,
    });
    const navigator = Injector.get<SwNavigator>("swNavigator");
    navigator.go("companyResearch_competitiveTracking_edit", { trackerId });
};

export const EditContextMenu = ({
    trackerId,
    onToggle = _.noop,
    onEditClickCallback = onEditClick,
    onDeleteClickCallback,
}) => {
    const contextMenuItems = [
        <ReactIconButton key={"settings"} iconName="settings" width="25px" height="25px" />,
        {
            id: "edit",
            iconName: "edit-icon",
            text: i18nFilter()("segment.analysis.table.additional.options.edit"),
            onClickFunc: onEditClickCallback(trackerId),
        },
        {
            id: "delete",
            iconName: "delete",
            text: i18nFilter()("segments.module.additional.options.delete.segment"),
            onClickFunc: onDeleteClickCallback,
        },
    ];
    return (
        <Dropdown
            dropdownPopupPlacement="bottom-left"
            buttonWidth="40px"
            width="180px"
            itemsComponent={EllipsisDropdownItem}
            onClick={(action) => action.onClickFunc(action.id)}
            onToggle={onToggle}
        >
            {contextMenuItems}
        </Dropdown>
    );
};
