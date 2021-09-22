import { hideIntercom } from "../../services/IntercomService";
import angular from "angular";

class DashboardGallery {
    public isWizardOpen;
    constructor() {
        hideIntercom();
        this.isWizardOpen = true;
    }
}

angular
    .module("sw.common")
    .controller("dashboardGallery", DashboardGallery as ng.Injectable<ng.IControllerConstructor>);
