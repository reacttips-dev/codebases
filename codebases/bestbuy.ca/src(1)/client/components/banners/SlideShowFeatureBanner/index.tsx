import * as React from "react";
import {useState, useEffect} from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import {SectionItemTypes, CustomContentType} from "models";
import * as styles from "./style.css";
import {FeatureBanner, FeatureBannerProps} from "components/banners/FeatureBanner";
import {SlideShow} from "components/SlideShow";
import {ChevronRight, ChevronLeft} from "@bbyca/bbyca-components";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {AdSlot} from "components/Advertisement";
import ContentContainer, {ContainerComponentProps} from "components/DynamicContent/ContentContainer";
import {GlobalStyles} from "pages/PageLayouts";
import {classname} from "utils/classname";

export interface SlideShowItemProps extends FeatureBannerProps {
    type?: SectionItemTypes;
    customContentType?: CustomContentType;
    values?: {
        format: string;
        id: string;
    };
}
export interface SlideShowFeatureBannerProps extends ContainerComponentProps {
    content: SlideShowItemProps[];
    screenSize: ScreenSize;
    isMobileApp?: boolean;
    language: Language;
}

export const SlideShowFeatureBanner = (props: SlideShowFeatureBannerProps) => {
    const {content = [], isMobileApp} = props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasAd, setHasAd] = useState(false);
    const contextStyles = React.useContext(GlobalStyles);

    useEffect(() => {
        content.forEach((item) => {
            if (isAdvertisementBanner(item) && !isMobileApp) {
                setHasAd(true);
                return;
            }
        });
    }, []);

    const isAdvertisementBanner = (banner: SlideShowItemProps) =>
        banner &&
        banner.type === SectionItemTypes.customContent &&
        banner.customContentType === CustomContentType.adSlotGoogle;

    const getSlideShowContent = () => {
        return (content || []).map((banner, index) => {
            if (isAdvertisementBanner(banner)) {
                if (isMobileApp) {
                    return;
                }

                const {values} = banner;
                return (
                    <AdSlot
                        key={index}
                        containerId={values && values.id}
                        format={values && values.format}
                        className={styles.adSlot}
                    />
                );
            } else {
                return (
                    <ContentContainer className={styles.featureBannerContainer} key={index} {...banner}>
                        <FeatureBanner className={styles.featureBanner} {...banner} />
                    </ContentContainer>
                );
            }
        });
    };

    const NextArrow = (nextArrowProps) => {
        const {className, style, onClick} = nextArrowProps;
        const disabled = hasAd && currentIndex + 1 === content.length;
        return (
            <div role="button" onClick={onClick} style={{...style}}>
                <ChevronRight
                    className={`${styles.sliderNextArrow} ${className} ${styles.icon} ${
                        disabled ? styles.disabled : ""
                    }`}
                    viewBox="-1 0 32 32"
                />
            </div>
        );
    };

    const PrevArrow = (prevArrowProps) => {
        const {className, style, onClick} = prevArrowProps;
        const disabled = hasAd && currentIndex === 0;
        return (
            <div role="button" onClick={onClick} style={{...style}}>
                <ChevronLeft
                    className={`${styles.sliderPrevArrow} ${className} ${styles.icon} ${
                        disabled ? styles.disabled : ""
                    }`}
                    viewBox="1 0 32 32"
                />
            </div>
        );
    };

    const onNextSlide = (index: number) => {
        const trackingVariables = {
            eVar: {
                54: `carousel${index + 1}`,
            },
            props: {
                74: `carousel${index + 1}`,
            },
        };
        adobeLaunch.customLink("carousel", trackingVariables);
        setCurrentIndex(index);
    };

    const displayOptions = content[currentIndex] && content[currentIndex].displayOptions;
    const theme = displayOptions && displayOptions.theme;

    const numberOfItemsPerSlide = 1;
    const settings = {
        arrows: true,
        dots: true,
        dotsClass: classname(["slick-dots", styles.dots]),
        speed: 500,
        infinite: !hasAd,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        pauseOnHover: false,
        pauseOnFocus: false,
        draggable: false,
        slidesToScroll: numberOfItemsPerSlide,
        slidesToShow: numberOfItemsPerSlide,
        afterChange: (index: number) => onNextSlide(index),
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    arrows: false,
                },
            },
        ],
    };

    return (
        <div className={classname([contextStyles.browserSizeLayout, styles.featureBannerSlideshow])}>
            <SlideShow settings={settings} content={getSlideShowContent()} isMobileApp={isMobileApp} />
        </div>
    );
};

export default SlideShowFeatureBanner;
