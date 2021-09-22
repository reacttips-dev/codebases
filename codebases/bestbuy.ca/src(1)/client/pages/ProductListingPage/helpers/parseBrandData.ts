import routeManager from "utils/routeManager";
import createNavigationLink from "./navigationContentParser";
import getBreadcrumbs from "./breadcrumbListParser";
import {isObject} from "utils/typeGuards";
import {ProductListingPageProps} from "..";
import {BuildProps} from "../containers/BrandL2Container";
import {getBreadcrumbRoot} from "utils/builders";
import {Seo} from "models";

const handleMenuClick = (buildProps: BuildProps) => (url: string) => buildProps.router.push(url);

const parseBrandData = (data: unknown, buildProps: BuildProps): ProductListingPageProps | null => {
    if (!isObject(data)) {
        return null;
    }

    const {body, breadcrumbs, header, navigation, seo} = data;
    const breadcrumbList = breadcrumbs && getBreadcrumbs(breadcrumbs, buildProps.intl, "brandPage");
    breadcrumbList?.unshift(getBreadcrumbRoot(buildProps.intl));
    const dynamicContent = data.sections;
    const canonicalUrl = `${routeManager.getDomain()}${seo?.canonicalUrl}`;
    const navigationData = createNavigationLink(
        navigation,
        buildProps.language,
        buildProps.location,
        handleMenuClick(buildProps),
    );

    const metaRobots = [];
    if (!!seo?.noIndex) {
        metaRobots.push("noindex");
    }
    if (!!seo?.noImageIndex) {
        metaRobots.push("noimageindex");
    }

    return {
        ...(header && {title: header}),
        ...(breadcrumbList && {breadcrumbList}),
        ...(navigationData && {navigationData}),
        ...(navigationData && {mobileNavigationData: navigationData}),
        ...(dynamicContent && {dynamicContent}),
        ...(body && {body: data.body}),
        ...((seo as Seo) && {
            seoContent: {
                title: seo.overviewTitle,
                headerTitle: seo.headerTitle,
                content: seo.overview,
                metaDescription: seo.metaDescription,
                metaRobots: metaRobots.length ? metaRobots.join(",") : null,
                canonicalUrl,
            },
        }),
        router: buildProps.router,
    };
};

export default parseBrandData;
