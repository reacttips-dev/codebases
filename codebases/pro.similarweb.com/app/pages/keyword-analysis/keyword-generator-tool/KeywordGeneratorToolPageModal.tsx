import { Button } from "@similarweb/ui-components/dist/button";
import { Component } from "react";
import * as React from "react";
import { ProModal } from "../../../../.pro-features/components/Modals/src/ProModal";
import { WithContext } from "../../../../.pro-features/components/Workspace/Wizard/src/WithContext";
import {
    ButtonContainer,
    KeywordGeneratorToolPageModalBody,
    KeywordGeneratorToolPageModalContainer,
    KeywordGeneratorToolPageModalFooter,
    KeywordGeneratorToolPageModalHeader,
} from "./styledComponents";
import { modalArt } from "./KeywordGeneratorToolArt";

const modalStyle: any = {
    customStyles: {
        content: {
            marginTop: "28vh",
            width: "400px",
            height: "240px",
            padding: "24px",
            boxSizing: "content-box",
        },
    },
};

export class KeywordGeneratorToolPageModal extends Component<any, any> {
    public render() {
        const {
            isOpen,
            onCloseClick,
            onViewGroupClick,
            onStartOverClick,
            newlyCreatedGroup,
        } = this.props;
        const headerText = newlyCreatedGroup
            ? "keyword.generator.tool.modal.header"
            : "keyword.generator.tool.modal.header.updated_group";
        return (
            <WithContext>
                {({ translate }) => (
                    <ProModal
                        isOpen={isOpen}
                        onCloseClick={onCloseClick}
                        {...modalStyle}
                        showCloseIcon={false}
                    >
                        <KeywordGeneratorToolPageModalContainer>
                            <KeywordGeneratorToolPageModalHeader>
                                {translate(headerText)}
                            </KeywordGeneratorToolPageModalHeader>
                            <KeywordGeneratorToolPageModalBody>
                                {modalArt}
                            </KeywordGeneratorToolPageModalBody>
                            <KeywordGeneratorToolPageModalFooter>
                                <ButtonContainer
                                    onClick={onViewGroupClick}
                                    type="primary"
                                    label={translate("keyword.generator.tool.modal.viewgroup")}
                                />
                                <ButtonContainer
                                    onClick={onStartOverClick}
                                    type="flat"
                                    label={translate("keyword.generator.tool.modal.startover")}
                                />
                            </KeywordGeneratorToolPageModalFooter>
                        </KeywordGeneratorToolPageModalContainer>
                    </ProModal>
                )}
            </WithContext>
        );
    }
}
