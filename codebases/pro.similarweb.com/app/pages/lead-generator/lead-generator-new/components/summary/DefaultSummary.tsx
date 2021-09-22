import React from "react";
import { FilterDescription, FilterTitle, SummaryFilterContainer } from "../elements";
import I18n from "components/React/Filters/I18n";

export const DefaultSummary = ({
    title,
    description,
    className,
}: {
    title: string;
    description: string;
    className?: string;
}) => {
    return (
        <SummaryFilterContainer className={className}>
            <FilterTitle>
                <I18n>{title}</I18n>
            </FilterTitle>
            <FilterDescription>
                <I18n>{description}</I18n>
            </FilterDescription>
        </SummaryFilterContainer>
    );
};
