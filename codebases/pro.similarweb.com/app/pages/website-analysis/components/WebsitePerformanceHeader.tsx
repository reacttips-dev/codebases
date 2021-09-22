import React, { useState } from "react";
import styled from "styled-components";
import { colorsPalettes, rgba, fonts } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { MobileAndDesktopScreenshots } from "@similarweb/ui-components/dist/mobile-desktop-screenshot";
import { SWReactIcons } from "@similarweb/icons";
import WebsitePerformanceAppItem from "components/React/AppItemWithTooltip/WebsitePerformanceAppItem";
import { useTranslation } from "components/WithTranslation/src/I18n";
import GAVerifiedContainer from "components/React/GAVerifiedIcon/GAVerifiedContainer";
import { TrackButton } from "components/React/TrackButton/TrackButton";

// ----- Structure -----
const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: 272px;
    width: 100%;
    padding: 24px;
    margin-bottom: 50px;
    border-radius: 4px;
    box-shadow: 0px 3px 6px ${rgba(colorsPalettes.carbon[500], 0.08)};
    box-sizing: border-box;
    background: linear-gradient(90deg, #ffffff 8.56%, rgba(255, 255, 255, 0) 54.21%),
        radial-gradient(
            38.36% 126.97% at 0.79% 79.32%,
            rgba(0, 115, 255, 0.15) 0%,
            rgba(255, 255, 255, 0) 100%
        ),
        radial-gradient(
            37.51% 157.39% at 83.12% 10.83%,
            rgba(0, 115, 255, 0.15) 0%,
            rgba(255, 255, 255, 0) 100%
        ),
        radial-gradient(
            23.44% 59.26% at 0.42% 0%,
            rgba(255, 132, 0, 0.15) 0%,
            rgba(255, 255, 255, 0) 100%
        ),
        radial-gradient(
            24.48% 60.57% at 67.76% 90.07%,
            rgba(255, 132, 0, 0.15) 0%,
            rgba(255, 255, 255, 0) 100%
        ),
        radial-gradient(
            168.43% 350.01% at 57.43% 23.44%,
            #f6f8fb 1.42%,
            rgba(243, 247, 254, 0) 100%
        ),
        linear-gradient(0deg, #ffffff, #ffffff), #f6f8fb;
`;

const LeftSectionWrapper = styled.div`
    display: flex;
    height: 100%;
    max-width: 50%;
    min-width: 35%;
    flex-direction: column;
`;

const DescriptionText = styled.div`
    ${setFont({
        $family: fonts.$roboto,
        $size: 14,
        $weight: 400,
        $color: colorsPalettes.midnight[600],
    })};
    width: 100%;
    margin-bottom: 24px;
    min-height: 64px;

    /* Truncate text after three lines */
    max-height: 3em;
    overflow: hidden;
`;

const MiddleSection = styled.div`
    display: flex;
    flex: 1 1 auto;
    height: 100%;
`;

const RightSectionWrapper = styled.div`
    display: flex;
    align-self: flex-end;
    height: 100%;
`;

// ----- Main Title -----
const LeftTitleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: flex-start;
    margin-bottom: 24px;
`;

const IconWrapper = styled.div`
    width: 32px;
    height: 32px;
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${colorsPalettes.carbon[100]};
    box-sizing: border-box;
    border-radius: 8px;
    box-shadow: 0px 2px 4px ${rgba(colorsPalettes.carbon[500], 0.2)};
`;

const DomainTitle = styled.span`
    ${setFont({
        $family: fonts.$dmSansFontFamily,
        $size: 32,
        $weight: 500,
        $color: colorsPalettes.midnight[600],
    })};
    margin-right: 4px;
`;

const OutLink = styled.a`
    opacity: 0;
    margin-right: 8px;

    &:hover {
        transition: opacity 0.5s east-out;
        opacity: 1;
    }

    & > path {
        fill: ${colorsPalettes.carbon[500]};
    }
`;

const TitleAndOutlink = styled.div`
    display: flex;
    flex-direction: row;
    &:hover > ${OutLink} {
        transition: opacity 0.5s east-out;
        opacity: 1;
    }
`;

const GAVerifiedIconWrapper = styled.span`
    width: 32px;
    height: 32px;
    background: ${colorsPalettes.carbon[25]};
    border-radius: 18px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

// ----- Related Apps -----
interface IAppsGroupProps {
    iconName: string;
    title: string;
    store: string;
    storeKey: string;
    relatedApps: IStoreInfo;
    className?: string;
    onClickHandler?: () => void;
    showMore: () => void;
    showBack: () => void;
    showMoreExpanded: boolean;
    noOfDisplayedApps: number;
}

const AppGroupTitle = styled.span`
    ${setFont({
        $family: fonts.$roboto,
        $size: 13,
        $weight: 400,
        $color: colorsPalettes.midnight[600],
    })};
    margin-left: 4px;
`;

const AppGroupIcon = styled(SWReactIcons)`
    & > svg {
        & > path {
            fill: ${colorsPalettes.carbon[500]};
        }
    }
`;

const AppsGroup: React.FC<IAppsGroupProps> = ({
    iconName,
    title,
    store,
    relatedApps,
    className,
    onClickHandler,
    showMore,
    showBack,
    showMoreExpanded,
    noOfDisplayedApps = 3,
}) => {
    const translate = useTranslation();
    return (
        <>
            <div className={className}>
                <RelatedAppsTitleWrapper>
                    <AppGroupIcon iconName={iconName} size="xs" />
                    <AppGroupTitle>{title}</AppGroupTitle>
                </RelatedAppsTitleWrapper>
                <AppIconsWrapper>
                    <WebsitePerformanceAppItem
                        store={store}
                        apps={relatedApps.apps}
                        limitApps={noOfDisplayedApps}
                        onClick={onClickHandler}
                        aClassName="related-app"
                        imgClassName="related-apps-app-icon"
                    />
                </AppIconsWrapper>
                {!showMoreExpanded && relatedApps.apps.length > noOfDisplayedApps && (
                    <span className="related-apps-show-more u-underline" onClick={showMore}>
                        {translate("wa.ao.header.apps.more")}
                    </span>
                )}
                {showMoreExpanded && (
                    <span className="related-apps-show-more u-underline" onClick={showBack}>
                        {translate("wa.ao.header.apps.back")}
                    </span>
                )}
            </div>
        </>
    );
};

const RelatedAppsGroup = styled(AppsGroup)`
    display: flex;
    flex-direction: column;
    width: 50%;
`;

const AppIconsWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const RelatedAppsTitleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 4px;
`;

const RelatedAppsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    & > ${RelatedAppsGroup} {
        margin-right: 16px;
    }
`;

const getMobileScreenshotUrlFromDesktopImage = (desktopUrl: string): string =>
    desktopUrl.replace("&t=1", "&t=4");

export interface IAppInfo {
    appId: string;
    appStore: string;
}

export interface IStoreInfo {
    apps: IAppInfo[];
    showMore: boolean;
    showBack: boolean;
}

export interface IRelatedAppsProp {
    ios?: IStoreInfo;
    google?: IStoreInfo;
}

export interface IWebsitePerformanceHeaderProps {
    domain: string;
    description?: string;
    favIconUrl: string;
    websiteHeaderImage?: string;
    showGAConnectCTA: boolean;
    showVerifiedData: boolean;
    privacyStatus: string;
    hasGAToken: boolean;
    metric: string;
    relatedApps: IRelatedAppsProp;
    showTrackButton: boolean;
    isTracked: boolean;
    isTrackLoading: boolean;
    hasTrackWorkspaces: boolean;
    addToWorkspace: () => void;
    trackButtonText: string;
    trackAppClick: (appName: string, store: string) => void;
    relatedAppsShowMore: (store: string) => void;
    relatedAppsShowBack: (store: string) => void;
}

const WebsitePerformanceHeader: React.FC<IWebsitePerformanceHeaderProps> = ({
    domain,
    description,
    favIconUrl,
    websiteHeaderImage = "/images/no-image.png",
    showGAConnectCTA,
    showVerifiedData,
    privacyStatus,
    hasGAToken,
    metric,
    relatedApps,
    showTrackButton,
    isTracked,
    isTrackLoading,
    hasTrackWorkspaces,
    addToWorkspace,
    trackButtonText,
}) => {
    const translate = useTranslation();
    const [appstoreMoreOpen, setAppstoreMoreOpen] = useState(false);
    const [googleMoreOpen, setGoogleMoreOpen] = useState(false);

    return (
        <HeaderWrapper>
            <LeftSectionWrapper>
                <LeftTitleWrapper>
                    <IconWrapper>
                        <img src={favIconUrl} />
                    </IconWrapper>
                    <TitleAndOutlink>
                        <DomainTitle>{domain}</DomainTitle>
                        <OutLink href={`http://${domain}`}>
                            <SWReactIcons iconName="link-out" size="xs" />
                        </OutLink>
                    </TitleAndOutlink>
                    {showGAConnectCTA !== undefined && (
                        <GAVerifiedIconWrapper>
                            <GAVerifiedContainer
                                size={"MEDIUM"}
                                isActive={showVerifiedData}
                                isPrivate={privacyStatus === "Private" && hasGAToken}
                                tooltipAvailable={true}
                                tooltipIsActive={showGAConnectCTA}
                                metric={metric}
                            />
                        </GAVerifiedIconWrapper>
                    )}
                    {hasTrackWorkspaces && showTrackButton && (
                        <TrackButton
                            type="outlined"
                            isTracked={isTracked}
                            isLoading={isTrackLoading}
                            isDisabled={isTrackLoading || isTracked}
                            onClick={addToWorkspace}
                            text={translate(trackButtonText)}
                        ></TrackButton>
                    )}
                </LeftTitleWrapper>
                <DescriptionText>{description}</DescriptionText>
                <RelatedAppsWrapper>
                    {relatedApps?.ios?.apps?.length > 0 && (
                        <RelatedAppsGroup
                            iconName={"i-tunes"}
                            store={relatedApps.ios.apps[0].appStore.toString()}
                            storeKey="ios"
                            title={translate("wa.ao.header.iosapps")}
                            relatedApps={relatedApps.ios}
                            showMoreExpanded={appstoreMoreOpen}
                            noOfDisplayedApps={appstoreMoreOpen ? relatedApps.ios.apps.length : 3}
                            showMore={setAppstoreMoreOpen.bind(null, true)}
                            showBack={setAppstoreMoreOpen.bind(null, false)}
                        />
                    )}
                    {relatedApps?.google?.apps?.length > 0 && (
                        <RelatedAppsGroup
                            iconName={"google-play"}
                            store={relatedApps.google.apps[0].appStore.toString()}
                            storeKey="google"
                            title={translate("wa.ao.header.googleapps")}
                            relatedApps={relatedApps.google}
                            showMoreExpanded={googleMoreOpen}
                            noOfDisplayedApps={googleMoreOpen ? relatedApps.google.apps.length : 3}
                            showMore={setGoogleMoreOpen.bind(null, true)}
                            showBack={setGoogleMoreOpen.bind(null, false)}
                        />
                    )}
                </RelatedAppsWrapper>
            </LeftSectionWrapper>
            <MiddleSection />
            <RightSectionWrapper>
                <MobileAndDesktopScreenshots
                    mobileImageUrl={getMobileScreenshotUrlFromDesktopImage(websiteHeaderImage)}
                    desktopImageUrl={websiteHeaderImage}
                />
            </RightSectionWrapper>
        </HeaderWrapper>
    );
};

SWReactRootComponent(WebsitePerformanceHeader, "WebsitePerformanceHeader");
