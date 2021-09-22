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

interface IRunReportModalProps {
    isOpen: boolean;
    reportName: string;
    reportDate: string;
    reportMaxResults: string;
    reportGroupResults: string;
    onClickClose: () => void;
    onClickDone: () => void;
}

const proModalStyles: IProModalCustomStyles = {
    content: {
        boxSizing: "content-box",
        width: "590px",
    },
};

const RunReportModal: StatelessComponent<IRunReportModalProps> = ({
    isOpen,
    reportName,
    reportDate,
    reportMaxResults,
    reportGroupResults,
    onClickClose,
    onClickDone,
}) => {
    return (
        <ProModal isOpen={isOpen} onCloseClick={onClickClose} customStyles={proModalStyles}>
            <LeadGeneratorModalContent>
                <LeadGeneratorModalTitle>
                    {i18nFilter()("grow.lead_generator.modal.run.title", { reportName })}
                </LeadGeneratorModalTitle>
                <LeadGeneratorModalSubtitle>
                    {i18nFilter()("grow.lead_generator.modal.run.subtitle", {
                        reportDate,
                        reportMaxResults,
                        reportGroupResults,
                    })}
                </LeadGeneratorModalSubtitle>
            </LeadGeneratorModalContent>
            <LeadGeneratorModalFooter>
                <Button type="flat" onClick={onClickClose}>
                    {i18nFilter()("grow.lead_generator.modal.run.cancel")}
                </Button>
                <Button onClick={onClickDone}>
                    {i18nFilter()("grow.lead_generator.modal.run.done")}
                </Button>
            </LeadGeneratorModalFooter>
        </ProModal>
    );
};

export default RunReportModal;
