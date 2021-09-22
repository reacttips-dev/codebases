import React from "react";
import { numberFilter } from "filters/ngFilters";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledExportModalFooter,
    StyledExportSubtitle,
    StyledExportTitle,
    StyledExportModalBody,
    StyledExportModalInner,
} from "./styles";
import { WithSearchAutoRerunProps } from "../../hoc/withSearchAutoRerun";

export type SavedSearchExportModalProps = WithSearchAutoRerunProps & {
    isOpen: boolean;
    onCancel(): void;
    onConfirm(): void;
    exportedDomains: number;
};

const CUSTOM_STYLES = {
    content: {
        minHeight: 225,
        padding: 0,
        width: 460,
    },
};
const formatAsNumber = numberFilter();
const SavedSearchExportModal = (props: SavedSearchExportModalProps) => {
    const translate = useTranslation();
    const { isOpen, onCancel, onConfirm, autoRerunAvailable, exportedDomains } = props;
    const subtitle = React.useMemo(() => {
        if (autoRerunAvailable) {
            return translate("si.components.search_excel_export_modal.quota_not_reached_subtitle");
        }

        return translate("si.components.search_excel_export_modal.quota_reached_subtitle");
    }, [autoRerunAvailable]);

    return (
        <ProModal
            isOpen={isOpen}
            showCloseIcon={false}
            customStyles={CUSTOM_STYLES}
            shouldCloseOnOverlayClick={false}
        >
            <StyledExportModalInner>
                <StyledExportModalBody>
                    <StyledExportTitle>
                        <span>
                            {translate("si.components.search_excel_export_modal.title", {
                                numberOfDomains: formatAsNumber(exportedDomains),
                            })}
                        </span>
                    </StyledExportTitle>
                    <StyledExportSubtitle>
                        <span>{subtitle}</span>
                    </StyledExportSubtitle>
                </StyledExportModalBody>
                <StyledExportModalFooter>
                    <Button
                        type="flat"
                        onClick={onCancel}
                        data-automation="si-search-excel-export-button-cancel"
                    >
                        {translate("si.common.button.no_thanks")}
                    </Button>
                    <Button
                        type="primary"
                        onClick={onConfirm}
                        data-automation="si-search-excel-export-button-confirm"
                    >
                        {translate("si.common.button.yes")}
                    </Button>
                </StyledExportModalFooter>
            </StyledExportModalInner>
        </ProModal>
    );
};

export default SavedSearchExportModal;
