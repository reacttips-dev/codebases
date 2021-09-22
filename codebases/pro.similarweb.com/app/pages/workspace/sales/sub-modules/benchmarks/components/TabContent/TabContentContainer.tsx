import React from "react";
import { EmptyState } from "../EmptyState/EmptyState";
import RootLoader from "../RootLoader/RootLoader";
import TabContent from "./TabContent";

type TabContentContainerProps = {
    isLoading: boolean;
    emptyStateMessages?: { mainMessage: string; subMessage: string };
};

const TabContentContainer = (props: TabContentContainerProps) => {
    const { isLoading, emptyStateMessages } = props;

    if (isLoading) {
        return <RootLoader />;
    }

    if (emptyStateMessages) {
        return (
            <EmptyState
                mainMessage={emptyStateMessages?.mainMessage}
                subMessage={emptyStateMessages?.subMessage}
            />
        );
    }

    return <TabContent />;
};

export default TabContentContainer;
