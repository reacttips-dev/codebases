import { IInjector } from "./Injector";
import angular, { auto } from "angular";
import { angularAppContainerId } from "../../../single-spa/angularjs/consts";

declare const SW_ENV: { debug: boolean };

export class AngularInjector implements IInjector {
    private _instance: auto.IInjectorService;

    private instance() {
        if (!this._instance) {
            const injectorElem = document.querySelector("#" + angularAppContainerId).children[0];
            this._instance = angular.element(injectorElem).injector();
            if (!this._instance) {
                if (SW_ENV.debug)
                    throw new Error("Injector: cannot find angular injector on bootstrap element");
            }
            // when you navigate between single spa apps you want to make sure instance is deleted so you"ll get the right injector when you come back
            this._instance.get("$rootScope").$on("$destroy", () => (this._instance = null));
        }
        return this._instance;
    }

    get<T>(name: string): T {
        return this.instance() && (this.instance().get(name) as T);
    }

    has(name: string): boolean {
        return this.instance() && this.instance().has(name);
    }

    invoke<T>(func: (...args: any[]) => T, context?: any, locals?: any): T {
        return this.instance() && this.instance().invoke(func, context, locals);
    }

    instantiate<T>(typeConstructor: { new (...args: any[]): T }, locals?: any): T {
        return this.instance() && this.instance().instantiate(typeConstructor, locals);
    }
}
