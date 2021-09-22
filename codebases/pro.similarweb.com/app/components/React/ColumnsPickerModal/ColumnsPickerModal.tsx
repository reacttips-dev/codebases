import * as React from "react";
import * as _ from "lodash";
import swLog from "@similarweb/sw-log";
import {
    ColumnsPicker,
    IColumnsPickerProps,
    IColumnData,
} from "@similarweb/ui-components/dist/columns-picker";
import { i18nFilter } from "filters/ngFilters";
import UIComponentStateService from "services/UIComponentStateService";
import {
    IProModalCustomStyles,
    ProModal,
} from "../../../../.pro-features/components/Modals/src/ProModal";
import { allTrackers } from "../../../services/track/track";

const proModalStyles: IProModalCustomStyles = {
    content: {
        padding: 0,
        width: "600px",
    },
    overlay: {
        zIndex: 1060,
    },
};

interface IColumnsPickerModalProps extends IColumnsPickerProps {
    isOpen: boolean;
    storageKey?: string;
    defaultColumnsData?: IColumnData[];
}

function trackGroupToggle({ selected, group }) {
    const action = selected ? "add" : "remove";
    allTrackers.trackEvent("checkbox", action, `column group picker/group/${group.displayName}`);
}

function trackColumnToggle({ selected, column }) {
    const action = selected ? "add" : "remove";
    allTrackers.trackEvent("checkbox", action, `column group picker/column/${column.displayName}`);
}

function getVisibleColumnsNamesByGroup(columns) {
    return columns.reduce((all, column) => {
        const { visible, displayName, groupKey } = column;
        if (visible && groupKey) {
            const { [groupKey]: members = [] } = all;
            return {
                ...all,
                [groupKey]: [...members, displayName],
            };
        }
        return all;
    }, {});
}

function trackApply(columns) {
    const selectedColumns = JSON.stringify(getVisibleColumnsNamesByGroup(columns));
    allTrackers.trackEvent("Button", "click", `column group picker/apply`); //, selectedColumns);
    return columns;
}

function trackRestore(columns) {
    allTrackers.trackEvent("Button", "click", `column group picker/restore default`);
    return columns;
}

const setColumnsData = (key) => (columnsData) => {
    const toggles = {};
    columnsData.forEach((column) => (toggles[column.field] = !!column.visible));
    UIComponentStateService.setItem(key, "localStorage", toggles);
    return columnsData.map((column) => ({
        ...column,
        visible: !!column.visible,
    }));
};

const getColumnsData = (key, columnsData) => {
    const toggles = UIComponentStateService.getItem(key, "localStorage");
    if (toggles) {
        return columnsData.map((column) => ({
            ...column,
            visible: toggles[column.field],
        }));
    }
    return columnsData;
};

const restoreColumnsData = (key, defaultColumnsData) => () => {
    return setColumnsData(key)(defaultColumnsData);
};

const shouldShowRestore = (crrData, storageData) => {
    return crrData.reduce((acc, crr) => {
        return (
            acc ||
            !!crr.visible !== !!storageData.find((storage) => storage.field === crr.field).visible
        );
    }, false);
};

export const ColumnsPickerModal = (props: IColumnsPickerModalProps) => {
    let columnsData, applyActions, showRestore, restoreActions;
    React.useEffect(() => {
        if (!props.storageKey)
            swLog.warn("Column toggle saving is DISABLED, must supply a 'storageKey' prop");
    }, []);

    if (props.storageKey) {
        const key = `${props.storageKey}_Table_columnsToggles`;
        const defaultColumnsData = props.defaultColumnsData || props.columnsData;
        columnsData = getColumnsData(key, props.columnsData);
        applyActions = [trackApply, setColumnsData(key), props.onApplyClick];
        showRestore = props.showRestore
            ? shouldShowRestore(defaultColumnsData, columnsData)
            : false;
        restoreActions = [
            trackRestore,
            restoreColumnsData(key, defaultColumnsData),
            props.onApplyClick,
        ];
    } else {
        columnsData = props.columnsData;
        applyActions = [trackApply, props.onApplyClick];
        showRestore = false;
        restoreActions = [_.identity];
    }
    return (
        <ProModal
            isOpen={props.isOpen}
            showCloseIcon={false}
            onCloseClick={props.onCancelClick}
            customStyles={proModalStyles}
        >
            <ColumnsPicker
                {...props}
                width={600}
                onGroupToggle={trackGroupToggle}
                onColumnToggle={trackColumnToggle}
                onApplyClick={_.flow(applyActions)}
                columnsData={columnsData}
                showRestore={showRestore}
                onRestoreClick={_.flow(restoreActions)}
            />
        </ProModal>
    );
};

ColumnsPickerModal.defaultProps = {
    titleText: i18nFilter()("modal.column_picker.title"),
    cancelText: i18nFilter()("modal.column_picker.cancel"),
    applyText: i18nFilter()("modal.column_picker.apply"),
    searchPlaceholderText: i18nFilter()("modal.column_picker.search_placeholder"),
    noResultsText: i18nFilter()("modal.column_picker.no_results"),
    restoreText: i18nFilter()("modal.column_picker.restore_default"),
};
