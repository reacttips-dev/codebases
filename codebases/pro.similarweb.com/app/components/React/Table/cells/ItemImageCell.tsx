import { dynamicFilterFilter } from "filters/dynamicFilter";
import * as React from "react";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";
import { UpgradeLink } from "./UpgradeLink";

export class ItemImageCell extends InjectableComponent {
    private dynamicFilter: any;

    constructor(props, context) {
        super(props, context);
        this.dynamicFilter = dynamicFilterFilter();
    }

    render() {
        const { value, row, tableOptions, tableMetadata, format = "None" } = this.props;
        const template = (
            <div>
                <img src={row.Icon || row.Favicon} className="favicon icon-text-margin" />
                {this.dynamicFilter(value, format)}
            </div>
        );
        const upgradeTemplate = <UpgradeLink />;
        return value === "grid.upgrade" ? upgradeTemplate : template;
    }
}
