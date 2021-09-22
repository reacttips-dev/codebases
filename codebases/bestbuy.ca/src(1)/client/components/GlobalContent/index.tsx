import * as React from "react";
import MessageBox, {IconType} from "components/MessageBox";
import {InjectedIntlProps, injectIntl} from "react-intl";
import messages from "./translations/messages";
import {State} from "store";
import {
    GlobalCMSContexts,
    ContextItemTypes,
    FlexMessageDisplayOption,
    AppMode,
    GlobalContentState,
    SectionData,
    GlobalCMSContextItem,
} from "models";
import {connect} from "react-redux";
import {SystemWideAlert} from "@bbyca/bbyca-components";
import PencilBanner from "components/PencilBanner";
import {Key} from "@bbyca/apex-components";
import DynamicContent from "components/DynamicContent";
import {IBrowser as ScreenSize} from "redux-responsive";
import {isMobileApp} from "../../utils/isMobileApp";
import {getScreenSize} from "store/selectors";

export interface StateProps {
    globalContent: GlobalContentState;
    appMode: AppMode;
    language: Language;
    regionName: string;
    screenSize: ScreenSize;
}
export interface OwnProps {
    context: GlobalCMSContexts;
    className?: string;
    contentType: ContextItemTypes;
    before?: () => React.ReactElement;
}

interface OwnState {
    show: boolean;
}

export class GlobalContent extends React.Component<OwnProps & StateProps & InjectedIntlProps, OwnState> {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
        };
    }

    public render() {
        const {globalContent, context, language, contentType, screenSize, regionName} = this.props;

        if (!globalContent.isFinished || !context || !contentType) {
            return null;
        }

        const content = globalContent.content;
        const contextItems = content && content[context] ? content[context].items : null;
        const contextItem =
            contextItems &&
            (contextItems as GlobalCMSContextItem[]).find(
                (item) => item.type === contentType || item.type === ContextItemTypes.customContentList,
            );
        const hasBrowseOnlyMessage = content && content.hasOwnProperty(GlobalCMSContexts.browseMode);
        const hasRpuDisabledMessage = content && content.hasOwnProperty(GlobalCMSContexts.rpuDisabled);
        const isApplicableContext =
            context === GlobalCMSContexts.searchBottom ||
            context === GlobalCMSContexts.pdpFooter ||
            context === GlobalCMSContexts.collectionBottom ||
            context === GlobalCMSContexts.collectionFooter ||
            context === GlobalCMSContexts.categoryBottom ||
            context === GlobalCMSContexts.categoryFooter;
        const hasApplicableContextData = globalContent.content && globalContent.content[context];

        if (!hasBrowseOnlyMessage && context === GlobalCMSContexts.browseMode) {
            return this.getDefaultMessages(context);
        }

        if (!hasRpuDisabledMessage && context === GlobalCMSContexts.rpuDisabled) {
            return this.getDefaultMessages(context);
        }

        if (contextItem && Object.keys(contextItem).length !== 0) {
            if (contextItem.type === ContextItemTypes.flexMessage) {
                switch (contextItem.displayOptions && contextItem.displayOptions.displayAs) {
                    case FlexMessageDisplayOption.info:
                        return (
                            <MessageBox
                                className={this.props.className}
                                messageIcon={IconType.Feedback}
                                messageTitle={contextItem.messageTitle}
                                messageDetails={contextItem.messageBody}
                            />
                        );
                    case FlexMessageDisplayOption.alert:
                        return (
                            <SystemWideAlert
                                className={this.props.className}
                                messageTitle={contextItem.messageTitle}
                                messageDetails={contextItem.messageBody}
                            />
                        );
                    default:
                        return null;
                }
            }

            if (contextItem.type === ContextItemTypes.pencilBanner) {
                return (
                    <PencilBanner
                        messageTitle={contextItem.headline}
                        messageDetails={contextItem.subHeadline}
                        images={contextItem.image}
                        cta={contextItem.event}
                        className={this.props.className}
                        theme={contextItem.displayOptions && contextItem.displayOptions.theme}
                        backgroundColour={contextItem.displayOptions && contextItem.displayOptions.backgroundColour}
                        language={language}
                        isMobileApp={isMobileApp(this.props.appMode)}
                    />
                );
            }
            if (
                (contextItem.type === ContextItemTypes.customContentList ||
                    contextItem.type === ContextItemTypes.customContent) &&
                isApplicableContext &&
                hasApplicableContextData
            ) {
                const section = globalContent.content[context] as SectionData;
                return (
                    <div style={{display: this.state.show ? "block" : "none"}}>
                        {!!this.props.before && this.props.before()}
                        <DynamicContent
                            isLoading={false}
                            sectionList={[section]}
                            screenSize={screenSize}
                            regionName={regionName}
                            hasNavigation={false}
                            language={language}
                            onAnyChildRendered={this.toggleDisplay.bind(this)}
                        />
                    </div>
                );
            }
        }
        return null;
    }

    private toggleDisplay(show: boolean) {
        if (show !== this.state.show) {
            this.setState({show});
        }
    }

    private getDefaultMessages(context: GlobalCMSContexts) {
        const {intl} = this.props;
        let messageTitle = "";
        let messageBody = "";

        if (context === GlobalCMSContexts.browseMode) {
            messageTitle = intl.formatMessage(messages.browseOnly);
            messageBody = intl.formatMessage(messages.browseOnlyInfo);
        } else if (context === GlobalCMSContexts.rpuDisabled) {
            messageTitle = intl.formatMessage(messages.rpuDisabled);
            messageBody = intl.formatMessage(messages.rpuDisabledInfo);
        } else {
            return null;
        }

        return (
            <MessageBox
                className={this.props.className}
                messageIcon={IconType.Feedback}
                messageTitle={messageTitle}
                messageDetails={messageBody}
            />
        );
    }
}

export const getPencilBannerContext = (pageKey: Key, globalContent: GlobalContentState) => {
    const homepageKey = ["homepage"];
    const plpKeys = ["search", "brand", "category", "collection"];
    const pdpKeys = [
        "product",
        "productSellers",
        "productReviews",
        "productReviewVerification",
        "createProductReview",
        "createSellerReview",
        "sellerProfile",
        "sellerReviews",
        "productOffers",
    ];
    const otherPageKeys = [
        "help",
        "eventMarketing",
        "legal",
        "brandStore",
        "services",
        "corporate",
        "careers",
        "flyer",
        "basket",
        "requiredParts",
    ];

    const hasSitewideBanner =
        globalContent.content &&
        globalContent.content.sitewide &&
        globalContent.content.sitewide.items &&
        globalContent.content.sitewide.items.find((item) => item.type === ContextItemTypes.pencilBanner);

    if (hasSitewideBanner) {
        return GlobalCMSContexts.sitewide;
    }

    if (pdpKeys.indexOf(pageKey) !== -1) {
        return GlobalCMSContexts.pdp;
    } else if (plpKeys.indexOf(pageKey) !== -1) {
        return GlobalCMSContexts.plp;
    } else if (homepageKey.indexOf(pageKey) !== -1) {
        return GlobalCMSContexts.homepage;
    } else if (otherPageKeys.indexOf(pageKey) !== -1) {
        return GlobalCMSContexts.everythingElse;
    } else {
        return null;
    }
};

const mapStateToProps = (state: State) => {
    return {
        globalContent: state.app.globalContent,
        language: state.intl.language,
        regionName: state.user.regionName,
        appMode: state.app.environment && state.app.environment.appMode,
        screenSize: getScreenSize(state)
    };
};

export default connect<StateProps, null, OwnProps>(mapStateToProps)(injectIntl(GlobalContent));
