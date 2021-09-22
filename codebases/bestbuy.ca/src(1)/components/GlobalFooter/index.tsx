import * as React from "react";
import { IntlProvider } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { navigationActionCreatorsFactory, } from "../../actions";
import { convertLocaleToLang, templateExpressions, } from "../../models";
import en from "../../translations-merged/en.json";
import fr from "../../translations-merged/fr.json";
import { urlCleaner } from "../../utils";
import isMobileApp from "../../utils/isMobileApp";
import { LinkContext } from "../GlobalHeader/Link";
import setAnalyticVariable, { Evars, } from "../GlobalHeader/setAnalyticVariable";
import contentParser from "./utils/contentParser";
import NewsLetterSignUp from "./NewsLetterSignUp";
import PrimaryLinks from "./PrimaryLinks";
import SecondaryLinks from "./SecondaryLinks";
import * as styles from "./style.css";
import ValueProps from "./ValueProps";
const messages = { en, fr };
export const GlobalFooter = (props) => {
    const { footerMenuContent } = props;
    const primaryLinks = footerMenuContent && footerMenuContent["footer-primary"];
    const secondaryLinks = footerMenuContent && footerMenuContent["footer-secondary"];
    const valueProps = footerMenuContent && footerMenuContent["value-props"];
    React.useEffect(() => {
        if (!footerMenuContent) {
            props.navigationActions.retrieveGlobalMenuContent(props.locale);
        }
    }, []);
    const hideFooter = props.environment && isMobileApp(props.environment.appMode);
    const linkContextProps = {
        internalLinkHandler: props.internalLinkHandler,
        locale: props.locale,
    };
    const language = convertLocaleToLang(props.locale);
    const localizedMessages = language ? messages[language] : messages.en;
    const stringParser = contentParser({
        [templateExpressions.ordersWebAppUrl]: urlCleaner(props.config.ordersWebAppUrl),
        [templateExpressions.accountsWebAppUrl]: urlCleaner(props.config.accountDashboardUrl),
    });
    return (React.createElement(IntlProvider, { locale: props.locale, messages: localizedMessages, defaultLocale: "en-CA", textComponent: React.Fragment },
        React.createElement(LinkContext.Provider, { value: linkContextProps },
            React.createElement("footer", { className: `${styles.globalFooter} ${hideFooter ? styles.hidden : ""}` },
                valueProps && React.createElement(ValueProps, Object.assign({}, props, { links: valueProps.items })),
                React.createElement("div", { className: styles.middleFooterSection },
                    React.createElement("div", { className: styles.footerContentContainer },
                        primaryLinks && (React.createElement(PrimaryLinks, Object.assign({}, props, { contentParser: stringParser.parse, links: primaryLinks.items }))),
                        React.createElement("div", { className: styles.footerRightContent },
                            React.createElement(NewsLetterSignUp, { newsLetterApiUrl: props.newsLetterApiUrl, locale: props.locale, localizedMessages: localizedMessages })))),
                secondaryLinks && (React.createElement(SecondaryLinks, { client: props.client, env: props.env, links: secondaryLinks.items, track: props.track }))))));
};
const mapStateToProps = (state) => ({
    environment: state.app && state.app.environment,
    screenSize: state.screenSize || state.app.screenSize,
    footerMenuContent: state.navigation.globalMenuContent,
});
const mapDispatchToProps = (dispatch, ownProps) => {
    const navigationActionCreators = navigationActionCreatorsFactory({
        logger: ownProps.logger,
        config: ownProps.config,
    });
    return {
        navigationActions: bindActionCreators(navigationActionCreators, dispatch),
        track: (label, client) => {
            const breadcrumb = ("footer;" + label).toLowerCase();
            if (client !== "ecomm-webapp") {
                setAnalyticVariable(Evars.eVar34, breadcrumb);
            }
            else {
                dispatch(navigationActionCreators.trackMenu(breadcrumb));
            }
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(GlobalFooter);
//# sourceMappingURL=index.js.map