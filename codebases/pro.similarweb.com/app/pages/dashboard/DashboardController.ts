/* eslint-disable prefer-const */
import swLog from "@similarweb/sw-log";
import { showSuccessToast } from "actions/toast_actions.ts";
import angular from "angular";
import { dashboardWizardNewWidget } from "components/dashboard/widget-wizard/actions/dashboardWizardActionCreators";
import { emptyWidget, IWidget, WidgetState } from "components/widget/widget-types/Widget";
import * as _ from "lodash";
import * as screenfull from "screenfull";
import { allTrackers } from "services/track/track";
import { ShareDashboardType } from "../../../.pro-features/components/Dashboard/SharedDashboardModal";
import DashboardSpy from "../../components/dashboard/widget-wizard/tests/DashboardSpy";
import { getToastItemComponent } from "../../components/React/Toast/ToastItem";
import { i18nFilter } from "../../filters/ngFilters";
import { hideIntercom } from "../../services/IntercomService";
import { setSharedWithMeDashboards } from "./DashboardSideNavActions";
import DashboardSubscriptionService from "./DashboardSubscriptionService";
import { GridsterService } from "./gridster/GridsterService";
import { ShareDashboardService } from "./ShareDashboardService";
import { swSettings } from "common/services/swSettings";
import { IAccountUser } from "sharing/SharingService";
import { IPptExportService, PptExportService } from "services/PptExportService/PptExportService";
import { IPptExportRequest } from "services/PptExportService/PptExportServiceTypes";
import { IDashboardExportListItem } from "components/Dashboard/DashboardPptExportModal/DashboardPptExportModalTypes";
import {
    getWidgetSubtitleForModal,
    getWidgetTitle,
} from "components/widget/widget-utilities/widgetPpt/PptWidgetUtils";
import { PdfExportService } from "services/PdfExportService";
import { gridsterPreferences } from "./gridster/gridster.preferences";
import { SwTrack } from "services/SwTrack";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

/**
 * Created by vlads on 21/1/2016.
 */

class DashboardController {
    private _dashboard: any;
    private _waitInterval: any;
    private _lastSavedLayout: any;
    private _presentationInterval: any;
    private _presentationHeightElements = [];
    public isPresentationMode = false;
    public addWidgetBtnText: string;
    public newWidget: any;
    public editableTitle: string;
    public isEdited: boolean;
    public titleWidth: number;
    public initialWidth: number | string;
    public headerWidthTimer = 0;
    public gridster: GridsterService;
    public _GridsterServiceFactory: any;
    public dashboardId: any;
    public _widgetsOrigin: any;
    public screens = 0;
    public currentScreen = 0;
    public isWizardOpen = false;
    public selectedWidget: any;
    public byteArrayToBase64: (arraybuffer: any) => string;
    public base64string = "";
    public userCountries: any[];
    public userDurations: any[];
    public userWebsources: any[];
    public globalChangeCountry: (countryId: number) => void;
    public globalChangeDuration: (durationId: any) => void;
    public globalChangeWebsource: (durationId: any) => void;
    public showGlobalFilters: boolean;
    public isWebsitesSidebarOpen: boolean;
    public shareDashboardOpen: boolean;
    public shareDashboardStep = 0;
    public dashboardOwnerName: string;
    public dashboardViewers: IAccountUser[];
    public loading: boolean;
    public isSharingEnabled: boolean;
    public isDuplicatingEnabled: boolean;
    public isSubscriptionOn: boolean;
    public isNotificationAllowed: boolean;
    public selectedShareDashboardType: ShareDashboardType;
    private pptExportService: IPptExportService;
    public isPptExportModalOpen: boolean;
    public widgetsForPptModal: IDashboardExportListItem[];
    public dashboardRelatedWorkspace:
        | { workspaceId: string; opportunityListId: string; workspaceType: string }
        | boolean = false;
    public getLink: any;
    public allTrackers: any;

    // PPT/PDF Loader details
    public isExportLoading: boolean;
    public exportLoaderTitle: string;
    public exportLoaderSubtitle: string;

    public static $inject = [
        "$scope",
        "$q",
        "$modal",
        "$filter",
        "$timeout",
        "swNavigator",
        "dashboardService",
        "GridsterServiceFactory",
        "$window",
        "$swNgRedux",
        "navigationScrollService",
    ];
    private i18nFilter: (
        key: string,
        obj?: any,
        defaultValue?: string,
    ) => string | (string & (string | undefined));
    constructor(
        private _$scope: any,
        private _$q: any,
        private _$modal: any,
        private _$filter: any,
        private _$timeout: any,
        private swNavigator: any,
        private _dashboardService: any,
        private GridsterServiceFactory: any,
        private _$window: any,
        private $swNgRedux,
        private navigationScrollService,
    ) {
        this.pptExportService = new PptExportService();
        this.dashboardId = this.swNavigator.getParams().dashboardId;
        this.loading = true;
        this.allTrackers = allTrackers.trackEvent.bind(allTrackers);
        this.i18nFilter = i18nFilter();
        this.getLink = this.swNavigator.href.bind(this.swNavigator);
        this.isSharingEnabled = swSettings.components.ShareDashboard.resources.CanShareADashboard;
        this.isDuplicatingEnabled =
            swSettings.components.Dashboard.resources.CanDuplicateADashboard;
        const unsubscribeFromStore = this.$swNgRedux.connect(
            ({ customDashboard: { dashboardSideNav } }) => {
                return dashboardSideNav;
            },
        )(({ navList, navListLoaded }) => {
            if (navListLoaded === true) {
                const dashboardIdNotFound = !angular.isDefined(
                    this._dashboardService.getDashboardById(this.dashboardId),
                );
                if (dashboardIdNotFound) {
                    if (this._dashboardService.dashboards.length > 0) {
                        swNavigator.go("dashboard-exist", {
                            dashboardId: this._dashboardService.getFirstDashboard().id,
                        });
                    } else {
                        swNavigator.go("dashboard-new");
                    }
                } else {
                    if (!this.dashboard) {
                        this.init();
                    }
                    this.loading = false;
                }
            }
        });

        this._$scope.$on("$destroy", () => {
            unsubscribeFromStore();
        });
        this._dashboardService
            .getDashboardRelatedWorkspace({ dashboardId: this.dashboardId })
            .then((response) => {
                if (response) {
                    this.dashboardRelatedWorkspace = response.data;
                }
            });
    }

    private init() {
        this.isExportLoading = false;
        this.exportLoaderTitle = "";
        this.exportLoaderSubtitle = "";
        this.isPptExportModalOpen = false;

        //Fixes the function binding to react component.
        this.gridScrollTo = this.gridScrollTo.bind(this);
        this.userCountries = this.getUserCountries("Home");
        this.userDurations = [
            { id: "-1", text: "Select" },
            { id: "28d", text: "28d" },
            { id: "1m", text: "1m" },
            { id: "3m", text: "3m" },
            { id: "6m", text: "6m" },
            { id: "12m", text: "12m" },
            { id: "18m", text: "18m" },
            { id: "24m", text: "24m" },
        ];
        this.userWebsources = [
            { id: "-1", text: "Select" },
            { id: "Total", text: "Total" },
            { id: "Desktop", text: "Desktop" },
            { id: "MobileWeb", text: "MobileWeb" },
        ];
        this._$scope.DashboardSpy = DashboardSpy;
        const layoutElement = $(".layout-stage");
        this._dashboardService.initDashboard(this.dashboardId);
        this._dashboard = this._dashboardService.dashboard;

        if (this._dashboard.widgets.length > 1) {
            this._dashboard.widgets = _.sortBy(this._dashboard.widgets, function (widget: any) {
                return widget._widgetConfig.addedTime;
            });
        }
        this.setDocumentTitle(this._dashboard.title);
        this._GridsterServiceFactory = this.GridsterServiceFactory;
        this.gridster = this.GridsterServiceFactory.create(this._dashboard);

        this.addWidgetBtnText = this._$filter("i18n")("home.dashboards.add.widget.2");
        this.newWidget = _.merge({}, emptyWidget, { dashboardId: this.dashboardId });
        //on dashboard creation : Open the wizard
        if (this.isJustCreatedDashboard()) {
            this.openWizard(this.newWidget);
        }
        this.initialWidth = this.setInitialWidth();
        this._widgetsOrigin = this.copyDashboardWidgets();
        this._$scope.$watch(() => {
            this.titleWidth = angular.element(".dashboard-wrap").width();
            return true;
        });

        if (!this._dashboardService.newVersion) {
            this.legacyMigrate();
        }

        this._$scope.$on("windowResize", () => {
            //this.onResize();
        });

        this._$scope.$on("dashboard.openWizard", (event, widget) => {
            this.openWizard(widget);
        });
        //SIM-23335 - gridster doesnt change the "pos" property of a widget if they are not valid, like in this case sizeX or sizeY as a string.
        this._dashboard.widgets.forEach((widget) => {
            ["sizeX", "sizeY"].map((property) => {
                if (widget.pos.hasOwnProperty(property))
                    widget.pos[property] = parseInt(widget.pos[property]);
            });
        });
        this._$scope.$watch(
            () => this.widgetsPos(),
            (newLayout, oldLayout) => {
                const addedWidget = this._dashboard.widgets[this._dashboard.widgets.length - 1];
                if (newLayout !== oldLayout) {
                    //when widget's sizeX changed and widget is last in the row. widget's col should be updated too. SIM-14279
                    newLayout.forEach((layout, index) => {
                        if (oldLayout[index]) {
                            if (
                                newLayout[index].sizeX > oldLayout[index].sizeX &&
                                newLayout[index].sizeX + newLayout[index].col >
                                    gridsterPreferences.columns
                            ) {
                                newLayout[index].col =
                                    gridsterPreferences.columns - newLayout[index].sizeX;
                            }
                        }
                    });

                    if (newLayout.length > oldLayout.length) {
                        this._$timeout(function () {
                            //timeout is necessary to account for the delay of DOM refresh - the new widget may yet not exist before the timeout
                            const widgetElement = $("#" + addedWidget.id),
                                distance =
                                    layoutElement.scrollTop() + widgetElement.offset().top - 195,
                                //distance = layoutElement[0].scrollHeight - layoutElement.height(),
                                delay = distance / 10;
                            layoutElement.animate(
                                {
                                    scrollTop: distance,
                                },
                                delay < 700 ? 700 : delay,
                            ); //speed is dependant on the distance from the top
                        }, 1);
                    }
                    this.layoutChanged(newLayout);
                }
            },
            true,
        );
        this.fullScreenListener();
        this.keyupListener();
        this.byteArrayToBase64 = (arraybuffer) => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            const bytes = new Uint8Array(arraybuffer),
                len = bytes.length;
            let base64 = "";

            for (let i = 0; i < len; i += 3) {
                base64 += chars[bytes[i] >> 2];
                base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
                base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
                base64 += chars[bytes[i + 2] & 63];
            }

            if (len % 3 === 2) {
                base64 = base64.substring(0, base64.length - 1) + "=";
            } else if (len % 3 === 1) {
                base64 = base64.substring(0, base64.length - 2) + "==";
            }

            return base64;
        };
        this.globalChangeCountry = (countryId) => {
            this.updateDashboardWidgetsProps({ country: countryId });
        };
        this.globalChangeDuration = (durationId) => {
            this.updateDashboardWidgetsProps({ duration: durationId.id });
        };
        this.globalChangeWebsource = (websourceId) => {
            this.updateDashboardWidgetsProps({ webSource: websourceId.id });
        };
        this.showGlobalFilters = swSettings.components.Home.resources.HasDashboardSettings;
        this.isWebsitesSidebarOpen = false;

        this.navigationScrollService.startLayoutScrollEvents();
        this._$scope.$on("$destroy", () => {
            this.navigationScrollService.finishLayoutScrollEvents();
        });

        this.toggleReadOnly();

        ShareDashboardService.getDashboardOwner(this.dashboard.ownerId).then(({ err, owner }) => {
            if (owner) {
                this.dashboardOwnerName = owner.User;
            }
        });
        this.isSubscriptionOn = DashboardSubscriptionService.isSubscriptionOn(this._dashboard);
        this.isNotificationAllowed = DashboardSubscriptionService.isNotificationAllowed(
            this._dashboard,
        );

        this.setShareDashboardState();
    }

    private clearEmptyRows(layout) {
        let currentRow = 0;
        let lastRow;
        let decreaseRow = false;

        layout.sort((a, b) => (a.row * 10 + a.col > b.row * 10 + b.col ? 1 : -1));
        const lastRowObj = layout[layout.length - 1];
        if (lastRowObj) {
            lastRow = lastRowObj.row;
        } else {
            return;
        }

        while (currentRow <= lastRow) {
            const rowWidgets = [];
            let rowHeight = 1;
            layout.forEach((widget, i) => {
                if (widget.row === currentRow) {
                    rowWidgets.push(widget);
                    if (widget.sizeY > rowHeight) {
                        rowHeight = widget.sizeY;
                    }
                    if (decreaseRow) {
                        layout[i].row = currentRow - 1;
                    }
                }
            });
            currentRow += rowHeight;
            if (rowWidgets.length === 0) {
                decreaseRow = true;
            }
        }
    }

    private toggleReadOnly() {
        //todo disable dashboard title edit name
        this.gridster.settings.draggable.enabled = !this._dashboard.readOnly;
        this.gridster.settings.resizable.enabled = !this._dashboard.readOnly;
        this._dashboard.widgets = this._dashboard.widgets.map((widget) => {
            widget.readOnly = this._dashboard.readOnly;
            widget.viewOptions.showSettings = !this._dashboard.readOnly;
            return widget;
        });
    }

    private isJustCreatedDashboard() {
        const newlyCreated = this.swNavigator.current().name === "dashboard-created";
        return this._dashboard.widgets.length == 0 && newlyCreated;
    }

    private widgetsPos() {
        return this._dashboard.widgets.map(function (widget) {
            widget.onResize();
            return widget.pos;
        });
    }

    private setInitialWidth = () => {
        const windowWidth = this._$window.innerWidth;
        //for medium screens
        let initWidth: number | string = "75%";
        //for small screens without sideBar
        if (windowWidth <= 1200) {
            initWidth = "95%";
        } else if (windowWidth > 1700) {
            //for very large screens with static width
            initWidth = 1338;
        }
        this._$timeout(() => {
            this._$scope.$broadcast("highchartsng.reflow");
        }, 1000);
        return initWidth;
    };

    private isValid(newTitle) {
        if (!newTitle) {
            return false;
        }
        const itemsWithTitle = _.filter(this._dashboardService.dashboards, { title: newTitle });
        return !itemsWithTitle.length && newTitle.length > 0;
    }

    private copyDashboardWidgets() {
        const widgetsOrigin = [];
        this._dashboard.widgets.forEach(function (widget) {
            widgetsOrigin.push({
                pos: angular.copy(widget.pos),
                width: angular.copy(widget.width),
            });
        });
        return widgetsOrigin;
    }

    private legacyMigrate = () => {
        const widgets = this._dashboard.widgets;
        const windowWidth = this._$window.innerWidth;
        const widgetsOrigin = this._widgetsOrigin;
        const scope = this._$scope;
        this._$timeout(function () {
            _.each(widgets, (widget, index) => {
                _.merge(widget.pos, getWidgetPos(widget, index));
            });
            scope.$broadcast("highchartsng.reflow");
        });

        function getWidgetPos(widget, index) {
            return {
                sizeY: 1,
                sizeX: getWidgetSize(widget, index),
                col: getWidgetCol(widget, index),
                row: getWidgetRow(widget, index),
            };
        }

        const getWidgetSize = function (widget, index) {
            return widget?.pos?.sizeX ?? 2;
        };

        const getWidgetCol = function (widget, index) {
            if (index % 2 == 0) {
                return 0;
            } else {
                return 2;
            }
        };

        const getWidgetRow = function (widget, index) {
            if (index == 0 || index == 1) {
                return 0;
            } else {
                if (index % 2 == 0) {
                    return index / 2;
                } else {
                    return (index - 1) / 2;
                }
            }
        };
    };

    private getUserCountries(component) {
        const _component = swSettings.components[component];
        const allowedCountries = [];
        _component.allowedCountries.forEach((country: any) => {
            if (!country.children || country.children.length < 1) {
                allowedCountries.push({
                    ...country,
                });
            } else {
                allowedCountries.push({
                    ...country,
                });
                country.children.forEach((state) => {
                    allowedCountries.push({
                        ...state,
                    });
                });
            }
        });
        return [{ id: "0", text: "Select" }, ...allowedCountries];
    }

    private setDocumentTitle(newTitle) {
        document.title = newTitle;
    }

    get dashboard() {
        return this._dashboard;
    }

    private openPdfExportLoader = () => {
        this.exportLoaderTitle = i18nFilter()("dashboard.export.loader.pdf.title");
        this.exportLoaderSubtitle = i18nFilter()("dashboard.export.loader.pdf.subtitle");
        this.isExportLoading = true;
    };

    private openPptExportLoader = () => {
        this.exportLoaderTitle = i18nFilter()("dashboard.export.loader.ppt.title");
        this.exportLoaderSubtitle = i18nFilter()("dashboard.export.loader.ppt.subtitle");
        this.isExportLoading = true;
    };

    private closeExportLoader = () => {
        this.isExportLoading = false;
        this.exportLoaderTitle = "";
        this.exportLoaderSubtitle = "";
    };

    public layoutChanged(layoutToSave) {
        this._$timeout.cancel(this._waitInterval);
        this._waitInterval = this._$timeout(() => {
            this.clearEmptyRows(layoutToSave);
            const sameLayout = angular.equals(this._lastSavedLayout, layoutToSave);
            if (!sameLayout) {
                // is it a new layout ?
                this._lastSavedLayout = angular.copy(layoutToSave);
                this._dashboardService.updateDashboardWidgets(this._dashboard);
            }
            this._$scope.$broadcast("highchartsng.reflow");
        }, 500);
    }

    public async closeWizard(widget, newWidget, cb = _.noop) {
        allTrackers.trackEvent("Add Widget", "submit-ok", `Dashboard/${this.dashboardId}`);
        if (widget.id) {
            //In case metric was change - reset the widget's title.
            if (widget.getWidgetModel().metric != newWidget.metric) {
                newWidget.titleTemplate = undefined;
                newWidget.title = undefined;
            } else {
                newWidget.titleTemplate = widget.viewData.titleTemplate;
                newWidget.title = widget.viewData.title;
            }
            this._dashboardService.editWidget({
                properties: newWidget,
                pos:
                    angular.merge(widget.pos, this._dashboardService.widgetPosMaker(newWidget)) ||
                    {},
                id: widget.id,
                dashboardId: widget.dashboardId,
            });
            cb();
        } else {
            widget.pos.sizeX = parseInt(newWidget.width);
            widget.pos.sizeY = 1;
            const resource = this._dashboardService.addWidget({
                properties: newWidget,
                pos: widget.pos || {},
                dashboardId: widget.dashboardId,
            });
            await resource;
            cb();
        }
    }

    public updateDashboardWidgetsProps(newProps) {
        this._dashboard.widgets.forEach((widget) => {
            this._dashboardService.editWidget({
                properties: Object.assign({}, widget.getProperties(), newProps),
                pos: widget.pos,
                id: widget.id,
                dashboardId: widget.dashboardId,
            });
        });
    }

    public updateDashboardWidgetsDomain = (domainsMap) => {
        this._dashboard.widgets.forEach((widget) => {
            const model = widget.getWidgetModel();
            if (model.family !== "Website") {
                return;
            }
            const newKeys = [];
            const uniqueKeys = [];
            for (let i = 0; i < model.key.length; i++) {
                const key = model.key[i];
                if (
                    uniqueKeys.indexOf(key.id) === -1 &&
                    uniqueKeys.indexOf(domainsMap[key.name]) === -1
                ) {
                    if (domainsMap[key.name]) {
                        newKeys.push({ name: domainsMap[key.name], id: domainsMap[key.name] });
                    } else {
                        newKeys.push({ name: key.name, id: key.name });
                    }
                    uniqueKeys.push(domainsMap[key.name]);
                }
            }
            this._dashboardService.editWidget({
                properties: Object.assign({}, widget.getProperties(), { key: newKeys }),
                pos: widget.pos,
                id: widget.id,
                dashboardId: widget.dashboardId,
            });
            widget.getLegendImage();
        });
    };

    public getDashboardWebsites() {
        const websites = [];
        this._dashboard.widgets.forEach((widget) => {
            const model = widget.getWidgetModel();
            if (model.family === "Website") {
                model.key.forEach((keyItem) => {
                    if (websites.indexOf(keyItem.name) === -1) {
                        websites.push(keyItem.name);
                    }
                });
            }
        });
        return websites;
    }

    public toggleWebsitesSidenav = () => {
        this.isWebsitesSidebarOpen = !this.isWebsitesSidebarOpen;
    };

    //This function is being used to open the wizard from React context (dashboardHeader).
    public openMetricsGallery = () => {
        this.openWizard(this.newWidget);
        this._$scope.$digest();
    };

    public openWizard(widget) {
        this.selectedWidget = widget;
        this.isWizardOpen = true;
        hideIntercom();
        if (widget.properties) {
            this.$swNgRedux.dispatch(dashboardWizardNewWidget());
        }
    }

    public toggleEdit(currentTitle) {
        this.editableTitle = angular.copy(currentTitle);
        this.isEdited = true;
    }

    public renameDashboard(editedTitle) {
        if (this._dashboard.title === editedTitle) {
            this.isEdited = false;
            return;
        }
        if (this.isValid(editedTitle)) {
            this._dashboard.title = editedTitle;
            this._dashboardService.renameDashboard(_.pick(this._dashboard, ["id", "title"]));
            SwTrack.all.trackEvent("Dashboards", "click", "Title Bar/Edit/" + editedTitle);
            this.isEdited = false;
        }
    }

    public widgetsLoaded() {
        return (
            this._dashboard.widgets.length &&
            this._dashboard.widgets.every((widget) => {
                return (
                    widget.widgetState === WidgetState.LOADED ||
                    widget.widgetState === WidgetState.ERROR
                );
            })
        );
    }

    /**
     * Resolves which widgets the user has selected to export.
     * @params selectedIds The index of the required widgets to export.
     * the index is known and used as an id since the widgets are sorted in a specific way.
     */
    private resolveSelectedPptWidgets = (selectedIds: string[]): IWidget<unknown>[] => {
        return sortWidgetsForPptExport(this._dashboard.widgets).filter((_, id) => {
            return selectedIds.includes(`${id}`);
        });
    };

    /**
     * Exports the given list of widgets to a powerpoint presentation, using the PPT service.
     */
    private exportWidgetsToPpt = async (widgets: IWidget<unknown>[]): Promise<void> => {
        SwTrack.all.trackEvent("Export", "submit-ok", "Dashboard/ppt/" + this._dashboard.title);

        try {
            this.openPptExportLoader();

            const pptRequest: IPptExportRequest = {
                name: this._dashboard.title,
                metrics: widgets.map((widget) => widget.getDataForPpt()),
                meta: {
                    userEmail: swSettings?.user?.username,
                },
            };

            await this.pptExportService.exportPpt(pptRequest);
        } finally {
            this._$scope.$evalAsync(() => {
                this.closeExportLoader();
            });
        }
    };

    /**
     * Callback method when the user clicks the "export" button in the ppt export modal.
     * at this point - the user has selected which widgets he wants to export to powerpoint.
     */
    public onPptModalExportConfirm = async (widgetsToExport: IDashboardExportListItem[]) => {
        this.closeExportPptModal();

        const selectedWidgetIds = widgetsToExport
            .filter((widget) => widget.isSelected && !widget.isDisabled)
            .map((widget) => widget.id);

        const selectedWidgets = this.resolveSelectedPptWidgets(selectedWidgetIds);
        if (selectedWidgets.length <= 0) return;

        await this.exportWidgetsToPpt(selectedWidgets);
    };

    /**
     * Opens a modal that allows the user to select which widgets he wants to export to powerpoint
     */
    public openExportPptModal = async () => {
        // We use the widgets index within the array as an id, since we know that
        // they will always maintain this order (they're sorted in a specific way)
        this.widgetsForPptModal = sortWidgetsForPptExport(this._dashboard.widgets).map(
            (widget, i) => {
                return {
                    id: `${i}`,
                    viewData: {
                        title: getWidgetTitle(widget),
                        subtitle: getWidgetSubtitleForModal(widget),
                    },
                    isSelected: true,
                    isDisabled: !widget.isPptSupported(),
                };
            },
        );

        this._$timeout(() => {
            this.isPptExportModalOpen = true;
        }, 1);
    };

    /**
     * Closes the PPT export selection modal
     */
    public closeExportPptModal = () => {
        this._$timeout(() => {
            this.isPptExportModalOpen = false;
        }, 1);
    };

    public downloadPdf = () => {
        SwTrack.all.trackEvent("Download", "submit-ok", "Dashboard/pdf/" + this._dashboard.title);
        this.openPdfExportLoader();
        const gridsterElement = $(".gridster-loaded");
        gridsterElement.css("width", "1366px");

        $(window).trigger("resize");

        setTimeout(async () => {
            const clonedHTML = gridsterElement.clone();
            // SIM-16516 fix for phishing site links
            $(clonedHTML).find(".swTable-linkOut").remove();
            gridsterElement.css("width", "");
            PdfExportService.setHTML(clonedHTML[0].outerHTML, "dashboard-pdf");
            try {
                await PdfExportService.downloadHtmlPdfFedService(this._dashboard.title);
            } finally {
                this._$scope.$evalAsync(() => {
                    this.closeExportLoader();
                });
            }
        }, 1000);
    };

    public getBase64Pdf = () => {
        const gridsterElement = $(".gridster-loaded");
        const clonedHTML = gridsterElement.clone();
        // SIM-16516 fix for phishing site links
        $(clonedHTML).find(".swTable-linkOut").remove();
        gridsterElement.css("width", "");
        PdfExportService.setHTML(clonedHTML[0].outerHTML);

        PdfExportService.downloadPDF(this._dashboard.title, { pdfType: "Dashboard" }).then(
            (pdf) => {
                const byteArray = [pdf.data];
                this.base64string = this.byteArrayToBase64(byteArray[0]);
                gridsterElement.append("<span id='base64ready'>");
            },
        );
    };

    //Connect function from DashboardHeader component to ShareDashboardModal component via Angular Controller.
    public openShareDashboard = () => {
        SwTrack.all.trackEvent(
            "share dashboard",
            "click",
            `${this.dashboard.id}/${this.dashboard.isSharedByMe ? "shared" : "unshared"}`,
        );
        setTimeout(() => {
            this.shareDashboardOpen = true;
            this._$scope.$digest();
        }, 1);
    };
    public openShareDashboardSettings = () => {
        this.openShareDashboard();
    };
    public closeShareDashboard = () => {
        this._$timeout(() => {
            this.shareDashboardOpen = false;
        }, 1);
    };
    public duplicateDashboard = () => {
        this._dashboardService.cloneDashboard(this.dashboard).then(
            async (createdDashboard) => {
                this.$swNgRedux.dispatch(setSharedWithMeDashboards());
                await keywordsGroupsService.init();
                this.swNavigator.go("dashboard-created", {
                    dashboardId: createdDashboard.id,
                });
            },
            function fail() {
                this.setState({
                    items: this.getSideNavList(this.state.activeItemName),
                });
            },
        );
    };

    public setShareDashboardState = () => {
        if (this.dashboard.sharedWithUsers.length > 0) {
            this.selectedShareDashboardType = ShareDashboardType.Specific;
            ShareDashboardService.getDashboardViewers(this.dashboard.sharedWithUsers).then(
                ({ err, viewers }) => {
                    this.dashboardViewers = viewers;
                },
            );
        } else {
            this.selectedShareDashboardType = ShareDashboardType.All;
            this.dashboardViewers = [];
        }
    };

    public setDashboardShared = async (users?: any[], message?: string) => {
        this.closeShareDashboard();
        const result = await ShareDashboardService.share({
            dashboardId: this.dashboard.id,
            userIds: users.map((user) => user.Id),
            message,
        });
        SwTrack.all.trackEvent(
            "share dashboard",
            "share",
            `${this.dashboard.id}/${message.length}`,
        );
        if (result.success) {
            this._$scope.$apply(() => {
                //backend returns array of strings in startup and array of numbers here. Normalising.
                const addedUserIds = result.response.addedUserIds.map((user) => user.toString());
                const existingUserIds = result.response.userIds.map((user) => user.toString());
                const userIds = _.union(existingUserIds, addedUserIds);
                this._dashboardService.setSharedWithUsers(this.dashboard.id, userIds);
                const accountIds = _.union(
                    this._dashboardService.dashboard.sharedWithAccounts,
                    result.response.addedAccountIds,
                );
                this._dashboardService.setSharedWithAccounts(this.dashboard.id, accountIds);
                this.dashboard.isSharedByMe = true;
                this._dashboardService.setIsSharedByMe(this.dashboard.id, true);
                const msg =
                    users && users.length > 0
                        ? i18nFilter()("dashboard.shareDashboard.share.specific.toast", {
                              user: users[users.length - 1].User,
                              moreUsersNumber: users.length - 1 > 0 ? `+${users.length - 1}` : "",
                          })
                        : i18nFilter()("dashboard.shareDashboard.share.all.toast");
                this.triggerSharedToast(msg);
                this.$swNgRedux.dispatch(setSharedWithMeDashboards());
                this.setShareDashboardState();
            });
        }
        if (result.err) {
            swLog.error(`sharing dashboard ${this.dashboard.id} failed`, result.err);
        }
    };

    public setDashboardUnshared = async () => {
        this.closeShareDashboard();
        const result = await ShareDashboardService.unShare({ dashboardId: this.dashboard.id });
        SwTrack.all.trackEvent("share dashboard", "unshare", `${this.dashboard.id}`);
        if (result.success) {
            this._$scope.$apply(() => {
                this._dashboardService.setSharedWithUsers(this.dashboard.id, []);
                this._dashboardService.setSharedWithAccounts(this.dashboard.id, []);
                this.dashboardViewers = [];
                this._dashboard.isSharedByMe = false;
                this._dashboardService.setIsSharedByMe(this.dashboard.id, false);
                this.triggerUnSharedToast();
                this.$swNgRedux.dispatch(setSharedWithMeDashboards());
                this.setShareDashboardState();
            });
        }
        if (result.err) {
            swLog.error(`unsharing dashboard ${this.dashboard.id} failed`, result.err);
        }
    };
    public triggerSharedToast = (text) => {
        const onClick = this.openShareDashboardSettings;
        const linkText = "SHARING SETTINGS";
        this.$swNgRedux.dispatch(
            showSuccessToast(getToastItemComponent({ text, onClick, linkText })),
        );
    };

    public triggerUnSharedToast = () => {
        const text = i18nFilter()("dashboard.shareDashboard.revoke.toast");
        this.$swNgRedux.dispatch(showSuccessToast(text));
    };

    public presentationMode() {
        if (!this.isPresentationMode) {
            SwTrack.all.trackEvent(
                "Button",
                "click",
                "Dashboard/present full screen/" + this._dashboard.title,
            );
            this.isPresentationMode = true;
            if (screenfull.enabled) {
                screenfull.request($(".layout-stage")[0]);
            } else {
                $("#topBar").addClass("presentation-mode");
            }
            $(".layout-stage").addClass("presentation-mode").scrollTop(0);
            setTimeout(() => {
                this.fixHeightForPresentation().then(() => {
                    this.waitForDomMutations(".layout-stage").then(() => {
                        this.setPresentationLayout();
                    });
                });
            });
        } else {
            this.restoreHeightFromPresentation().then(() => {
                this.unsetPresentationLayout();
            });
        }
    }

    public fixHeightForPresentation() {
        const _deffered = this._$q.defer();
        const _maxRows = Math.floor(window.innerHeight / 359) - 1;
        const _grid = $(".gridster").data("$gridsterController").grid;
        _grid.forEach((itemsGroup, index) => {
            itemsGroup.forEach((item) => {
                if (item.row % _maxRows === 0 && item.sizeY === 2) {
                    item.$element.find("sw-widget-resize button").click();
                    this._presentationHeightElements.push(item);
                }
            });
        });

        setTimeout(() => {
            _deffered.resolve();
        });

        return _deffered.promise;
    }

    public restoreHeightFromPresentation() {
        const _deffered = this._$q.defer();
        if (this._presentationHeightElements.length > 0) {
            //Restore any widget that was shrinked.
            this._presentationHeightElements.forEach((item, i) => {
                this._$timeout(() => {
                    if (item) {
                        item.$element.find("sw-widget-resize button").click();
                        this._presentationHeightElements[i] = undefined;
                        if (i === this._presentationHeightElements.length - 1) {
                            setTimeout(() => {
                                _deffered.resolve();
                            }, 750);
                        }
                    }
                });
            });
        } else {
            this._$timeout(() => {
                _deffered.resolve();
            });
        }

        return _deffered.promise;
    }

    public setPresentationLayout() {
        const _maxRows = Math.floor(window.innerHeight / 359);
        const _grid = $(".gridster").data("$gridsterController").grid;
        const _screens = Math.ceil(_grid.length / _maxRows);
        let _maxLeft = 0;
        const _gridContainer = $($(".gridster ul:first")[0]);
        this.screens = _screens;
        _grid.forEach((itemsGroup, index) => {
            itemsGroup.forEach((item) => {
                if (item.row > _maxRows - 1) {
                    const el = item.$element[0];
                    const newTop = (item.row % _maxRows) * 359;
                    const screenMultiplation = Math.floor(item.row / _maxRows);
                    const newLeft =
                        parseInt($(el).css("left")) + screenMultiplation * window.innerWidth;
                    $(el).css("top", newTop);
                    $(el).css("left", newLeft);
                    if (newLeft > _maxLeft) {
                        _maxLeft = newLeft;
                    }
                }
            });
        });
        _gridContainer.append("<li id='demoWidget'></li>");
        const _demoWidget = $("#demoWidget");
        _demoWidget.css("width", "100px");
        _demoWidget.css("height", "100px");
        _demoWidget.css("position", "absolute");
        _demoWidget.css("left", _maxLeft + window.innerWidth + "px");
        if (_screens > 1) {
            this.startGridAutoScroll(_screens);
        }
    }

    public unsetPresentationLayout() {
        this.isPresentationMode = false;
        if (screenfull.enabled) {
            screenfull.exit();
        } else {
            $("#topBar").removeClass("presentation-mode");
        }
        $("#demoWidget").remove();
        $(".layout-stage").removeClass("presentation-mode").scrollTop(0);
        this.stopGridAutoScroll();
    }

    public startGridAutoScroll(maxCount) {
        let _counter = 0;
        this._presentationInterval = setInterval(() => {
            if (_counter < maxCount - 1) {
                this.gridScrollTo(_counter + 1, false);
                _counter++;
            } else {
                _counter = 0;
                this.resetGridScroll();
            }
            this.currentScreen = _counter;
            this._$scope.$digest();
        }, 10000);
    }

    public stopGridAutoScroll() {
        this.screens = 0;
        clearInterval(this._presentationInterval);
    }

    public gridScrollTo(slideNum = 1, stopAutoScroll?: boolean) {
        if (stopAutoScroll === true || stopAutoScroll === undefined) {
            clearInterval(this._presentationInterval);
        }
        const scrollCount = slideNum;
        $(".layout-stage").animate({ scrollLeft: window.innerWidth * scrollCount }, 800);
        this.currentScreen = slideNum;
        this._$scope.$apply();
    }

    public resetGridScroll() {
        $(".layout-stage").animate({ scrollLeft: $(".layout-stage").scrollLeft() * -1 }, 800);
    }

    public waitForDomMutations(selector) {
        const _deffered = this._$q.defer();
        const _target = $(selector)[0];
        const _config = { childList: true, subtree: true };

        const _observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation, i) => {
                if (mutations.length - 1 === i) {
                    setTimeout(() => {
                        _deffered.resolve();
                        _observer.disconnect();
                    });
                }
            });
        });
        _observer.observe(_target, _config);
        return _deffered.promise;
    }

    public fullScreenListener() {
        screenfull.onchange(() => {
            if (!screenfull.isFullscreen) {
                this.restoreHeightFromPresentation().then(() => {
                    this.unsetPresentationLayout();
                });
            }
        });
    }

    public keyupListener() {
        $(".layout-stage").keyup((e) => {
            //Screen pagination in full screen mode
            if (this.isPresentationMode) {
                switch (e.keyCode) {
                    //Left arrow
                    case 37:
                        if (this.currentScreen === 0) {
                            this.currentScreen = this.screens - 1;
                            this.gridScrollTo(this.currentScreen);
                        } else {
                            this.currentScreen--;
                            this.gridScrollTo(this.currentScreen);
                        }
                        break;
                    //Right arrow
                    case 39:
                        if (this.currentScreen === this.screens - 1) {
                            this.gridScrollTo(0);
                            this.currentScreen = 0;
                        } else {
                            this.currentScreen++;
                            this.gridScrollTo(this.currentScreen);
                        }
                        break;
                }
                this._$scope.$apply();
            }
        });
    }

    public removeEmptyRows() {
        const widgets = this._dashboard.widgets;
        const sorted = sortWidgetsByPosition(widgets);
        const emptyRow = findEmptyRow(sorted);
        if (emptyRow) {
            widgets.forEach((widget) => {
                if (widget.pos.row > emptyRow) {
                    widget.pos.row = widget.pos.row - 1;
                }
            });
        }
    }

    public onSubscription = () => {
        this._dashboardService.dashboardsubscribe(this._dashboard.id).then(() => {
            this._$scope.$apply(() => {
                this.isSubscriptionOn = DashboardSubscriptionService.isSubscriptionOn(
                    this._dashboard,
                );
                this.isNotificationAllowed = DashboardSubscriptionService.isNotificationAllowed(
                    this._dashboard,
                );
                this.triggerSubscriptiondToast();
            });
        });
    };

    public onUnsubscription = () => {
        this._dashboardService.dashboardUnsubscribe(this._dashboard.id).then(() => {
            this._$scope.$apply(() => {
                this.isSubscriptionOn = DashboardSubscriptionService.isSubscriptionOn(
                    this._dashboard,
                );
                this.isNotificationAllowed = DashboardSubscriptionService.isNotificationAllowed(
                    this._dashboard,
                );
            });
        });
    };

    public triggerSubscriptiondToast = () => {
        const text = i18nFilter()("dashboard.dashboardSubscription.success.toast");
        this.$swNgRedux.dispatch(showSuccessToast(text));
    };
}

function sortWidgetsByPosition(widgets) {
    const sorted = _.sortBy(widgets, function (x: any) {
        return parseFloat(`${x.pos.row}.${x.pos.col}`);
    });
    return sorted;
}

function sortWidgetsForPptExport(widgets) {
    const sortedWidgetsByPosition = sortWidgetsByPosition(widgets);
    const supportedWidgets = sortedWidgetsByPosition.filter((widget) => widget.isPptSupported());
    const unsupportedWidgets = sortedWidgetsByPosition.filter((widget) => !widget.isPptSupported());
    return [...supportedWidgets, ...unsupportedWidgets];
}

function findEmptyRow(widgets) {
    const rows = [];
    widgets.forEach((widget) => {
        rows[widget.pos.row] = true;
        if (widget.pos.sizeY == 2) {
            rows[widget.pos.row + 1] = true;
        }
    });
    for (let i = 0; i < rows.length; i++) {
        if (rows[i] !== true) {
            return i;
        }
    }
    return null;
}

angular
    .module("sw.common")
    .controller("dashboardCtrl", DashboardController as ng.Injectable<ng.IControllerConstructor>);
