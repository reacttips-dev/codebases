import * as React from "react";
import { Component } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    LeadGeneratorModalTitle,
    LeadGeneratorModalSubtitle,
    LeadGeneratorModalInput,
    RenameReportModalContent,
    LeadGeneratorModalFooter,
} from "./elements";
import I18n from "components/React/Filters/I18n";
import { i18nFilter } from "filters/ngFilters";
import {
    IProModalCustomStyles,
    ProModal,
} from "../../../../.pro-features/components/Modals/src/ProModal";
import LeadGeneratorUtils from "../LeadGeneratorUtils";

interface IRenameReportModalProps {
    isOpen: boolean;
    reportName: string;
    reportId: number;
    onRequestClose: () => void;
    onClickDone: (string) => void;
}

interface IRenameReportModalState {
    newName: string;
}

const proModalStyles: IProModalCustomStyles = {
    content: {
        width: "414px",
    },
};

class RenameReportModal extends Component<IRenameReportModalProps, IRenameReportModalState> {
    constructor(props) {
        super(props);

        this.state = {
            newName: props.reportName,
        };
    }

    private onKeyPress = (e) => {
        if (e.key === "Enter") {
            this.props.onClickDone(this.state.newName);
        }
    };

    public render() {
        return (
            <ProModal
                isOpen={this.props.isOpen}
                onCloseClick={this.props.onRequestClose}
                customStyles={proModalStyles}
            >
                <RenameReportModalContent>
                    <LeadGeneratorModalTitle>
                        <I18n>grow.lead_generator.all.report.rename</I18n>
                    </LeadGeneratorModalTitle>
                    <LeadGeneratorModalSubtitle>
                        <I18n>grow.lead_generator.all.report.rename.subtitle</I18n>
                    </LeadGeneratorModalSubtitle>
                    <LeadGeneratorModalInput
                        onChange={(event) => this.setState({ newName: event.target.value })}
                        value={this.state.newName}
                        onKeyPress={this.onKeyPress}
                    />
                </RenameReportModalContent>
                <LeadGeneratorModalFooter>
                    <Button
                        onClick={() => this.props.onClickDone(this.state.newName)}
                        isDisabled={!LeadGeneratorUtils.isReportNameValid(this.state.newName)}
                    >
                        {i18nFilter()("grow.lead_generator.modal.rename.done")}
                    </Button>
                </LeadGeneratorModalFooter>
            </ProModal>
        );
    }
}

export default RenameReportModal;
