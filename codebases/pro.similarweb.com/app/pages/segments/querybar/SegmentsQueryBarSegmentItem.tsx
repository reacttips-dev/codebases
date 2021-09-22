import React from "react";
import { QueryBarAppItem } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItems/QueryBarAppItem";
import { QueryBarItemContainer } from "./styledComponents";

interface ISegmentsQueryBarGroupItemProps {
    segmentName: string;
    segmentWebsite: string;
    segmentImage: string;
    onItemClick: () => void;
}

export const SegmentsQueryBarSegmentItem = (props: ISegmentsQueryBarGroupItemProps) => {
    const { segmentName, segmentWebsite, segmentImage, onItemClick } = props;

    return (
        <QueryBarItemContainer>
            <QueryBarAppItem
                text={segmentWebsite}
                secondaryText={segmentName}
                image={segmentImage}
                isCompare={false}
                onItemClick={onItemClick}
            />
        </QueryBarItemContainer>
    );
};
