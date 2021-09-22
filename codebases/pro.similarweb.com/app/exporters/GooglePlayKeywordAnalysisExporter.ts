import { WidgetExporter } from "./WidgetExporter";
import { SOURCES_TEXT } from "components/widget/widget-types/Widget";
export class GooglePlayKeywordAnalysisExporter extends WidgetExporter {
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

    getTitleHTML() {
        let { viewData, webSource } = this.widget;
        let source = SOURCES_TEXT.websites[webSource];
        let duration = this.$filter("i18n")("googleplaykeyword.analysis.graph.png.title");
        let country = viewData.country.text;

        return this.$q
            .resolve(`<div style="padding: 21px 24px; margin-bottom: 12px; border-bottom: 1px solid #e4e4e4; color: #2b3d52; font-family: 'Roboto', Tahoma, sans-serif;">
                        <span style="font-size: 35px;">${viewData.title}</span>
                        <span style="font-size: 18px; padding-left: 24px;">${
                            duration ? duration : ""
                        } ${country ? " | " + country : ""} ${source ? " | " + source : ""}</span>
                    </div>`);
    }
}
