import React from "react";
import {
    NoSelectedQueriesContainer,
    NoSelectedQueriesSubtitle,
    NoSelectedQueriesTitle,
} from "pages/sneakpeek/StyledComponents";
import { SWReactIcons } from "@similarweb/icons";

export const NoSelectedQueries = (props) => {
    return (
        <NoSelectedQueriesContainer justifyContent={"center"} alignItems={"center"}>
            <SWReactIcons iconName={"no-data-lab-2"} />
            <NoSelectedQueriesTitle>No queries to show</NoSelectedQueriesTitle>
            <NoSelectedQueriesSubtitle>
                Select a query from the dropdown above
            </NoSelectedQueriesSubtitle>
        </NoSelectedQueriesContainer>
    );
};
