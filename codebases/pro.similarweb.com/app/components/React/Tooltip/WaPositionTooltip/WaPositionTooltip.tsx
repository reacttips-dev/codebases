/**
 * Created by dannyr on 13/12/2016.
 */

import * as React from "react";
import * as PropTypes from "prop-types";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { WaPositionTooltipContent } from "../WaPositionTooltip/WaPositionTooltipContent";
export class WaPositionTooltip extends InjectableComponentClass<
    { data: { Key: string; Value: number }[] },
    {}
> {
    static propTypes = {
        data: PropTypes.array,
    };

    static defaultProps = { data: [] };

    render() {
        return (
            <PopupHoverContainer
                content={() => <WaPositionTooltipContent data={this.props.data} />}
                config={{ enabled: true, placement: "left", width: 184 }}
            >
                {this.props.children}
            </PopupHoverContainer>
        );
    }
}
