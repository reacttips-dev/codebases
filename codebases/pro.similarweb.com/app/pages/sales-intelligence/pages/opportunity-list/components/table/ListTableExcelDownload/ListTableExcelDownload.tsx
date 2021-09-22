import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import UnlockModal from "components/Modals/src/UnlockModal/UnlockModal";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useSalesSettingsHelper } from "../../../../../services/salesSettingsHelper";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import { CommonModalConfig } from "components/Modals/src/UnlockModal/configs/commonUnlockModalConfig";
import { StyledExcelDownloadContainer } from "./styles";

type ListTableExcelDownloadProps = {
    list: OpportunityListType;
    downloading: boolean;
    downloadToExcel(listId: OpportunityListType["opportunityListId"]): void;
};

const ListTableExcelDownload = (props: ListTableExcelDownloadProps) => {
    const translate = useTranslation();
    const {
        list: { opportunityListId },
        downloading,
        downloadToExcel,
    } = props;
    const [unlockModalOpen, setUnlockModalOpen] = React.useState(false);
    const isDownloadAllowed = useSalesSettingsHelper().isExcelAllowed();

    function closeUnlockModal() {
        setUnlockModalOpen(false);
    }

    function handleDownloadClick() {
        if (isDownloadAllowed) {
            return downloadToExcel(opportunityListId);
        }

        setUnlockModalOpen(true);
    }

    return (
        <StyledExcelDownloadContainer>
            <UnlockModal
                isOpen={unlockModalOpen}
                onCloseClick={closeUnlockModal}
                {...CommonModalConfig()["DownloadTable"]}
                location="Hook PRO/Sales Intelligence/Download list table to excel"
            />
            <PlainTooltip
                tooltipContent={translate("si.pages.single_list.export_to_excel.tooltip")}
            >
                <div>
                    <IconButton
                        type="flat"
                        isLoading={downloading}
                        isDisabled={downloading}
                        onClick={handleDownloadClick}
                        dataAutomation="si-static-list-export-to-excel-button"
                        iconName={isDownloadAllowed ? "excel" : "excel-locked"}
                    />
                </div>
            </PlainTooltip>
        </StyledExcelDownloadContainer>
    );
};

export default ListTableExcelDownload;
