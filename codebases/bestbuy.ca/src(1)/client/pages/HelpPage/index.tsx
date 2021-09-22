import {
    helpActionCreators as helpTopicAction,
    HelpActionCreators as HelpTopicActions,
    routingActionCreators as routingAction,
    RoutingActionCreators as RoutingAction,
} from "actions";
import Link from "components/Link";
import {Key, routeManager} from "@bbyca/apex-components";
import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {HelpState, RoutingState} from "reducers";
import {bindActionCreators} from "redux";
import {State} from "store";
import * as styles from "./style.css";

import HelpCategoryBox from "components/Help/HelpCategoryBox";
import ContactUs from "components/ContactUs";
import BreadcrumbList from "components/BreadcrumbList";
import {getBreadcrumbRoot} from "utils/builders/breadcrumbBuilder";
import {BreadcrumbListItem} from "models/Breadcrumb";
import {BreadcrumbItem, SideNavMenu} from "@bbyca/bbyca-components";
import {IBrowser} from "redux-responsive/types";
import TwoColumn from "pages/PageLayouts/TwoColumn";
import DynamicContent from "components/DynamicContent";
import {SingleColumn} from "pages/PageLayouts";
import TextBlock from "components/TextBlock";
import {HeadTags} from "components/HeadTags";
import SideNavigation from "pages/DynamicContentPage/components/SideNavigation";
import {WithRouterProps} from "react-router";
import messages from "./translations/messages";
import {SideNavigationNode, NavigationLink, Dispatch} from "models";
import SectionTitle, {TitleAppearance} from "components/SectionTitle";
import {classname} from "utils/classname";
import {getScreenSize} from "store/selectors";

interface StateProps extends HelpState {
    regionName: string;
    routing: RoutingState;
    language: Language;
    screenSize: IBrowser;
    env: string;
}

export interface OwnProps extends WithRouterProps {
    showNav?: boolean;
}

interface DispatchProps {
    helpActions: HelpTopicActions;
    routingActions: RoutingAction;
}
export class HelpPage extends React.Component<StateProps & DispatchProps & OwnProps & InjectedIntlProps> {
    public render() {
        const Template = this.getPageTemplate();
        return (
            <>
                <HeadTags title={this.getSeoTitle()} metaTags={this.getMetaTags()} />
                <Template.Container>
                    <Template.Header>
                        <BreadcrumbList className={styles.breadCrumbs} breadcrumbListItems={this.getBreadcrumbs()} />
                        <div className={styles.mobilePageHeader}>{this.getHeader()}</div>
                    </Template.Header>
                    {this.props.showNav && <TwoColumn.SideBar>{this.getSideNav()}</TwoColumn.SideBar>}
                    <Template.Main useLoader={true} loading={this.props.loading}>
                        <div className={"medium"}>{this.getHeader()}</div>
                        {this.props.content && this.getHelpPageContent()}
                    </Template.Main>
                </Template.Container>
            </>
        );
    }

    public async componentDidMount() {
        await this.props.helpActions.syncHelpStateWithLocation(this.props.routing.locationBeforeTransitions);
        this.props.helpActions.trackHelpPageLoad();
    }

    public async componentWillReceiveProps(nextProps: StateProps & DispatchProps & InjectedIntlProps) {
        const currentLocation = this.props.routing.locationBeforeTransitions;
        const nextLocation = nextProps.routing.locationBeforeTransitions;
        if (currentLocation.pathname !== nextLocation.pathname) {
            await this.props.helpActions.syncHelpStateWithLocation(nextLocation);
            this.props.helpActions.trackHelpPageLoad();
        }
    }

    private getSeoTitle = () => {
        const {content} = this.props;
        return (!!content && !!content.seo && content.seo.headerTitle) || "Help Centre";
    };

    private getMetaTags = () => {
        const {content} = this.props;
        const metaTags = [];
        if (content && content.seo && content.seo.description) {
            metaTags.push({name: "description", content: content.seo.description});
        }
        return metaTags;
    };

    private getPageTemplate = () => (this.props.showNav ? TwoColumn : SingleColumn);

    private getSideNav = () => {
        const sideNavigationNode = this.props.content && this.props.content.navigation;
        if (sideNavigationNode && this.props.showNav) {
            const Nav = ({isMobile}: {isMobile: boolean}) => (
                <SideNavigation
                    isMobile={isMobile}
                    isLoading={false}
                    backToText={this.props.intl.formatMessage(messages.backTo)}
                    tree={this.createNavigationLink(
                        sideNavigationNode,
                        this.props.language,
                        this.props.location.pathname,
                    )}
                />
            );
            return (
                <>
                    <div className={styles.mobileNav}>
                        <SideNavMenu
                            sideNavContent={() => <Nav isMobile={true} />}
                            title={this.props.content && this.props.content.header}
                            displayCloseIcon={true}
                            closeIconColor="white"
                        />
                    </div>
                    <div className={"medium"}>
                        <Nav isMobile={false} />
                    </div>
                </>
            );
        } else {
            return null;
        }
    };

    private getHeader = () => {
        return (
            this.props.content &&
            this.props.content.header &&
            (this.props.showNav ? (
                <SectionTitle
                    appearance={TitleAppearance.d1}
                    className={classname([styles.helpPageHeader, styles.twoCol])}>
                    <h1>{this.props.content.header}</h1>
                </SectionTitle>
            ) : (
                <SectionTitle appearance={TitleAppearance.h1} className={styles.helpPageHeader}>
                    <h1>{this.props.content.header}</h1>
                </SectionTitle>
            ))
        );
    };

    private getHelpPageContent = () => {
        return this.props.content ? (
            <div className={styles.helpPageContent}>
                {this.props.content.body && <TextBlock className={styles.helpBody} body={this.props.content.body} />}
                <DynamicContent
                    regionName={this.props.regionName}
                    sectionList={this.props.content.sections || []}
                    screenSize={this.props.screenSize}
                    language={this.props.language}
                    isLoading={false}
                />
                {this.props.content.categories && (
                    <HelpCategoryBox
                        helpCategories={this.props.content.categories}
                        isGreaterThanXS={this.props.screenSize.greaterThan.extraSmall}
                    />
                )}
                {this.props.content.topics && this.renderCategory()}
                {this.props.content.displayContactUs && <ContactUs className={styles.contactUs} />}
            </div>
        ) : null;
    };

    private getBreadcrumbs(): BreadcrumbListItem[] {
        const {content, intl} = this.props;

        if (content && content.breadcrumbs) {
            const breadcrumbs = content.breadcrumbs.map((breadcrumb) => {
                return {
                    ...breadcrumb,
                    linkParams: this.extractHelpLinkPath(breadcrumb.path),
                    seoText: breadcrumb.path && breadcrumb.path.toLowerCase() === "/help" ? "" : breadcrumb.seoText,
                    linkType: "help" as Key,
                } as BreadcrumbItem;
            });

            breadcrumbs.unshift(getBreadcrumbRoot(intl));

            return breadcrumbs;
        }

        return [];
    }

    private renderCategory = () => {
        return this.props.content ? (
            <TextBlock className={styles.helpPageContent}>
                <ul className={styles.helpCategoryList}>
                    {this.props.content.topics.map((topic, index) => {
                        const helpCategoriesProps = {
                            params: [topic.categoryId, topic.topicId],
                            to: "help" as Key,
                        };
                        return (
                            <li className={styles.helpCategoryListItem} key={index}>
                                <Link {...helpCategoriesProps}>
                                    <h3 className={styles.helpCategory}>{topic.seoText}</h3>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </TextBlock>
        ) : null;
    };

    private extractHelpLinkPath = (url: string = "") => {
        const [, , , categoryId, , topicId, , subTopicId] = url.split("/") || [];
        return [categoryId, topicId, subTopicId];
    };

    private createNavigationLink = (
        sideNavigationNode: SideNavigationNode,
        language: Language,
        currentPath?: string,
    ): NavigationLink => {
        const path = routeManager.getPathByKey(
            this.props.language,
            "help",
            ...this.extractHelpLinkPath(sideNavigationNode.path),
        );
        const handleClick = (url: string) => (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.props.router.push(url);
        };

        const result = {
            ...sideNavigationNode,
            isSelected: currentPath === path,
            onClick: handleClick(path),
            path,
            links: sideNavigationNode.children
                ? sideNavigationNode.children.map((item: SideNavigationNode) =>
                      this.createNavigationLink(item, language, currentPath),
                  )
                : [],
        };
        return result;
    };
}

function mapStateToProps(state: State): StateProps {
    return {
        ...state.help,
        language: state.intl.language,
        regionName: state.user.shippingLocation.regionName,
        routing: state.routing,
        screenSize: getScreenSize(state),
        env: state.app.environment.nodeEnv,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        helpActions: bindActionCreators(helpTopicAction, dispatch),
        routingActions: bindActionCreators(routingAction, dispatch),
    };
}

export default connect<StateProps, DispatchProps, OwnProps, State>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(HelpPage));
