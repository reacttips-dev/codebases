import { colorsPalettes } from "@similarweb/styles";
import { Button, ButtonLabel, IconButton } from "@similarweb/ui-components/dist/button";
import { Rating } from "@similarweb/ui-components/dist/rating";
import { MultipleChoiceQuestion } from "@similarweb/ui-components/dist/multiple-choice-question";
import { Textarea } from "@similarweb/ui-components/dist/textarea";
import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";
import { PureComponent } from "react";
import styled from "styled-components";
import I18n from "../../../../app/components/React/Filters/I18n";
import { WithContext } from "../../Workspace/Wizard/src/WithContext";
import { ProModal } from "../src/ProModal";

export enum QuestionType {
    Open = "Open",
    Rating = "Rating",
    MultipleChoice = "MultipleChoice",
}

export interface IQuestion {
    id: number;
    page?: number;
    questionType: QuestionType;
    possibleAnswers?: string[];
    title: string;
    subtitle?: string;
    maxLabel?: string;
    midLabel?: string;
    minLabel?: string;
}

export interface IFeedbackSurveyModalProps {
    isOpen: boolean;
    onCloseClick: () => void;
    onSkipSurveyClick?: () => void;
    onNextClick: (IQuestion, answer) => void;
    onSubmitClick: (IQuestion, answer) => void;
    surveyQuestions: IQuestion[];
    surveyName?: string;
    customStyles?: any;
}

interface IFeedbackSurveyModalState {
    currentQuestionIndex: number;
    questionsAns: Array<{ value: any }>;
}

const moreProps: any = {
    customStyles: {
        content: {
            boxSizing: "content-box",
            width: "518px",
        },
    },
};

export class FeedbackSurveyModal extends PureComponent<
    IFeedbackSurveyModalProps,
    IFeedbackSurveyModalState
> {
    private track;

    constructor(props, context) {
        super(props, context);
        this.state = {
            currentQuestionIndex: 0,
            questionsAns: [],
        };
    }

    private renderSwitch(currentQuestion: IQuestion, currentAnswer, translate) {
        switch (currentQuestion.questionType) {
            case QuestionType.Rating:
                return (
                    <Rating
                        width={467}
                        value={currentAnswer}
                        onRatingSelect={this.nextClick}
                        maxLabel={translate(currentQuestion.maxLabel)}
                        midLabel={translate(currentQuestion.midLabel)}
                        minLabel={translate(currentQuestion.minLabel)}
                    />
                );
            case QuestionType.MultipleChoice:
                return (
                    <MultipleChoiceQuestion
                        possibleAnswers={currentQuestion.possibleAnswers.map((possibleAnswer) =>
                            translate(possibleAnswer),
                        )}
                        onAnswerToggle={this.updateAnswer}
                        answers={currentAnswer}
                    />
                );
            default:
                return (
                    <div style={{ width: "100%" }}>
                        <Textarea
                            onChange={this.updateAnswer}
                            placeholder={translate("feedback.openquestion.placeholder.text")}
                            value={currentAnswer}
                        />
                    </div>
                );
        }
    }

    public render() {
        const {
            isOpen,
            onCloseClick,
            onSkipSurveyClick,
            surveyQuestions,
            customStyles,
        } = this.props;
        const firstQuestion = this.state.currentQuestionIndex === 0;
        const lastQuestion = this.state.currentQuestionIndex === surveyQuestions.length - 1;
        const currentQuestion: IQuestion = surveyQuestions[this.state.currentQuestionIndex];
        const currentAnswer: any = this.state.questionsAns[this.state.currentQuestionIndex];
        const mergedStyles = { ...moreProps, ...customStyles };
        return (
            <WithContext>
                {({ track, translate }) => {
                    this.track = track;
                    return (
                        <ProModal isOpen={isOpen} onCloseClick={onCloseClick} {...mergedStyles}>
                            <ContentContainer>
                                <div>
                                    <TitleContainer>
                                        {!firstQuestion && (
                                            <BackButtonWrapper>
                                                <IconButton
                                                    type="flat"
                                                    onClick={this.backToPreviousStep}
                                                    iconName="arrow-left"
                                                    iconSize="sm"
                                                />
                                            </BackButtonWrapper>
                                        )}
                                        <ModalTitle>
                                            <I18n>{`${currentQuestion.title}`}</I18n>
                                        </ModalTitle>
                                    </TitleContainer>
                                    <ModalSubtitle>
                                        <QuestionNumber>{`${currentQuestion.id}/${surveyQuestions?.length}`}</QuestionNumber>
                                        <I18n>{currentQuestion.subtitle}</I18n>
                                    </ModalSubtitle>
                                </div>
                                <Content firstQuestion={firstQuestion}>
                                    {this.renderSwitch(currentQuestion, currentAnswer, translate)}
                                </Content>
                                <ButtonGroup>
                                    {onSkipSurveyClick && !lastQuestion && (
                                        <Button type="flat" onClick={this.skipClick}>
                                            <ButtonLabel>
                                                <I18n>feedback.survey.modal.skip.button.label</I18n>
                                            </ButtonLabel>
                                        </Button>
                                    )}
                                    {!lastQuestion ? (
                                        <Button
                                            type="primary"
                                            onClick={() => this.nextClick(currentAnswer)}
                                        >
                                            <ButtonLabel>
                                                <I18n>feedback.survey.modal.next.button.label</I18n>
                                            </ButtonLabel>
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            onClick={() => this.submit(currentAnswer)}
                                        >
                                            <ButtonLabel>
                                                <I18n>
                                                    feedback.survey.modal.submit.button.label
                                                </I18n>
                                            </ButtonLabel>
                                        </Button>
                                    )}
                                </ButtonGroup>
                            </ContentContainer>
                        </ProModal>
                    );
                }}
            </WithContext>
        );
    }

    private trackSurveyAction(action) {
        const currentQuestion = this.props.surveyQuestions[this.state.currentQuestionIndex];
        this.track(
            `Workspace survey`,
            "click",
            `${currentQuestion.title}/${this.state.currentQuestionIndex}/${action}`,
        );
    }

    @autobind
    private backToPreviousStep() {
        this.trackSurveyAction("back");
        this.setState({
            currentQuestionIndex: this.state.currentQuestionIndex - 1,
        });
    }

    @autobind
    private updateAnswer(value) {
        const newQuestionAns = _.clone(this.state.questionsAns);
        if (this.state.questionsAns[this.state.currentQuestionIndex] !== undefined) {
            newQuestionAns.splice(this.state.currentQuestionIndex, 1, value);
        }
        this.setState({
            questionsAns:
                this.state.questionsAns[this.state.currentQuestionIndex] !== undefined
                    ? newQuestionAns
                    : this.state.questionsAns.concat([value]),
        });
    }

    @autobind
    private skipClick() {
        this.trackSurveyAction("skip");
        this.props.onSkipSurveyClick();
    }

    @autobind
    private nextClick(value) {
        const { onNextClick, surveyQuestions } = this.props;
        const currentQuestion = surveyQuestions[this.state.currentQuestionIndex];
        const newQuestionAns = _.clone(this.state.questionsAns);
        if (this.state.questionsAns[this.state.currentQuestionIndex]) {
            newQuestionAns.splice(this.state.currentQuestionIndex, 1, value);
        }
        this.setState({
            questionsAns: this.state.questionsAns[this.state.currentQuestionIndex]
                ? newQuestionAns
                : this.state.questionsAns.concat([value]),
            currentQuestionIndex: this.state.currentQuestionIndex + 1,
        });
        this.trackSurveyAction("next");

        onNextClick(currentQuestion, value);
    }

    @autobind
    private submit(value) {
        const { onSubmitClick, surveyQuestions } = this.props;
        const currentQuestion = surveyQuestions[this.state.currentQuestionIndex];
        onSubmitClick(currentQuestion, value);
        this.setState({
            questionsAns: [],
            currentQuestionIndex: 0,
        });
    }
}

export const ModalTitle = styled.div.attrs({
    "data-automation": "feedback-survey-modal-title",
} as any)`
    font-size: 14px;
    line-spacing: 24px;
    color: ${colorsPalettes.carbon["400"]};
    margin-top: 5px;
`;
ModalTitle.displayName = "ModalTitle";

export const ModalSubtitle = styled.div.attrs({
    "data-automation": "feedback-survey-modal-subtitle",
} as any)`
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    margin-bottom: 12px;
    max-width: 90%;
    display: flex;
    color: ${colorsPalettes.midnight["600"]};
`;
ModalSubtitle.displayName = "ModalSubtitle";

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
`;

export const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    height: 24px;
    margin-bottom: 12px;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Content = styled.div<{ firstQuestion: boolean }>`
    display: flex;
    margin-left: ${({ firstQuestion }) => (firstQuestion ? 25 : 0)}px;
    .answersContainer > div {
        margin-left: 36px;
    }
    .answersContainer > div:first-child {
        margin-left: 0px;
    }
`;

const BackButtonWrapper = styled.div`
    height: 24px;
    width: 24px;
    margin-top: -12px;
    margin-left: -12px;
    margin-right: 19px;
`;

const QuestionNumber = styled.div`
    height: 24px;
    font-size: 16px;
    font-weight: 500;
    color: ${colorsPalettes.midnight["600"]};
    margin-right: 6px;
    font-size: 16px;
`;
