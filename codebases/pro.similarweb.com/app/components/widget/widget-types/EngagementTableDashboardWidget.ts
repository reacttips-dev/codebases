import { TableWidget } from "./TableWidget";

export class EngagementTableDashboardWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "EngagementTableDashboard";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getWidgetDashboardType() {
        return "Table";
    }

    constructor() {
        super();
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        const webSource = this.getWidgetModel().webSource;
        switch (webSource) {
            case "Total":
                break;
            default:
                this.data.Records = this.data.Records.map((record) => {
                    if (record.Source === webSource) {
                        return record;
                    }
                }).filter((record) => record !== undefined);
                break;
        }
    }
}

EngagementTableDashboardWidget.register();
