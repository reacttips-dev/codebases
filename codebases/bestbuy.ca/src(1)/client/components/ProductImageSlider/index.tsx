import * as React from "react";
import * as styles from "./styles.css";
import {FormattedMessage} from "react-intl";
import messages from "./translations/messages";
import {IBrowser as ScreenSize} from "redux-responsive";
import SlideShow from "components/SlideShow";
import ProductImage from "components/ProductImage";
import {ChevronLeft, ChevronRight} from "@bbyca/bbyca-components";
import {YouTubePlayer, YouTubePlayerHandler} from "../YouTubePlayer";
import {ProductVideo} from "../../models";
import * as playbutton from "Decide/components/MediaGallery/assets/Thumbnail-MediaPlay.svg";
import {Settings as ReactSlickSettings} from "react-slick";
import {classname, classIf} from "utils/classname";

interface Props {
    images: string[];
    videos?: ProductVideo[];
    screenSize: ScreenSize;
    selectedIndex: number;
    handleSelection: (index: number) => void;
    placeholderImage?: string;
    width?: string;
    height?: string;
    onVideoEnd?: (event) => void;
    onVideoPlay?: (event) => void;
    onVideoReady?: (event) => void;
    onVideoError?: (event) => void;
    onError?: (event) => void;
}

interface State {
    productDisplay: Slider;
}

interface Slider extends JSX.Element {
    slickGoTo: (index: number, disableAnimation?: boolean) => void;
}

interface ArrowProps {
    className?: string;
    style?: any;
    onClick?: () => void;
    disabled?: any;
}

const NextArrow: React.FC<ArrowProps> = ({className, onClick, disabled}) => {
    const chevronRightClassnames = classname([
        className,
        styles.icon,
        styles.sliderNextArrow,
        classIf(styles.disabled, disabled),
    ]);

    return (
        <button onClick={onClick} className={classname(styles.button)}>
            <ChevronRight className={chevronRightClassnames} />
        </button>
    );
};

const PrevArrow: React.FC<ArrowProps> = ({className, onClick, disabled}) => {
    const chevronLeftClassnames = classname([
        className,
        styles.icon,
        styles.sliderPrevArrow,
        classIf(styles.disabled, disabled),
    ]);

    return (
        <button onClick={onClick} className={classname(styles.button)}>
            <ChevronLeft className={chevronLeftClassnames} />
        </button>
    );
};

/**
 * @deprecated
 * This component is deprecated in favour of MediaGallery for better consistency and reusability.
 */
export class ProductImageSlider extends React.Component<Props, State> {
    private currentPlayer;
    private productDisplay: Slider;

    constructor(props: Props) {
        super(props);
        this.state = {
            productDisplay: null,
        };
    }

    public componentDidMount() {
        this.setState({
            ...this.state,
            productDisplay: this.productDisplay,
        });
    }

    public render() {
        const hasVideo = this.props.videos && this.props.videos.length > 0;
        const productImageDisplaySettings: ReactSlickSettings = {
            arrows: false,
            afterChange: this.SyncDisplayHandler,
            swipe: true,
            ref: (slider: Slider) => (this.productDisplay = slider),
            lazyLoad: true as any,
            infinite: !hasVideo,
        };

        const productImages = this.prepareMedia();
        const thumbnailImages = this.prepareMediaThumbnail();
        const disableNext = hasVideo && this.props.selectedIndex + 1 === thumbnailImages.length;
        const disablePrevious = hasVideo && this.props.selectedIndex === 0;
        const galleryControllerSettings = {
            arrows: true,
            className: `center ${styles.gallerySlider}`,
            infinite: !hasVideo,
            centerPadding: "60px",
            slidesToShow: this.props.screenSize.is.small ? 3 : 5,
            swipeToSlide: true,
            nextArrow: <NextArrow disabled={disableNext} />,
            prevArrow: <PrevArrow disabled={disablePrevious} />,
            speed: 500,
            easing: "ease-out",
        };

        return (
            <div className={classname(styles.productImageSliderContainer)}>
                <SlideShow settings={productImageDisplaySettings} content={productImages} />
                <div className={classname(styles.slideShowContainer)}>
                    <div className={classname(styles.imageCounterMessage)}>
                        <FormattedMessage
                            {...messages.showingNumOfTotal}
                            values={{
                                number: this.props.selectedIndex + 1,
                                total: productImages.length,
                            }}
                        />
                    </div>
                    <SlideShow settings={galleryControllerSettings} content={thumbnailImages} />
                </div>
            </div>
        );
    }

    private syncSelectionHandler = (index: number) => {
        this.state.productDisplay.slickGoTo(index, true);
        this.props.handleSelection(index);
    };

    private SyncDisplayHandler = (index: number) => {
        this.props.handleSelection(index);
        if (this.currentPlayer) {
            this.currentPlayer.stopVideo();
        }
    };
    private prepareMedia() {
        const images = this.props.images || [];
        const videos = this.props.videos || [];

        const medias = images.map((imageUrl, index) => (
            <div className={classname(styles.productImageContainer)} key={index}>
                <ProductImage
                    className={classname(styles.productImage)}
                    src={imageUrl}
                    width={this.props.width}
                    height={this.props.height}
                    placeholderImage={this.props.placeholderImage}
                />
            </div>
        ));

        if (videos) {
            const host = location.protocol + "//" + location.hostname;
            const ytopts = {
                playerVars: {iv_load_policy: 3, color: "red", modestbranding: 1, enablejsapi: 1, origin: host, rel: 0},
            };
            videos.forEach((element, index) => {
                const ytpHandler: YouTubePlayerHandler = {
                    onError: this.props.onError,
                    onEnd: this.props.onVideoEnd,
                    onPlay: this.onVideoPlay,
                    onReady: this.props.onVideoReady,
                };
                medias.splice(
                    index + 1,
                    0,
                    <div key={index + 1}>
                        {" "}
                        <YouTubePlayer videoId={element.id} options={ytopts} ytpHandler={ytpHandler} />
                    </div>,
                );
            });
        }

        return medias;
    }

    private onVideoPlay = (event) => {
        this.currentPlayer = event.target;
        this.props.onVideoPlay(event);
    };

    private prepareMediaThumbnail() {
        const images = this.props.images || [];
        const videos = this.props.videos || [];

        const videosSize = videos.length;
        const thumbnailImages = images.map((imageUrl, index) => {
            const pos = index > 0 ? index + videosSize : 0;
            const isSelected = pos === this.props.selectedIndex ? styles.selected : "";
            const thumbnailImageSize = imageUrl.replace(/[0-9]+x[0-9]+/, "100x100");
            return (
                <button
                    className={classname(styles.sliderButton)}
                    key={pos}
                    onClick={() => this.syncSelectionHandler(pos)}>
                    <div className={classname([styles.itemContainer, isSelected])}>
                        <ProductImage
                            className={classname(styles.productImage)}
                            src={thumbnailImageSize}
                            width={this.props.width}
                            height={this.props.height}
                            placeholderImage={this.props.placeholderImage}
                        />
                    </div>
                </button>
            );
        });

        videos.forEach((element, index) => {
            const pos = index + 1;
            const isSelected = pos === this.props.selectedIndex ? styles.selected : "";
            thumbnailImages.splice(
                pos,
                0,
                <button
                    className={classname(styles.sliderButton)}
                    key={pos}
                    onClick={() => this.syncSelectionHandler(pos)}>
                    <div id="imagethumbnailDiv" className={classname([styles.itemContainer, isSelected])}>
                        <ProductImage
                            className={classname(styles.productImage)}
                            src={element.thumbnail}
                            width={this.props.width}
                            height={this.props.height}
                            placeholderImage={this.props.placeholderImage}
                            masking={playbutton as any}
                        />
                    </div>
                </button>,
            );
        });

        return thumbnailImages;
    }
}

export default ProductImageSlider;
