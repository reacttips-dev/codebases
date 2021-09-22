import * as React from "react";
import * as styles from "./style.css";
import Link from "components/Link";
import {IBrowser as ScreenSize} from "redux-responsive";
import {OfferItem, CustomContentType, SectionItemTypes, MerchItem, DisplayOptions, BackgroundWidth} from "models";
import {buildLinkProps} from "@bbyca/apex-components";
import LazyLoad from "react-lazyload";
import {ChevronRight} from "@bbyca/bbyca-components";
import {AdSlot as GoogleAdSlot} from "components/Advertisement";
import {getImageProps} from "utils/imageUtils";
import {classname, classIf} from "utils/classname";
import {GlobalStyles} from "pages/PageLayouts/";
import ContentContainer, {ContainerComponentProps} from "components/DynamicContent/ContentContainer";

export interface SectionColumnContent {
    mobileDisplay: 1 | 2;
    offerList: Array<OfferItem | MerchItem>;
}

export interface ColumnContentProps {
    content: SectionColumnContent;
    displayOptions?: DisplayOptions;
    screenSize: ScreenSize;
    language: Language;
    isMobileApp?: boolean;
    onAdItemsHaveBeenHidden?: (shouldShowParentBlock: boolean) => void;
}

export const ColumnContent = (props: ColumnContentProps) => {
    const {content, displayOptions = {}} = props;
    const themeClass = classIf(styles.dark, !!(displayOptions.theme === "dark"));
    const layoutClass = isMobile2Across(content.mobileDisplay) ? styles.xsTwoAcross : "";

    return <div className={classname([styles.columnContentRow, layoutClass, themeClass])}>{renderOffers(props)}</div>;
};

const isMobile2Across = (mobileDisplay: number) => mobileDisplay === 2;

const isAdvertisement = (item: MerchItem) => {
    return item.type === SectionItemTypes.customContent && item.customContentType === CustomContentType.adSlotGoogle;
};

const renderOffers = (props: ColumnContentProps) => {
    const itemsPerRow = 4;
    const content = props.content;

    // According to the UX spec, offer list only displays at most the first 4 offers, and ignore the rest.
    // Consider set limit 4 by content api or content stack CMS in the future.
    if (content.offerList.length > itemsPerRow) {
        content.offerList = content.offerList.slice(0, itemsPerRow);
    }

    const [itemState, setItemState] = React.useState({});
    const updateItemState = (index, value) => {
        if (itemState[index] !== value) {
            setItemState({
                ...itemState,
                [index]: value,
            });
        }
    };

    const numberOfHiddenItems = Object.values(itemState).filter((state) => state === false).length;
    if (numberOfHiddenItems !== 0 && props.onAdItemsHaveBeenHidden) {
        const areAllItemsHidden = numberOfHiddenItems !== content.offerList.length;
        props.onAdItemsHaveBeenHidden(areAllItemsHidden);
    }

    const fourItemsPerRowClass = props.content.offerList.length === itemsPerRow ? styles.fourItemsPerRow : "";
    return props.content.offerList.map((offer, index) => {
        if (isAdvertisement(offer as MerchItem) && props.isMobileApp) {
            return;
        }
        const containerDisplayStyle = itemState[index] === false ? "none" : "block";
        const updateCurrentItemState: (value: boolean) => void = (value) => updateItemState(index, value);
        return (
            <div
                key={index}
                className={`${styles.column} ${fourItemsPerRowClass}`}
                style={{display: containerDisplayStyle}}>
                {buildOffer(
                    offer,
                    props.screenSize,
                    props.language,
                    !!props.isMobileApp,
                    props.content.mobileDisplay,
                    updateCurrentItemState,
                )}
            </div>
        );
    });
};

const getBackgroundImage = (offer: OfferItem, screenSize: ScreenSize) => {
    const imageProps = getImageProps(
        {
            image: offer.image,
            description: offer.alternateText,
            preferHigherResolution: true,
        },
        screenSize,
    );
    return imageProps && imageProps.src;
};

const buildOffer = (
    item: OfferItem | MerchItem,
    screenSize: ScreenSize,
    language: Language,
    isMobileApp: boolean,
    mobileDisplay: number,
    updateItemState: (value: boolean) => void,
) => {
    if (isAdvertisement(item as MerchItem)) {
        const ad = item as MerchItem;
        const containerId = ad.values && ad.values.id;
        return (
            <GoogleAdSlot
                containerId={containerId}
                onAdAvailabilityChange={updateItemState}
                format={ad.values.format}
            />
        );
    }

    const offer = item as OfferItem;
    const hasCTA = checkCTA(offer);
    const linkEvent = {...offer.event, language};
    const ctaLinkProps = hasCTA ? buildLinkProps(linkEvent, isMobileApp) : null;
    const offerContent = buildOfferContent(offer, screenSize, mobileDisplay);

    return hasCTA ? <Link {...ctaLinkProps}>{offerContent}</Link> : offerContent;
};

const buildOfferContent = (offer: OfferItem, screenSize: ScreenSize, mobileDisplay: number) => {
    const imageURL = getBackgroundImage(offer, screenSize);
    return (
        <>
            {imageURL && (
                <LazyLoad offset={100}>
                    <div
                        className={`${styles.offerBackgroundImage} ${
                            isMobile2Across(mobileDisplay) ? styles.xsTwoAcrossImage : ""
                        } ${!offer.hasCustomImage ? styles.skuImage : ""}`}
                        style={{backgroundImage: `url(${imageURL})`}}
                        role="img"
                        aria-label={(offer.image && offer.image.alternateText) || undefined}></div>
                </LazyLoad>
            )}
            {offer.offerTitle && <p className={styles.offerTitle}>{offer.offerTitle}</p>}
            {offer.text && <p className={styles.offerText}>{offer.text}</p>}
            {checkCTA(offer) && (
                <p className={styles.offerCta}>
                    <span>{offer.event.ctaText}</span>
                    <ChevronRight className={`${styles.arrowIcon} ${styles.ctaIcon}`} viewBox="0 -2 26 26" />
                </p>
            )}
        </>
    );
};

const checkCTA = (offer: OfferItem) => offer.event && offer.event.ctaText;

const WrappedColumnContent: React.FC<ColumnContentProps & ContainerComponentProps> = (props) => {
    const {backgroundImage, backgroundColour, displayOptions = {}, displaySection = true} = props;
    const contextStyles = React.useContext(GlobalStyles);
    const hasBackground = !!(backgroundImage || backgroundColour);
    const containerClassName = classname([
        displayOptions.backgroundWidth === BackgroundWidth.browserSize ? contextStyles.browserSizeLayout : "",
        !displaySection ? styles.hidden : "",
    ]);
    const contentClassName = classname([
        contextStyles.siteSizeLayout,
        hasBackground && styles.backgroundMounted,
        hasBackground && contextStyles.contentSections.backgroundMountedContent,
    ]);

    return (
        <ContentContainer {...props} className={containerClassName}>
            <div className={contentClassName}>
                {props.children}
                <ColumnContent {...props} />
            </div>
        </ContentContainer>
    );
};

export default WrappedColumnContent;
