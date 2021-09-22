/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { FC, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { swSettings } from "common/services/swSettings";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import { MultipleWorkspacesHeader } from "./MultipleWorkspacesHeader";
import { SingleWorkspaceHeader } from "./SingleWorkspaceHeader";
import { IMarketingWorkspaceNavBarHeaderProps } from "./MarketingWorkspaceNavBarHeaderTypes";

const MarketingWorkspaceNavBarHeader: FC<IMarketingWorkspaceNavBarHeaderProps> = (props) => {
    const maxAllowedWorkspaces = swSettings.components.MarketingWorkspace.resources.WorkspacesLimit;
    const { selectedWorkspaceName, allWorkspaces, selectedWorkspaceId } = props;

    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            translate: i18nFilter(),
        };
    }, []);

    const headerTitle = selectedWorkspaceName || "";
    const hasMultipleWorkspaces = maxAllowedWorkspaces > 1;

    return hasMultipleWorkspaces ? (
        <MultipleWorkspacesHeader
            headerTitle={headerTitle}
            selectedWorkspaceId={selectedWorkspaceId}
            allWorkspaces={allWorkspaces}
            maxAllowedWorkspaces={maxAllowedWorkspaces}
            services={services}
        />
    ) : (
        <SingleWorkspaceHeader headerTitle={headerTitle} navigator={services.swNavigator} />
    );
};

const mapStateToProps = ({ marketingWorkspace: { allWorkspaces, selectedWorkspace } }) => {
    const { id, title } = selectedWorkspace;
    return {
        allWorkspaces,
        selectedWorkspaceId: id,
        selectedWorkspaceName: title,
    };
};

const connected = connect(mapStateToProps)(MarketingWorkspaceNavBarHeader);
export default connected;
