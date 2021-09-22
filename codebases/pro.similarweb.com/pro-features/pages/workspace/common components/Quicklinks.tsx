import * as React from "react";
import { WorkspaceQuickLinksContainer } from "./QuickLinks/WorkspaceQuickLinksContainer";

export const Quicklinks = (props) => {
    const quickLinks = props.quickLinks.map((item, index) => ({ ...item, trackIndex: index + 1 }));

    const extensionLinks = props.extensionLinks
        ? props.extensionLinks.map((item, index) => ({
              ...item,
              trackIndex: quickLinks.length + index + 1,
          }))
        : null;

    const { linkToDashboardTemplate, onClickFindNewLeadsBox, findNewLeadsBox, templateId } = props;

    return (
        <WorkspaceQuickLinksContainer
            quickLinks={quickLinks}
            findNewLeadsBox={findNewLeadsBox}
            extensionLinks={extensionLinks}
            linkToDashboardTemplate={linkToDashboardTemplate}
            onClickFindNewLeadsBox={onClickFindNewLeadsBox}
            templateId={templateId}
        />
    );
};
