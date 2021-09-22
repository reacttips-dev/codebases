import { dynamicFilterFilter } from "filters/dynamicFilter";
import * as React from "react";

import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";
export class TablePieCell extends InjectableComponent {
    private dynamicFilter: any;
    private chosenSites: any;

    constructor(props, context) {
        super(props, context);
        this.dynamicFilter = dynamicFilterFilter();
        this.chosenSites = this.injector.get("chosenSites");
    }

    render() {
        const { value, row, rowIndex, format, tableOptions } = this.props,
            innerColor = this.chosenSites.getSiteColor(row.Domain);
        return (
            <div>
                <div
                    className="compare-progress-value value u-alignRight"
                    style={{ color: innerColor }}
                >
                    {this.dynamicFilter(value, format)}
                </div>
            </div>
        );
    }
}
