import { ChannelAnalysisGraphWidget } from "./ChannelAnalysisGraphWidget";
import { ChannelAnalysisExporterSearch } from "../../../exporters/ChannelAnalysisExporterSearch";

export class ChannelAnalysisGraphSearchWidget extends ChannelAnalysisGraphWidget {
    getToltipPointMarkup(point, options) {
        let isMobileWeb = this.apiParams.webSource === "MobileWeb";
        let isCompare = this._chosenSites.isCompare();
        let $filter = this._$filter;
        if (isMobileWeb) {
            if (point.value !== "NA") {
                return `<div>
                        <span class="item-marker" style="background: ${point.color}"></span>
                        <span class="item-name">${isCompare ? point.name : "Mobile Search"}
                            <span class="item-value" 
                                  style="margin-left:4px;color:${point.color};font-weight: bold;">
            ${$filter("noData")(
                $filter(options.tooltipFormat || options.format)(
                    point.value,
                    ...(options.formatParams || []),
                ),
                "^((00:00:00)|0|null|N\\/A)$",
                "NA",
            )}</span>
                        </span>
                    </div>`;
            } else {
                return "";
            }
        } else {
            return `<div>
                        <span class="item-marker" style="background: ${point.color}"></span>
                        <span class="item-name">${point.name}
                            <span class="item-value" style="margin-left:4px;color:${
                                point.color
                            };font-weight: bold;">${$filter("noData")(
                $filter(options.tooltipFormat || options.format)(
                    point.value,
                    ...(options.formatParams || []),
                ),
                "^((00:00:00)|0|null|N\\/A)$",
                "NA",
            )}</span>
                        </span>
                    </div>`;
        }
    }
    public getExporter() {
        return ChannelAnalysisExporterSearch;
    }
}

ChannelAnalysisGraphSearchWidget.register();
