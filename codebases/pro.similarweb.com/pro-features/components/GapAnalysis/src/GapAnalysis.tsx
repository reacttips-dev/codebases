import { Button } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Range } from "@similarweb/ui-components/dist/slider";
import * as React from "react";
import { StatelessComponent } from "react";
import {
    ButtonContainer,
    Competitors,
    DeleteButton,
    DeleteButtonContainer,
    GroupContainer,
    LeftButton,
    LegendContainer,
    RightButton,
    SubTitle,
    Title,
    TitleContainer,
} from "./GapAnalysis.styles";

export interface IKeywordGapProps {
    groups: IGroup[];
    addCompetitor?: JSX.Element;
    onDone?: () => void;
    onCancel?: () => void;
    onReset?: () => void;
    text: {
        title: string;
        subTitle: string;
        resetButton: string;
        cancelButton: string;
        doneButton: string;
        removeButtonToolTip: string;
    };
}

export interface IGroup {
    label?: JSX.Element;
    range: IRange;
    isDeletable?: boolean;
    onChange: (index: number) => void;
    onDelete: (index: number) => void;
}

export interface IRange {
    value: number[];
}

export const GapAnalysis: StatelessComponent<IKeywordGapProps> = ({
    groups,
    addCompetitor,
    onReset,
    onCancel,
    onDone,
    text,
}) => {
    return (
        <div>
            <TitleContainer>
                <Title>{text.title}</Title>
                <SubTitle>{text.subTitle}</SubTitle>
            </TitleContainer>
            {groups.map((group, index) => {
                return (
                    <GroupContainer key={`group-container-${index}`}>
                        <LegendContainer>
                            {group.label}
                            {group.isDeletable && (
                                <DeleteButtonContainer>
                                    <PlainTooltip tooltipContent={text.removeButtonToolTip}>
                                        <div>
                                            <DeleteButton
                                                iconName="delete"
                                                type="flat"
                                                onClick={group.onDelete}
                                            />
                                        </div>
                                    </PlainTooltip>
                                </DeleteButtonContainer>
                            )}
                        </LegendContainer>
                        <Range
                            min={0}
                            max={100}
                            value={group.range.value}
                            description={group.range.value.map((val) => `${val}%`).join(" - ")}
                            onChange={group.onChange}
                            markInit={true}
                        />
                    </GroupContainer>
                );
            })}
            {addCompetitor && (
                <Competitors numOfCompetitors={groups.length}>{addCompetitor}</Competitors>
            )}
            <ButtonContainer>
                <LeftButton>
                    <Button type="flat" onClick={onReset} label={text.resetButton} />
                </LeftButton>
                <RightButton>
                    <Button type="flat" onClick={onCancel} label={text.cancelButton} />
                    <Button type="primary" onClick={onDone} label={text.doneButton} />
                </RightButton>
            </ButtonContainer>
        </div>
    );
};

GapAnalysis.displayName = "GapAnalysis";
