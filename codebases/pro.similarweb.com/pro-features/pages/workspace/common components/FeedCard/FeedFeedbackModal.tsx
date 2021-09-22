import { Button } from "@similarweb/ui-components/dist/button";
import React from "react";
import { Component } from "react";
import { IProModalCustomStyles, ProModal } from "../../../../components/Modals/src/ProModal";
import {
    CardBodyContainer,
    FeedbackModalCardWrapper,
    FeedbackModalFreeText,
    FeedbackModalHeader,
    FeedbackModalInput,
    FeedbackModalReason,
    FeedCardContainer,
    FeedCardHeader,
    FeedCardTitle,
} from "./elements";
import { FeedCardBadges } from "./FeedCardBadges";
import { IFeedbackModal } from "./FeedCardFeedback";
import { formatChange } from "./utils";

const getProModalStyles = (freeTextMode) =>
    ({
        content: {
            width: "440px",
            height: freeTextMode ? "400px" : "496px",
            padding: "0",
            marginTop: "104px",
        },
    } as IProModalCustomStyles);

const reasonsTexts = [
    "workspace.feed_sidebar.feedback.modal.reason.timing",
    "workspace.feed_sidebar.feedback.modal.reason.role",
    "workspace.feed_sidebar.feedback.modal.reason.insights",
    "workspace.feed_sidebar.feedback.modal.reason.workflow",
];

interface IFeedFeedbackModalProps extends IFeedbackModal {
    translate: (key, obj?) => string;
    onClose();
    onExit();
    onUpdate(args);
}

interface IFeedFeedbackModalState {
    isOpen: boolean;
    freeTextMode: boolean;
    freeText: string;
}

export class FeedFeedbackModal extends Component<IFeedFeedbackModalProps, IFeedFeedbackModalState> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            freeTextMode: false,
            freeText: "",
        };
    }

    public closeModal = () => {
        this.props.onExit();
        this.setState({ isOpen: false });
    };

    public componentDidUpdate() {
        if (!this.state.isOpen) {
            this.props.onClose();
        }
    }

    public onChooseFeedback = (text) => {
        this.props.onUpdate(text);
        this.setState({ isOpen: false });
    };

    public setFreeTextMode = () => {
        this.setState({ freeTextMode: true });
    };

    public onChangeFreeText = (event) => {
        this.setState({ freeText: event.target.value });
    };

    public render() {
        return (
            <ProModal
                customStyles={getProModalStyles(this.state.freeTextMode)}
                onCloseClick={this.closeModal}
                isOpen={this.state.isOpen}
            >
                <>
                    <FeedbackModalHeader>
                        {this.props.translate("workspace.feed_sidebar.feedback.modal.title")}
                    </FeedbackModalHeader>
                    <FeedbackModalCardWrapper>
                        <FeedCardContainer seen={true} visible={true}>
                            <FeedCardHeader>
                                <FeedCardTitle>
                                    {this.props.translate(this.props.cardTitle)}
                                </FeedCardTitle>
                            </FeedCardHeader>
                            <FeedCardBadges
                                country={this.props.country}
                                change={this.props.change}
                                webSource={this.props.webSource}
                            />
                            <CardBodyContainer>
                                {this.props.translate(this.props.cardText, {
                                    change: formatChange(this.props.change),
                                    from_month: this.props.fromMonth,
                                    to_month: this.props.toMonth,
                                })}
                            </CardBodyContainer>
                        </FeedCardContainer>
                    </FeedbackModalCardWrapper>
                    {this.state.freeTextMode ? (
                        <FeedbackModalFreeText>
                            <FeedbackModalInput
                                autoFocus={true}
                                maxLength={1000}
                                value={this.state.freeText}
                                onChange={this.onChangeFreeText}
                                placeholder={this.props.translate(
                                    "workspace.feed_sidebar.feedback.modal.input_placeholder",
                                )}
                            />
                            <Button
                                label={this.props.translate(
                                    "workspace.feed_sidebar.feedback.modal.send",
                                )}
                                onClick={() => this.onChooseFeedback(this.state.freeText)}
                            />
                        </FeedbackModalFreeText>
                    ) : (
                        <>
                            {reasonsTexts.map((reason) => (
                                <FeedbackModalReason
                                    key={reason}
                                    onClick={() =>
                                        this.onChooseFeedback(this.props.translate(reason))
                                    }
                                >
                                    {this.props.translate(reason)}
                                </FeedbackModalReason>
                            ))}
                            <FeedbackModalReason onClick={this.setFreeTextMode}>
                                {this.props.translate(
                                    "workspace.feed_sidebar.feedback.modal.reason.other",
                                )}
                            </FeedbackModalReason>
                        </>
                    )}
                </>
            </ProModal>
        );
    }
}
