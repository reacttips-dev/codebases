import { IInjector } from "./Injector";
import swLog from "@similarweb/sw-log";
import angular from "angular";

export class AngularMockInjector implements IInjector {
    instance() {
        let _injector: angular.auto.IInjectorService = null;
        if (angular.mock && angular.mock.inject) {
            angular.mock.inject(($injector) => (_injector = $injector));
            if (!_injector) {
                throw new Error("Injector: cannot find angular mock injector");
            }
        } else {
            swLog.error("AngularMockInjector requires angular.mock");
        }
        return _injector;
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
