import { ChannelAnalysisExporter } from "./ChannelAnalysisExporter";
export class ChannelAnalysisExporterSearch extends ChannelAnalysisExporter {
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
    getSelectedChannel() {
        return this.widget._widgetConfig.properties.engagementControllerState.selectedChannel;
    }
}
