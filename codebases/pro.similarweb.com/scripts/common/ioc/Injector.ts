import angular from "angular";
import { AngularInjector } from "./AngularInjector";
import { AngularMockInjector } from "./AngularMockInjector";
import { SimpleInjector } from "./SimpleInjector";
import swLog from "@similarweb/sw-log";

/**
 * Injector interface
 */
export interface IInjector {
    /**
     * get an injections
     * @param name
     */
    get<T>(name: string): T;

    /**
     * check existing injection
     * @param {string} name
     * @returns {boolean}
     */
    has(name: string): boolean;

    /**
     * Invoke the method and supply the method arguments from the Injector.
     * @param func
     * @param context
     * @param locals
     */
    invoke<T>(func: (...args: any[]) => T, context?: any, locals?: any): T;

    /**
     * Create a new instance of JS type.
     * The method takes a constructor function, invokes the new operator,
     * and supplies all of the arguments to the constructor function as specified by the constructor annotation.
     * @param typeConstructor
     * @param locals
     */
    instantiate<T>(typeConstructor: { new (...args: any[]): T }, locals?: any): T;
}

const angularInjector = new AngularInjector();
const angularMockInjector = new AngularMockInjector();
let simpleInjector = new SimpleInjector({});

function getAngularInjector(): IInjector {
    return window["angular"] && angular.mock ? angularMockInjector : angularInjector;
}

/**
 * Simple IoC container, based on angular and a simple map fallback.
 */
class InjectorImpl implements IInjector {
    get<T = any>(name: string): T {
        // try simple injector first
        let res = simpleInjector.get(name);

        if (!res) {
            // try angular
            res = getAngularInjector().get(name);
        }
        if (!res) {
            throw new Error("Injector: failed to resolve " + name);
        }
        return res as T;
    }

    has(name: string): boolean {
        // try simple injector first
        return simpleInjector.has(name) || getAngularInjector().has(name);
    }

    getSafe<T>(name: string): T {
        try {
            return this.get(name);
        } catch (e) {
            swLog.error(`Injector: Failed to get("${name}")`, e);
            swLog.serverLogger(`Injector: Failed to get("${name}")`, e);
            return null;
        }
    }

    invoke<T>(func: (...args: any[]) => T, context?: any, locals?: any): T {
        return getAngularInjector().invoke(func, context, locals);
    }

    instantiate<T>(typeConstructor: { new (...args: any[]): T }, locals?: any): T {
        return getAngularInjector().instantiate(typeConstructor, locals) as T;
    }
}

export const Injector = new InjectorImpl();

export function mockInject(injections) {
    simpleInjector = new SimpleInjector(injections);
}

export function clearMockInject() {
    simpleInjector = new SimpleInjector({});
}
