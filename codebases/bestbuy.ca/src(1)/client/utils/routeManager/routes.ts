import {
    CreateSellerReviewPage,
    ProductSellersPage,
    BasketPage,
    ProductDetailPage,
    ProductReviewsPage,
    ProductReviewVerificationPage,
    ProductOffersPage,
    StoreLocatorPage,
    SellerProfilePage,
    SellerReviewsPage,
    CreateProductReviewPage,
    BenefitsPage,
    ManufacturerWarrantyPage,
    MobileActivationPage,
    MarketplaceSignUpPage,
    MarketplaceSellerSignUpPage,
    InHomeConsultationSignUpPage,
    GeekSquadMembershipPage,
    BusinessContactPage,
    HealthContactPage,
    AddonsPage,
} from "Decide";
import injectedRoutes from "utils/routeManager/injectedRoutes";
import App from "../../components/App";
import {Routes, Route} from "../../models";
import EmailUsPage from "pages/EmailUsPage";
import {HelpPage, HelpLandingPage} from "pages/HelpPage/containers";
import HomePage from "pages/HomePage";
import {routes as sharedRoutes} from "@bbyca/apex-components";
import DynamicContentPage from "pages/DynamicContentPage";
import FlyerPage from "pages/FlyerPage";
import SSCContainer from "pages/ProductListingPage/containers/SSCContainer";
import CategoryContainer from "pages/ProductListingPage/containers/CategoryContainer";
import BrandContainer from "pages/ProductListingPage/containers/BrandContainer";
import SearchContainer from "pages/ProductListingPage/containers/SearchContainer";
import BrandL2Container from "pages/ProductListingPage/containers/BrandL2Container";

const domain = "https://www.bestbuy.ca";
const routesConfig: Routes = [
    {
        component: App,
        key: "app",
        analyticVariable: "",
        redirectToKey: "homepage",
        subRoutes: [
            {
                component: HomePage,
                key: "homepageStandalone",
                analyticVariable: "Home Page",
            },
            {
                component: HomePage,
                key: "homepage",
                analyticVariable: "",
            },
            {
                component: SearchContainer,
                isServerSideRenderEnabled: false,
                key: "search",
                analyticVariable: "Search Results Page",
            },
            {
                component: ProductReviewsPage,
                key: "productReviews",
                analyticVariable: "",
            },
            {
                component: ProductReviewVerificationPage,
                key: "productReviewVerification",
                analyticVariable: "",
            },
            {
                component: CreateProductReviewPage,
                key: "createProductReview",
                analyticVariable: "",
            },
            {
                component: ProductOffersPage,
                key: "productOffers",
                analyticVariable: "",
            },
            {
                component: StoreLocatorPage,
                key: "productRpu",
                analyticVariable: "",
            },
            {
                component: SSCContainer,
                key: "collection",
                analyticVariable: "",
            },
            {
                component: BrandContainer,
                key: "brand",
                analyticVariable: "Brand Page",
                links: {
                    next: {
                        en: `${domain}/en-ca/brand/:brandName`,
                        fr: `${domain}/fr-ca/marque/:brandName`,
                    },
                    prev: {
                        en: `${domain}/en-ca/brand/:brandName`,
                        fr: `${domain}/fr-ca/marque/:brandName`,
                    },
                },
            },
            {
                component: BrandL2Container,
                key: "brandPage",
                analyticVariable: "Brand Page",
                links: {
                    next: {
                        en: `${domain}/en-ca/brand/:brandL1/:brandL2(/:brandL3)`,
                        fr: `${domain}/fr-ca/marque/:brandL1/:brandL2(/:brandL3)`,
                    },
                    prev: {
                        en: `${domain}/en-ca/brand/:brandL1/:brandL2(/:brandL3)`,
                        fr: `${domain}/fr-ca/marque/:brandL1/:brandL2(/:brandL3)`,
                    },
                },
            },
            {
                component: CategoryContainer,
                key: "category",
                analyticVariable: "PLP",
                links: {
                    next: {
                        en: `${domain}/en-ca/category/:seoName/:id`,
                        fr: `${domain}/fr-ca/categorie/:seoName/:id`,
                    },
                    prev: {
                        en: `${domain}/en-ca/category/:seoName/:id`,
                        fr: `${domain}/fr-ca/categorie/:seoName/:id`,
                    },
                },
            },
            {
                component: ProductDetailPage,
                key: "product",
                analyticVariable: "",
            },
            {
                component: ProductSellersPage,
                key: "productSellers",
                analyticVariable: "",
            },
            {
                component: HelpLandingPage,
                key: "helpLanding",
                analyticVariable: "",
            },
            {
                component: HelpPage,
                key: "help",
                analyticVariable: "",
                links: {
                    next: {
                        en: `${domain}/en-ca/help/:categoryId/:topicId/:subTopicId`,
                        fr: `${domain}/fr-ca/aide/:categoryId/:topicId/:subTopicId`,
                    },
                    prev: {
                        en: `${domain}/en-ca/help/:categoryId/:topicId/:subTopicId`,
                        fr: `${domain}/fr-ca/aide/:categoryId/:topicId/:subTopicId`,
                    },
                },
                // canonicalUrls for content page returned by wordpress API
            },
            {
                component: EmailUsPage,
                key: "emailUs",
            },
            {
                component: undefined, // undefined as this renders with the HelpPage Route
                key: "legal",
                analyticVariable: "",
            },
            {
                component: undefined, // undefined as this renders with the HelpPage Route
                key: "freeShippingPolicy",
                analyticVariable: "",
            },
            {
                component: undefined, // undefined as this renders with the HelpPage Route
                key: "returnPolicy",
                analyticVariable: "",
            },
            {
                component: CreateSellerReviewPage,
                key: "createSellerReview",
                analyticVariable: "",
            },
            {
                component: SellerProfilePage,
                key: "sellerProfile",
                analyticVariable: "",
            },
            {
                component: SellerReviewsPage,
                key: "sellerReviews",
                analyticVariable: "",
                links: {
                    next: {
                        en: `${domain}/en-ca/seller/:id/review`,
                        fr: `${domain}/fr-ca/vendeur/:id/avis`,
                    },
                    prev: {
                        en: `${domain}/en-ca/seller/:id/review`,
                        fr: `${domain}/fr-ca/vendeur/:id/avis`,
                    },
                },
            },
            {
                component: BasketPage,
                key: "basket",
                analyticVariable: "",
            },
            {
                component: BenefitsPage,
                key: "geekSquadProtection",
                analyticVariable: "",
            },
            {
                component: undefined, // undefined as this renders with the HelpPage Route
                key: "specialDelivery",
                analyticVariable: "",
            },
            {
                component: DynamicContentPage,
                key: "eventMarketing",
                analyticVariable: "Marketing Page",
            },
            {
                component: DynamicContentPage,
                key: "brandStore",
                analyticVariable: "Brand Store Page",
            },
            {
                component: DynamicContentPage,
                key: "services",
                analyticVariable: "Service Page",
            },
            {
                component: DynamicContentPage,
                key: "corporate",
                analyticVariable: "Corporate Page",
            },
            {
                component: DynamicContentPage,
                key: "careers",
                analyticVariable: "Careers Page",
            },
            {
                component: ManufacturerWarrantyPage,
                key: "manufacturerWarranty",
                analyticVariable: "",
            },
            {
                component: MobileActivationPage,
                key: "cellphonePlanInquiry",
            },
            {
                component: GeekSquadMembershipPage,
                key: "geekSquadBusinessMembership",
            },
            {
                component: InHomeConsultationSignUpPage,
                key: "inHomeConsultationSignUp",
            },
            {
                component: MarketplaceSellerSignUpPage,
                key: "marketplaceSignUp",
            },
            {
                component: HealthContactPage,
                key: "bbyHealth",
            },
            {
                component: BusinessContactPage,
                key: "bbyBusiness",
            },
            {
                component: AddonsPage,
                key: "requiredParts",
            },
            {
                component: FlyerPage,
                key: "flyer",
            },
            ...injectedRoutes,
        ],
    },
] as any;

const addPathsToRoute = (route: Route): Route => {
    route.paths = sharedRoutes[route.key];
    if (route.subRoutes) {
        route.subRoutes = route.subRoutes.map(addPathsToRoute);
    }
    return route;
};

export default routesConfig.map(addPathsToRoute);
