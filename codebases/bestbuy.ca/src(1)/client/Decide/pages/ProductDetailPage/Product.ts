import {
    AvailabilityReduxStore,
    BreadcrumbListItem,
    CustomerReview,
    DetailedProduct,
    ProductImageSizeMap,
    ProductImagesMap,
} from "models";
import {SellerOffer} from "reducers";
import {getAvailabilitySchema, getPriceValidUntil, getUrl} from "utils/productDetail";
import {ProductDetailPageProps} from "./ProductDetailPage";

export const createProductJsonld = (
    {product, customerReviews, availability, locale}: ProductDetailPageProps,
    hasEhf: boolean,
    sellerOffers: SellerOffer[],
) => {
    const productJsonld = {
        "@context": "http://schema.org/",
        "@type": "Product",
        brand: {
            "@type": "Brand",
            name: product.brandName,
        },
        gtin12: product.upcs,
        name: product.name,
        model: product.modelNumber,
        sku: product.sku,
        aggregateRating: getAggregateRating(product),
        image: getImageUrls(product),
        description: product.shortDescription,
        url: getSellerUrl(product, locale),
        offers:
            sellerOffers.length > 1
                ? getMultiProductOffer(sellerOffers)
                : getProductOffer(product, hasEhf, availability),
        review: getReviews(customerReviews.customerReviews),
    };
    return productJsonld;
};

const getProductOffer = (product: DetailedProduct, hasEhf: boolean, availability: AvailabilityReduxStore) => ({
    "@type": "Offer",
    priceCurrency: "CAD",
    price: getPrice(product.priceWithEhf, product.priceWithoutEhf, hasEhf),
    priceValidUntil: getPriceValidUntil(product.saleEndDate),
    url: getUrl(),
    availability: getAvailabilitySchema(availability && availability.shipping && availability.shipping.status),
});

const getOfferPrices = (offers: SellerOffer[]) =>
    offers.map((offer: SellerOffer) => {
        const pricing = offer?.offer?.pricing;
        return getPrice(pricing?.priceWithEhf, pricing?.priceWithoutEhf, !!pricing?.ehf);
    });

const getMultiProductOffer = (offers: SellerOffer[]) => {
    const sellerPrices = getOfferPrices(offers);
    const lowPrice = Math.min.apply(null, sellerPrices);
    const highPrice = Math.max.apply(null, sellerPrices);
    return {
        "@type": "AggregateOffer",
        priceCurrency: "CAD",
        offerCount: offers.length,
        lowPrice,
        highPrice,
        itemCondition: "https://schema.org/NewCondition",
    };
};

export const createBreadcrumbJsonld = (breadcrumbList: BreadcrumbListItem[], locale: Locale) => {
    const breadcrumbJsonld = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: getListElements(breadcrumbList, locale),
    };
    return breadcrumbJsonld;
};

const getImageUrls = (product: DetailedProduct): string[] => {
    const preparedImages: ProductImagesMap = (product.media && product.media.images) || {};
    const imageUrls: string[] = [];
    Object.keys(preparedImages)
        .slice(0, 1)
        .forEach((index) => {
            const image: ProductImageSizeMap = preparedImages[index];
            Object.keys(image)
                .slice(0, 1)
                .forEach((imageIndex) => {
                    imageUrls.push(image[imageIndex].url);
                });
        });
    return imageUrls;
};

const getAggregateRating = (product: DetailedProduct) => {
    if (product.customerRating && product.customerRatingCount) {
        return {
            "@type": "AggregateRating",
            ratingValue: product.customerRating,
            reviewCount: product.customerRatingCount,
        };
    }
    return null;
};

const getReviews = (reviews: CustomerReview[]): any[] => {
    const customerReviews: any[] = [];
    reviews.slice(0, 3).forEach((review: CustomerReview) => {
        customerReviews.push({
            "@type": "Review",
            reviewRating: {
                "@type": "Rating",
                ratingValue: review.rating,
            },
            author: {
                "@type": "Person",
                name: review.reviewerName,
            },
            reviewBody: review.comment,
        });
    });
    return customerReviews;
};

const getPrice = (priceWithEhf: number, priceWithoutEhf: number, hasEhf: boolean) => {
    const price = hasEhf ? priceWithEhf : priceWithoutEhf;
    return (typeof price === "number" && Number(price.toFixed(2))) || 0;
};

const getListElements = (breadcrumbList: BreadcrumbListItem[], locale: Locale): any[] => {
    const list: any[] = [];
    breadcrumbList.forEach((item: BreadcrumbListItem, index) => {
        list.push([
            {
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "WebPage",
                    "@id": getItemUrl(item, locale),
                    name: item.label,
                },
            },
        ]);
    });
    return list;
};

const getItemUrl = (item: BreadcrumbListItem, locale: Locale) => {
    if (item.linkType === "homepage") {
        return `/${locale}`;
    } else if (item.linkTypeId) {
        return `${locale}/${item.linkType}/${item.seoText}/${item.linkTypeId}`;
    }
    return null;
};

export const getSellerUrl = (product: DetailedProduct, locale: Locale) => {
    if (product.seller && product.seller.id) {
        return `${locale}/seller/${product.seller.id}`;
    }
    return null;
};
