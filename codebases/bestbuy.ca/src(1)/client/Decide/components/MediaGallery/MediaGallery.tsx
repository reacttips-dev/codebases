import * as React from "react";
import {useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {Modal} from "@bbyca/bbyca-components";
import Slider, {Settings} from "react-slick";
import {debounce} from "lodash-es";

import {ProductImageProps} from "components/ProductImage";
import SlideShow from "components/SlideShow";
import {generateZoomableId, ZoomableProps} from "components/Zoomable";
import {PlayerEvent} from "components/YouTubePlayer/youTubeIframeAPIReady";
import Image, {ImageProps} from "components/Image";
import {classname} from "utils/classname";

import * as styles from "./style.css";
import messages from "./translations/messages";
import * as playbutton from "./assets/Thumbnail-MediaPlay.svg";
import * as navigationexpand from "./assets/Navigation-MediaExpand.svg";
import {placeVideoInOrder, getResponsiveThumbnailSliderSettings} from "./utils";
import {NextArrow, PrevArrow} from "./SliderButtons";
import {IntrinsicImageProps} from "./Image";
import {VideoProps} from "./Video";
import {Image as MediaImage} from ".";

export interface MediaGalleryEventsCallbackArgs {
    currentIndex: number;
}

export interface MediaGalleryProps {
    isProductVideoEnabled?: boolean;
    containerClassName?: string;
    children: React.ReactNode;
    onMediaChange?: (args: MediaGalleryEventsCallbackArgs) => void;
    onModalVisible?: () => void;
    onImageZoom?: (args: MediaGalleryEventsCallbackArgs) => ZoomableProps["onImageZoom"];
    disableSeoAttributes?: boolean;
}

interface PrepareImagesArgs extends Pick<ProductImageProps, "disableResponsiveSquareTrick"> {
    className?: string;
}

export interface ZoomableInstances {
    [instanceId: number]: ImageProps["resetZoomCallback"];
}

export const NavigationExpandIcon = ({onClick}) => (
    <button className={classname(styles.navigationExpandIcon)} onClick={onClick}>
        <img src={navigationexpand as any} alt={"Open Modal"} />
    </button>
);

NavigationExpandIcon.displayName = "NavigationExpandIcon";

// keep mapping of zoomable instances for reset purposes
// react-slick-slider creates cloned array copies because of lazy-load purposes,
// so we need to keep our own mapping of components on screen after component mounts
let registeredResetZoomTransforms: ZoomableInstances = {};

export const MediaGallery: React.FC<MediaGalleryProps> = (props) => {
    const getElementsFromChildren = (children: React.ReactNode) => {
        const isImageComponent = (element: JSX.Element): boolean =>
            (!!element && element.type.displayName === "Image") || element.type.displayName === "Connect(Image)";

        const isVideoComponent = (element: JSX.Element): boolean =>
            (!!element && element.type.displayName === "Video") || element.type.displayName === "Connect(Video)";

        const imageElements = React.Children.toArray(children).filter(isImageComponent);
        const videoElements = React.Children.toArray(children).filter(isVideoComponent);

        return {
            imageElements,
            videoElements,
        };
    };
    const childrenElements = getElementsFromChildren(props.children);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [isDraggable, setIsDraggable] = useState(true);
    const [isMediaGalleryMounted, setIsMediaGalleryMounted] = useState(false);
    const [videos, setVideos] = useState<Array<React.ReactElement<VideoProps>>>(
        childrenElements.videoElements as React.ReactElement[],
    );
    const [images, setImages] = useState<Array<React.ReactElement<IntrinsicImageProps>>>(
        childrenElements.imageElements as React.ReactElement[],
    );
    const hasVideo = props.isProductVideoEnabled && videos && videos.length > 0;
    const pdpSlideShowRef = React.useRef<Slider>();
    const pdpThumbnailSliderRef = React.useRef<Slider>();
    const modalPdpSlideShowRef = React.useRef<Slider>();
    const modalThumbnailSliderRef = React.useRef<Slider>();
    const [videoPlayer, setCurrentVideoPlayer] = useState(null);
    const [hideExpandNavigationIcon, setHideExpandNavigationIcon] = useState<boolean>(false);
    /**
     * The map of key-value pair where key is the length of the thumbnail images and value
     * is the style. It is applied on the thumbnail slider to indicate how many elements
     * exists to adjust the width of the slider so that items are evenly spread across the
     * max width of the thumbnail slider container.
     */
    const styleMap: {[length: number]: string} = {
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
    };
    /**
     * Video component renders youtube player in an iframe as implemented by Youtube. It
     * is difficult to apply event listener to video object to enable swipe and a user using
     * mobile devices are stuck to go to next media. We chose to disable video on image zoom
     * and enable it when arrows on the slider is introduced.
     */
    const disableVideoOnImageZoom = !!modalVisible;

    useEffect(() => {
        const {videoElements, imageElements} = getElementsFromChildren(props.children);
        setImages(imageElements as React.ReactElement[]);
        setVideos(videoElements as React.ReactElement[]);
    }, [props.children]);

    useEffect(() => {
        // Reset the index to 0 so that react-slick slider can reference an image from an array.
        if (selectedIndex < 0) {
            setSelectedIndex(0);
            return;
        }

        // Temporary logic to hide ExpandNavigationIcon when user is on the video on PDP
        if (selectedIndex > 0 && selectedIndex <= videos.length) {
            setHideExpandNavigationIcon(true);
        } else {
            setHideExpandNavigationIcon(false);
        }

        if (pdpSlideShowRef && pdpSlideShowRef.current) {
            pdpSlideShowRef.current.slickGoTo(selectedIndex);
        }

        if (modalPdpSlideShowRef && modalPdpSlideShowRef.current) {
            modalPdpSlideShowRef.current.slickGoTo(selectedIndex);
        }
    }, [selectedIndex]);

    useEffect(() => {
        if (!modalVisible) {
            if (pdpThumbnailSliderRef && pdpThumbnailSliderRef.current) {
                pdpThumbnailSliderRef.current.slickGoTo(selectedIndex);
            }

            if (pdpSlideShowRef && pdpSlideShowRef.current) {
                pdpSlideShowRef.current.slickGoTo(selectedIndex);
            }
        } else {
            if (modalThumbnailSliderRef && modalThumbnailSliderRef.current) {
                modalThumbnailSliderRef.current.slickGoTo(selectedIndex);
            }

            if (modalPdpSlideShowRef && modalPdpSlideShowRef.current) {
                modalPdpSlideShowRef.current.slickGoTo(selectedIndex);
            }
        }
    }, [modalVisible]);

    /**
     * For some weird reason, the carousel slider (main image slider) displays media at index -1 when
     * navigating from PLP to PDP, but not on server-side render.
     *
     * Even though the selectedIndex in the state and initialSlide settings of the slider initializes
     * the media at 0 index, the react-slider display media at -1 index. This could be a potential
     * bug with the react-slick library and to temporary fix this problem, the check on innerSlider's
     * state is done each time this component change and carousel slider is positioned at 0th index.
     */
    useEffect(() => {
        if (pdpSlideShowRef && pdpSlideShowRef.current) {
            /**
             *  Slider from 'react-slick' does not expose InnerSlider type as it is not intended for
             *  direct use, thus we convert to 'any' type to prevent the Typescript error.
             */
            const slider = pdpSlideShowRef.current as any;
            if (slider.innerSlider.state.currentSlide < 0) {
                pdpSlideShowRef.current.slickNext();
            }
        }
    });

    /**
     * Viewport height for desktop and mobile browser calculate it differently. The mobile browsers
     * does not include navigation bar and footer in viewport height. Also, when scrolling the viewport
     * height changes. This function calculate viewport height and adds a variable to the DOM element.
     */
    const calculateViewportHeight = () => {
        if (window) {
            // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
            const viewportHeight = window.innerHeight * 0.01;
            // Then we set the value in the --vh custom property to the root of the document
            document.documentElement.style.setProperty("--vh", `${viewportHeight}px`);
        }
    };

    useEffect(() => {
        setIsMediaGalleryMounted(true);
        calculateViewportHeight();
        const debounceCalculateViewportHeight = debounce(calculateViewportHeight, 100);
        // Listen to the resize event, and recaculate viewport height
        window.addEventListener("resize", debounceCalculateViewportHeight);
        // remove event listener on unmount
        return () => window.removeEventListener("resize", debounceCalculateViewportHeight);
    }, []);

    const onVideoPlay = (videoPlayCallback: (event: PlayerEvent) => void) => (event: PlayerEvent) => {
        setCurrentVideoPlayer(event.target as any);
        if (!!videoPlayCallback) {
            videoPlayCallback(event);
        }
    };

    const registerResetZoomCallback = (resetTransform: () => void, zoomableInstanceId: number) => {
        registeredResetZoomTransforms[zoomableInstanceId] = resetTransform;
    };

    const onVideoError = (callback: (event: PlayerEvent) => void) => (event: PlayerEvent) => {
        if (event.target.getVideoData) {
            const videoId = event.target.getVideoData().video_id;
            if (videoId) {
                const updatedVideos = videos.filter(
                    (element: React.ReactElement<VideoProps>) => element.props.id !== videoId,
                );
                setVideos(updatedVideos);
            }
        }

        if (!!callback) {
            callback(event);
        }
    };

    const handleOpen = () => {
        setModalVisible(true);
        // Re-adjust selectedIndex to display image after media when vidoes are removed from image zoom (modal)
        // and a user navigated to image zoom when video is selected on PDP.
        if (selectedIndex > videos.length) {
            const adjustedSelectedIndex = selectedIndex - videos.length;
            setSelectedIndex(adjustedSelectedIndex);
        }

        if (props.onModalVisible && typeof props.onModalVisible === "function" && !modalVisible) {
            props.onModalVisible();
        }

        if (selectedIndex > 0 && selectedIndex <= videos.length) {
            setSelectedIndex(1);
        }
    };

    const handleClose = () => {
        setModalVisible(false);
        registeredResetZoomTransforms = {};
        generateZoomableId(0);

        // Readjust index after use navigate back to PDP
        if (selectedIndex > 0) {
            const adjustedSelectedIndex = selectedIndex + videos.length;
            setSelectedIndex(adjustedSelectedIndex);
        }
    };

    const prepareImages = ({className = "", disableResponsiveSquareTrick}: PrepareImagesArgs): JSX.Element[] =>
        images.map((element: React.ReactElement<IntrinsicImageProps>, index: number) =>
            React.cloneElement(element, {
                resetZoomCallback: registerResetZoomCallback,
                onClick: !modalVisible ? handleOpen : undefined,
                setIsDraggable,
                disableResponsiveSquareTrick,
                className: classname([className, element.props.className || ""]),
                enableZoom: !!modalVisible,
                onImageZoom:
                    props.onImageZoom && typeof props.onImageZoom === "function"
                        ? props.onImageZoom({currentIndex: selectedIndex})
                        : undefined,
            }),
        );

    const prepareVideos = (): JSX.Element[] =>
        videos.map((element: React.ReactElement<VideoProps>) =>
            React.cloneElement(element, {
                onError: element.props.onError && onVideoError(element.props.onError),
                onPlay: element.props.onPlay && onVideoPlay(element.props.onPlay),
            }),
        );

    const generateSettings = (): Settings => {
        return {
            accessibility: modalVisible,
            adaptiveHeight: false,
            beforeChange: () => {
                if (!!modalVisible) {
                    Object.keys(registeredResetZoomTransforms).forEach((key) => {
                        if (typeof registeredResetZoomTransforms[key] === "function") {
                            registeredResetZoomTransforms[key]();
                        }
                    });
                }
            },
            afterChange: (index: number) => {
                if (videoPlayer) {
                    videoPlayer.stopVideo();
                }
                setSelectedIndex(index);

                if (props.onMediaChange && typeof props.onMediaChange === "function") {
                    /**
                     * Due to potential bug with the react-slick slider it reference -1 index
                     * we re-adjust to 0. When this happens, do not call onMediaChange callback.
                     */
                    if (pdpSlideShowRef && pdpSlideShowRef.current) {
                        const pdpSlider = pdpSlideShowRef.current as any;
                        if (pdpSlider.innerSlider.state.currentSlide < 0) {
                            return;
                        }
                    }
                    props.onMediaChange({currentIndex: index});
                }
            },
            arrows: false,
            autoplay: false,
            draggable: isDraggable,
            dots: false,
            infinite: false,
            initialSlide: 0,
            slidesToScroll: 1,
            slidesToShow: 1,
            speed: 500,
            swipe: true,
        };
    };

    const prepareMediaThumbnail = () => {
        const localThumbnailImages = images.map((element: React.ReactElement<IntrinsicImageProps>, index) => {
            let pos: number = index;
            // If videos is diabled in image zoom mode then re-calculate pos.
            if (!disableVideoOnImageZoom) {
                pos = index > 0 ? index + videos.length : 0;
            }
            const selectedItemStyle = pos === selectedIndex ? styles.selected : "";

            // currently there is an issue with LazyLoad in <ProductImage/> alongside <Slideshow/>
            return (
                <MediaImage
                    key={index}
                    onClick={() => setSelectedIndex(pos)}
                    className={classname([styles.thumbnailItemContainer, selectedItemStyle])}
                    imageSrc={element.props.thumbnailImageSrc}
                    thumbnailImageSrc={""}
                    disableMouseMoveCancelClick={true}
                    disableResponsiveSquareTrick={true}
                    disableLazyLoad={true}
                    disableSeoAttributes={props.disableSeoAttributes}
                />
            );
        });

        if (!!hasVideo && !disableVideoOnImageZoom) {
            videos.forEach((element: React.ReactElement<VideoProps>, index: number) => {
                const pos = index + 1;
                const thumbnailSelectedClassName = pos === selectedIndex ? styles.selected : "";
                localThumbnailImages.splice(
                    pos,
                    0,
                    <div
                        key={pos}
                        role="button"
                        onClick={() => setSelectedIndex(pos)}
                        className={classname([styles.thumbnailItemContainer, thumbnailSelectedClassName])}>
                        <Image src={element.props.thumbnail} masking={playbutton as any} />
                    </div>,
                );
            });
        }

        return localThumbnailImages;
    };
    const thumbnailImages = prepareMediaThumbnail();
    const disableNext = hasVideo && selectedIndex + 1 === thumbnailImages.length;
    const disablePrevious = hasVideo && selectedIndex === 0;
    // styleMap has mapping for thumbnail images length range 1 to 8.
    const itemCountStyles = thumbnailImages.length <= 8 ? styleMap[thumbnailImages.length] : "";

    const getThumbnailSliderSettings = (): Settings => ({
        className: classname(["center", styles.gallerySlider, "x-thumbnail-gallery-control", styles[itemCountStyles]]),
        centerPadding: "60px",
        swipeToSlide: true,
        nextArrow: <NextArrow disabled={disableNext} />,
        prevArrow: <PrevArrow disabled={disablePrevious} />,
        speed: 500,
        easing: "ease-out",
        initialSlide: 0,
        slidesToScroll: 1,
        lazyLoad: "progressive",
        responsive: getResponsiveThumbnailSliderSettings({
            fullScreenView: modalVisible,
            totalThumbnails: thumbnailImages.length,
        }),
    });

    const productImageSliderSlideShow = ({
        carousalRef,
        sliderRef,
    }: {
        carousalRef: React.RefObject<Slider | undefined>;
        sliderRef: React.RefObject<Slider | undefined>;
    }) => {
        const toggleSingleImageClassName = thumbnailImages.length === 1 ? styles.singleImage : "";
        const toggleHasThumbImageToShowClassName = thumbnailImages.length > 1 ? styles.hasImage : "";
        const imgs = prepareImages({
            className: classname(styles.productImageContainer),
            disableResponsiveSquareTrick: !!modalVisible,
        });
        const vids = !!disableVideoOnImageZoom ? [] : prepareVideos();
        const orderedMedia = placeVideoInOrder<JSX.Element>(imgs, vids);
        const isSSR = typeof window === "undefined";
        return (
            <>
                <SlideShow
                    className={classname([styles.sliderContainer, toggleSingleImageClassName])}
                    settings={generateSettings()}
                    forwardedRef={carousalRef}
                    content={orderedMedia}
                />
                <div
                    className={classname([
                        styles.slideShowContainer,
                        toggleSingleImageClassName,
                        toggleHasThumbImageToShowClassName,
                    ])}>
                    <div className={styles.imageCounterMessage}>
                        {isMediaGalleryMounted && thumbnailImages.length > 0 && (
                            <FormattedMessage
                                {...messages.showingNumOfTotal}
                                values={{
                                    number: selectedIndex + 1,
                                    total: thumbnailImages.length,
                                }}
                            />
                        )}
                    </div>
                    {!isSSR && (
                        <SlideShow
                            forwardedRef={sliderRef}
                            settings={getThumbnailSliderSettings()}
                            content={thumbnailImages}
                        />
                    )}
                </div>
            </>
        );
    };

    return (
        <>
            <div
                data-automation="media-gallery-product-image-slider"
                className={classname([styles.container, props.containerClassName || ""])}>
                <div className={classname(styles.productImageSliderContainer)}>
                    {!hideExpandNavigationIcon && <NavigationExpandIcon onClick={handleOpen} />}
                    {!modalVisible &&
                        productImageSliderSlideShow({carousalRef: pdpSlideShowRef, sliderRef: pdpThumbnailSliderRef})}
                </div>
            </div>
            <Modal
                className="x-modal-container"
                visible={modalVisible}
                theme="fullscreen"
                closeIcon={true}
                onClose={handleClose}
                blockScrollingOnOpen={true}>
                <div
                    data-automation="media-gallery-product-image-slider-modal"
                    className={props.containerClassName || ""}>
                    {!!modalVisible &&
                        productImageSliderSlideShow({
                            carousalRef: modalPdpSlideShowRef,
                            sliderRef: modalThumbnailSliderRef,
                        })}
                </div>
            </Modal>
        </>
    );
};

MediaGallery.displayName = "MediaGallery";

export default MediaGallery;
