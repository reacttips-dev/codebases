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

interface IGroupingModalProps {
    isOpen: boolean;
    onClickClose: () => void;
}

const proModalStyles: IProModalCustomStyles = {
    content: {
        width: "440px",
    },
};

const GroupingModal: StatelessComponent<IGroupingModalProps> = ({ isOpen, onClickClose }) => {
    return (
        <ProModal isOpen={isOpen} onCloseClick={onClickClose} customStyles={proModalStyles}>
            <LeadGeneratorModalContent>
                <LeadGeneratorModalTitle>
                    <I18n>grow.lead_generator.modal.grouping.title</I18n>
                </LeadGeneratorModalTitle>
                <LeadGeneratorModalSubtitle>
                    <I18n>grow.lead_generator.modal.grouping.subtitle</I18n>
                </LeadGeneratorModalSubtitle>
            </LeadGeneratorModalContent>
            <LeadGeneratorModalFooter>
                <Button onClick={onClickClose}>
                    {i18nFilter()("grow.lead_generator.modal.grouping.close")}
                </Button>
            </LeadGeneratorModalFooter>
        </ProModal>
    );
};

export default GroupingModal;
