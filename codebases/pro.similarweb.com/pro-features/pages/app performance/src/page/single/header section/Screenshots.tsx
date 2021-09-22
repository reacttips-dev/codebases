import * as React from "react";
import { PureComponent } from "react";
import Img from "react-image";
import WithTrack from "../../../../../../components/WithTrack/src/WithTrack";
import {
    EmptyScreenshot,
    Frames,
    HiddenImages,
    LandscapeFrame,
    PortraitFrame,
    Screenshot,
    Unknown,
} from "./StyledComponents";

export const FailedImg: any = () => (
    <EmptyScreenshot>
        <Unknown />
    </EmptyScreenshot>
);
FailedImg.displayName = "FailedImg";

export default class Screenshots extends PureComponent<any, any> {
    private maxFrames = 3;
    private images;
    private portraits = [];
    private landscapes = [];
    private loadedImgs = 0;

    constructor(props) {
        super(props);
        this.images = props.images;
        this.state = {
            appear: false,
            isLandscape: false,
        };
    }

    public render() {
        return (
            <WithTrack>
                {(track) => {
                    const { isLandscape } = this.state;
                    const Frame = isLandscape ? LandscapeFrame : PortraitFrame;
                    const items =
                        !this.images || !this.images.length
                            ? ["broken", "broken", "broken"]
                            : this.images;
                    const imgs =
                        items.length > this.maxFrames ? items.slice(0, this.maxFrames) : items;
                    const openSlider = () => {
                        // open slider
                        // track('pop up', 'open', 'app screen shot');
                    };

                    return (
                        <Frames
                            appear={this.state.appear}
                            isLandscape={isLandscape}
                            onClick={openSlider}
                        >
                            {imgs.map((img, idx, arr) => (
                                <Frame key={idx} zIndex={arr.length - idx + 1} index={idx}>
                                    <Screenshot data-automation-screenshot={idx + 1}>
                                        <Img src={[img]} unloader={FailedImg()} />
                                    </Screenshot>
                                </Frame>
                            ))}
                            {this.state.appear ? null : (
                                <HiddenImages>
                                    {this.images.map((hiddenSrc, idx) => (
                                        <img
                                            key={"h" + idx}
                                            src={hiddenSrc}
                                            onLoad={this.onImgLoad}
                                            onError={this.onImgError}
                                        />
                                    ))}
                                </HiddenImages>
                            )}
                        </Frames>
                    );
                }}
            </WithTrack>
        );
    }

    public onImgLoad = (e) => {
        const img = e.target;
        // mark each loaded-to-DOM image as landscape or portrait
        this.loadedImgs++;
        if (img.width > img.height) {
            this.landscapes.push(img.src);
        } else {
            this.portraits.push(img.src);
        }
        // show screenshots when all images has loaded
        if (this.loadedImgs === this.props.images.length) {
            this.showScreenshots();
        }
    };

    public onImgError = () => {
        this.loadedImgs++;
        // show screenshots when all images has loaded
        if (this.loadedImgs === this.props.images.length) {
            this.showScreenshots();
        }
    };

    public showScreenshots = () => {
        // determine whether to show landscapes or portraits only
        if (this.landscapes.length > this.portraits.length) {
            this.images = [];
            // put the first landscapes/portraits (as in app store)
            this.props.images.forEach((item) => {
                if (this.landscapes.indexOf(item) !== -1) {
                    this.images.push(item);
                }
            });
            this.setState({
                isLandscape: true,
                appear: true,
            });
        } else {
            this.setState({ appear: true });
        }
    };
}
