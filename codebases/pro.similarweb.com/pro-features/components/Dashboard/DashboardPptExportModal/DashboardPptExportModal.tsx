import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ProModal } from "../../../../.pro-features/components/Modals/src/ProModal";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    ButtonContainer,
} from "components/Dashboard/DashboardPptExportModal/DashboardPptExportModalStyles";
import { DashboardPptExportList } from "components/Dashboard/DashboardPptExportModal/DashboardPptExportList/DashboardPptExportList";
import { i18nFilter } from "filters/ngFilters";
import {
    IDashboardExportListItem,
    IDashboardPptExportModalProps,
} from "./DashboardPptExportModalTypes";

export const DashboardPptExportModal: FC<IDashboardPptExportModalProps> = (props) => {
    const { isOpen, onClose, widgets, onExport } = props;

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
        };
    }, []);

    const [widgetsList, setWidgetsList] = useState<IDashboardExportListItem[]>(widgets);
    useEffect(() => {
        setWidgetsList(widgets);
    }, [widgets]);

    /**
     * Update the isSelected property of the item that corresponds to the given id
     * this enables a basic checklist state management.
     */
    const updateSelectionInList = (id: string, isSelected: boolean) => {
        return widgetsList.map((item) => {
            const isTargetItem = item.id === id;
            const selectionState = isTargetItem ? isSelected : item.isSelected;
            return { ...item, isSelected: selectionState };
        });
    };

    /**
     * Update the given item details in the widgets list. used for updating the checked
     * items in the checklist.
     */
    const handleItemToggle = (item: IDashboardExportListItem) => {
        const updatedList = updateSelectionInList(item.id, !item.isSelected);
        setWidgetsList(updatedList);
    };

    /**
     * We want to enable export only in case we have at least one widget
     * that is selected.
     */
    const shouldEnableExport = useMemo(() => {
        return widgetsList.some((item) => !item.isDisabled && item.isSelected);
    }, [widgetsList]);

    return (
        <ProModal
            className="ppt-export-modal"
            isOpen={isOpen}
            onCloseClick={onClose}
            customStyles={{ content: { padding: 0, width: 368 } }}
            showCloseIcon={false}
        >
            <ModalHeader>
                <span>{services.translate("dashboard.export.modal.title")}</span>
            </ModalHeader>

            <ModalBody>
                <DashboardPptExportList
                    listItems={widgetsList}
                    onToggleWidgetSelect={handleItemToggle}
                />
            </ModalBody>

            <ModalFooter>
                <ButtonContainer>
                    <Button type="flat" onClick={onClose}>
                        {services.translate("dashboard.export.modal.cancel.button")}
                    </Button>
                </ButtonContainer>
                <ButtonContainer>
                    <IconButton
                        iconName="ppt"
                        type="primary"
                        isDisabled={!shouldEnableExport}
                        onClick={() => onExport(widgetsList)}
                    >
                        {services.translate("dashboard.export.modal.export.button")}
                    </IconButton>
                </ButtonContainer>
            </ModalFooter>
        </ProModal>
    );
};
