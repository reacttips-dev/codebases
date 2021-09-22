import * as React from "react";
import * as ReactDOM from "react-dom";
import Slider, {Settings} from "react-slick";

interface Props {
    // https://react-slick.neostack.com/docs/api/
    settings: Settings;
    className?: string;
    isMobileApp?: boolean;
    focusOnSelect?: boolean;
    content: JSX.Element[];
    asNavFor?: Slider;
    forwardedRef?: React.RefObject<Slider | undefined>;
}

export class SlideShow extends React.Component<Props> {
    private touchStartPositionX = 0;
    private touchMovePositionX = 0;
    private slider: Slider | null;

    public constructor(props) {
        super(props);
        this.slider = props.forwardedRef || React.createRef<Slider>();
    }

    public render() {
        const {isMobileApp, content, className, focusOnSelect, asNavFor} = this.props;
        let {settings} = this.props;

        settings = {
            ...settings,
            lazyLoad: !!this.props.settings.lazyLoad ? "progressive" : "ondemand",
            onSwipe: isMobileApp && this.onSwipe,
        };

        return (
            <Slider
                className={className}
                focusOnSelect={focusOnSelect}
                asNavFor={asNavFor}
                ref={this.slider}
                {...settings}>
                {content}
            </Slider>
        );
    }

    public componentDidMount() {
        const node = ReactDOM.findDOMNode(this);
        node.addEventListener("touchstart", this.onTouchStart);
        node.addEventListener("touchmove", this.onTouchMove, {passive: false});
    }

    public componentWillUnmount() {
        const node = ReactDOM.findDOMNode(this);
        node.removeEventListener("touchstart", this.onTouchStart);
        node.removeEventListener("touchmove", this.onTouchMove);
    }

    private onSwipe = () => {
        if (this.slider) {
            this.slider.innerSlider.clickable = true;
        }
    };

    private onTouchStart(e) {
        this.touchStartPositionX = e.touches[0].clientX;
    }

    private onTouchMove(e) {
        const minValue = 20;
        this.touchMovePositionX = e.touches[0].clientX - this.touchStartPositionX;
        if (Math.abs(this.touchMovePositionX) > minValue && e.cancelable) {
            e.preventDefault();
            return false;
        }
    }
}

export default SlideShow;
