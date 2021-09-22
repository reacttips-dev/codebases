/**
 * Created by dannyr on 13/12/2016.
 */

import * as React from "react";
import * as PropTypes from "prop-types";

import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";
export class WaPositionTooltipContent extends InjectableComponentClass<
    { data: { Key: string; Value: number }[] },
    {}
> {
    static propTypes = {
        data: PropTypes.array,
    };

    static defaultProps = { data: [] };

    private chosenSites: any;

    constructor(props) {
        super(props);
        this.chosenSites = this.injector.get("chosenSites");
    }

    render() {
        let items = [];
        for (let i = 0; i < this.props.data.length; i++) {
            let item = this.props.data[i];
            let rank = item.Value;
            let site = item.Key;
            let hasRanks = rank !== -1;
            let color = this.chosenSites.getSiteColor(site);
            items.push(
                <div key={site} style={{ padding: "5px 0" }}>
                    <span
                        className="legend-item-circle"
                        style={{ background: color, marginRight: 5, verticalAlign: "middle" }}
                    />
                    <span
                        style={{
                            display: "inline-block",
                            width: "112px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            verticalAlign: "middle",
                            marginRight: "10px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {site}
                    </span>
                    <span style={{ float: "right" }}>{hasRanks ? rank : "-"}</span>
                </div>,
            );
        }
        return <div>{items}</div>;
    }
}
