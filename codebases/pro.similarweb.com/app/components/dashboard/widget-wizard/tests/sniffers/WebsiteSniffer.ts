import DurationService from "services/DurationService";
import { mapDispatchToProps } from "../../DashboardWizard";
import {
    dashboardWizardWidgetTypeChanged,
    dashboardWizardMetricAndFamilyChanged,
    defaultStateParams,
} from "../../actions/dashboardWizardActionCreators";
import getDefaultstate from "../../utils/dashboardWizardDefaultState";
import { Injector } from "common/ioc/Injector";

export default class WebsiteSniffer {
    protected metric: any;
    protected store: any;
    protected models: Map<any, any>;
    protected removeChangeListener: () => void;
    protected actions: any;

    constructor(metric, store) {
        this.metric = metric;
        this.store = store;
        this.models = new Map();
        const { dispatch } = store;
        this.actions = {
            dashboardWizardMetricAndFamilyChanged: (id, family, customDashboardState) =>
                dispatch(
                    dashboardWizardMetricAndFamilyChanged(customDashboardState, id, family, ""),
                ),
            ...mapDispatchToProps(dispatch),
            changeType: (type) =>
                dispatch(dashboardWizardWidgetTypeChanged(this.customDashboardState, type)),
        };
    }

    protected get customDashboardState(): any {
        const { customDashboard = getDefaultstate() } = this.store.getState();
        return customDashboard;
    }

    protected getDefaultDuration() {
        const { componentProps } = defaultStateParams(this.customDashboardState);
        const {
            raw: { from, to },
        } = DurationService.getDurationData(
            componentProps.defaultParams.duration,
            null,
            this.customDashboardState.component,
        );
        return `${from.format("YYYY.MM")}-${to.format("YYYY.MM")}`;
    }

    protected getSampleKey(): any {
        return {
            name: "cnn.com",
            image:
                "https://site-images.similarcdn.com/image?url=cnn.com&t=2&s=1&h=5028980367947358037",
            isVirtual: false,
            type: "Website",
        };
    }

    protected createModelSkeleton() {
        // we start with country = 'US' ,webSource = 'Desktop, site = 'cnn.com', duration = '3m'
        const { id, family } = this.metric;
        const {
            dashboardWizardMetricAndFamilyChanged,
            changeCountry,
            changeDuration,
            keyAppend,
        } = this.actions;
        dashboardWizardMetricAndFamilyChanged(id, family, this.customDashboardState);
        keyAppend(this.getSampleKey(), this.customDashboardState);
        changeCountry("840", this.customDashboardState);
        changeDuration(this.getDefaultDuration(), this.customDashboardState, false);
    }

    protected subscribe() {
        this.removeChangeListener = this.store.subscribe(this.onChange.bind(this));
    }

    protected onChange() {
        const { widget } = this.customDashboardState;
        if (widget && !this.models.has(JSON.stringify(widget))) {
            this.models.set(JSON.stringify(widget), widget);
        }
    }

    protected buildModels() {
        const { changeWebSource, changeType } = this.actions;
        this.customDashboardState.availableTrafficSources
            .filter(({ disabled }) => !disabled)
            .forEach(({ id: webSource }) => {
                changeWebSource(webSource, this.customDashboardState);
                this.customDashboardState.availableWidgetTypes
                    .filter(({ disabled }) => !disabled)
                    .forEach((type) => {
                        changeType(type);
                    });
            });
    }

    public getSingleModeModels() {
        return new Promise((resolve) => {
            this.createModelSkeleton();
            this.subscribe();
            this.buildModels();
            this.removeChangeListener();
            resolve(Array.from(this.models.values()));
        });
    }
}
