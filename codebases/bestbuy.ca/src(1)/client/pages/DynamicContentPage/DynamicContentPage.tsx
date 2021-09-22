import * as React from "react";
import {connect} from "react-redux";
import {Location} from "history";
import {bindActionCreators} from "redux";
import {
    dynamicContentActionCreators,
    DynamicContentActionCreators,
    sideNavigationActionCreators,
    SideNavigationActionCreators,
    notificationActionCreators,
    NotificationActionCreators,
    adActionCreators,
    AdActionCreators,
} from "actions";
import {IBrowser as ScreenSize} from "redux-responsive";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {NavigationLink, DynamicContentModel, Seo, BreadcrumbListItem, Breadcrumb, SectionData} from "models";
import {RoutingState, SideNavigationState, DynamicContentState} from "reducers";
import {State} from "store";
import routeManager from "utils/routeManager";
import messages from "./translations/messages";
import {HeadTags} from "components/HeadTags";
import BreadcrumbList from "components/BreadcrumbList";
import {getBreadcrumbRoot} from "utils/builders/breadcrumbBuilder";
import {DynamicContent} from "components/DynamicContent";
import TitleHeader from "components/TitleHeader";
import * as styles from "./style.css";
import {SideNavMenu} from "@bbyca/bbyca-components";
import {RouteActions} from "react-router-redux";
import SideNavigation, {createNavigationLink, findPath} from "./components/SideNavigation";
import GeeksquadChat from "components/GeeksquadChat";
import {Key} from "@bbyca/apex-components";
import {AdLoader, AdItem, AvailableAdFormats, buildAdItemsFromSectionData} from "components/Advertisement";
import {DynamicContentPageAdTargetingProps, GoogleAdsEventAdSlot} from "components/Advertisement/GooglePublisherTag";
import LoadingSkeleton from "./components/LoadingSkeleton/LoadingSkeleton";
import SEOBlock from "pages/ProductListingPage/components/SEOBlock";
import {SingleColumn, TwoColumn} from "pages/PageLayouts";
import ContactUs from "components/ContactUs";
import {TestPencilAdIds} from "config";
import {getScreenSize} from "store/selectors";

export interface StateProps {
    appEnv: string;
    dynamicContent: DynamicContentState;
    sideNavigation: SideNavigationState;
    language: Language;
    routing: RoutingState;
    screenSize: ScreenSize;
    regionName: string;
    geeksquadChatUrl: string;
    locale: Locale;
    testPencilAdIds: TestPencilAdIds;
}

export interface DispatchProps {
    dynamicContentActions: DynamicContentActionCreators;
    sideNavigationActions: SideNavigationActionCreators;
    notificationActions: NotificationActionCreators;
    adActions: AdActionCreators;
}

export interface OwnProps {
    router: RouteActions;
    location: Location;
}

interface Props extends StateProps, DispatchProps, OwnProps, InjectedIntlProps {}

const getTemplate = (twoCol: boolean) => (twoCol ? TwoColumn : SingleColumn);

export class DynamicContentPage extends React.PureComponent<Props> {
    private tree: NavigationLink;

    public render() {
        const {
            dynamicContent,
            screenSize,
            intl,
            language,
            router,
            routing,
            sideNavigation,
            locale,
            appEnv,
            adActions,
        } = this.props;
        const content = dynamicContent.content;
        const isMobile = screenSize.lessThan.medium;
        const seoBlock = content && content.seo;
        const headerTitle = (seoBlock && seoBlock.headerTitle) || intl.formatMessage(messages.title);
        const h1 = (content && content.h1) || "";
        const shouldDisplayNavigation = this.shouldDisplayNavigation();
        let path;

        const sideNavigationNode = content && content.navigation ? content.navigation[0] : sideNavigation.tree;

        if (shouldDisplayNavigation) {
            this.tree = createNavigationLink(sideNavigationNode, this.getParams(), language, router, routing.pageKey);
            path = findPath(this.tree);
        } else {
            path = [{label: h1}];
        }

        const Template = getTemplate(!!shouldDisplayNavigation);

        const breadCrumbList = this.shouldUseBreadcrumbFromContent()
            ? this.setBreadcrumbList(content.breadcrumbs, routing.pageKey)
            : this.setBreadcrumbListByPath(path);

        return (
            <>
                {content && this.getHeadTags(content, headerTitle)}
                <Template.Container>
                    <Template.Header>
                        <BreadcrumbList className={styles.breadcrumbs} breadcrumbListItems={breadCrumbList} />
                    </Template.Header>
                    {shouldDisplayNavigation && (
                        <TwoColumn.SideBar>
                            {isMobile ? (
                                <div data-automation="secondary-navigation">
                                    <SideNavMenu
                                        sideNavContent={() => this.renderSideNav()}
                                        title={h1}
                                        displayCloseIcon={true}
                                        closeIconColor="white"
                                    />
                                </div>
                            ) : (
                                <div className={styles.navigationContainer} data-automation="secondary-navigation">
                                    {this.renderSideNav()}
                                </div>
                            )}
                        </TwoColumn.SideBar>
                    )}
                    <Template.Main>
                        <div className={styles.titleHeader} data-automation="dynamic-content-title">
                            <TitleHeader title={h1} noPaddingTop={true} noPaddingBottom={true} />
                        </div>
                        <div className={styles.sectionContainer}>
                            {content && (
                                <>
                                    {this.loadAds(content.id, content.sections, locale, appEnv, adActions.adLoaded)}
                                    {dynamicContent.loading ? (
                                        <LoadingSkeleton />
                                    ) : (
                                        <>
                                            <DynamicContent
                                                isLoading={dynamicContent.loading}
                                                sectionList={content.sections}
                                                screenSize={this.props.screenSize}
                                                regionName={this.props.regionName}
                                                hasNavigation={shouldDisplayNavigation}
                                                language={this.props.language}
                                            />
                                            {content.displayContactUs && <ContactUs />}
                                        </>
                                    )}
                                </>
                            )}
                            {this.renderSeoContent()}
                        </div>
                    </Template.Main>
                </Template.Container>
            </>
        );
    }

    public async componentDidMount() {
        const {dynamicContent, dynamicContentActions, sideNavigationActions, sideNavigation, routing} = this.props;
        const isDifferentContent =
            !dynamicContent.content || (dynamicContent.content && dynamicContent.content.id !== this.getParams().id);

        if (isDifferentContent) {
            await this.loadContent();
            if (this.pageHasDynamicNavigation()) {
                sideNavigationActions.syncSideNavigationStateWithLocation(routing.locationBeforeTransitions);
            } else if (sideNavigation.tree) {
                sideNavigationActions.clearSideNavigation();
            }
        }
        dynamicContentActions.trackDynamicContentPageLoad();
        this.launchGeekSquadChat();
    }

    public async componentDidUpdate(prevProps: Props) {
        const {dynamicContentActions, routing, sideNavigation: sideNav, sideNavigationActions, location} = this.props;
        const isDifferentPathname = prevProps.location.pathname !== location.pathname;
        const isDifferentPage = prevProps.routing.pageKey !== routing.pageKey;

        if (isDifferentPage) {
            sideNavigationActions.clearSideNavigation();
        }

        if (isDifferentPathname) {
            await this.loadContent();
            dynamicContentActions.trackDynamicContentPageLoad();
            this.launchGeekSquadChat();
            if (this.pageHasDynamicNavigation() && !sideNav.tree) {
                sideNavigationActions.syncSideNavigationStateWithLocation(routing.locationBeforeTransitions);
            }
        }
    }

    private loadAds = (
        marketingPageId: string,
        contentSections: SectionData[],
        locale: Locale,
        appEnv: string,
        adsLoadedCallback: (adSlotId: string, adRendered: boolean, adSlot: GoogleAdsEventAdSlot) => void,
    ) => {
        if (marketingPageId && contentSections && contentSections.length) {
            const adTargetingProps: DynamicContentPageAdTargetingProps = {
                lang: locale,
                marketingPageId,
                environment: appEnv,
            };
            const items: AdItem[] = [
                ...!!this.props.testPencilAdIds ? [{
                    format: AvailableAdFormats.pencilAd,
                    id: this.props.testPencilAdIds.marketing,
                }] : [],
                ...buildAdItemsFromSectionData(contentSections),
            ];
            return (
                <AdLoader items={items} adTargetingProps={adTargetingProps} callbackOnAdRendered={adsLoadedCallback} />
            );
        }
    };

    private shouldUseBreadcrumbFromContent = () => {
        const {
            dynamicContent: {content},
            routing,
        } = this.props;
        return content && content.breadcrumbs && routing.pageKey === "careers";
    };

    private loadContent = () => {
        const {dynamicContentActions, routing} = this.props;
        return dynamicContentActions.syncDynamicContentStateWithLocation(routing.locationBeforeTransitions);
    };

    private renderSideNav = () => {
        const {tree, props} = this;
        const {
            sideNavigation: {loading},
            screenSize,
            intl,
        } = props;
        return (
            <SideNavigation
                isLoading={!tree || loading}
                tree={tree}
                backToText={intl.formatMessage(messages.backTo)}
                isMobile={screenSize.lessThan.medium}
            />
        );
    };

    private renderSeoContent = () => {
        const {
            dynamicContent: {content, loading},
        } = this.props;

        if (!loading && content && content.seo && content.seo.overview) {
            return <SEOBlock title={content.seo.overviewTitle} content={content.seo.overview} />;
        }

        return null;
    };

    private getHeadTags(content: DynamicContentModel, headerTitle: string) {
        let metaTags;
        let links = [];
        const seo = (content.seo || {}) as Seo;
        if (seo.disabled) {
            metaTags = [{name: "ROBOTS", content: "NOINDEX, NOFOLLOW"}];
        } else {
            const metaDescription = seo.metaDescription || this.props.intl.formatMessage(messages.description);
            const seoText = seo.seoText || this.getParams().name;
            const id = !!seoText && content.id !== seoText ? content.id : "";
            const canonicalUrl = routeManager.getCanonicalUrlByKey(
                this.props.language,
                this.props.routing.pageKey,
                seoText,
                id,
            );
            metaTags = [{name: "description", content: metaDescription}];
            links = [canonicalUrl && {rel: "canonical", href: canonicalUrl}];
        }
        return <HeadTags title={headerTitle} links={links} metaTags={metaTags} />;
    }

    private getParams() {
        const params = routeManager.getParams(this.props.language, this.props.location.pathname) as any;
        return params || {};
    }

    private shouldDisplayNavigation(): boolean {
        const hasSideNavigation =
            this.props.sideNavigation.tree ||
            (this.props.dynamicContent.content && this.props.dynamicContent.content.navigation);
        return hasSideNavigation && !this.isBrandStoreL1();
    }

    private setBreadcrumbList = (breadcrumbs: Breadcrumb[], pageKey: Key): BreadcrumbListItem[] => {
        const breadcrumbList: BreadcrumbListItem[] = [];
        breadcrumbs.forEach((breadcrumb) => {
            const linkParams = breadcrumb.path ? breadcrumb.path.split("/").filter(Boolean) : [];
            breadcrumbList.push({
                label: breadcrumb.label,
                linkType: pageKey,
                seoText: linkParams[1],
                linkTypeId: linkParams[2],
            });
        });
        return [getBreadcrumbRoot(this.props.intl)].concat(breadcrumbList);
    };

    private setBreadcrumbListByPath = (pathLinks: []): BreadcrumbListItem[] => {
        return (pathLinks || []).length !== 0 ? [getBreadcrumbRoot(this.props.intl)].concat(pathLinks) : [];
    };

    private pageHasDynamicNavigation = (): boolean => {
        const pagesWithNavigation = ["brandStore"];
        return pagesWithNavigation.indexOf(this.props.routing.pageKey) > -1;
    };

    private isBrandStoreL1 = () => {
        return this.props.sideNavigation.tree && this.props.sideNavigation.tree.id === this.getParams().id;
    };

    private launchGeekSquadChat = () =>
        this.props.routing.pageKey === "services"
            ? GeeksquadChat(this.props.geeksquadChatUrl, this.props.notificationActions.geeksquadChatLoadError)
            : null;
}

const mapStateToProps = (state: State): any => ({
    appEnv: state.app.environment.appEnv,
    dynamicContent: state.dynamicContent,
    sideNavigation: state.sideNavigation,
    language: state.intl.language,
    locale: state.intl.locale,
    routing: state.routing,
    screenSize: getScreenSize(state),
    regionName: state.user.shippingLocation.regionName,
    geeksquadChatUrl: state.config.dataSources.geeksquadChatUrl,
    testPencilAdIds: state.config.testPencilAdIds,
});

const mapDispatchToProps = (dispatch): any => {
    return {
        adActions: bindActionCreators(adActionCreators, dispatch),
        dynamicContentActions: bindActionCreators(dynamicContentActionCreators, dispatch),
        sideNavigationActions: bindActionCreators(sideNavigationActionCreators, dispatch),
        notificationActions: bindActionCreators(notificationActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(DynamicContentPage));
