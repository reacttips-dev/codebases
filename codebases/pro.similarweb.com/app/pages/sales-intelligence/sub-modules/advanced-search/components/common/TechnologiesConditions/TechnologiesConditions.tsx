import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledEntryName, StyledEntrySeparator } from "./styles";
import {
    TechnologiesCondition,
    TechnologiesConditionEntry,
} from "../../../filters/technology/types";
import {
    StyledConditionItem,
    StyledConditionItemControls,
    StyledConditionItemSeparator,
    StyledConditionItemValue,
} from "./styles";

type TechnologiesConditionsProps = {
    conditions: TechnologiesCondition[];
    onEditClick(condition: TechnologiesCondition): void;
    onDeleteClick(id: TechnologiesCondition["id"]): void;
};

const TechnologiesConditions = (props: TechnologiesConditionsProps) => {
    const translate = useTranslation();
    const { conditions, onEditClick, onDeleteClick } = props;

    const renderConditionEntry = (
        entry: TechnologiesConditionEntry,
        index: number,
        array: TechnologiesConditionEntry[],
    ) => {
        const name = <StyledEntryName key={entry.name}>{entry.name}</StyledEntryName>;

        if (array.length - 1 === index) {
            return name;
        }

        return (
            <span key={`entry-with-separator-${entry.name}`}>
                {name}
                <StyledEntrySeparator>&nbsp;{translate("si.common.or")}&nbsp;</StyledEntrySeparator>
            </span>
        );
    };

    const renderConditionItem = (
        condition: TechnologiesCondition,
        index: number,
        array: TechnologiesCondition[],
    ) => {
        const renderedCondition = (
            <StyledConditionItem key={`condition-item-${condition.id}`}>
                <StyledConditionItemValue>
                    <span>
                        {translate(`si.components.inclusion_dd.${condition.inclusion}.text`)}
                        :&nbsp;
                    </span>
                    {condition.entries.map(renderConditionEntry)}
                </StyledConditionItemValue>
                <StyledConditionItemControls>
                    <IconButton
                        type="flat"
                        iconSize="xs"
                        iconName="edit-icon"
                        onClick={() => onEditClick(condition)}
                        dataAutomation="technologies-filter-condition-button-edit"
                    />
                    <IconButton
                        type="flat"
                        iconSize="xs"
                        iconName="delete"
                        onClick={() => onDeleteClick(condition.id)}
                        dataAutomation="technologies-filter-condition-button-delete"
                    />
                </StyledConditionItemControls>
            </StyledConditionItem>
        );

        if (array.length - 1 === index) {
            return renderedCondition;
        }

        return (
            <div key={`condition-item-with-separator-${condition.id}`}>
                {renderedCondition}
                <StyledConditionItemSeparator>
                    <StyledEntryName>{translate(`si.common.and`)}</StyledEntryName>
                </StyledConditionItemSeparator>
            </div>
        );
    };

    return <>{conditions.map(renderConditionItem)}</>;
};

export default TechnologiesConditions;
