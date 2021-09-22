import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { TubeSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { Injector } from "common/ioc/Injector";
import { stringify } from "querystring";
import React, { PureComponent } from "react";
import Modal from "react-modal";
import Alert from "./components/Alert";
import Footer from "./components/Footer";
import { SneakpeekApiService } from "./SneakpeekApiService";
import {
    GranularitySwitcher,
    Loader,
    ModalContainer,
    ModalHeader,
    ModalTitle,
    QuestionLabel,
    QuestionTextarea,
    QuestionWrapper,
} from "./StyledComponents";

const YesNoQ = ({ text, answer, onAnswer }) => {
    const selectedIndex = answer || 0;
    const renderOptions = questionsMap.yesNo.values.map((opt) => (
        <TubeSwitcherItem key={opt}>{opt}</TubeSwitcherItem>
    ));
    return (
        <QuestionWrapper>
            <QuestionLabel>{text}</QuestionLabel>
            <GranularitySwitcher
                key="yesNo"
                selectedIndex={selectedIndex}
                onItemClick={(i) => onAnswer(i)}
                customClass="TubeSwitcher"
            >
                {renderOptions}
            </GranularitySwitcher>
        </QuestionWrapper>
    );
};

const RateQ = ({ text, answer, onAnswer }) => {
    const selectedIndex = answer || 0;
    const renderOptions = questionsMap.rate.values.map((opt) => (
        <TubeSwitcherItem key={opt}>{opt}</TubeSwitcherItem>
    ));
    return (
        <QuestionWrapper>
            <QuestionLabel>{text}</QuestionLabel>
            <GranularitySwitcher
                key="rating"
                selectedIndex={selectedIndex}
                onItemClick={(i) => onAnswer(i)}
                customClass="TubeSwitcher"
            >
                {renderOptions}
            </GranularitySwitcher>
        </QuestionWrapper>
    );
};

const TextQ = ({ text, answer = "", onAnswer }) => {
    return (
        <QuestionWrapper>
            <QuestionLabel>{text}</QuestionLabel>
            <QuestionTextarea value={answer} onChange={(e) => onAnswer(e.target.value)} />
        </QuestionWrapper>
    );
};

const questionsMap = {
    yesNo: {
        type: YesNoQ,
        init: 0,
        values: ["Yes", "No"],
    },
    rate: {
        type: RateQ,
        init: 0,
        values: [1, 2, 3, 4, 5],
    },
    text: {
        type: TextQ,
        init: "",
        values: null,
    },
};

const customStyles = {
    content: {
        zIndex: 9999,
        padding: 0,
        borderRadius: "1%",
        left: "auto",
        bottom: "auto",
    },
    overlay: {
        zIndex: 9999,
    },
};

export class Feedback extends PureComponent<any, any> {
    private feedback;
    private questions;
    private sendTo;
    private swNavigator;

    constructor(props) {
        super(props);
        this.swNavigator = Injector.get("swNavigator");
        this.sendTo = props.feedback.sendTo;
        this.questions = props.feedback.questions;

        this.state = {
            isOpen: false,
            showFeedback: true,
            showLoader: false,
            showMsg: false,
            message: "",
            feedbackAnswers: this.initAnswers(),
        };
    }

    public initAnswers = () => {
        return this.questions.reduce((prev, question) => {
            prev[question.text] = questionsMap[question.type].init;
            return prev;
        }, {});
    };

    public onAnswer = (question, value) => {
        const { feedbackAnswers } = this.state;
        this.setState({
            feedbackAnswers: {
                ...feedbackAnswers,
                [question]: value,
            },
        });
    };

    public render() {
        const content = this.questions.map((question, index) => {
            const Comp = questionsMap[question.type].type;
            return (
                <Comp
                    key={index}
                    text={`${index + 1}. ${question.text}`}
                    answer={this.state.feedbackAnswers[question.text]}
                    onAnswer={(value) => this.onAnswer(question.text, value)}
                />
            );
        });

        return (
            <div>
                <IconButton iconName={"response"} type={"flat"} onClick={this.onOpen}>
                    Send feedback
                </IconButton>
                <Modal
                    style={customStyles}
                    isOpen={this.state.isOpen}
                    onRequestClose={() => this.setState({ isOpen: false })}
                >
                    <ModalHeader>Tell us what you think</ModalHeader>
                    <ModalContainer>
                        {this.state.showLoader && (
                            <Loader>
                                <DotsLoader />
                            </Loader>
                        )}
                        {this.state.showMsg && (
                            <Alert text={this.state.message} isValid={this.state.isValid} />
                        )}
                        {this.state.showFeedback && (
                            <div>
                                <ModalTitle>
                                    Thank you for taking the time to provide us with your feedback
                                    for &quot;{this.props.queryTitle}&quot;
                                </ModalTitle>
                                {content}
                                <Footer>
                                    <Button
                                        type="outlined"
                                        height={36}
                                        width={172}
                                        className="sneakpeek-secondary-btn"
                                        onClick={this.onSubmit}
                                    >
                                        Send Feedback
                                    </Button>
                                </Footer>
                            </div>
                        )}
                    </ModalContainer>
                </Modal>
            </div>
        );
    }

    public onOpen = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            showLoader: false,
            showFeedback: true,
            showMsg: false,
        });
    };

    public onSubmit = () => {
        this.setState(
            {
                showLoader: true,
                showFeedback: false,
                showMsg: false,
            },
            () => {
                const currentUrl = this.swNavigator.$location.$$absUrl;
                const questionsAndAnswers = this.questions.reduce((prev, question) => {
                    const ans = this.state.feedbackAnswers[question.text];
                    const ansArr = questionsMap[question.type].values;
                    prev[question.text] = ansArr ? ansArr[ans] : ans;
                    return prev;
                }, {});

                SneakpeekApiService.sendFeedback(
                    stringify({
                        queryId: this.props.queryId,
                        url: currentUrl,
                    }),
                    { questionsAndAnswers },
                )
                    .then(() => {
                        this.setAlert("Thank You, Feedback was submitted", true);
                        setTimeout(() => {
                            this.setState({
                                isOpen: !this.state.isOpen,
                                feedbackAnswers: this.initAnswers(),
                            });
                        }, 3000);
                    })
                    .catch(() => {
                        this.setAlert("Something went wrong, please try again", false);
                        setTimeout(() => {
                            this.setState({ isOpen: !this.state.isOpen });
                        }, 3000);
                    });
            },
        );
    };

    public setAlert = (message, isValid) => {
        this.setState({
            showLoader: false,
            showMsg: true,
            message,
            isValid,
        });
    };
}
