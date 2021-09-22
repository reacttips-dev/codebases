import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { InnerTitleContainer } from "components/AutocompleteKeywords/styles/AutocompleteKeywordStyles";
import React from "react";

export const Section = ({ header, content }) => {
    return (
        <FlexColumn>
            {header && <InnerTitleContainer>{header}</InnerTitleContainer>}
            {content}
        </FlexColumn>
    );
};
