import { WidgetExporter } from "./WidgetExporter";
import { Injector } from "common/ioc/Injector";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export class KeywordAnalysisShareOverTimeExporter extends WidgetExporter {
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

    protected getTitleHTML() {
        let { viewData } = this.widget;
        let duration = viewData.duration;
        let country = viewData.country.text;
        let { keys: keyword } = this.widget.apiParams;
        const group = keywordsGroupsService.findGroupById(keyword);
        if (group) {
            keyword = `Group '${group.Name}'`;
        } else {
            keyword = `Keyword '${keyword}'`;
        }
        const context = this.widget.context.split(".")[1];
        let source;
        switch (context) {
            case "total":
                source = "Total traffic";
                break;
            case "organic":
                source = "Organic Only";
                break;
            case "paid":
                source = "Paid Only";
                break;
            case "mobileweb":
                source = "Mobile Web Only";
                break;
        }
        return this.$q
            .resolve(`<div style="padding: 21px 24px; margin-bottom: 12px; border-bottom: 1px solid #e4e4e4; color: #2b3d52; font-family: 'Roboto', Tahoma, sans-serif;">
                        <span style="font-size: 35px;">${viewData.title}</span>
                        <span style="font-size: 18px; padding-left: 24px;">${duration} | ${country} | ${source} | ${keyword}</span>
                    </div>`);
    }
}
