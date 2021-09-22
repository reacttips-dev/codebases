import { SWReactIcons } from "@similarweb/icons";
import * as classNames from "classnames";
import { dynamicFilterFilter } from "filters/dynamicFilter";
import * as React from "react";
import styled from "styled-components";

export const WinnerIcon: any = styled(SWReactIcons)`
    height: 1em;
    width: 1em;
    margin-right: 5px;
`;
WinnerIcon.displayName = "WinnerIcon";

import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";

export class LeaderDefaultCell extends InjectableComponent {
    private dynamicFilter: any;
    constructor(props, context) {
        super(props, context);
        this.dynamicFilter = dynamicFilterFilter();
    }

    render() {
        const { value, format } = this.props,
            realValue = value["Value"],
            isLeader = value["IsLeader"],
            cellFormat = format ? format : value?.format,
            classes = classNames(
                "u-flex-row value",
                isLeader ? "value--leader" : "no-leader-icon-offset",
            );

        return (
            <div className="leader-cell">
                <span className={classes}>
                    {isLeader ? <WinnerIcon iconName="winner" /> : null}
                    {realValue === null ? "N/A" : this.dynamicFilter(realValue, cellFormat)}
                </span>
                {this.props.GAVerifiedIcon}
            </div>
        );
    }
}
