import angular from "angular";

import { SWWidget } from "../widget-types/widget.reg";
import { WidgetFactoryService } from "./WidgetFactoryService";

export const WidgetFactoryServiceAngular = new WidgetFactoryService(SWWidget);

angular.module("sw.common").factory("widgetFactoryService", () => WidgetFactoryServiceAngular);
