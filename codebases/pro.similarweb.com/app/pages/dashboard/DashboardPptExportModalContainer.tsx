import { IWidget } from "components/widget/widget-types/Widget";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC } from "react";
import { DashboardPptExportModal } from "components/Dashboard/DashboardPptExportModal/DashboardPptExportModal";
import _ from "lodash";
import { IDashboardExportListItem } from "components/Dashboard/DashboardPptExportModal/DashboardPptExportModalTypes";

interface IDashboardPptExportModalContainerProps {
    isOpen: boolean;
    widgets: IDashboardExportListItem[];
    onClose: () => void;
    onExport: (widgetsToExport: IDashboardExportListItem[]) => Promise<void>;
}

export const DashboardPptExportModalContainer: FC<IDashboardPptExportModalContainerProps> = (
    props,
) => {
    const { widgets = [], isOpen, onClose, onExport } = props;
    return (
        <DashboardPptExportModal
            widgets={widgets}
            isOpen={isOpen}
            onClose={onClose}
            onExport={onExport}
        />
    );
};

SWReactRootComponent(DashboardPptExportModalContainer, "DashboardPptExportModalContainer");
