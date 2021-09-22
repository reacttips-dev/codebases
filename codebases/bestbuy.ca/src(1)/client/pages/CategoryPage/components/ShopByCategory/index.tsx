import * as React from "react";
import Divider from "@material-ui/core/Divider";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import {IBrowser as ScreenSize} from "redux-responsive";
import {ShopByCategory as ShopByCategoryInterface} from "models/Category";
import * as styles from "./style.css";
import {SlideShow} from "components/SlideShow";
import CategoryIcon from "components/CategoryIconList/components/CategoryIcon";

export interface Props extends ShopByCategoryInterface {
    screenSize: ScreenSize;
}

export const SMALL_NUMBER_OF_ITEMS = 2;
export const MEDIUM_NUMBER_OF_ITEMS = 6;
const ARROW_SIZE = "32px";
const SLIDER_SPEED = 500;

export const ShopByCategory: React.SFC<Props> = ({items, screenSize, title}) => (
    <div className={`x-shop-by-category ${styles.container}`}>
        <div className={styles.categoryContainer}>
            {title && <h2 className={`x-header ${styles.header}`}>{title}</h2>}
            {shouldShowSliderMerchList(items, screenSize)
                ? renderSliderMerchList(items, screenSize)
                : renderMerchList(items, screenSize)}
        </div>
        <Divider className={styles.dividerWithMargin} />
    </div>
);

const renderMerchList = (items, screenSize) => (
    <div className={`x-merch-row ${styles.merchRow}`}>{renderMerchCategories(items, screenSize)}</div>
);

const shouldShowSliderMerchList = (items, screenSize): boolean => {
    const {small} = screenSize.lessThan;
    const {length} = items;

    if (small) {
        return length > SMALL_NUMBER_OF_ITEMS;
    }

    return length > MEDIUM_NUMBER_OF_ITEMS;
};

const getNumberOfItemsPerSlide = (screenSize) => {
    const {small} = screenSize.lessThan;
    if (small) {
        return SMALL_NUMBER_OF_ITEMS;
    }

    return MEDIUM_NUMBER_OF_ITEMS;
};

const renderSliderMerchList = (items, screenSize) => {
    const NextArrow = (props) => {
        const {className, style, onClick} = props;

        return (
            <KeyboardArrowRight
                className={`x-next-arrow ${className} ${styles.icon}`}
                classes={{
                    root: styles.sliderNextArrow,
                }}
                onClick={onClick}
                style={{
                    ...style,
                    height: ARROW_SIZE,
                    width: ARROW_SIZE,
                }}
            />
        );
    };

    const PrevArrow = (props) => {
        const {className, style, onClick} = props;

        return (
            <KeyboardArrowLeft
                className={`x-prev-arrow ${className} ${styles.icon}`}
                classes={{
                    root: styles.sliderPrevArrow,
                }}
                onClick={onClick}
                style={{
                    ...style,
                    height: ARROW_SIZE,
                    width: ARROW_SIZE,
                }}
            />
        );
    };

    const numberOfItemsPerSlide = getNumberOfItemsPerSlide(screenSize);

    const settings = {
        arrows: true,
        className: `x-category-list ${styles.categoryListSlider}`,
        dots: true,
        dotsClass: `x-slider-dots slick-dots ${styles.dots}`,
        draggable: false,
        infinite: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToScroll: numberOfItemsPerSlide,
        slidesToShow: numberOfItemsPerSlide,
        speed: SLIDER_SPEED,
        lazyLoad: true,
    };

    return <SlideShow settings={settings} content={renderMerchCategories(items, screenSize)} />;
};

const renderMerchCategory = (screenSize) => (category, index) => (
    <div className={styles.merchCategoryContainer} key={index}>
        <CategoryIcon {...category} className={`x-category-item ${styles.sliderItem}`} screenSize={screenSize} />
    </div>
);

const renderMerchCategories = (items, screenSize) => items.map(renderMerchCategory(screenSize));

ShopByCategory.displayName = "ShopByCategory";

export default ShopByCategory;
