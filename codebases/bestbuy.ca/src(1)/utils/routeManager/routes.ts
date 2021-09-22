import { HelpTopicIdEnvLookup } from "../helpTopics";
const helpTopicsId = HelpTopicIdEnvLookup.production;
export const routes = {
    app: {
        en: "/",
        fr: "/",
    },
    homepageStandalone: {
        en: "/en-ca/home",
        fr: "/fr-ca/accueil",
    },
    // tslint:disable-next-line:object-literal-sort-keys
    homepage: {
        en: "/en-ca",
        fr: "/fr-ca",
    },
    search: {
        en: "/en-ca/search",
        fr: "/fr-ca/chercher",
    },
    productReviews: {
        en: "/en-ca/product(/:seoName)/:sku/review",
        fr: "/fr-ca/produit(/:seoName)/:sku/avis",
    },
    createProductReview: {
        en: "/en-ca/create-review/:sku/",
        fr: "/fr-ca/ecrire-evaluation/:sku/",
    },
    productReviewVerification: {
        en: "/en-ca/product-review-verification",
        fr: "/fr-ca/produit-avis-verification",
    },
    productOffers: {
        en: "/en-ca/product(/:seoName)/:sku/offer",
        fr: "/fr-ca/produit(/:seoName)/:sku/offre",
    },
    collection: {
        en: "/en-ca/collection/:seoName/:id",
        fr: "/fr-ca/collection/:seoName/:id",
    },
    brand: {
        en: "/en-ca/brand/:brand",
        fr: "/fr-ca/marque/:brand",
    },
    brandPage: {
        en: "/en-ca/brand/:brandL1/:brandL2(/:brandL3)",
        fr: "/fr-ca/marque/:brandL1/:brandL2(/:brandL3)",
    },
    category: {
        en: "/en-ca/category(/:seoName)/:id",
        fr: "/fr-ca/categorie(/:seoName)/:id",
    },
    product: {
        en: "/en-ca/product(/:seoName)/:sku",
        fr: "/fr-ca/produit(/:seoName)/:sku",
    },
    productSellers: {
        en: "/en-ca/product-sellers/:sku",
        fr: "/fr-ca/vendeurs-de-produit/:sku",
    },
    productRpu: {
        en: "/en-ca/reserve-and-pickup/:sku",
        fr: "/fr-ca/reservez-et-ramassez/:sku",
    },
    helpLanding: {
        en: "/en-ca/help",
        fr: "/fr-ca/aide",
    },
    help: {
        en: "/en-ca/help/(:categoryId)(/:topicId)(/:subTopicId)",
        fr: "/fr-ca/aide/(:categoryId)(/:topicId)(/:subTopicId)",
    },
    emailUs: {
        en: "/en-ca/email-us",
        fr: "/fr-ca/envoyez-courriel",
    },
    legal: {
        en: `/en-ca/help/${helpTopicsId.legal}`,
        fr: `/fr-ca/aide/${helpTopicsId.legal}`,
    },
    freeShippingPolicy: {
        en: ["/en-ca/help", ...helpTopicsId.freeShippingPolicy].join("/"),
        fr: ["/fr-ca/aide", ...helpTopicsId.freeShippingPolicy].join("/"),
    },
    returnPolicy: {
        en: ["/en-ca/help", ...helpTopicsId.returnPolicy].join("/"),
        fr: ["/fr-ca/aide", ...helpTopicsId.returnPolicy].join("/"),
    },
    createSellerReview: {
        en: "/en-ca/sellerReview/*",
        fr: "/fr-ca/sellerReview/*",
    },
    sellerReviews: {
        en: "/en-ca/seller(/:id)/review",
        fr: "/fr-ca/vendeur(/:id)/avis",
    },
    sellerProfile: {
        en: "/en-ca/seller(/:id)",
        fr: "/fr-ca/vendeur(/:id)",
    },
    basket: {
        en: "/en-ca/basket",
        fr: "/fr-ca/panier",
    },
    specialDelivery: {
        en: ["/en-ca/help", ...helpTopicsId.specialDelivery].join("/"),
        fr: ["/fr-ca/aide", ...helpTopicsId.specialDelivery].join("/"),
    },
    eventMarketing: {
        en: "/en-ca/event/:name/:id",
        fr: "/fr-ca/evenement/:name/:id",
    },
    tradeInProgramme: {
        en: "/en-ca/event/trade-in-program/:id",
        fr: "/fr-ca/evenement/programme-echange/:id",
    },
    brandStore: {
        en: "/en-ca/brand-hub/:name/:id",
        fr: "/fr-ca/marques/:name/:id",
    },
    services: {
        en: "/en-ca/services/:name/:id",
        fr: "/fr-ca/services/:name/:id",
    },
    corporate: {
        en: "/en-ca/about/:name/:id",
        fr: "/fr-ca/a-propos/:name/:id",
    },
    corporateInformation: {
        en: "/en-ca/about/about-us/:id",
        fr: "/fr-ca/a-propos/a-propos-de-nous/:id",
    },
    sellOnMarketPlace: {
        en: "/en-ca/about/selling-on-marketplace/:id",
        fr: "/fr-ca/a-propos/vendre-sur-le-marche/:id",
    },
    whatIsMarketPlace: {
        en: "/en-ca/about/what-is-marketplace/:id",
        fr: "/fr-ca/a-propos/qu-est-ce-que-la-place-de-marche/:id",
    },
    bbyFinancing: {
        en: "/en-ca/about/best-buy-financing/:id",
        fr: "/fr-ca/a-propos/financement-best-buy/:id",
    },
    bbyGiftCard: {
        en: "/en-ca/about/gift-cards/:id",
        fr: "/fr-ca/a-propos/cartes-cadeaux/:id",
    },
    bbyForBusiness: {
        en: "/en-ca/about/best-buy-business/:id",
        fr: "/fr-ca/a-propos/best-buy-affaires/:id",
    },
    notFound: {
        en: "/en-ca/404",
        fr: "/fr-ca/404",
    },
    careers: {
        en: "/en-ca/careers/(:name/)(:id/)",
        fr: "/fr-ca/carrieres/(:name/)(:id/)",
    },
    requiredParts: {
        en: "/en-ca/required-parts/:sku",
        fr: "/fr-ca/pieces-requises/:sku",
    },
    returnsAndExchanges: {
        en: "/en-ca/help/returns-and-exchanges",
        fr: "/fr-ca/help/returns-and-exchanges",
    },
    geekSquadProtection: {
        en: "/en-ca/geek-squad-protection/:sku",
        fr: "/fr-ca/protection-geek-squad/:sku",
    },
    geekSquadServices: {
        en: "/en-ca/services/geek-squad-services/:sku",
        fr: "/fr-ca/services/services-geek-squad/:sku",
    },
    geekSquadBusinessMembership: {
        en: "/en-ca/services/geek-squad-business-membership-form",
        fr: "/fr-ca/services/formulaire-pour-geek-squad-affaires",
    },
    cellphonePlanInquiry: {
        en: "/en-ca/get-phone-plan-started(/:seoName)(/:sku)",
        fr: "/fr-ca/commencez-votre-forfait-telephonique(/:seoName)(/:sku)",
    },
    inHomeConsultationSignUp: {
        en: "/en-ca/services/in-home-consultation-application-form",
        fr: "/fr-ca/services/formulaire-demande-consultation-a-domicile",
    },
    productMarketingForm: {
        en: "/en-ca/marketing/form",
        fr: "/fr-ca/marketing/formulaire",
    },
    marketplaceSignUp: {
        en: "/en-ca/about/marketplace-seller-application-form",
        fr: "/fr-ca/apropos/formulaire-demande-place-de-marche",
    },
    manufacturerWarranty: {
        en: "/en-ca/manufacturers-warranty/:sku",
        fr: "/fr-ca/garantie-du-fabricant/:sku",
    },
    emailPreferences: {
        en: "/account/en-ca/email-preferences",
        fr: "/account/fr-ca/preferences-courriel",
    },
    /**
     * todo: Flyer is now depreciated and can be removed
     * once all we know all internal links to the flyer
     * have been removed
     *  */
    flyer: {
        en: "/en-ca/collection/shop-all-deals/16074",
        fr: "/fr-ca/collection/magasinez-toutes-les-offres/16074",
    },
    questionsAndAnswers: {
        en: "/en-ca/common-questions/:sku",
        fr: "/fr-ca/questions-frequentes/:sku",
    },
    latestAndGreatest: {
        en: "/en-ca/event/new-tech-products/blteaf4620e33f91220",
        fr: "/fr-ca/evenement/nouveaux-produits-techno/blteaf4620e33f91220",
    },
    bbyHealth: {
        en: "/en-ca/services/best-buy-health-contact-form",
        fr: "/fr-ca/services/services-de-sante-best-buy-formulaire-de-contact",
    },
    bbyBusiness: {
        en: "/en-ca/services/best-buy-business-contact-form",
        fr: "/fr-ca/services/services-de-affaires-best-buy-formulaire-de-contact",
    },
};
export default routes;
//# sourceMappingURL=routes.js.map