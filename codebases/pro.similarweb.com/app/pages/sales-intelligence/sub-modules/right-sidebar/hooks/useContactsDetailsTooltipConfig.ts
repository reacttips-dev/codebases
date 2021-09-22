import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";

const useContactsDetailsTooltipConfig = (
    isRevealed: boolean,
    quota: number,
    isClicked: boolean,
) => {
    const translate = useTranslation();
    const tooltipConfig = React.useMemo(() => {
        if (isRevealed && !isClicked) {
            return {
                tooltipContent: translate("si.sidebar.contacts.contacts_details_btn.tooltip.view"),
                variation: "black",
            };
        }
        if (isRevealed && isClicked) {
            return {
                tooltipContent: translate("si.sidebar.contacts.contacts_details_btn.tooltip.close"),
                variation: "black",
            };
        }
        if (quota === 0) {
            return {
                tooltipContent: translate("si.sidebar.contacts.contacts_details_btn.tooltip.quota"),
                variation: "white",
            };
        }
        return {
            tooltipContent: translate("si.sidebar.contacts.contacts_details_btn.tooltip.unlock"),
            variation: "black",
        };
    }, [isRevealed, quota, isClicked]);

    return tooltipConfig;
};

export default useContactsDetailsTooltipConfig;
