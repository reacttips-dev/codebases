import React from "react";
import { ColumnsPicker, IColumnData } from "@similarweb/ui-components/dist/columns-picker";
import { FlexTableColumnType } from "pages/sales-intelligence/types";
import { ProModal } from "components/Modals/src/ProModal";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { getSearchResultsTableColumnPickerGroups } from "../../../configuration/table-columns";
import { PICKER_HEIGHT, CUSTOM_MODAL_STYLES, StyledModalGlobal } from "./styles";

type ColumnsSelectionModalProps = {
    isOpened: boolean;
    columns: readonly FlexTableColumnType[];
    onCancel(): void;
    onApply(columns: FlexTableColumnType[]): void;
};

const ColumnsSelectionModal = (props: ColumnsSelectionModalProps) => {
    const translate = useTranslation();
    const { isOpened, columns, onCancel, onApply } = props;
    const columnPickerGroups = React.useMemo(
        () => getSearchResultsTableColumnPickerGroups(translate),
        [],
    );

    return (
        <ProModal
            isOpen={isOpened}
            showCloseIcon={false}
            shouldCloseOnOverlayClick={false}
            customStyles={CUSTOM_MODAL_STYLES}
        >
            <StyledModalGlobal />
            <ColumnsPicker
                showRestore={false}
                height={PICKER_HEIGHT}
                onApplyClick={onApply}
                onCancelClick={onCancel}
                groupsData={columnPickerGroups}
                width={CUSTOM_MODAL_STYLES.content.width}
                columnsData={(columns as unknown) as IColumnData[]}
                onRestoreClick={(...args) => console.log("onRestoreClick", args)}
            />
        </ProModal>
    );
};

export default ColumnsSelectionModal;
