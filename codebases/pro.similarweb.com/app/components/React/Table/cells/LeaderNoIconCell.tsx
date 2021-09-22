import * as React from "react";
import * as classNames from "classnames";

import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";
import { dynamicFilterFilter } from "filters/dynamicFilter";
export class LeaderNoIconCell extends InjectableComponent {
    private dynamicFilter: any;

    constructor(props, context) {
        super(props, context);
        this.dynamicFilter = dynamicFilterFilter();
    }

    render() {
        const { value, format } = this.props,
            realValue = value["Value"],
            classes = classNames("value", "no-leader-icon-offset");

        return (
            <div className="leader-cell">
                <span className={classes}>
                    {realValue === null ? "N/A" : this.dynamicFilter(realValue, format)}
                </span>
                {this.props.GAVerifiedIcon}
            </div>
        );
    }
}
