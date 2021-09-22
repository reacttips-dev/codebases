import * as React from "react";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { CHART_COLORS } from "constants/ChartColors";
import { dynamicFilterFilter } from "filters/dynamicFilter";

export class CompareProgressbar extends InjectableComponent {
    private dynamicFilter: any;

    constructor(props, context) {
        super(props, context);
        this.dynamicFilter = dynamicFilterFilter();
    }

    render() {
        const { value, row, rowIndex, format, tableOptions } = this.props,
            innerColor = CHART_COLORS[tableOptions.colorSource][rowIndex];
        let key, share, width;

        // to fit all kinds of modules (app analysis/web analysis etc.) e.g: "ShareOfVisits" / "ShareOfDownloads" ...
        for (key in row) {
            if (/ShareOf/.test(key)) {
                share = row[key];
            }
        }
        width = share ? share * 100 : 0;

        return (
            <div className="swTable-progressBar">
                <div className="u-full-width">
                    <ProgressBar width={width} innerColor={innerColor} isCompare={false} />
                </div>
                <div className="compare-progress-value value u-alignRight">
                    {this.dynamicFilter(value, format)}
                </div>
                {this.props.GAVerifiedIcon}
            </div>
        );
    }
}
