import * as PropTypes from "prop-types";
import React, { Component } from "react";

export default class ComponentsProvider extends Component<any, any> {
    public static childContextTypes = {
        components: PropTypes.object.isRequired,
    };
    public static propTypes = {
        components: PropTypes.object.isRequired,
    };

    public render() {
        return this.props.children;
    }

    public getChildContext() {
        return {
            components: this.props.components,
        };
    }
}
