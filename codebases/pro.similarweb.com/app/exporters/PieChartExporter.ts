import { WidgetExporter } from "./WidgetExporter";
import { SOURCES_TEXT } from "components/widget/widget-types/Widget";
export class PieChartExporter extends WidgetExporter {
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
        let viewData = this.widget._viewData;
        let app = viewData.key[0];
        let icon = app.icon || app.image;
        let store = SOURCES_TEXT.apps[app.store];
        let country = viewData.country.text;
        let widgetTitle = viewData.title;
        let titleHTML = "";
        if (viewData.key.length > 1) {
            titleHTML = `<div style="padding: 21px 24px; margin-bottom: 12px; border-bottom: 1px solid #e4e4e4; color: #2b3d52; font-family: 'Roboto', Tahoma, sans-serif;">
                            <span style="font-size: 35px;">${widgetTitle}</span>
                            <span style="font-size: 16px; padding-left: 24px;letter-spacing: -1px;">${
                                store ? store : viewData.duration
                            } | ${country}</span>
                        </div>`;
        } else {
            titleHTML = `<div style="color: #2b3d52; font-family: 'Roboto', Tahoma, sans-serif;">
                            <div style="padding: 21px 24px;
                                    margin-bottom: 12px;
                                    border-bottom: 1px solid #e4e4e4;">     
                                <span style="font-size: 35px;">${widgetTitle}</span>
                            </div>
                            <div style="font-size: 16px; padding-left: 24px;letter-spacing: -1px;">
                                <img style="display: inline-block;max-width: 32px;max-height: 32px" src="${icon}" />
                                <span style="max-width: 350px;
                                            overflow: hidden;
                                            white-space: nowrap;
                                            text-overflow: ellipsis;">${app.name} | </span>
                                <span style="font-size: 16px; ">${
                                    store ? store : viewData.duration
                                } | ${country}</span>
                            </div>
                        </div>`;
        }
        return this.$q.resolve(titleHTML);
    }
}
