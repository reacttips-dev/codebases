/**
 * Created by dannyr on 13/12/2016.
 */

import * as React from "react";
import * as PropTypes from "prop-types";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";

export class WaSearchUrlTooltipContent extends InjectableComponentClass<
    { data: { Key: string; Value: string }[] },
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

    private getOutsideLink(item) {
        if (item.Value.indexOf("http") === 0) {
            return item.Value;
        } else {
            return "http://" + item.Value;
        }
    }

    render() {
        let items = [];
        for (let i = 0; i < this.props.data.length; i++) {
            let item = this.props.data[i];
            let url = item.Value;
            let site = item.Key;
            let hasValue = item.Value.toLowerCase() !== "n/a";
            let isFirst = i == 0;
            let isLast = i == this.props.data.length - 1;
            let color = this.chosenSites.getSiteColor(site);
            let padding = isFirst ? "0 0 10px 0" : isLast ? "10px 0 0 0" : "10px 0";
            items.push(
                <div
                    key={item.Key}
                    style={{
                        borderBottom: !isLast ? "2px solid #F8F8F8" : "none",
                        padding: padding,
                    }}
                >
                    <div style={{ verticalAlign: "top", display: "inline-block" }}>
                        <span
                            className="legend-item-circle"
                            style={{ background: color, marginRight: 5 }}
                        />
                        <span
                            style={{
                                display: "inline-block",
                                width: "120px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                verticalAlign: "bottom",
                                marginRight: "10px",
                            }}
                        >
                            {item.Key}
                        </span>
                    </div>
                    {hasValue ? (
                        <span className="tooltip-link">
                            {item.Value}
                            <a
                                className="swTable-linkOut sw-link-out"
                                href={this.getOutsideLink(item)}
                                target="_blank"
                            />
                        </span>
                    ) : (
                        <span className="tooltip-link"> - </span>
                    )}
                </div>,
            );
        }
        return <div>{items}</div>;
    }
}
