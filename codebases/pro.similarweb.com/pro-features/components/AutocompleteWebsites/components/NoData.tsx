import React from "react";
import { NoDataWrapper, NoDataIcon, NoDataText } from "../styles";
import { i18nFilter } from "filters/ngFilters";

const translate = i18nFilter();

export const NoData = ({ text }) => {
    return (
        <NoDataWrapper>
            <NoDataIcon iconName="globe" />
            <NoDataText>{translate(text)}</NoDataText>
        </NoDataWrapper>
    );
};
