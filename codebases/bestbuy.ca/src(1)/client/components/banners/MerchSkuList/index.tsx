import ProductItem, {thumbnailImageSizes} from "components/ProductListing/ProductItem";
import * as React from "react";
import {IBrowser as ScreenSize, IBrowser} from "redux-responsive";
import {MerchSkuListType, MerchSkuListDisplayTypes, SimpleProduct} from "../../../models";
import * as styles from "./styles.css";
import {SlideShow} from "../../SlideShow";
import {ChevronLeft, ChevronRight} from "@bbyca/bbyca-components";
import {EventTypes} from "@bbyca/apex-components/dist/models";
import {classname} from "utils/classname";

enum RowItems {
    lessThanSmall = 2,
    small = 4,
    greaterThanSmall = 5,
}

export interface MerchSkuListProps extends MerchSkuListType {
    screenSize: ScreenSize;
    isMobileApp?: boolean;
    language: Language;
    noCrawl?: boolean;
    alignLeft?: boolean;
    noConversion?: boolean;
    shouldRenderAnchorLinkOnProductItems?: boolean;
    onProductItemScrollIntoView?: (sku: string) => void;
    displayAs?: MerchSkuListDisplayTypes;
    disableSeoAttributes?: boolean;
}

const getSkuList = (props: MerchSkuListProps): JSX.Element[] => {
    return (props.skuList || []).map((sku, index) => {
        const event = props.event
            ? {...props.event, language: props.language}
            : {
                  eventType: EventTypes.product,
                  seoText: sku.seoText,
                  eventId: sku.sku,
                  language: props.language,
              };
        const product = props.noConversion ? sku : new SimpleProduct(sku);
        return (
            product.sku && (
                <li className={styles.productItemContainer} key={sku.sku + index}>
                    <ProductItem
                        className={styles.skuListItem}
                        position={index.toString()}
                        product={product}
                        screenSize={props.screenSize}
                        detailsBelow={true}
                        hideRating={false}
                        disableRipple={true}
                        productTitleLines={3}
                        query={sku.query}
                        isMobileApp={props.isMobileApp}
                        event={event}
                        preferredThumbnailSize={thumbnailImageSizes.thumb250}
                        noCrawl={props.noCrawl}
                        shouldRenderAnchorLink={props.shouldRenderAnchorLinkOnProductItems}
                        onProductScrollIntoView={props.onProductItemScrollIntoView}
                        externalUrl={product.productUrl}
                        badgeSkipAvailabilityCheck={true}
                        disableSeoAttributes={props.disableSeoAttributes}
                    />
                </li>
            )
        );
    });
};

const SliderSkuList = (props: MerchSkuListProps) => {
    const NextArrow = (nextArrowProps) => {
        const {className, style, onClick} = nextArrowProps;
        return (
            <a href="javascript: void(0)" style={{...style}} onClick={onClick}>
                <ChevronRight className={classname([className, styles.sliderNextArrow, styles.icon])} />
            </a>
        );
    };

    const PrevArrow = (prevArrowProps) => {
        const {className, style, onClick} = prevArrowProps;
        return (
            <a href="javascript: void(0)" style={{...style}} onClick={onClick}>
                <ChevronLeft className={classname([className, styles.sliderPrevArrow, styles.icon])} />
            </a>
        );
    };

    const numberOfItemsPerSlide = getNumberOfItemsPerSlide(props.screenSize);
    const settings = {
        arrows: props.screenSize && props.screenSize.greaterThan && props.screenSize.greaterThan.extraSmall,
        className: styles.skuListSlider,
        dots: true,
        dotsClass: `slick-dots ${styles.dots}`,
        draggable: false,
        infinite: true,
        nextArrow: <NextArrow className={styles.sliderNextArrow} />,
        prevArrow: <PrevArrow className={styles.sliderPrevArrow} />,
        slidesToScroll: numberOfItemsPerSlide,
        slidesToShow: numberOfItemsPerSlide,
        speed: 500,
    };
    return (
        <ul className={classname([styles.productsRow, props.alignLeft && styles.alignLeft])}>
            <SlideShow settings={settings} content={getSkuList(props)} isMobileApp={props.isMobileApp} />
        </ul>
    );
};

const RowSkuList = (props: MerchSkuListProps) => {
    return <ul className={`${styles.productsRow} ${props.alignLeft ? styles.alignLeft : ""}`}>{getSkuList(props)}</ul>;
};

const getNumberOfItemsPerSlide = (screenSize: IBrowser): number => {
    if (screenSize.lessThan.small) {
        return RowItems.lessThanSmall;
    }
    if (screenSize.is.small) {
        return RowItems.small;
    }
    return RowItems.greaterThanSmall;
};

const MerchSkuList: React.FC<MerchSkuListProps> = (props) => {
    const displayType = props.displayAs;
    const theme = (displayType && MerchSkuListDisplayTypes[displayType]) || MerchSkuListDisplayTypes.slideshow;
    const shouldShowSliderSkuList =
        theme === MerchSkuListDisplayTypes.slideshow &&
        props.skuList &&
        props.skuList.length > getNumberOfItemsPerSlide(props.screenSize);

    return (
        <div className={styles.container}>
            <div className={styles.productContainer}>
                {shouldShowSliderSkuList ? <SliderSkuList {...props} /> : <RowSkuList {...props} />}
            </div>
        </div>
    );
};

export {MerchSkuList, RowSkuList, SliderSkuList, getSkuList};

export default MerchSkuList;
