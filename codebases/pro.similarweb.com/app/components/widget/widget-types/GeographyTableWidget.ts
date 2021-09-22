import { TableWidget } from "./TableWidget";
/**
 * Created by liorb on 2/12/2017.
 */
export class GeographyTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "Table";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
    }

    getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        widgetModel.metric = "Geography";
        return widgetModel;
    }

    getProperties() {
        let props = super.getProperties();
        props.metric = "Geography";
        return props;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}

GeographyTableWidget.register();
