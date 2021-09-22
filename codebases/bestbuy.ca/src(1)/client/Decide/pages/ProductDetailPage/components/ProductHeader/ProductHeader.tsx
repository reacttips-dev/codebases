import * as React from "react";
import {useState, useCallback, useEffect} from "react";
import {connect, MapStateToProps, MapDispatchToProps} from "react-redux";
import {bindActionCreators} from "redux";
import {Col, Row} from "@bbyca/ecomm-components";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {FormattedMessage} from "react-intl";

import StarRate from "components/StarRate";
import Link from "components/Link";

import {MediaGallery, Image, Video} from "../../../../components/MediaGallery";
import BundleOverview from "./../BundleOverview";
import ProductDetailPlaceholder from "../ProductDetailPlaceholder";
import * as styles from "./styles.css";
import messages from "./translations/messages";
import {
    DetailedProduct as Product,
    ProductVideo,
    isBundle,
    ProductContent,
    ContextType,
    ProductMedia,
    ProductImageSizeMap,
    ProductImagesMap,
    ImageSizes,
    Environment,
} from "models";
import {productActionCreators, ProductActionCreators, configActionCreators, ConfigActionCreators} from "actions";
import {State} from "store";
import {Key} from "@bbyca/apex-components";
import {sendReviewAnalytics} from "../../utils";
import {classname, classIf} from "utils/classname";
import {utils as adobeAnalytics} from "@bbyca/adobe-launch";
import BlueShirtChat from "../BlueShirtChat";
import getTargettedContent from "../../../ProductDetailPage/utils/getTargettedContent";
import {selectProductMedia} from "../../../../store/selectors/productSelectors";
import {getRouting} from "store/selectors/routingSelectors";

import {RoutingState} from "reducers";
import {BrandAssetMap, BrandId, commonConfig} from "../BlueShirtChat/brands";
import {isEmpty} from "lodash-es";

export interface StateProps extends Pick<Environment, "appEnv"> {
    product: Product;
    bazaarVoiceEnabled?: boolean;
    blueShirtChatEnabled?: boolean;
    isBrandExpertChatEnabled?: boolean;
    isBrandExpertChatEnabledForMarketPlace?: boolean;
    isProductVideoEnabled: boolean;
    isImageZoomEnabled?: boolean;
    locale: Locale;
    baseUrl: string;
    targettedContent: ProductContent;
    productMedia: ProductMedia;
    routing: RoutingState;
    disableSeoAttributes?: boolean;
    language: Language;
}

export interface Props {
    onReviewsClicked: () => void;
    onVideoEnd?: (event) => void;
    onVideoPlay: (event) => void;
    onVideoReady?: (event) => void;
    onVideoError?: (event) => void;
}

export interface DispatchProps {
    actions: ProductActionCreators;
    configActions: ConfigActionCreators;
}

interface ProductImage {
    index?: string;
    imageSrc: string;
    highResolutionImageSrc?: string;
    thumbnailImageSrc: string;
}

interface MediaVisitedState {
    [currentIndex: number]: boolean;
}

export type ProductHeaderProps = DispatchProps & StateProps & InjectedIntlProps & Props;

export const ProductHeader: React.FC<ProductHeaderProps> = (props) => {
    const resolveSpecificRes = useCallback(
        (resolution: string, image: ProductImageSizeMap) => (image[resolution] && image[resolution].url) || "",
        [],
    );
    const getPreparedImages = (images: ProductImagesMap): ProductImage[] => {
        return Object.keys(images).map((index) => {
            const image: ProductImageSizeMap = images[index];
            return {
                highResolutionImageSrc: resolveSpecificRes(ImageSizes.highResoultion, image),
                imageSrc: resolveSpecificRes(ImageSizes.midResolution, image),
                thumbnailImageSrc: resolveSpecificRes(ImageSizes.lowResultion, image),
            };
        });
    };
    const preparedImages: ProductImagesMap = (props.productMedia && props.productMedia.images) || {};
    const [productImages, setProductImages] = useState<ProductImage[]>(getPreparedImages(preparedImages));
    const [productVideos, setProductVideos] = useState<ProductVideo[]>(
        (props.productMedia && props.productMedia.videos) || [],
    );
    const [mediaVisited, setMediaVisited] = useState<MediaVisitedState>({});
    const [imageZoomedVisited, setImageZoomedVisited] = useState<MediaVisitedState>({});
    const [blueShirtChatTargeted, setBlueShirtChatTargeted] = useState(false);

    useEffect(() => {
        const media: ProductMedia = props.productMedia;
        if (media && media.images) {
            setProductImages(getPreparedImages(media.images));
        }

        if (media && media.videos) {
            setProductVideos(media.videos);
        }
    }, [props.productMedia, props.product && props.product.productVideos]);

    useEffect(() => {
        if (!props.product || !props.product.sku) {
            setProductImages([]);
            return;
        }
        props.actions.getProductMedia({sku: props.product.sku, locale: props.locale});
    }, [props.product && props.product.sku]);

    useEffect(() => {
        if (props.targettedContent) {
            const chatTargetedContext = getTargettedContent(props.targettedContent, ContextType.chat);
            if (chatTargetedContext && chatTargetedContext.length > 0) {
                setBlueShirtChatTargeted(chatTargetedContext[0].enabled || false);
            }
        }
    }, [props.targettedContent]);

    const prepareMediaGalleryImages = (): JSX.Element[] | JSX.Element => {
        return !productImages.length ? (
            <Image
                imageSrc={""}
                key={"product-placeholder-image"}
                thumbnailImageSrc={""}
                placeholderImageSrc={props.product.placeholderImage}
                enableZoom={false}
                highResolutionImageSrc={""}
                alt={"product image"}
            />
        ) : (
            productImages.map((obj, index) => {
                const isFirstElement = index === 0;

                return (
                    <Image
                        imageSrc={obj.imageSrc}
                        key={`image-${index}`}
                        thumbnailImageSrc={obj.thumbnailImageSrc}
                        placeholderImageSrc={!isFirstElement ? props.product.placeholderImage : ""}
                        enableZoom={!!props.isImageZoomEnabled}
                        highResolutionImageSrc={obj.highResolutionImageSrc}
                        alt={"product image"}
                        disableLazyLoad={isFirstElement}
                        disableSeoAttributes={props.disableSeoAttributes}
                    />
                );
            })
        );
    };

    const prepareMediaGalleryVideos = (): JSX.Element[] | undefined => {
        if (!productVideos || !productVideos.length) {
            return;
        }

        return productVideos.map((productVideo: ProductVideo) => (
            <Video
                key={productVideo.id}
                id={productVideo.id}
                source={productVideo.source}
                thumbnail={productVideo.thumbnail}
                onEnd={props.onVideoEnd}
                onReady={props.onVideoReady}
                onError={props.onVideoError}
                onPlay={props.onVideoPlay}
            />
        ));
    };

    const getShortProductDescription = (styleClassname: string) => {
        let isChatVisible = false;
        const {product, blueShirtChatEnabled, isBrandExpertChatEnabledForMarketPlace} = props;

        if (blueShirtChatEnabled && blueShirtChatTargeted && product) {
            const {brandName, isMarketplace} = product;
            const isBEC = !isEmpty(commonConfig[brandName?.toLocaleLowerCase()]);
            const isBECEnabledForMarketplace = isMarketplace && isBrandExpertChatEnabledForMarketPlace && isBEC;

            if (!isMarketplace || isBECEnabledForMarketplace) {
                isChatVisible = true;
            }
        }

        return (
            <div
                className={classname([
                    styles.overviewContainer,
                    styleClassname,
                    classIf(styles.chatEnabled, isChatVisible),
                ])}>
                <div
                    className={classname([
                        styles.productDescription,
                        classIf(styles.withChatInitiator, isChatVisible),
                    ])}>
                    <div className={classname(styles.overview)}>
                        <FormattedMessage {...messages.overview} tagName="h2" />
                    </div>
                    <div
                        className={classname(styles.description)}
                        dangerouslySetInnerHTML={{__html: props.product.shortDescription}}
                    />
                </div>
                <BlueShirtChat
                    isChatVisible={isChatVisible}
                    brandId={props.isBrandExpertChatEnabled ? (props.product.brandName as BrandId) : "blueShirt"}
                    appEnv={props.appEnv}
                    language={props.language}
                />
            </div>
        );
    };

    const createWriteReviewLink = () => {
        const {sku} = props.product;
        const zeroReviews = props.product.customerRatingCount <= 0;
        const reviewLinkClassName = zeroReviews
            ? `${styles.writeReviewLink} ${styles.zeroReviews}`
            : `${styles.writeReviewLink}`;

        return (
            <Link
                chevronType={"right"}
                className={reviewLinkClassName}
                to={"createProductReview" as Key}
                params={[sku]}
                // Use rel="nofollow" to tell search engine to not follow this link
                extraAttrs={{rel: "nofollow"}}
                onClick={onWriteReviewLinkClick}>
                {zeroReviews ? (
                    <FormattedMessage {...messages.firstToReviewLink} />
                ) : (
                    <FormattedMessage {...messages.writeReview} />
                )}
            </Link>
        );
    };

    const onWriteReviewLinkClick = () => {
        sendReviewAnalytics(
            {
                sku: props.product.sku,
                brandName: props.product.brandName,
                primaryParentCategoryId: props.product.primaryParentCategoryId,
            },
            "write",
            "PdpWriteReviewProductHeader",
        );
    };

    const sendMediaOnChangeAnalytics = useCallback(
        ({currentIndex}) => {
            if (!mediaVisited[currentIndex]) {
                adobeAnalytics.pushEventToDataLayer({
                    event: "pdp-mediagallery-media-on-change",
                    payload: {
                        customLinkName: "Gallery View",
                    },
                });
            }
            setMediaVisited({...mediaVisited, [currentIndex]: true});
        },
        [mediaVisited, setMediaVisited],
    );

    const sendImageZoomVisibleAnalytics = useCallback(() => {
        adobeAnalytics.pushEventToDataLayer({
            event: "pdp-image-zoom-interactions",
            payload: {
                customLinkName: "Gallery Expand",
            },
        });
    }, []);

    const sendImageZoomAnalytics = useCallback(
        ({currentIndex}) => () => {
            if (!imageZoomedVisited[currentIndex]) {
                adobeAnalytics.pushEventToDataLayer({
                    event: "pdp-image-zoom-interactions",
                    payload: {
                        customLinkName: "Image Zoom",
                    },
                });
            }
            setImageZoomedVisited({...imageZoomedVisited, [currentIndex]: true});
        },
        [imageZoomedVisited, setImageZoomedVisited],
    );

    return !props.product ? (
        <ProductDetailPlaceholder />
    ) : (
        <div className={"x-product-detail-page"}>
            <h1 className={classname(styles.productName)}>{props.product.name}</h1>
            <div className={classname(styles.modelDetailSection)}>
                <div className={classname(styles.modelInformationContainer)}>
                    {props.product.modelNumber && props.product.modelNumber !== "N/A" && (
                        <div className={classname(styles.modelInformation)}>
                            <strong>
                                <FormattedMessage {...messages.modelNumber} />
                            </strong>
                            <span>{props.product.modelNumber}</span>
                        </div>
                    )}
                    <div className={classname(styles.modelInformation)}>
                        <strong>
                            <FormattedMessage {...messages.webCode} />
                        </strong>
                        <span>{props.product.sku}</span>
                    </div>
                </div>
                <div className={styles.reviewsContainer}>
                    <StarRate
                        rate={props.product.customerRating}
                        count={props.product.customerRatingCount}
                        hideRatingScore={!props.product.customerRatingCount}
                        onClickRatingsHandler={props.onReviewsClicked}
                        disableSeoAttributes={props.disableSeoAttributes}
                    />
                    <div
                        className={`${
                            props.product.customerRatingCount
                                ? styles.writeReviewLinkContainer
                                : styles.writeReviewLinkContainerZeroReviews
                        }`}>
                        {createWriteReviewLink()}
                    </div>
                </div>
            </div>
            <hr className={classname(styles.divider)} />
            <Row>
                <Col className={classname(styles.productContent)} xs={12} sm={6} md={8}>
                    <MediaGallery
                        isProductVideoEnabled={props.isProductVideoEnabled}
                        containerClassName={classname(styles.mediaGalleryContainer)}
                        onImageZoom={sendImageZoomAnalytics}
                        onMediaChange={sendMediaOnChangeAnalytics}
                        onModalVisible={sendImageZoomVisibleAnalytics}
                        disableSeoAttributes={props.disableSeoAttributes}>
                        {prepareMediaGalleryImages()}
                        {prepareMediaGalleryVideos()}
                    </MediaGallery>
                    {getShortProductDescription(styles.greaterThanSmall)}
                    {isBundle(props.product) && props.product.bundleProducts && (
                        <BundleOverview
                            classname={classname([styles.bundleOverview, styles.greaterThanSmall])}
                            constituents={props.product.bundleProducts}
                        />
                    )}
                </Col>
                <Col className={classname(styles.collapseColContainer)} xs={12} sm={6} md={4}>
                    {props.children}
                </Col>
            </Row>
            <hr className={classname([styles.divider, styles.productBodyDivider])} />
            {getShortProductDescription(styles.lessThanMedium)}

            {isBundle(props.product) && props.product.bundleProducts && (
                <BundleOverview
                    classname={classname([styles.bundleOverview, styles.lessThanMedium])}
                    constituents={props.product.bundleProducts}
                />
            )}
        </div>
    );
};

ProductHeader.displayName = "ProductHeader";

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => {
    const features = state.config.features;
    return {
        bazaarVoiceEnabled: features?.bazaarVoiceEnabled,
        blueShirtChatEnabled: !!features?.blueShirtChatEnabled,
        isBrandExpertChatEnabled: !!features?.isBrandExpertChatEnabled,
        isBrandExpertChatEnabledForMarketPlace: !!features?.isBrandExpertChatEnabledForMarketPlace,
        product: state.product.product,
        isProductVideoEnabled: !!features?.isProductVideoEnabled,
        baseUrl: state.config.dataSources && state.config.dataSources.productApiUrl,
        locale: state.intl.locale,
        isImageZoomEnabled: !!features?.isImageZoomEnabled,
        targettedContent: state.product.targettedContent,
        productMedia: selectProductMedia(state),
        routing: getRouting(state),
        appEnv: state.app.environment.appEnv,
        language: state.intl.language,
    };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => {
    return {
        actions: bindActionCreators(productActionCreators, dispatch),
        configActions: bindActionCreators(configActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps, {}, State>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<Props & StateProps & DispatchProps>(ProductHeader));
