import { IInjector } from "./Injector";

export class SimpleInjector implements IInjector {
    constructor(private map: any) {}

    get<T>(name: string): T {
        return this.map[name] as T;
    }

    has(name: string): boolean {
        return name in this.map;
    }

    invoke<T>(func: (...args: any[]) => T, context?: any, locals?: any): T {
        throw new Error("SimpleInjector.invoke() not implemented");
    }

    instantiate<T>(typeConstructor: Function, locals?: any): T {
        throw new Error("SimpleInjector.instantiate() not implemented");
    }
}
