import React from "react";
import { QueryBarGroupItem } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItems/QueryBarGroupItem";
import { QueryBarItemContainer } from "./styledComponents";
import { i18nFilter } from "filters/ngFilters";

interface ISegmentsQueryBarGroupItemProps {
    groupName: string;
    groupSize: number;
    onItemClick: () => void;
}

export const SegmentsQueryBarGroupItem = (props: ISegmentsQueryBarGroupItemProps) => {
    const { i18n } = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const { groupName, groupSize, onItemClick } = props;

    return (
        <QueryBarItemContainer>
            <QueryBarGroupItem
                text={i18n("segments.querybar.group.item.main", { count: groupSize })}
                secondaryText={groupName}
                icon="segment-folder"
                onItemClick={onItemClick}
            />
        </QueryBarItemContainer>
    );
};
