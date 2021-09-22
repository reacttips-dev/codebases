import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { QuotaContainerProps } from "./QuotaContainer";
import { useSalesSettingsHelper } from "../../../services/salesSettingsHelper";
import { useTranslation } from "components/WithTranslation/src/I18n";
import * as styles from "./styles";

const Quota: React.FC<QuotaContainerProps> = (props) => {
    const { allUniqueWebsites } = props;
    const translate = useTranslation();
    const quotaLimit = useSalesSettingsHelper().getQuotaLimit();

    return (
        <styles.StyledQuotaContainer className="fadeIn">
            <span data-automation="sales-intelligence-quota-text">
                {translate("si.common.quota", {
                    numberOfWebsites: allUniqueWebsites.length,
                    limit: quotaLimit,
                })}
            </span>
            <PlainTooltip tooltipContent={translate("si.common.quota.tooltip")}>
                <styles.StyledTooltipContent>
                    <SWReactIcons iconName="info" size="xs" />
                </styles.StyledTooltipContent>
            </PlainTooltip>
        </styles.StyledQuotaContainer>
    );
};

export default Quota;
