import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import ProductImage from "../ProductImage";
import * as styles from "./style.css";
import ProductImageSlider from "../ProductImageSlider";
import SlideShow from "../SlideShow";
import messages from "./translations/messages";
import {FormattedMessage} from "react-intl";
import {classname} from "utils/classname";

export interface Props {
    images: string[];
    alt?: string;
    className?: string;
    width?: string;
    height?: string;
    screenSize: ScreenSize;
    placeholderImage?: string;
}
interface State {
    isImageGalleryLoading: boolean;
    selectedIndex: number;
}

/**
 * @deprecated
 *
 * This component is deprecated in favour of MediaGallery for better consistency and reusability.
 */
export class ImageGallery extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isImageGalleryLoading: true,
            selectedIndex: 0,
        };
    }

    public render() {
        const settings = {
            adaptiveHeight: false,
            afterChange: (index) =>
                this.setState({
                    selectedIndex: index,
                }),
            arrows: false,
            autoplay: false,
            customPaging: this.generateImageThumbnail,
            dots: true,
            infinite: true,
            initialSlide: this.state.selectedIndex,
            lazyLoad: true,
            slidesToScroll: 1,
            slidesToShow: 1,
            speed: 500,
        };

        const images = this.props.images || [];

        const maxSlideShowImages = this.props.screenSize.greaterThan.small ? 5 : 3;
        const showSingleImage = images.length <= 1 || this.state.isImageGalleryLoading;
        const showProductImageSlider =
            this.props.screenSize.greaterThan.extraSmall && images.length > maxSlideShowImages;

        if (showSingleImage) {
            return (
                <div
                    data-automation="image-gallery-single-image"
                    className={classname([styles.container, this.props.className])}>
                    <ProductImage
                        className={styles.productImage}
                        src={images.length >= 1 ? images[0] : undefined}
                        alt={this.props.alt}
                        width={this.props.width}
                        height={this.props.height}
                        placeholderImage={this.props.placeholderImage}
                    />
                </div>
            );
        }

        if (showProductImageSlider) {
            return (
                <div
                    data-automation="image-gallery-product-image-slider"
                    className={classname([styles.container, this.props.className])}>
                    <ProductImageSlider
                        images={images}
                        screenSize={this.props.screenSize}
                        selectedIndex={this.state.selectedIndex}
                        handleSelection={this.handleSelection}
                        placeholderImage={this.props.placeholderImage}
                        width={this.props.width}
                        height={this.props.height}
                    />
                </div>
            );
        }

        return (
            <div data-automation="image-gallery" className={classname([styles.container, this.props.className])}>
                <SlideShow
                    settings={settings}
                    className={classname(styles.sliderContainer)}
                    content={images.map((imageUrl, index) => (
                        <div className={classname(styles.productImageContainer)} key={index}>
                            <ProductImage
                                className={classname(styles.productImage)}
                                src={imageUrl}
                                width={this.props.width}
                                height={this.props.height}
                                placeholderImage={this.props.placeholderImage}
                            />
                        </div>
                    ))}
                />
                <div className={classname(styles.sliderIndexTitle)}>
                    <FormattedMessage
                        {...messages.showingNumOfTotal}
                        values={{
                            number: this.state.selectedIndex + 1,
                            total: images.length,
                        }}
                    />
                </div>
            </div>
        );
    }

    public componentDidMount() {
        this.setState({isImageGalleryLoading: false});
    }

    private generateImageThumbnail = (i: number) => {
        const reducedImageSizeUrl = this.props.images[i].replace(/[0-9]+x[0-9]+/, "100x100");
        return (
            <img src={reducedImageSizeUrl} className={classname(styles.imageThumbnail)} alt="" role="presentation" />
        );
    };

    private handleSelection = (selectedIndex: number) => {
        this.setState({
            ...this.state,
            selectedIndex,
        });
    };
}

export default ImageGallery;
