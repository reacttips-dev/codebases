import React from "react";
import { Dropdown, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { i18nFilter } from "filters/ngFilters";
import { itsMyOwnSegment } from "pages/segments/analysis/CustomSegmentsTableConfig";
import {
    SegmentsEllipsisButton,
    StyledDropdownContainer,
} from "pages/segments/start-page/StyledComponents";

interface SegmentsAddtionalOptionsEllipsis {
    onClickDuplicate?: (row: any) => void;
    onClickEdit?: (row: any) => void;
    onClickDelete?: (row: any) => void;
    onToggleEllipsis?: (boolean) => void;
    row?: any;
    groupEllipsis?: boolean;
}

export const SegmentsStartTableAdditionalOptionsEllipsis = (
    props: SegmentsAddtionalOptionsEllipsis,
) => {
    const {
        onClickDuplicate,
        onClickEdit,
        onClickDelete,
        onToggleEllipsis,
        groupEllipsis,
        row,
    } = props;
    function initialMenuContent() {
        return [<SegmentsEllipsisButton key="SegmentsEllipsisButton" />];
    }

    const actionsList = React.useMemo(() => {
        let actionsMenu = initialMenuContent();
        if (row) {
            const edit = {
                id: "edit",
                iconName: "edit",
                text: i18nFilter()("segment.analysis.table.additional.options.edit"),
                onClickFunc: () => onClickEdit(row),
            };
            const copyAndEdit = {
                id: "copyAndEdit",
                iconName: "copy-and-edit",
                text: i18nFilter()("segment.analysis.table.additional.options.copy.and.edit"),
                onClickFunc: () => onClickDuplicate(row),
            };
            const deleteObj = {
                id: "delete",
                iconName: "delete",
                text: i18nFilter()("segments.module.additional.options.delete.segment"),
                onClickFunc: () => onClickDelete(row),
            };

            if (groupEllipsis) {
                actionsMenu = actionsMenu.concat([edit, deleteObj] as any);
            } else {
                if (itsMyOwnSegment(row?.userId)) {
                    actionsMenu = actionsMenu.concat(
                        (row?.segmentAdvancedDisabled
                            ? [deleteObj]
                            : [edit, copyAndEdit, deleteObj]) as any,
                    );
                } else {
                    actionsMenu = actionsMenu.concat(
                        (row?.segmentAdvancedDisabled ? [] : [copyAndEdit]) as any,
                    );
                }
            }
        }
        return actionsMenu;
    }, [row, groupEllipsis, onClickEdit, onClickDuplicate, onClickDelete]);

    return actionsList.length > 1 ? (
        <StyledDropdownContainer>
            <Dropdown
                dropdownPopupPlacement="ontop-right"
                buttonWidth="40px"
                width="180px"
                itemsComponent={EllipsisDropdownItem}
                onClick={(action) => action.onClickFunc(action.id)}
                onToggle={onToggleEllipsis}
            >
                {actionsList}
            </Dropdown>
        </StyledDropdownContainer>
    ) : null;
};
