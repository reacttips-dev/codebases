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

interface ITrafficSourceModalProps {
    isOpen: boolean;
    onClickClose: () => void;
    onClickBtn?: () => void;
}

const proModalStyles: IProModalCustomStyles = {
    content: {
        width: "440px",
    },
};

const InvalidPercentsGroupModal: StatelessComponent<ITrafficSourceModalProps> = ({
    isOpen,
    onClickClose,
    onClickBtn,
    children,
}) => {
    return (
        <ProModal isOpen={isOpen} onCloseClick={onClickClose} customStyles={proModalStyles}>
            <LeadGeneratorModalContent>
                <LeadGeneratorModalTitle>
                    <I18n>grow.lead_generator.modal.traffic_source.title</I18n>
                </LeadGeneratorModalTitle>
                <LeadGeneratorModalSubtitle>
                    <I18n>{children}</I18n>
                </LeadGeneratorModalSubtitle>
            </LeadGeneratorModalContent>
            <LeadGeneratorModalFooter>
                <Button onClick={onClickBtn || onClickClose}>
                    {i18nFilter()("grow.lead_generator.modal.traffic_source.close")}
                </Button>
            </LeadGeneratorModalFooter>
        </ProModal>
    );
};

export default InvalidPercentsGroupModal;
