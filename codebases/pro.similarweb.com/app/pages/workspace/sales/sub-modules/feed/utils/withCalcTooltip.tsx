import React from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { replaceUnderscores } from "../helpers";

export const withCalcTooltip = (
    text: string | undefined | null,
    Wrapper: React.ComponentType | React.FunctionComponent,
    maxTextLength: number,
    maxWidth: number,
    wrapperProps: Record<string, any>,
): JSX.Element => {
    const categoryText = replaceUnderscores(text);
    return text && text.length > maxTextLength ? (
        <PlainTooltip maxWidth={maxWidth} placement="top" tooltipContent={categoryText}>
            <Wrapper {...wrapperProps}>{categoryText}</Wrapper>
        </PlainTooltip>
    ) : (
        <Wrapper>{categoryText}</Wrapper>
    );
};
