import * as React from "react";
import { FC } from "react";
import {
    IconWrapper,
    NoMoreHighlightsCardContent,
    NoMoreHighlightsCardTitle,
    NoMoreHighlightsCardWrapper,
} from "./StyledComponents";
import I18n from "components/WithTranslation/src/I18n";

export const NoMoreHighlightsCard: FC<any> = () => {
    return (
        <NoMoreHighlightsCardWrapper>
            <NoMoreHighlightsCardTitle>
                <I18n>arena.strategic-overview.highlights.no-more-highlights.title</I18n>
            </NoMoreHighlightsCardTitle>
            <NoMoreHighlightsCardContent>
                <I18n>arena.strategic-overview.highlights.no-more-highlights.content</I18n>
            </NoMoreHighlightsCardContent>
            <IconWrapper iconName={"no-data-lab"} />
        </NoMoreHighlightsCardWrapper>
    );
};
