import * as React from "react";
import { StatelessComponent } from "react";
import {
    ReportsQuotaWrapper,
    ReportsQuotaPercents,
    ReportsQuotaDiv,
    ReportsQuotaDetailed,
    LeadGeneratorInfoIcon,
} from "./elements";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { i18nFilter } from "filters/ngFilters";
import * as numeral from "numeral";
import QuotaPopup from "../dialogs/QuotaPopup";
import LeadGeneratorUtils from "../LeadGeneratorUtils";

interface ILeadGeneratorQuotaProps {
    userQuota: number;
    maxQuota: number;
    isUnlimited: boolean;
    isFree: boolean;
}

const LeadGeneratorQuota: StatelessComponent<ILeadGeneratorQuotaProps> = ({
    userQuota,
    maxQuota,
    isUnlimited,
    isFree,
}) => {
    let quotaPercents = maxQuota === 0 ? 0 : (userQuota / maxQuota) * 100;
    quotaPercents =
        quotaPercents < 10 ? Math.floor(quotaPercents * 100) / 100 : Math.floor(quotaPercents);
    const quotaState = quotaPercents < 90 ? 1 : quotaPercents < 100 ? 2 : 3;
    const quotaText = isUnlimited
        ? i18nFilter()("grow.lead_generator.quota.unlimited")
        : isFree
        ? i18nFilter()("grow.lead_generator.quota.free", { number: maxQuota.toString() })
        : numeral(maxQuota).format("0,0");
    return (
        <ReportsQuotaWrapper>
            <ReportsQuotaPercents>
                {i18nFilter()("grow.lead_generator.quota.used", {
                    quotaPercents: quotaPercents.toString(),
                })}
            </ReportsQuotaPercents>
            <PopupHoverContainer
                content={() => (
                    <QuotaPopup
                        usedPercent={quotaPercents.toString()}
                        quotaState={quotaState}
                        isFreeLeads={isFree}
                        maxQuota={maxQuota}
                    />
                )}
                config={{
                    width: "348px",
                    enabled: true,
                    allowHover: true,
                    closeDelay: 500,
                }}
            >
                <div style={{ cursor: "pointer", margin: "1px 7px" }}>
                    <LeadGeneratorInfoIcon />
                </div>
            </PopupHoverContainer>
            <ReportsQuotaDiv percents={quotaPercents} state={quotaState} />
            <ReportsQuotaDetailed data-automation="lead-generator-quota">{`(${numeral(
                userQuota,
            ).format("0,0")} / ${quotaText})`}</ReportsQuotaDetailed>
        </ReportsQuotaWrapper>
    );
};

export default LeadGeneratorQuota;
