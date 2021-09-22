import classNames from "classnames";
import React, { memo } from "react";
import { SegmentUrlListItemContainer } from "./SegmentUrlListStyles";
import { ISegmentUrlListItemHighlightProps } from "./SegmentUrlListTypes";

export const SegmentUrlListItemComponent: React.FunctionComponent<ISegmentUrlListItemHighlightProps> = ({
    urlHighlighted,
}) => {
    return (
        <SegmentUrlListItemContainer>
            {urlHighlighted.map(({ partTypes, text, isShrink }, i) => (
                <span key={i} className={classNames(Array.from(partTypes), { shrinked: isShrink })}>
                    {text}
                </span>
            ))}
        </SegmentUrlListItemContainer>
    );
};

export const SegmentUrlListItem = memo(SegmentUrlListItemComponent);
