import * as PropTypes from "prop-types";
import React, { Component } from "react";

export default class LinkProvider extends Component<any, any> {
    public static childContextTypes = {
        linkFn: PropTypes.any.isRequired,
    };

    public static propTypes = {
        linkFn: PropTypes.any.isRequired,
    };

    public render() {
        return this.props.children;
    }

    public getChildContext() {
        return {
            linkFn: this.props.linkFn,
        };
    }
}
