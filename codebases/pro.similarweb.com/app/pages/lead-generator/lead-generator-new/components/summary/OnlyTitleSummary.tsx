import React from "react";
import { FilterTitle, SummaryFilterContainer } from "../elements";
import I18n from "components/React/Filters/I18n";

export const OnlyTitleSummary = ({ title }) => {
    return (
        <SummaryFilterContainer>
            <FilterTitle>
                <I18n>{title}</I18n>
            </FilterTitle>
        </SummaryFilterContainer>
    );
};
