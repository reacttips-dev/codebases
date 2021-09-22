import { SOURCES_TEXT } from "components/widget/widget-types/Widget";
import { i18nFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import { PNG_WIDTH } from "./IPngExport";
import { WidgetExporter } from "./WidgetExporter";

export class AppEngagementOverviewExporter extends WidgetExporter {
    constructor(
        userResource,
        $window,
        widget,
        _$widgetElement,
        $q,
        $timeout,
        chosenSites,
        $filter,
        exportOptions,
        utility,
    ) {
        super(
            userResource,
            $window,
            widget,
            _$widgetElement,
            $q,
            $timeout,
            chosenSites,
            $filter,
            exportOptions,
            utility,
        );
    }

    public getTitleHTML() {
        const { viewData, webSource, tabsConfig, activeTab } = this.widget;
        const tab = tabsConfig[activeTab];
        const title = i18nFilter()((tab.getTitle && tab.getTitle()) || tab.title); // Take png title from tabsConfig in widget
        const source = SOURCES_TEXT.websites[webSource];
        const duration = viewData.duration;
        const country = viewData.country.text;

        return this.$q.resolve(
            `<div style="padding: 21px 24px; margin-bottom: 12px; border-bottom: 1px solid #e4e4e4; color: #2b3d52; font-family: 'Roboto', Tahoma, sans-serif;">
                <span style="font-size: 35px;">${title}</span>
                <span style="font-size: 18px; padding-left: 24px;">
                    ${duration ? duration : ""} ${country ? " | " + country : ""} ${
                source ? " | " + source : ""
            }
                </span>
            </div>
        `,
        );
    }

    protected init() {
        this._$parent = this._$widgetElement.parent();
        this.lockParentHeight();
        const origWidth = this._$widgetElement.css("width");
        const origPadding = this._$widgetElement.css("padding");
        // set original widget to a fixed width of a PNG file
        this._$widgetElement.css("width", this.exportOptions.pngWidth || PNG_WIDTH);
        this._$widgetElement.css("padding", "20px");
        this._$widgetElement.find(".chartContainer").children(":first").highcharts().reflow();
        // copy the original widget after the "resize" (in order to send it to the png server)
        this._$clonedWidgetElement = this._$widgetElement.clone();
        // hide it & append it to the dom
        this._$clonedWidgetElement.hide();
        $("body").append(this._$clonedWidgetElement);
        // revert the changes of the original widget to it's original state
        this._$widgetElement.css("width", origWidth);
        this._$widgetElement.css("padding", origPadding);
        this._$widgetElement.find(".chartContainer").children(":first").highcharts().reflow();
    }

    protected getFileName() {
        const { tabsConfig, activeTab } = this.widget;
        const duration = DurationService.getDurationData(this.widget._params.duration).forAPI;
        const tab = tabsConfig[activeTab];
        const title = i18nFilter()((tab.getTitle && tab.getTitle()) || tab.title); // Take png title from tabsConfig in widget

        return `${title} (${duration.from + "_" + duration.to})`;
    }

    protected getBody() {
        return this.$q
            .all([this.getTitleHTML(), this.getWidgetHTML()])
            .then(([titleHTML, widgetHTML]) => {
                return `
                    <div>
                        ${titleHTML}
                        ${widgetHTML}
                    </div>
            `;
            });
    }
}
