import { ChannelAnalysisExporter } from "./ChannelAnalysisExporter";
import { SOURCES_TEXT } from "../components/widget/widget-types/Widget";
export class PlaExporter extends ChannelAnalysisExporter {
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
    getTitleAndSubtitleStrings() {
        const { viewData, webSource } = this.widget;
        const source = SOURCES_TEXT.websites[webSource];
        const { title } = viewData;
        let subTitle = ` | ${viewData.duration} | ${viewData.country.text} | ${source}`;
        if (this.chosenSites.isCompare()) {
            const channelName = this.getSelectedChannel();
            subTitle += ` | ${channelName}`;
        }
        return {
            title,
            subTitle,
        };
    }
}
