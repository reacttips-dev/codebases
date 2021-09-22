import * as React from "react";
import * as PropTypes from "prop-types";
import { Component } from "react";
import * as classNames from "classnames";
import SWReactRootComponent from "decorators/SWReactRootComponent";

@SWReactRootComponent
export class SwitchComponent extends Component<any, any> {
    constructor(props) {
        super(props);
        if (!("checked" in props)) {
            props.checked = !!props.defaultChecked;
        }
    }

    render() {
        const { prefixCls, checked, disabled, ...restProps } = this.props;
        const switchClassName = classNames({
            [`${prefixCls}-component`]: true,
            [`${prefixCls}-checked`]: checked,
            [`${prefixCls}-disabled`]: disabled,
        });
        return (
            <span
                {...restProps}
                className={switchClassName}
                tabIndex={disabled ? -1 : 0}
                ref="node"
                onClick={this.click.bind(this)}
            >
                <span className={`${prefixCls}-knob`}></span>
            </span>
        );
    }

    click() {
        return this.props.disabled ? () => {} : this.toggle();
    }

    toggle() {
        const checked = !this.props.checked;
        this.props.onChange(checked);
    }

    static propTypes = {
        prefixCls: PropTypes.string,
        disabled: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        checked: PropTypes.bool,
        defaultChecked: PropTypes.bool,
    };

    static defaultProps = {
        prefixCls: "sw-switch",
        defaultChecked: false,
    };
}
