import angular, { IRootScopeService } from "angular";
import { isHidden, isLocked } from "common/services/pageClaims";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { string } from "prop-types";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { ISwSettings } from "../../../@types/ISwSettings";
import { marketingWorkspaceApiService } from "../../../services/marketingWorkspaceApiService";
import { IWidgetKeyBase, IWidgetModel } from "../../widget/widget-types/Widget";
import { IDashboardService } from "../services/DashboardService";
import { getMetricProperties } from "../widget-wizard/utils/dashboardWizardUtils";
import { EFamilyTypes } from "./components/DashboardTemplatesConfig";
import DashboardTemplateGetter from "./StaticDashboardTemplateGetter";
import BlankDashboard from "./templates/BlankDashboard";
import { GridUtilities } from "./templates/GridUtilities";
import InvestorsWorkspaceApiService from "../../../services/workspaces/investorsWorkspaceApiService";
import SalesWorkspaceApiService from "../../../services/workspaces/salesWorkspaceApiService";
import swLog from "@similarweb/sw-log";
import { DurationService } from "services/DurationService";
import { periodOverPeriodService } from "services/PeriodOverPeriodService";

export interface widgetPos {
    sizeX: number;
    sizeY?: number;
    minSizeX?: number;
    maxSizeX?: number;
    maxSizeY?: number;
    row?: number;
    col?: number;
}

export interface IWidgetProperties {
    country: number;
    customAsset: boolean;
    dataModel: any;
    duration: string;
    family: string;
    filters: any;
    metric: string;
    key: Array<{
        name: string;
        image: string;
        type: string;
    }>;
    options: any;
    selectedChannel: string;
    type: string;
    webSource: string;
    width: number;
}

export interface IWidgetTemplate {
    pos: widgetPos;
    // TODO replace any
    properties: any;
    singleModeOnly?: boolean;
}

export interface IDashboardTemplateMetaData {
    id: string | number;
    title: string;
    thumbnailImage?: string;
    previewImage?: string;
    description: string;
    descriptionLong: string;
    keyMetrics: string;
    locked?: boolean;
    empty?: boolean;
    /*
     * isHidden
     * -- a flag to indicate if the template should be removed before rendering.
     * This is necessary for solutions 2.0 in order to filter out any templates
     * that contain widgets that are not available to new packages but still make
     * the template available to the legacy packages.
     * see SIM-32385
     */
    isHidden?: boolean;
    familyType: EFamilyTypes;
    sticky?: boolean;
    isNew?: boolean;
    maxItems: number;
    minItems: number;
    autocompleteDescription?: string;
    placeholderEmpty?: string;
    placeholderFull?: string;
}

export interface IDashboardTemplate extends IDashboardTemplateMetaData {
    widgets?: IWidgetTemplate[];
}

export enum EDashboardParentType {
    TEMPLATE = "Template",
    // WORKSPACE = "Workspace"
}

export enum EDashboardOriginType {
    INVESTORS_WORKSPACE = "InvestorsWorkspace",
    SALES_WORKSPACE = "SalesWorkspace",
    MARKETING_WORKSPACE_ARENA = "MarketingWorkspaceArena",
}

type dashboardTemplateGetter = () => Promise<IDashboardTemplate[]>;

const MAX_COLS = 4;

export interface IDashboardTemplateService {
    templates: IDashboardTemplate[];
    investorsApiService: InvestorsWorkspaceApiService;
    salesApiService: SalesWorkspaceApiService;
    saveDashboardTemplate(
        templates: IDashboardTemplate,
        parentType?: EDashboardParentType,
    ): Promise<any>;

    linkDashboardToOrigin(
        originType: EDashboardOriginType,
        originId: string,
        dashboardId: string,
    ): Promise<any>;

    generateDashboardTemplates(
        dashboardTemplateGetter: dashboardTemplateGetter,
    ): Promise<IDashboardTemplateMetaData[]>;

    getTemplateById(id: string | number): IDashboardTemplate;

    populateTemplate(
        keys: IWidgetKeyBase[],
        country: number,
        template: IDashboardTemplate,
    ): IDashboardTemplate;

    cloneTemplate(template: IDashboardTemplate): IDashboardTemplate;
}

class DashboardTemplateServiceClass implements IDashboardTemplateService {
    templates: IDashboardTemplate[];
    investorsApiService: InvestorsWorkspaceApiService;
    salesApiService: SalesWorkspaceApiService;

    constructor() {
        this.investorsApiService = new InvestorsWorkspaceApiService();
        this.salesApiService = new SalesWorkspaceApiService();
    }
    /**
     * Save dashboards to the DB
     * @param dashboards
     * @returns {IPromise<T> | IPromise<"angular".resource.IResourceArray<T>> | angular.IPromise<T[]> | any}
     */
    public saveDashboardTemplate(dashboard, parentType?: EDashboardParentType, parentId?: string) {
        const dashboardsJSON = {
            title: dashboard.title,
            widgets: dashboard.widgets.map((widget) => {
                return {
                    pos: JSON.stringify(_.omit(widget.pos, ["oldRow", "oldCol"])),
                    properties: JSON.stringify(widget.properties),
                };
            }),
            ParentId: parentId,
            ParentType: parentType,
        };
        return Injector.get<any>("dashboardService").bulkAddDashboards([dashboardsJSON]);
    }

    /**
     * A callback to be triggered after dashboard templated created, only if originType and originId was provided.
     * @param originType
     * @param originId
     * @param dashboardId
     */
    public linkDashboardToOrigin(
        originType: EDashboardOriginType,
        originId: string,
        dashboardId: string,
    ) {
        switch (originType) {
            case EDashboardOriginType.INVESTORS_WORKSPACE:
                return this.investorsApiService.linkInvestorsOpportunityListToDashboard(
                    originId,
                    dashboardId,
                );
            case EDashboardOriginType.SALES_WORKSPACE:
                return this.salesApiService.linkSalesOpportunityListToDashboard(
                    originId,
                    dashboardId,
                );
            case EDashboardOriginType.MARKETING_WORKSPACE_ARENA:
                return marketingWorkspaceApiService.linkDashboardToArena(dashboardId, originId);
        }
    }

    /**
     * Generates template based on templates from `dashboardTemplateGetter`.
     * @param {dashboardTemplateGetter} dashboardTemplateGetter
     * @returns {Promise<[any]>}
     */
    public async generateDashboardTemplates(
        dashboardTemplateGetter: dashboardTemplateGetter = DashboardTemplateGetter.getDashboardTemplates,
    ) {
        const rawTemplates = await this.loadDashboardTemplate(dashboardTemplateGetter);
        const templates = rawTemplates
            .filter((template) => !template.isHidden)
            .map((template) => {
                const clonedTemplate = { ...template };
                if (!this.validateDashboard(clonedTemplate)) {
                    clonedTemplate.locked = true;
                } else {
                    clonedTemplate.locked = false;
                }
                return clonedTemplate;
            });
        templates.unshift(BlankDashboard);
        return templates;
    }

    /**
     * Populate each widget in the template with country and key
     * @param {string[]} key
     * @param {number} country
     * @param {dashboardTemplate} template
     * @returns {dashboardTemplate}
     */
    public populateTemplate(keys: IWidgetKeyBase[], country: number, template: IDashboardTemplate) {
        const grid = GridUtilities.getGridInstance();
        const widgets = [];
        let newRowsCounter = 0;
        const filteredWidgets = this.filterByWebsource(template.widgets, country);
        filteredWidgets.forEach((widget, index) => {
            const copies = [];
            // const indexToPushCopies = index + _.result(widget, 'properties.multipleOffset', 0);
            widget.pos.sizeY = widget.pos.sizeY || 1;
            widget.properties.country = _.result(widget, "properties.fixedCountry", country);
            widget.properties.key = widget.singleModeOnly ? [keys[0]] : keys;
            // If pre defined title - set custom title template to prevent other services to manipulate the title
            if (widget.properties.title) {
                widget.properties.titleTemplate = "custom";
            }
            if (widget.properties.multiple && keys.length > 1) {
                const keysToAdd = widget.singleModeOnly ? keys.slice(1) : keys;
                keysToAdd.forEach((key, i) => {
                    // create a copy of the original widget and set the key to a single key
                    const copy = {
                        pos: {
                            ...widget.pos,
                            ..._.result(widget, "properties.multipleOverrides.pos", {}),
                            col: null,
                            row: null,
                        },
                        properties: {
                            ...widget.properties,
                            ..._.result(widget, "properties.multipleOverrides.properties", {}),
                        },
                    };
                    copy.properties.key = [key];
                    copies.push(copy);
                });
            }
            // push main widget to grid and to the widgets array
            grid.putItem(widget.pos, widget.pos.row + newRowsCounter, widget.pos.col);
            widgets.push(widget);

            // push copies
            _.forEach(copies, (copy) => {
                const currentRows = grid.grid.length;
                grid.putItem(copy.pos);
                // calculate if new rows were created
                newRowsCounter += grid.grid.length - currentRows;
                widgets.push(copy);
            });

            if (widget.properties.breakRowAfterCopies) {
                newRowsCounter++;
            }
        });

        GridUtilities.removeEmptyRows(grid);
        template.widgets = widgets;
        return template;
    }

    /**
     * Get a single template, include it's widgets
     * @param {string | number} id
     * @returns {any}
     */
    public getTemplateById(id: string | number) {
        const template = _.find<IDashboardTemplate>(this.templates, { id: id });
        return template;
    }

    /**
     * Validate if at least one widgets in the dashboard is invalid
     * @param dashboardTemplate
     * @returns {boolean}
     */
    private validateDashboard(dashboardTemplate) {
        const widgets = dashboardTemplate.widgets;
        return widgets.every((widget) => this.validateWidget(widget));
    }

    /**
     * Validate a single widget model
     * @param {IWidgetModel} widget
     * @returns {boolean}
     */
    private validateWidget(widget: any) {
        let isValid = true;

        const { metric, family, duration, flexibleDuration } = widget.properties;
        const metricProperties = getMetricProperties(metric, family);
        const comparedDuration = _.result(
            widget,
            "properties.multipleOverrides.properties.comparedDuration",
            false,
        );
        const componentId = metricProperties.component;

        const isComponentAllowed = swSettings.components[componentId].isAllowed;

        // This can override isComponentAllowed = true, causing this method to return isValid = false.
        const isWidgetAllowed =
            !isLocked(swSettings.components[metricProperties.availabilityComponent]) &&
            !isHidden(swSettings.components[metricProperties.availabilityComponent]);

        const isDurationAllowed = swSettings.allowedDuration(duration, componentId);
        const isCustomDurationAllowed = comparedDuration
            ? periodOverPeriodService.periodOverPeriodEnabled(
                  comparedDuration,
                  duration,
                  [{}],
                  componentId,
              )
            : true;

        if (!isCustomDurationAllowed) {
            widget.properties.multipleOverrides.properties.comparedDuration = "1m";
        }

        // currently validate that component is allowed, widget is allowed and duration is allowed
        if (!isDurationAllowed) {
            // change widget's duration to be the maximum the user has
            if (flexibleDuration) {
                // sim-30775: take the max duration the user have (from the presets)
                const presets = [...swSettings.components[componentId].datePickerPresets].reverse();
                const maxDurationAllowed = presets.find((preset) => !preset.locked).value;
                widget.properties.duration = maxDurationAllowed;
            } else {
                return false;
            }
        }
        if (!isComponentAllowed) {
            isValid = false;
        }
        if (!isWidgetAllowed) {
            isValid = false;
        }

        return isValid;
    }

    private async loadDashboardTemplate(
        dashboardTemplateGetter: dashboardTemplateGetter,
    ): Promise<IDashboardTemplate[]> {
        const rawDashboards = await dashboardTemplateGetter();
        this.templates = rawDashboards;
        return this.templates;
    }

    /**
     * remove widgets or change their websource from total to desktop if needed
     * @param {IWidgetTemplate[]} widgets
     * @param country
     * @returns {any[]}
     */
    private filterByWebsource(widgets: IWidgetTemplate[], country) {
        const result = [];
        const countryHasMobileWeb = swSettings.allowedCountry(country, "MobileWebSearch");
        const userHasMobileWeb = swSettings.components.MobileWeb.isAllowed;
        widgets.forEach((widget) => {
            if (!countryHasMobileWeb || !userHasMobileWeb) {
                if (widget.properties.mobileWebOnly) {
                    return;
                }
            }

            if (!countryHasMobileWeb) {
                this.handleCountryNoMobileWeb(widget);
            } else if (!userHasMobileWeb) {
                this.handleUserNoMobileWeb(widget);
            }

            result.push(widget);
        });

        return result;
    }

    private handleCountryNoMobileWeb(widget) {
        const webSource = widget.properties.webSource;
        if (webSource === "Total") {
            widget.properties.webSource = "Desktop";
            if (widget.properties.title) {
                widget.properties.title = widget.properties.title.replace("Total", "Desktop");
            }
        }
    }

    private handleUserNoMobileWeb(widget) {
        const webSource = widget.properties.webSource;
        if (webSource === "Desktop" && widget.properties.froWebSource) {
            widget.properties.webSource = widget.properties.froWebSource;
            widget.properties.title = widget.properties.title.replace(
                "Desktop",
                widget.properties.froWebSource,
            );
        }
    }

    public cloneTemplate(template: IDashboardTemplate) {
        return _.cloneDeep(template);
    }
}

export const DashboardTemplateService = new DashboardTemplateServiceClass();
