import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { Switcher } from "@similarweb/ui-components/dist/switcher";
import autobind from "autobind-decorator";
import * as React from "react";
import { Component } from "react";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import { ProModal } from "../../Modals/src/ProModal";
import { WithContext } from "../../Workspace/Wizard/src/WithContext";
import { Footer, ModalSubtitle, ModalTitle, TitleContainer } from "./SelectWorkspaceTrialModal";

export interface IAreYouSureModalProps {
    isOpen: boolean;
    onCloseClick: () => void;
    onConfirmationClick: () => void;
    title: string;
    subtitle: string;
}
const modalStyle: any = {
    customStyles: {
        content: {
            boxSizing: "content-box",
            width: "500px",
        },
    },
};

export class AreYouSureModal extends Component<IAreYouSureModalProps, any> {
    constructor(props) {
        super(props);
    }
    public render() {
        const { isOpen, onCloseClick, onConfirmationClick, title, subtitle } = this.props;
        return (
            <WithContext>
                {({ translate }) => {
                    return (
                        <ProModal isOpen={isOpen} onCloseClick={onCloseClick} {...modalStyle}>
                            <TitleContainer>
                                <ModalTitle>{translate(title)}</ModalTitle>
                            </TitleContainer>
                            <StyledModalSubtitle>{translate(subtitle)}</StyledModalSubtitle>
                            <Footer>
                                <Button onClick={onCloseClick} type="flat" label={"Cancel"} />
                                <Button
                                    onClick={onConfirmationClick}
                                    type="primary"
                                    label={"Yes"}
                                />
                            </Footer>
                        </ProModal>
                    );
                }}
            </WithContext>
        );
    }
}

const StyledModalSubtitle = styled(ModalSubtitle)`
    max-width: 70%;
`;
