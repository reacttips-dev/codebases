import * as React from "react";
import * as PropTypes from "prop-types";
import { InjectableComponent } from "../InjectableComponent/InjectableComponent";
import SWReactRootComponent from "decorators/SWReactRootComponent";

@SWReactRootComponent
export class WidgetsSectionTitle extends InjectableComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        title: PropTypes.string,
        source: PropTypes.string,
    };

    static defaultProps = {
        title: "Title Placeholder",
        source: "",
    };

    render() {
        return (
            <div className="widgets-section-title u-full-width">
                {this.i18n(this.props.title)}
                <div className="divider"></div>
            </div>
        );
    }
}
