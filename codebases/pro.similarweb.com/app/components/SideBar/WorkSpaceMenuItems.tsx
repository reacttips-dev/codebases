import { useEffect, useState } from "react";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import {
    WorkspacesDropDownItem,
    WorkspacesDropDownLink,
} from "components/SideBar/StyledComponents";
import { Injector } from "common/ioc/Injector";
import NgRedux from "ng-redux";
import { WORKSPACE_SALES_MANIPULATION_WEBSITES_WIZARD } from "pages/workspace/common/action_types/COPY_actionTypes";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import I18n from "components/WithTranslation/src/I18n";
import * as React from "react";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { IconSidebarItem } from "@similarweb/ui-components/dist/icon-sidebar";

// temporary solution, wil be deleted by EOY.

export const isMarketingWorkspace = (item) => item?.modules?.[0] === "marketingWorkspace";

export const WorkSpaceMenuItems = ({
    onChildClick,
    onToggle,
    onClick,
    isActive,
    permittedWorkSpaces,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);
    const hasMR = swSettings.user.hasMR;
    const isSimilarWebUser = swSettings.user.isSimilarWebUser;
    useEffect(() => {
        const fetchWorkspaces = async () => {
            setIsLoading(true);
            try {
                const workspaces = await marketingWorkspaceApiService.getMarketingWorkspaces();
                setWorkspaces(workspaces);
            } finally {
                setIsLoading(false);
            }
        };
        if (hasMR && !isSimilarWebUser) fetchWorkspaces();
    }, []);

    const tempFilter = (item) => {
        if (isMarketingWorkspace(item) && hasMR && !isSimilarWebUser) {
            return workspaces?.length > 0;
        } else {
            return true;
        }
    };
    const permittedWorkSpacesToDisplay = permittedWorkSpaces.filter(tempFilter);
    if (permittedWorkSpacesToDisplay.length === 0) {
        return null;
    }
    return (
        <Dropdown
            width={270}
            dropdownPopupHeight={400}
            buttonWidth={"auto"}
            appendTo={"body"}
            onClick={onChildClick}
            onToggle={onToggle}
            dropdownPopupPlacement="right"
            cssClassContainer="DropdownContent-container icon-sidebar-workspaces-dropdown"
        >
            {[
                <IconSidebarItem
                    key={"workspaces"}
                    icon={"category"}
                    title={i18nFilter()("workspace")}
                    onItemClick={onClick}
                    isActive={isActive}
                />,
                ...permittedWorkSpacesToDisplay.map((item) => {
                    if (isLoading) {
                        return <PixelPlaceholderLoader width={"100%"} height={48} />;
                    }
                    return (
                        <WorkspacesDropDownItem key={item.trackName} id="workspace-dropdown-item">
                            <WorkspacesDropDownLink
                                href={item.link}
                                target={"_self"}
                                onClick={() => {
                                    if (item.link === "/#/workspace/sales") {
                                        const $ngRedux = Injector.get<NgRedux.INgRedux>("$ngRedux");
                                        $ngRedux.dispatch({
                                            type: WORKSPACE_SALES_MANIPULATION_WEBSITES_WIZARD,
                                            isOpen: false,
                                        });
                                    }
                                    TrackWithGuidService.trackWithGuid(
                                        "solutions2.sidebar.menu.workspace.dropdown",
                                        "click",
                                        { trackName: `${item.trackName}/websites` },
                                    );
                                }}
                            >
                                <I18n>{item.title}</I18n>
                            </WorkspacesDropDownLink>
                        </WorkspacesDropDownItem>
                    );
                }),
            ]}
        </Dropdown>
    );
};
