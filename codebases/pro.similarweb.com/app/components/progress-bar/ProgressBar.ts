import angular from "angular";
import { IController } from "angular";
interface IProgressBarBindings extends IController {
    innerWidth: string;
    innerColor: string;
    backgroundColor: string;
    height: string;
    isCompare: boolean;
}

class ProgressBarCtrl implements IProgressBarBindings {
    public innerWidth: string;
    public innerColor: string;
    public backgroundColor: string;
    public height: string;
    public isCompare: boolean;
    public rawWidth: number;

    constructor() {
        this.rawWidth = parseInt(this.innerWidth, 10);
    }
}

export class ProgressBar implements ng.IComponentOptions {
    public templateUrl = "/app/components/progress-bar/progress-bar.html";
    public bindings: any = {
        innerWidth: "=",
        innerColor: "@",
        backgroundColor: "@",
        height: "@",
        isCompare: "=",
    };
    public HasTwoValues: boolean;
    public controller = ProgressBarCtrl as ng.Injectable<ng.IControllerConstructor>;

    constructor() {}
}

angular.module("sw.common").component("swProgressBar", new ProgressBar());
