import {
    BoxHeader,
    BoxTitle,
    FeedbackItemContainer,
    FeedbackItemTitle,
    Label,
    NoQuestionsAddedText,
    TypeDropdownContainer,
} from "pages/sneakpeek/StyledComponents";
import InputBox from "pages/sneakpeek/components/InputBox";
import React, { FC } from "react";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import {
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { buttonTypes } from "UtilitiesAndConstants/Constants/ButtonTypes";
import * as _ from "lodash";

const feedbackQType = {
    yesNo: "Yes/No",
    rate: "Rating",
    text: "Free Text",
};

export const FeedbackItem: FC<any> = (props) => {
    let type = props.type || "yesNo",
        text = props.text || "",
        typeName = feedbackQType[type];
    const { onDelete, onChange } = props;

    const feedbackQTypeItems = [
        <DropdownButton key="type">{typeName}</DropdownButton>,
        ..._.map(feedbackQType, (text: string, id: string) => {
            return {
                id,
                text,
            };
        }),
    ];

    return (
        <FeedbackItemContainer alignItems="flex-start">
            <FlexRow
                justifyContent="space-between"
                alignItems="center"
                style={{ width: "100%", marginBottom: "20px" }}
            >
                <FeedbackItemTitle>{`Question #${props.index + 1}`}</FeedbackItemTitle>
                <PlainTooltip tooltipContent="Remove question">
                    <div>
                        <IconButton iconName="clear" type="flat" onClick={onDelete} />
                    </div>
                </PlainTooltip>
            </FlexRow>
            <InputBox
                containerWidth={"100%"}
                width={"100%"}
                value={text}
                onChange={(text) => onChange(type, text)}
            >
                Question title
            </InputBox>
            <TypeDropdownContainer>
                <Label>Feedback type</Label>
                <Dropdown
                    selectedIds={{ [type]: true }}
                    onClick={(item) => {
                        type = item.id;
                        typeName = feedbackQType[item.id];
                        onChange(type, text);
                    }}
                    itemsComponent={SimpleDropdownItem}
                >
                    {feedbackQTypeItems}
                </Dropdown>
            </TypeDropdownContainer>
        </FeedbackItemContainer>
    );
};

type questionObjectType = { type: string; text: string };

interface IFeedbackBuilderProps {
    currentFeedbackMetaData: { questions: questionObjectType[]; sendTo: string };
    addFeedbackQuestion: () => void;
    setFeedbackMetaData: (index: number, type: string, text: string) => void;
    deleteFeedbackQuestion: (index: number) => void;
    onFeedbackSendToChange: (sendTo) => void;
}

export const FeedbackBuilder: FC<IFeedbackBuilderProps> = (props) => {
    const {
        currentFeedbackMetaData: { questions, sendTo },
        setFeedbackMetaData,
        deleteFeedbackQuestion,
        addFeedbackQuestion,
        onFeedbackSendToChange,
    } = props;
    const questionsHaveBeenAdded = !!(questions && questions.length);
    return (
        <>
            <BoxHeader>
                <BoxTitle>Feedback</BoxTitle>
            </BoxHeader>
            <FlexColumn alignItems="center">
                {questionsHaveBeenAdded &&
                    questions.map((item, index) => (
                        <FeedbackItem
                            type={item.type}
                            text={item.text}
                            onChange={(type, text) => setFeedbackMetaData(index, type, text)}
                            onDelete={() => deleteFeedbackQuestion(index)}
                            key={index}
                            index={index}
                        />
                    ))}
                {questionsHaveBeenAdded && (
                    <InputBox
                        placeholder="Email"
                        value={sendTo}
                        onChange={onFeedbackSendToChange}
                        width={"100%"}
                        containerWidth={"100%"}
                    >
                        Send To
                    </InputBox>
                )}
                {!questionsHaveBeenAdded && (
                    <NoQuestionsAddedText>
                        Want to collect feedback about your query from viewers?
                    </NoQuestionsAddedText>
                )}
                <PlainTooltip tooltipContent="Add a question to feedback">
                    <div style={{ marginTop: "16px" }}>
                        <IconButton
                            iconName="add"
                            type={buttonTypes.PRIMARY}
                            onClick={addFeedbackQuestion}
                        >
                            Add Question
                        </IconButton>
                    </div>
                </PlainTooltip>
            </FlexColumn>
        </>
    );
};
