import { dynamicFilterFilter } from "filters/dynamicFilter";
import { noDataFilter } from "filters/ngFilters";
import * as React from "react";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";
import { UpgradeLink } from "./UpgradeLink";

export class DefaultCell extends InjectableComponent {
    private dynamicFilter: any;
    private noData: any;

    constructor(props, context) {
        super(props, context);
        this.dynamicFilter = dynamicFilterFilter();
        this.noData = noDataFilter();
    }

    public render() {
        let { value } = this.props;
        const {
            format,
            formatParams = [],
            dangerouslySetInnerHTML,
            tableMetadata,
            tableOptions,
            className,
        } = this.props;
        if (format) {
            value = this.dynamicFilter(value, format);
        }
        value = this.noData(value, "^\\s*n\\/a\\s*$", "-");
        if (value !== "grid.upgrade") {
            return dangerouslySetInnerHTML ? (
                <div
                    className={`cell-innerText ${className}`}
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            ) : (
                <div className={`cell-innerText ${className}`}>{value}</div>
            );
        } else {
            return <UpgradeLink hookType={this.props.hookType} />;
        }
    }
}
