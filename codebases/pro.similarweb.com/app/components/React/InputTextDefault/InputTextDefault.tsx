import * as classNames from "classnames";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as PropTypes from "prop-types";
import * as React from "react";
import { InputText } from "../InputText/InputText";
import { SWReactIcons } from "@similarweb/icons";

@SWReactRootComponent
export class InputTextDefault extends React.PureComponent<any, any> {
    public static propTypes = {
        placeholder: PropTypes.string,
        inputText: PropTypes.string,
        iconName: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };
    }

    public onFocus = () => {
        this.setState({ active: true });
    };

    public onBlur = () => {
        this.setState({ active: false });
    };

    public render() {
        return (
            <div className={classNames("input-text-default", { active: this.state.active })}>
                <InputText
                    placeholder={this.props.placeholder}
                    inputText={this.props.inputText}
                    onChange={this.props.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
                {this.props.iconName && (
                    <SWReactIcons
                        iconName={this.props.iconName}
                        className="input-text-field-icon"
                    />
                )}
            </div>
        );
    }
}
