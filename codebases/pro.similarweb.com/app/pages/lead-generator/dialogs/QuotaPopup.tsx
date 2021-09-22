import * as React from "react";
import { StatelessComponent } from "react";
import {
    LeadGeneratorPopupWrapper,
    LeadGeneratorModalTitle,
    LeadGeneratorModalSubtitle,
    LeadGeneratorPopupContent,
    LeadGeneratorModalFooter,
} from "./elements";
import { i18nFilter } from "filters/ngFilters";
import ContactUsButton from "components/React/ContactUs/ContactUsButton";

interface IQuotaPopupProps {
    usedPercent: string;
    quotaState: number;
    isFreeLeads: boolean;
    maxQuota: number;
}

const QuotaPopup: StatelessComponent<IQuotaPopupProps> = ({
    usedPercent,
    quotaState,
    isFreeLeads,
    maxQuota,
}) => {
    return (
        <LeadGeneratorPopupWrapper>
            <LeadGeneratorPopupContent>
                <LeadGeneratorModalTitle>
                    {isFreeLeads
                        ? i18nFilter()("grow.lead_generator.popup.quota.title.free", {
                              number: maxQuota.toString(),
                          })
                        : i18nFilter()("grow.lead_generator.popup.quota.title", { usedPercent })}
                </LeadGeneratorModalTitle>
                <LeadGeneratorModalSubtitle>
                    {isFreeLeads
                        ? i18nFilter()("grow.lead_generator.popup.quota.subtitle.free", {
                              number: maxQuota.toString(),
                          })
                        : i18nFilter()(
                              `grow.lead_generator.popup.quota.subtitle.state${quotaState}`,
                          )}
                </LeadGeneratorModalSubtitle>
            </LeadGeneratorPopupContent>
            <hr />
            <LeadGeneratorModalFooter>
                <ContactUsButton label="Request quota modal">
                    {i18nFilter()("grow.lead_generator.popup.quota.purchase")}
                </ContactUsButton>
            </LeadGeneratorModalFooter>
        </LeadGeneratorPopupWrapper>
    );
};

export default QuotaPopup;
