import { dynamicFilterFilter } from "filters/dynamicFilter";
import * as React from "react";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
export class SubcategoriesShare extends InjectableComponent {
    private dynamicFilter: any;

    constructor(props, context) {
        super(props, context);
        this.dynamicFilter = dynamicFilterFilter();
    }

    render() {
        const { value, row, format } = this.props;
        const width = row.ShareOfVisits ? row.ShareOfVisits * 100 : 0;
        return (
            <div className="swTable-progressBar">
                <ProgressBar width={width} />
                <span className="min-value">{this.dynamicFilter(value, format)}</span>
            </div>
        );
    }
}
