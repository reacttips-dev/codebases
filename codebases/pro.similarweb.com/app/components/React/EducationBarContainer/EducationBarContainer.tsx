import { ContactUsDefault } from "@similarweb/contact-us";
import { EducationBar } from "@similarweb/pro-education-bar/src/components/education-bar/src/EducationBar";
import { ArticleType } from "@similarweb/pro-education-bar/src/models/ArticleEntity";
import { Button } from "@similarweb/ui-components/dist/button";
import * as actions from "actions/educationBarActions";
import { swSettings } from "common/services/swSettings";
import getUserInfo from "components/React/ContactUs/getContactUsUserInfo";
import { ContactUsMode } from "components/React/ContactUs/modes";
import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { ChilipiperRouter } from "services/chiliPiper/chiliPiper";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { InjectableComponent } from "../InjectableComponent/InjectableComponent";
import { ArticlesService } from "./ArticlesService";

class EducationBarContainer extends InjectableComponent {
    private messages: any;
    private $rootScope: any;
    private swNavigator: any;
    private swNavigatorState: any;
    private navigationStateChangeListener;
    private track;
    private userInfo;

    constructor(props) {
        super(props);

        this.state = {
            educationBarContext: {
                articlesFilter: "",
            },
            isContactUnModalOpen: false,
        };

        this.i18n = this.injector.get("i18nFilter");
        this.$rootScope = this.injector.get("$rootScope");
        this.swNavigator = this.injector.get("swNavigator");
        this.swNavigatorState = this.swNavigator.current();
        this.userInfo = getUserInfo();

        this.navigationStateChangeListener = this.$rootScope.$on("$stateChangeSuccess", () => {
            this.props.toggleEducationBar(false);
        });
        this.track = (category, action, name) => {
            allTrackers.trackEvent(category, action, name);
        };

        this.messages = this.setMessage();

        this.sideBarToggleHandler = this.sideBarToggleHandler.bind(this);
        this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);
        this.supportLinkClickHandler = this.supportLinkClickHandler.bind(this);
        this.searchSubmitHandler = this.searchSubmitHandler.bind(this);
        this.articleTitleClickHandler = this.articleTitleClickHandler.bind(this);
        this.zendeskLinkOpenHandler = this.zendeskLinkOpenHandler.bind(this);
        this.backToDefaultClickHandler = this.backToDefaultClickHandler.bind(this);
        this.backToArticlesClickHandler = this.backToArticlesClickHandler.bind(this);
        this.articleAttachmentClick = this.articleAttachmentClick.bind(this);
        this.handleSupportButtonClick = this.handleSupportButtonClick.bind(this);
    }

    public componentWillUnmount(): void {
        if (this.navigationStateChangeListener) {
            this.navigationStateChangeListener();
        }
    }

    public render() {
        return (
            <EducationBar
                messages={this.messages}
                isSidebarOpen={this.props.isSidebarOpen}
                article={this.props.article}
                fetchArticles={ArticlesService.GetArticlesByFilter}
                fetchAttachments={ArticlesService.GetAttachments}
                onArticleViewed={ArticlesService.OnArticleViewed}
                educationBarContext={this.state.educationBarContext}
                onSidebarToggle={this.sideBarToggleHandler}
                onCloseButtonClick={this.closeButtonClickHandler}
                onSupportLinkClick={this.supportLinkClickHandler}
                onSearchSubmit={this.searchSubmitHandler}
                onArticleTitleClick={this.articleTitleClickHandler}
                onZendeskLinkOpen={this.zendeskLinkOpenHandler}
                onBackToDefaultClick={this.backToDefaultClickHandler}
                onBackToArticlesClick={this.backToArticlesClickHandler}
                onArticleAttachmentClick={this.articleAttachmentClick}
                renderContactUs={() => (
                    <>
                        <Button type="upsell" onClick={this.handleSupportButtonClick}>
                            {this.messages.contactButtonText}
                        </Button>
                        <ContactUsDefault
                            mode={ContactUsMode.PopUp}
                            isOpen={this.state.isContactUnModalOpen}
                            title={this.messages.contactButtonText}
                            subtitle=""
                            messagePlaceholder=""
                            hiddenFields={{
                                subject: "Support",
                                formLocationBreadcrumbs: `Education Bar/${this.messages.contactButtonText}`,
                            }}
                            apiUrl={swSettings.swsites.light}
                            submitUrl={`${swSettings.swsites.light}/api/forms/hook`}
                            userInfo={this.userInfo}
                            track={this.track}
                            trackingName="Education Bar"
                            onRequestClose={this.handleContactUsClose}
                            chilipiperRouter={ChilipiperRouter.CU_ROUTER_FRO_HOOKS}
                        />
                    </>
                )}
            />
        );
    }

    public getSearchTag(newState: any): string {
        const state = newState || this.swNavigator.current();

        if (!state.data) {
            const { pageId } = state;
            if (!pageId) {
                return undefined;
            }
            return _.filter([pageId.section, pageId.subSection, pageId.subSubSection])
                .join("_")
                .toUpperCase();
        }
        const searchTag: any = state.data.educationBarTag;
        switch (typeof searchTag) {
            case "string":
                return searchTag.toString();
            case "function":
                return searchTag(state);
        }
        return undefined;
    }

    public getArticlesTitle(newState: any): string {
        const state = newState || this.swNavigator.current();
        return this.i18n(state.pageTitle);
    }

    private handleContactUsClose = () => {
        this.setState({
            isContactUnModalOpen: false,
        });
    };

    private setArticlesAndTitle = () => {
        const tag = this.getSearchTag(this.swNavigator.current());
        this.messages.articlesListTitle = this.getArticlesTitle(this.swNavigator.current());

        this.setState({
            educationBarContext: {
                articlesFilter: tag,
            },
        });
    };

    private sideBarToggleHandler(isOpen: boolean): void {
        TrackWithGuidService.trackWithGuid(
            "solutions2.sidebar.menu.education_bar.toggle",
            "click",
            { mode: isOpen ? "open" : "close" },
        );
        if (isOpen) {
            this.setArticlesAndTitle();
        }
    }

    private setMessage(): object {
        return {
            articlesListTitle: this.i18n(this.swNavigatorState.pageTitle), // add default props like default messaging
            educationBarTitle: this.i18n("educationBar.educationBarTitle"),
            contactButtonText: this.i18n("educationBar.contactButtonText"),
            searchBarPlaceholder: this.i18n("educationBar.searchBarPlaceholder"),
            supportLinkText: this.i18n("educationBar.supportLinkText"),
            emptyStateText: this.i18n("educationBar.emptyStateText"),
            emptyStateDescription: this.i18n("educationBar.emptyStateDescription"),
        };
    }

    private getArticleType(articleType: number): string {
        return articleType === 1 ? "Document" : "Video";
    }

    private handleSupportButtonClick = () => {
        this.setState({
            isContactUnModalOpen: true,
        });
        TrackWithGuidService.trackWithGuid(
            "navigation.sidebar.education_bar.contact_support",
            "click",
        );
    };

    private closeButtonClickHandler(): void {
        this.track("side bar", "close", "education bar");
        this.props.toggleEducationBar(false);
    }

    private supportLinkClickHandler(): void {
        this.track("internal link", "click", "education bar/support");
    }

    private searchSubmitHandler(searchText: string): void {
        if (searchText) {
            this.track("Search Bar", "click", `education bar/${searchText}`);
        }
    }

    private articleTitleClickHandler(articleType: ArticleType, articleTitle: string): void {
        this.track(
            "side bar",
            "open",
            `education bar/${this.getArticleType(articleType)}/${articleTitle}`,
        );
    }

    private zendeskLinkOpenHandler(articleType: ArticleType, articleTitle: string): void {
        this.track(
            "internal link",
            "click",
            `education bar/${this.getArticleType(articleType)}/${articleTitle}`,
        );
    }

    private backToDefaultClickHandler(): void {
        this.track("side bar", "back", "education bar");
    }

    private backToArticlesClickHandler(articleType: ArticleType, articleTitle: string): void {
        this.track(
            "side bar",
            "back",
            `education bar/${this.getArticleType(articleType)}/${articleTitle}`,
        );
    }

    private articleAttachmentClick(articleTitle: string, attachmentName: string): void {
        this.track("Download", "submit-ok", `education bar/${articleTitle}/${attachmentName}`);
    }
}

function mapDispatchToProps(dispatch): object {
    return {
        toggleEducationBar: (isOpen) => {
            dispatch(actions.toggleEducationBar(isOpen));
        },
    };
}

function mapStateToProps(state): object {
    return {
        isSidebarOpen: state.educationBar.isOpen,
        article: state.educationBar.article,
    };
}

const component = connect(mapStateToProps, mapDispatchToProps)(EducationBarContainer);

SWReactRootComponent(component, "EducationBarContainer");

export default component;
