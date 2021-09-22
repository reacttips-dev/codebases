import * as PropTypes from "prop-types";
import * as React from "react";
import { ReactNode } from "react";
import I18n from "../../Filters/I18n";
/**
 * Created by dannyr on 30/11/2016.
 */
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";

export class PlainTooltipContent extends InjectableComponentClass<
    { text: ReactNode; dangerouslySetInnerHTML: boolean },
    {}
> {
    public static propTypes = {
        text: PropTypes.node,
        dangerouslySetInnerHTML: PropTypes.bool,
    };

    public static defaultProps = {
        text: "MISSING_TEXT",
        dangerouslySetInnerHTML: false,
    };

    public render() {
        const { text } = this.props;
        if (typeof text === "string") {
            return (
                <div>
                    <I18n dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML}>
                        {this.props.text}
                    </I18n>
                </div>
            );
        }
        return <div>{this.props.text}</div>;
    }
}
