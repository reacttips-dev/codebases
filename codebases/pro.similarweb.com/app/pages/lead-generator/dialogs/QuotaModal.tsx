import * as React from "react";
import { StatelessComponent } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    LeadGeneratorModalTitle,
    LeadGeneratorModalSubtitle,
    LeadGeneratorModalContent,
    LeadGeneratorModalFooter,
} from "./elements";
import { i18nFilter } from "filters/ngFilters";
import {
    IProModalCustomStyles,
    ProModal,
} from "../../../../.pro-features/components/Modals/src/ProModal";
import I18n from "../../../components/React/Filters/I18n";
import ContactUsButton from "components/React/ContactUs/ContactUsButton";

interface IQuotaModalProps {
    isOpen: boolean;
    onClickClose: () => void;
    onClickPurchase: () => void;
}

const proModalStyles: IProModalCustomStyles = {
    content: {
        width: "440px",
    },
};

const QuotaModal: StatelessComponent<IQuotaModalProps> = ({
    isOpen,
    onClickClose,
    onClickPurchase,
}) => {
    return (
        <ProModal isOpen={isOpen} onCloseClick={onClickClose} customStyles={proModalStyles}>
            <LeadGeneratorModalContent>
                <LeadGeneratorModalTitle>
                    <I18n>grow.lead_generator.modal.quota.title</I18n>
                </LeadGeneratorModalTitle>
                <LeadGeneratorModalSubtitle>
                    <I18n>grow.lead_generator.modal.quota.subtitle</I18n>
                </LeadGeneratorModalSubtitle>
            </LeadGeneratorModalContent>
            <LeadGeneratorModalFooter>
                <Button type="flat" onClick={onClickClose}>
                    {i18nFilter()("grow.lead_generator.modal.quota.close")}
                </Button>
                <ContactUsButton label="Quota Modal/Request a report">
                    {i18nFilter()("grow.lead_generator.modal.quota.purchase")}
                </ContactUsButton>
            </LeadGeneratorModalFooter>
        </ProModal>
    );
};

export default QuotaModal;
