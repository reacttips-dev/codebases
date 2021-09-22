import { WidgetExporter } from "./WidgetExporter";
import { SOURCES_TEXT } from "components/widget/widget-types/Widget";

export class MmxBarChartExporter extends WidgetExporter {
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
        let { viewData, webSource } = this.widget;
        let source = SOURCES_TEXT.websites[webSource];
        let { displayName, icon } = this.chosenSites.getPrimarySite(),
            metricDisplayName = this.$filter("i18n")(this.utility.properties.metricDisplayName);
        if (!this.chosenSites.isCompare()) {
            return this.$q.resolve(`
                    <div style="padding: 21px 24px; margin-bottom: 12px; border-bottom: 1px solid #e4e4e4; color: #2b3d52; font-family: 'Roboto', Tahoma, sans-serif;">
                     <span style="font-size: 35px;margin:12px;">${viewData.title}</span>
                       <span style="padding-left: 10px;">
                            <img src="${icon}" style="position:relative;top:-5px;margin-right:2px;" /> 
                            <span style="font-size: 18px;display: inline-block;max-width: 350px;text-overflow:ellipsis;">
                            ${displayName}
                       </span>
                     </span>
                     <span style="font-size: 18px;"> | ${viewData.duration} | ${viewData.country.text} | ${source}</span>
                    </div>`);
        } else {
            return this.$q.resolve(`
                    <div style="padding: 21px 24px; margin-bottom: 12px; border-bottom: 1px solid #e4e4e4; color: #2b3d52; font-family: 'Roboto', Tahoma, sans-serif;">
                         <span style="font-size: 35px;margin:12px;">${viewData.title}</span>
                         <span style="font-size: 18px;"> | ${viewData.duration} | ${viewData.country.text} | ${source}</span>
                    </div>`);
        }
    }
}
