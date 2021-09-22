import * as React from "react";
import { connect } from "react-redux";

import Header from "components/Header";
import InjectedContent from "components/InjectedContent";
import { convertLocaleToLang } from "models/Intl";
import { State } from "store";
import HeadTags from "components/HeadTags";
import PageContent from "components/PageContent";
import { parseQueryString } from "utils/queryString";
import Footer from "components/Footer";
import { injectedPageActionCreator } from "actions/injectedPageActions/index";

import isMarketingFormDomainWhitelist from "./marketingFormDomainWhitelistHandler";

interface InjectedPageProps {
    marketingFormDomainWhitelist: string[];
    url: string;
    location: Location;
    trackPageLoad: (url: string) => void;
}

export class InjectedPage extends React.Component<InjectedPageProps> {

    public componentDidMount() {
        this.props.trackPageLoad(this.props.url);
    }

    public render() {
        const { url, marketingFormDomainWhitelist, location } = this.props;
        const metaTags = [{ name: "robots", content: "noindex" }];
        const { formUrl, height, width } = parseQueryString(location.search);
        let injectedContentProps: { src: string, width?: string, height?: string };

        if (!!formUrl && isMarketingFormDomainWhitelist(formUrl, marketingFormDomainWhitelist)) {
            injectedContentProps = { src: formUrl.toString(), width, height };
        } else {
            injectedContentProps = { src: url };
        }

        return (<div>
            <HeadTags
                metaTags={metaTags} />
            <Header />
            <PageContent>
                <InjectedContent {...injectedContentProps} />
            </PageContent>
            <Footer />
        </div>);
    }
}

const mapStateToProps = (state: State) => ({
    url: state.config.dataSources[state.routing.pageKey] &&
        state.config.dataSources[state.routing.pageKey][convertLocaleToLang(state.intl.locale)],
    marketingFormDomainWhitelist: state.config.marketingFormDomainWhitelist,
});

const mapDispatchToProps = (dispatch) => ({
    trackPageLoad: injectedPageActionCreator.trackInjectedPageLoad(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(InjectedPage);
