import React, { FC, useMemo } from "react";
import { DashboardPptExportListItem } from "./DashboardPptExportListItem";
import { ListContainer } from "./DashboardPptExportListStyles";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { IDashboardPptExportListProps } from "components/Dashboard/DashboardPptExportModal/DashboardPptExportList/DashboardPptExportListTypes";

export const DashboardPptExportList: FC<IDashboardPptExportListProps> = (props) => {
    const { listItems, onToggleWidgetSelect } = props;

    const listContent = useMemo(() => {
        return listItems.map((item) => {
            return (
                <DashboardPptExportListItem
                    key={item.id}
                    item={item}
                    onToggle={onToggleWidgetSelect}
                />
            );
        });
    }, [listItems, onToggleWidgetSelect]);

    return (
        <ListContainer>
            <ScrollArea
                style={{ height: "261px" }}
                verticalScrollbarStyle={{ borderRadius: 5 }}
                horizontal={false}
                smoothScrolling={true}
                minScrollSize={48}
            >
                <FlexColumn>{listContent}</FlexColumn>
            </ScrollArea>
        </ListContainer>
    );
};
