import { WidgetExporter } from "./WidgetExporter";
import { SOURCES_TEXT } from "components/widget/widget-types/Widget";
export class DemographicsBarChartExporter extends WidgetExporter {
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
        let isCompare = viewData.key.length > 1;

        let appHTML = isCompare
            ? ``
            : `<span style="font-size: 18px; padding-left: 24px; line-height: 32px; height: 32px; display: flex; align-items: center;">
                            <img style="display: inline-block;
                                        position:absolute;
                                        max-width: 32px; max-height: 32px; 
                                        line-height: 1;
                                        margin: 0;" 
                                            src="${icon}" />
                            <span style="display: inline-block;
                                        padding-left: 37px;
                                        max-width: 350px;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;">
                            ${app.name} | </span>
                        </span>`;

        return this.$q
            .resolve(`<div style="padding: 21px 24px; margin-bottom: 12px; border-bottom: 1px solid #e4e4e4; color: #2b3d52; font-family: 'Roboto', Tahoma, sans-serif; display: flex; align-items: center;">
                        <span style="font-size: 35px;">${widgetTitle}</span>
                        <span style="font-size: 18px; padding-left: 24px; display: flex; align-items: center;">
                            ${appHTML} ${store ? store : viewData.duration} | ${country}</span>
                    </div>`);
    }
}
