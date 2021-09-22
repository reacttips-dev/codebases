import React from "react";
import OutOfLimitModal from "pages/sales-intelligence/common-components/modals/OutOfLimitModal/OutOfModalLimit";
import { getQuotaModalInfo } from "pages/sales-intelligence/helpers/quotaModal/helpers";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";

type IndustryModalOutLimitProps = {
    activePanel: TypeOfSelectors;
    excelQuota: number;
    leadsLimit: number;
    isOpen: boolean;
    onClose(): void;
};

const IndustryModalOutLimit: React.FC<IndustryModalOutLimitProps> = ({
    activePanel,
    isOpen,
    excelQuota,
    leadsLimit,
    onClose,
}) => {
    const translate = useTranslation();

    const { title, contentText } = getQuotaModalInfo(
        activePanel,
        excelQuota,
        leadsLimit,
        translate,
    );

    return (
        <OutOfLimitModal
            title={title}
            contentText={contentText}
            onClose={onClose}
            isOpen={isOpen}
        />
    );
};

export default IndustryModalOutLimit;
