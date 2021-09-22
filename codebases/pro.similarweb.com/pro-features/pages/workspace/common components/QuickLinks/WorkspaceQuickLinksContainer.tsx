import { Carousel } from "components/Carousel/src/Carousel";
import WorkspaceExtensionLink from "components/Workspace/ExtentionDownloadLink/src/WorkspaceExtensionLink";
import WorkspaceQuickLink from "components/Workspace/QuickLink/src/WorkspaceQuickLink";
import WorkspaceQuickBox from "components/Workspace/QuickLink/src/WorkspaceQuickBox";
import * as React from "react";
import WithAllContexts from "../WithAllContexts";
import { QuickLinkBox, SearchQuickLinkWrapper } from "./StyledComponents";

export const WorkspaceQuickLinksContainer = (props) => {
    const {
        quickLinks,
        findNewLeadsBox,
        linkToDashboardTemplate,
        onClickFindNewLeadsBox,
        templateId,
        extensionLinks,
        opportunityListId,
    } = props;

    return (
        <WithAllContexts>
            {({ translate, track, getLink }) => {
                const chromeClick = () =>
                    track(
                        "Download",
                        "click",
                        `quickLink/SW Extension/${
                            quickLinks[quickLinks.length - 1].trackIndex + 1
                        }`,
                    );
                return (
                    <Carousel margin={16} offset={0}>
                        {findNewLeadsBox?.isShowBox && (
                            <SearchQuickLinkWrapper>
                                <WorkspaceQuickBox
                                    title={translate(findNewLeadsBox.title)}
                                    text={translate(findNewLeadsBox.text)}
                                    iconComponent={findNewLeadsBox.iconComponent}
                                    onClick={onClickFindNewLeadsBox}
                                    data-automation-quick-box={"workspace-quick-box"}
                                />
                            </SearchQuickLinkWrapper>
                        )}
                        {quickLinks &&
                            quickLinks.map((quickLink, index) => {
                                const {
                                    header,
                                    title,
                                    text,
                                    iconComponent,
                                    state,
                                    params,
                                    target,
                                    trackIndex,
                                } = quickLink;
                                const href = state ? getLink(state, params) : undefined;
                                const onClick = () => {
                                    track(
                                        "Internal Link",
                                        "click",
                                        `quickLink/${translate(title)}/${trackIndex}`,
                                    );
                                    // templateId, keys, country, workspaceId
                                    if (typeof target === "function") {
                                        target(params);
                                    } else if (target) {
                                        linkToDashboardTemplate(
                                            templateId[target],
                                            [],
                                            null,
                                            opportunityListId,
                                        );
                                    }
                                };
                                return (
                                    <QuickLinkBox key={"quick" + index}>
                                        <WorkspaceQuickLink
                                            title={translate(title)}
                                            header={translate(header)}
                                            text={translate(text)}
                                            href={href}
                                            iconComponent={iconComponent}
                                            onClick={onClick}
                                            data-automation-quick-link={`quickLink-${index}`}
                                            target="_self"
                                        />
                                    </QuickLinkBox>
                                );
                            })}
                        {extensionLinks ? (
                            <QuickLinkBox>
                                {extensionLinks.map((extentionLink, index) => {
                                    const {
                                        title,
                                        text,
                                        href,
                                        iconComponent,
                                        target,
                                        downloadText,
                                        dataAutomation,
                                    } = extentionLink;
                                    return (
                                        <WorkspaceExtensionLink
                                            key={`${title}${index}`}
                                            title={translate(title)}
                                            href={href}
                                            text={translate(text)}
                                            iconComponent={iconComponent}
                                            downloadText={downloadText}
                                            data-automation-quick-link={dataAutomation}
                                            onClick={chromeClick}
                                            target={target}
                                        />
                                    );
                                })}
                            </QuickLinkBox>
                        ) : null}
                    </Carousel>
                );
            }}
        </WithAllContexts>
    );
};
