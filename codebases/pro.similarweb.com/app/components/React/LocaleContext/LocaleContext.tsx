import * as React from "react";
import * as PropTypes from "prop-types";
import { ReactElement } from "react";

declare var window;

class LocaleContext extends React.Component<any, any> {
    static childContextTypes = {
        translateFn: PropTypes.func,
    };

    getChildContext() {
        return {
            translateFn: window.i18n.t,
        };
    }

    render() {
        return React.cloneElement(React.Children.only(this.props.children as ReactElement), {
            ...this.props,
        });
    }
}

export default LocaleContext;
