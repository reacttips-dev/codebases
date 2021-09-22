import angular from "angular";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { allTrackers } from "services/track/track";
import { setSharedWithMeDashboards } from "../../../pages/dashboard/DashboardSideNavActions";
import { showIntercom } from "../../../services/IntercomService";
import { ISwNgReduxService } from "../../../services/SwNgRedux";
import { clearSelectedTemplate } from "../dashboard-templates/actions/dashboardTemplateActions";
import { DashboardTemplateService } from "../dashboard-templates/DashboardTemplateService";
import {
    dashboardWizardMetricAndFamilyChanged,
    dashboardWizardNewWidget,
    dashboardWizardWidgetChanged,
} from "./actions/dashboardWizardActionCreators";
import getDefaultstate from "./utils/dashboardWizardDefaultState";
import widgetSettings from "components/dashboard/WidgetSettings.ts";

class ReactWizardController {
    static $inject = [
        "$scope",
        "widgetFactoryService",
        "$swNgRedux",
        "$timeout",
        "i18nFilter",
        "swNavigator",
        "dashboardService",
    ];
    public currentStep: string;
    public cta: string;
    public ctaSave: string;
    public ctaSaving: string;
    public ctaDisabled: boolean = false;
    public wizardSteps: any;
    public creatingDashboard: boolean = false;
    public selectedTemplate: string = "";
    public clearSelectedTemplate: () => void;
    public widgetPreview: any;
    public widgetProperties: any;
    private statePath: any;
    private injector: any;
    private unSubscribe: any;
    private widgetFactoryService: any;
    private ngReduxUnsubscribe;
    private originType;
    private originId;

    constructor(
        public $scope,
        widgetFactoryService,
        public $swNgRedux: ISwNgReduxService,
        public $timeout,
        _i18nFilter,
        public swNavigator,
        public dashboardService,
    ) {
        this.widgetFactoryService = widgetFactoryService;
        this.statePath = "customDashboard.dashboardWizard";
        this.ctaSave = _i18nFilter("home.dashboards.wizard.save.btn");
        this.ctaSaving = _i18nFilter("home.dashboards.wizard.saving.btn");
        this.cta = this.ctaSave;
        this.wizardSteps = {
            gallery: { title: _i18nFilter("home.dashboards.wizard.metric.title") },
            edit: { title: _i18nFilter("home.dashboards.wizard.edit.title") },
            templates_gallery: {
                title: _i18nFilter("home.dashboards.wizard.templates_gallery.title"),
                subTitle: _i18nFilter("home.dashboards.wizard.templates_gallery.subTitle"),
            },
            template_config: { title: _i18nFilter("home.dashboards.wizard.template_config.title") },
        };
        $swNgRedux = Injector.get("$swNgRedux");
        if (this.swNavigator.current().name === "dashboard-gallery") {
            const templateId = this.$swNgRedux.getState().customDashboard.dashboardTemplate
                .selectedTemplate;
            if (templateId) {
                this.currentStep = "template_config";
                this.wizardSteps["template_config"] = {
                    title:
                        $swNgRedux.getState().customDashboard.dashboardTemplate.initialTitle ||
                        _i18nFilter(DashboardTemplateService.getTemplateById(templateId).title),
                };
            } else {
                this.currentStep = "templates_gallery";
            }
        } else {
            this.currentStep = "gallery";
        }
        this.unSubscribe = $swNgRedux.notifyOnChange(this.statePath, this.getWidgetPreview);
        $scope.$watch("ctrl.isWizardOpen", (newVal, oldVal) => {
            if (newVal !== oldVal && newVal === true) {
                this.open();
            }
        });
        $scope.$watch("reactWizardController.selectedTemplate", (newVal, oldVal) => {
            if (newVal && newVal !== oldVal) {
                if (newVal === "blank") {
                    $swNgRedux.dispatch(dashboardWizardNewWidget());
                    this.swNavigator.go("dashboard-gallery-blank");
                    this.currentStep = "gallery";
                } else {
                    this.currentStep = "template_config";
                    this.wizardSteps["template_config"] = {
                        title: _i18nFilter(DashboardTemplateService.getTemplateById(newVal).title),
                    };
                }
            }
        });
        this.ngReduxUnsubscribe = $swNgRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        $scope.$on("$destroy", this.onDestroy);
    }

    onDestroy = () => {
        this.clearSelectedTemplate();
        this.ngReduxUnsubscribe();
    };

    onTitleChange = (event) => {
        this.$scope.$apply(() => {
            this.wizardSteps["template_config"] = {
                title: event.target.value,
            };
        });
    };

    onCardClick = (widgetMetric) => {
        if (widgetMetric && widgetMetric.isDisabled) {
            window.open("https://www.similarweb.com/corp/contact/");
            return;
        }
        const {
            customDashboard: { dashboardWizard },
        } = this.$swNgRedux.getState();

        let _key = [];
        if (dashboardWizard.widget.family === widgetMetric.family) {
            _key = dashboardWizard.widget.key;
        }
        this.$swNgRedux.dispatch(
            dashboardWizardMetricAndFamilyChanged(
                getDefaultstate(),
                widgetMetric.id,
                widgetMetric.family,
                _key,
            ),
        );
        this.$timeout(() => {
            this.currentStep = "edit";
        });
    };

    goBack = () => {
        allTrackers.trackEvent("back", "click", `prev step/${this.currentStep}`);
        switch (this.currentStep) {
            case "edit":
                this.currentStep = "gallery";
                break;
            case "template_config":
                this.currentStep = "templates_gallery";
                if (typeof this.clearSelectedTemplate === "function") {
                    this.clearSelectedTemplate();
                }
                break;
            case "templates_gallery":
                history.back();
                showIntercom();
                this.clearSelectedTemplate();
                break;
            case "gallery":
                if (this.swNavigator.current().name === "dashboard-created") {
                    this.swNavigator.go("dashboard-exist");
                } else if (this.swNavigator.current().name === "dashboard-gallery-blank") {
                    this.currentStep = "templates_gallery";
                    history.back();
                } else {
                    this.close();
                }
                break;
            default:
                this.close();
        }
    };

    open = () => {
        const widget = this.$scope.ctrl.selectedWidget;
        if (widget && !!widget.id) {
            this.currentStep = "edit";
            this.widgetPreview = widget;
            const widgetModel = Object.assign(
                this.widgetPreview.getWidgetModel(),
                this.widgetPreview.getProperties(),
            );
            widgetModel.widgetType = {
                type: widgetModel.type,
                id: widgetSettings.getWidgetDashboardType(widgetModel.type) || widgetModel.type,
            };
            delete widgetModel.type;
            this.$swNgRedux.dispatch(
                dashboardWizardWidgetChanged(
                    Object.assign(getDefaultstate(), { widget: widgetModel }),
                    widgetModel,
                ),
            );
        } else {
            this.currentStep = "gallery";
        }
    };

    close = () => {
        this.$scope.ctrl.isWizardOpen = false;
        showIntercom();
        this.$scope.ctrl.selectedWidget = false;
    };

    save = () => {
        if (this.swNavigator.current().name === "dashboard-gallery-blank") {
            this.createWithWidget().then((data) => {
                allTrackers.trackEvent("Dashboard", "submit-ok", `New Dashboard/${data[0].id}`);
                this.swNavigator.go("dashboard-created", { dashboardId: data[0].id });
                this.$swNgRedux.dispatch(setSharedWithMeDashboards());
            });
            return;
        }
        this.ctaDisabled = true;
        this.cta = this.ctaSaving;
        this.$scope.ctrl.closeWizard(this.$scope.ctrl.selectedWidget, this.widgetProperties, () => {
            this.close();
            this.ctaDisabled = false;
            this.cta = this.ctaSave;
        });
    };

    getWidgetPreview = _.debounce((state, newState) => {
        this.widgetPreview = false;
        if (newState.widget.key.length === 0) {
            this.$scope.$digest();
            return;
        }
        this.$timeout(() => {
            // triggering digest loop
            try {
                this.widgetProperties = newState.widget;
                this.widgetPreview = this.widgetFactoryService.create({
                    dashboardId: "PREVIEW",
                    width: widgetSettings.getDefaultWidgetSize(newState.widget.type),
                    properties: newState.widget,
                });
            } catch (e) {
                // console.error(e)
            }
        });
    }, 200);

    create = () => {
        this.creatingDashboard = true;
        this.dashboardService.addNewDashboard().then((dashboard) => {
            this.$swNgRedux.dispatch(setSharedWithMeDashboards());
            this.creatingDashboard = false;
            this.swNavigator.go("dashboard-created", {
                dashboardId: dashboard.id,
            });
        });
        this.clearSelectedTemplate();
    };

    async createWithWidget() {
        const newDashboard = {
            title: this.dashboardService.generateNewTitle(
                i18nFilter()("home.page.dashboard.new"),
                "title",
            ),
            widgets: [
                {
                    properties: JSON.stringify(this.widgetProperties),
                    pos: JSON.stringify(
                        Object.assign(this.dashboardService.widgetPosMaker(this.widgetProperties), {
                            sizeX: this.widgetProperties.width,
                        }),
                    ),
                },
            ],
        };
        const created = await this.dashboardService.bulkAddDashboards([newDashboard]);
        if (created && created.length && created.length > 0) {
            if (this.originType && this.originId) {
                await DashboardTemplateService.linkDashboardToOrigin(
                    this.originType,
                    this.originId,
                    created[0].id,
                );
                this.clearSelectedTemplate();
                return Promise.resolve(created);
            } else {
                this.clearSelectedTemplate();
                return Promise.resolve(created);
            }
        }
    }
}

function mapStateToThis({ customDashboard: { dashboardTemplate } }) {
    return {
        selectedTemplate: dashboardTemplate.selectedTemplate,
        originType: dashboardTemplate.originType,
        originId: dashboardTemplate.originId,
    };
}

function mapDispatchToThis(dispatch) {
    return {
        clearSelectedTemplate: () => {
            dispatch(clearSelectedTemplate());
        },
    };
}

angular
    .module("sw.common")
    .controller(
        "reactWizardController",
        ReactWizardController as ng.Injectable<ng.IControllerConstructor>,
    );
