import React, { Component } from "react";
import * as PropTypes from "prop-types";
import autobind from "autobind-decorator";
import layoutConfiguration from "../../layout/layoutConfiguration";

export default class ScrollListener extends Component<any, any> {
    private scrollElement: Element = null;
    componentDidMount() {
        const {
            scrollElement = document.querySelector(`.${layoutConfiguration.pageScroller}`),
        } = this.props;
        this.scrollElement = scrollElement;
        this.scrollElement.addEventListener("scroll", this.onScroll, { capture: true });
    }

    componentWillUnmount() {
        this.scrollElement.removeEventListener("scroll", this.onScroll, { capture: true });
    }
    @autobind
    onScroll(event) {
        const { scrollElement } = this;
        const { threshold, onThresholdReached } = this.props;
        const maxScrollLength = scrollElement.scrollHeight - scrollElement.clientHeight;
        const scrollTop = scrollElement.scrollTop;
        const delta = maxScrollLength - scrollTop;
        if (delta <= threshold) {
            // we've reached the threshold...
            onThresholdReached(delta);
        }
    }
    render() {
        return this.props.children;
    }

    static propTypes = {
        threshold: PropTypes.number.isRequired,
        onThresholdReached: PropTypes.func.isRequired,
        scrollElement: PropTypes.node,
    };
}
