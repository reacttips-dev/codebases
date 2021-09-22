import * as React from "react";
import { InjectableComponent } from "../InjectableComponent/InjectableComponent";

export class ScrollContainer extends InjectableComponent {
    private $scrollContainer: any;
    private nanoSettings: any;

    constructor(props) {
        super(props);
        this.nanoSettings = {
            nanoClass: "sw-scroller",
            contentClass: "sw-scroller-content",
            paneClass: "sw-scroller-pane",
            sliderClass: "sw-scroller-slider",
        };
    }

    componentDidMount() {
        this.$scrollContainer.nanoScroller(this.nanoSettings);
    }

    componentDidUpdate() {
        this.$scrollContainer.nanoScroller(this.nanoSettings);
    }

    componentWillUnmount() {
        this.$scrollContainer.nanoScroller({ destroy: true });
    }

    update() {
        this.$scrollContainer.nanoScroller(this.nanoSettings);
    }

    render() {
        return (
            <div
                ref={(el) => (this.$scrollContainer = $(el))}
                {...this.props}
                className="sw-scroller"
            >
                <div className="sw-scroller-content">{this.props.children} </div>
            </div>
        );
    }
}
