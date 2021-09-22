import * as React from "react";
import {connect} from "react-redux";
import {InjectedRouter} from "react-router";
import {State} from "store";
import {SingleColumn, TwoColumn} from "pages/PageLayouts";
import HeadTags, {Meta, Link} from "components/HeadTags";
import {OwnProps as GlobalContentProps} from "components/GlobalContent";
import {AdItem} from "components/Advertisement";
import {AdTargetingProps} from "components/Advertisement/GooglePublisherTag";
import BreadcrumbList, {BreadcrumbProps} from "components/BreadcrumbList";
import DynamicContent from "components/DynamicContent";
import SectionTitle, {TitleAppearance} from "components/SectionTitle";
import {TextBlock} from "components/TextBlock";
import Navigation from "./components/Navigation";
import SEOBlock from "./components/SEOBlock";
import {replaceAllSpacesBy} from "utils/stringUtils";
import {IBrowser} from "redux-responsive/types";
import {BreadcrumbListItem, NavigationLink, SectionData} from "models";
import * as styles from "./styles.css";
import {getScreenSize} from "store/selectors";

/**
 * note: this interface - ProductListingPageProps is derived from the existing
 * logic buried inside of <CategoryPage /> and <SearchPage />. It should be refactored,
 * but for now, this should be the starting point for our Page component so we can
 * easily extract out the necassary components (listings, load more, facets, pills)
 * from both PLP types
 */

export interface ProductListingPageProps extends ContentProps {
    breadcrumbs?: BreadcrumbProps;
    dynamicUrlParams?: string[];
    breadcrumbList?: BreadcrumbListItem[];
    router?: InjectedRouter;
    desktopTitleOnly?: boolean;
    ads?: {
        adItems?: AdItem[];
        adTargeting: AdTargetingProps;
    };
    pageBottomGlobalContent?: GlobalContentProps;
    pageFooterGlobalContent?: GlobalContentProps;
    isLoading?: boolean;
}

interface ContentProps {
    body?: string;
    title?: string;
    breadcrumbData?: BreadcrumbListItem[];
    dynamicContent?: SectionData[];
    navigationData?: NavigationLink;
    mobileNavigationData?: NavigationLink;
    seoContent?: {
        content?: string;
        canonicalUrl?: string;
        headerTitle?: string;
        title?: string;
        metaDescription?: string;
        metaRobots?: string;
    };
}

interface StateProps {
    regionName: string;
    language: Language;
    screenSize: IBrowser;
    env: string;
}

const Body: React.FC<ProductListingPageProps> = ({body}) =>
    body ? <TextBlock className={styles.bodyContent} body={body} /> : null;

const BreadCrumbs: React.FC<ProductListingPageProps> = ({breadcrumbList}) =>
    breadcrumbList ? <BreadcrumbList className={styles.breadCrumbs} breadcrumbListItems={breadcrumbList} /> : null;

const MerchContent: React.FC<ProductListingPageProps & StateProps> = (props) =>
    props.dynamicContent ? <DynamicContent {...props} sectionList={props.dynamicContent} /> : null;

const MetaTags: React.FC<ProductListingPageProps> = ({seoContent}) => {
    const metaTags = [] as Meta[];
    const metaLinks = [] as Link[];

    if (seoContent?.metaRobots) {
        metaTags.push({
            name: "robots",
            content: seoContent.metaRobots,
        });
    }

    if (seoContent?.metaDescription) {
        metaTags.push({
            name: "description",
            content: seoContent.metaDescription,
        });
    }

    if (seoContent?.canonicalUrl) {
        metaLinks.push({
            rel: "canonical",
            href: seoContent?.canonicalUrl || "",
        });
    }

    return seoContent ? <HeadTags title={seoContent?.headerTitle} links={metaLinks} metaTags={metaTags} /> : null;
};

const Title: React.FC<ProductListingPageProps & {className: string}> = ({title, className}) =>
    title ? (
        <SectionTitle
            className={className}
            appearance={TitleAppearance.h1}
            extraAttrs={{"data-automation": `section-title-${replaceAllSpacesBy(title.toLowerCase(), "-")}`}}>
            <h1>{title}</h1>
        </SectionTitle>
    ) : null;

const NavigationMenu: React.FC<ProductListingPageProps> = ({navigationData, mobileNavigationData, title, isLoading}) =>
    navigationData ? (
        <TwoColumn.SideBar loading={isLoading}>
            <Navigation
                className={styles.sideNav}
                navigationData={navigationData}
                mobileNavigationData={mobileNavigationData}
                title={title}
            />
        </TwoColumn.SideBar>
    ) : null;

export const ProductListingPage: React.FC<ProductListingPageProps & StateProps> = (props) => {
    const Template = props.navigationData ? TwoColumn : SingleColumn;

    return (
        <Template.Container>
            <Template.Header>
                <MetaTags {...props} />
                <BreadCrumbs {...props} />
                <Title {...props} className={styles.mobileTitle} />
            </Template.Header>
            <NavigationMenu {...props} />
            <Template.Main loading={props?.isLoading}>
                <Title {...props} className={styles.desktopTitle} />
                <Body {...props} />
                <MerchContent {...props} />
            </Template.Main>
            <Template.Footer>
                <SEOBlock {...props?.seoContent} />
            </Template.Footer>
        </Template.Container>
    );
};

function mapStateToProps(state: State): StateProps {
    return {
        language: state.intl.language,
        regionName: state.user.shippingLocation.regionName,
        screenSize: getScreenSize(state),
        env: state.app.environment.nodeEnv,
    };
}

ProductListingPage.displayName = "ProductListingPage";

export default connect<StateProps, {}, ProductListingPageProps, State>(mapStateToProps)(ProductListingPage);
