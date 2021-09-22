import angular from "angular";
export type SWFormInputType = "text" | "password" | "checkbox" | "radio";
const inputTemplates = {
    default: "/app/components/sw-form/templates/sw-form-input-text.html",
    text: "/app/components/sw-form/templates/sw-form-input-text.html",
    checkbox: "/app/components/sw-form/templates/sw-form-input-checkbox.html",
    radio: "/app/components/sw-form/templates/sw-form-input-radio.html",
};

class SWFormInputController {
    public label: string;
    public type: SWFormInputType;
    public floatDisabled: boolean = false;
    public errorMode: boolean;
    public errorText: string;
    public width: string;
    public labelFloating: boolean = false;
    public value: any;
    public onClick: any;
    public onChange: any;
    public onFocus: any;

    static $inject = ["$scope", "$element", "$timeout"];

    constructor(private _$scope: any, private _$element: any, private _$timeout: any) {
        this.floatDisabled = false;
    }

    setLabelFloatMode() {
        this.labelFloating = true;
    }

    disableLabelFloatMode() {
        if (this.value == "") {
            this.labelFloating = false;
        }
    }

    toggleBooleanValue() {
        this.value = !this.value;
    }

    getTemplateUrl() {
        return inputTemplates[this.type] || inputTemplates["default"];
    }

    clickEvent() {
        this.toggleBooleanValue();
        this._$timeout(() => {
            this.onClick();
        });
    }

    changeEvent() {
        this.disableLabelFloatMode();
        this._$timeout(() => {
            this.onChange();
        });
    }

    focusEvent() {
        this.setLabelFloatMode();
        this._$timeout(() => {
            this.onFocus();
        });
    }
}

class SWFormInputComponent implements angular.IComponentOptions {
    public bindings: any;
    public controller: any;
    public templateUrl: string;

    constructor() {
        this.bindings = {
            label: "@",
            type: "@",
            floatDisabled: "<",
            errorMode: "<",
            errorText: "@",
            width: "@",
            value: "=",
            onClick: "&",
            onChange: "&",
            onFocus: "&",
        };
        this.controller = "swFormInputController";
        this.templateUrl = "/app/components/sw-form/templates/sw-form-input-container.html";
    }
}
angular.module("sw.form").component("swFormInput", new SWFormInputComponent());
angular
    .module("sw.form")
    .controller(
        "swFormInputController",
        SWFormInputController as ng.Injectable<ng.IControllerConstructor>,
    );
