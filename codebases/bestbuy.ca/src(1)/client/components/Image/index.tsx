import * as React from "react";
import * as styles from "./style.css";
import Zoomable, {ZoomableProps} from "components/Zoomable";
import {classIf, classname} from "utils/classname";

export interface ImageProps extends Omit<ZoomableProps, "children"> {
    alt?: string;
    className?: string;
    dispatchLoadEvents?: boolean;
    height?: string;
    placeholder?: React.ReactNode;
    src?: string;
    width?: string;
    masking?: string;
    enableZoom?: boolean;
    disableSeoAttributes?: boolean;
}

export interface ImageState {
    usePlaceholder: boolean;
}

export class Image extends React.Component<ImageProps, ImageState> {
    private imgElement: HTMLImageElement;

    constructor(props) {
        super(props);
        this.state = {
            usePlaceholder: !!props.placeholder || false,
        };
    }

    public onImageLoadHandler = () => {
        this.hidePlaceholder();
        this.dispatchLoadedImageEvent();
    };

    public hidePlaceholder = () => {
        this.setState({usePlaceholder: false});
    };

    public componentDidMount() {
        this.dispatchRegisterImageEvent();

        if (this.imgElement && this.imgElement.complete) {
            this.dispatchLoadedImageEvent();
        }

        if (
            this.state.usePlaceholder &&
            this.imgElement &&
            this.imgElement.complete &&
            this.imgElement.naturalWidth > 0
        ) {
            this.hidePlaceholder();
        }
    }

    public dispatchLoadedImageEvent = () => {
        if (this.props.dispatchLoadEvents) {
            document.dispatchEvent(new CustomEvent("LoadedImageElement", {bubbles: true}));
        }
    };

    public dispatchRegisterImageEvent = () => {
        if (this.props.dispatchLoadEvents) {
            document.dispatchEvent(new CustomEvent("RegisterImageElement", {bubbles: true}));
        }
    };

    public render() {
        const {
            placeholder,
            dispatchLoadEvents,
            alt,
            enableZoom,
            resetZoomCallback,
            setIsDraggable,
            masking,
            onImageZoom,
            disableSeoAttributes,
            ...imgProps
        } = this.props;

        const itemProp = !disableSeoAttributes && {itemProp: "image"};
        // Please keep <Zoomable /> as a parent of <sliderTarget />, otherwise swipe/zoom doesn't work
        const imageContentElement = (
            <div className={classIf(styles.hidden, this.state.usePlaceholder, styles.displayingImage)}>
                <div className={styles.sliderTarget}></div>
                <img
                    {...imgProps}
                    alt={alt || ""}
                    {...itemProp}
                    onError={this.dispatchLoadedImageEvent}
                    onLoad={this.onImageLoadHandler}
                    ref={(i) => (this.imgElement = i)}
                />

                {masking && <img src={masking} className={classname(styles.middle)} alt="" role="presentation" />}
            </div>
        );

        return (
            <div>
                {this.state.usePlaceholder && placeholder}
                {!!enableZoom ? (
                    <Zoomable
                        setIsDraggable={setIsDraggable}
                        resetZoomCallback={resetZoomCallback}
                        onImageZoom={onImageZoom}>
                        {imageContentElement}
                    </Zoomable>
                ) : (
                    imageContentElement
                )}
            </div>
        );
    }
}

Image.defaultProps = {
    dispatchLoadEvents: false,
};

export default Image;
