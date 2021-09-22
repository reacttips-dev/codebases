/**
 * Created by dannyr on 13/12/2016.
 */

import * as React from "react";
import * as PropTypes from "prop-types";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";
import { WaSearchUrlTooltipContent } from "./WaSearchUrlTooltipContent";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";

export class WaSearchUrlTooltip extends InjectableComponentClass<
    { data: { Key: string; Value: string }[] },
    {}
> {
    static propTypes = {
        data: PropTypes.array,
    };

    static defaultProps = { data: [] };

    render() {
        return (
            <PopupHoverContainer
                content={() => <WaSearchUrlTooltipContent data={this.props.data} />}
                config={{ enabled: true, placement: "left", allowHover: true, closeDelay: 0 }}
            >
                {this.props.children}
            </PopupHoverContainer>
        );
    }
}
