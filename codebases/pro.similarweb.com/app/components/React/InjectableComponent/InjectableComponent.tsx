import angular from "angular";
import * as React from "react";
import swLog from "@similarweb/sw-log";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";

class InjectableComponentBase<P, S> extends React.Component<P, S> {
    protected injector;
    protected i18n;
    protected swLog;

    constructor(props?: P, context?: S) {
        super(props, context);
        this.injector = Injector;
        this.i18n = i18nFilter();
        this.swLog = swLog;
    }

    static register() {
        let clazz = this;
        let name = clazz["name"] || clazz["displayName"];
        if (!name) {
            // try regexp
            let reg = /\s*function\s*(\w+)\s*\(/.exec(clazz.toString());
            if (reg && reg.length === 2) {
                name = reg[1];
            }
        }
        if (name) {
            angular.module("sw.common").service(name, function () {
                return clazz;
            });
        } else {
            console.error(`Failed to register ${clazz}: missing name`);
        }
    }
}

export class InjectableComponentClass<P, S> extends InjectableComponentBase<P, S> {}

export class InjectableComponent extends InjectableComponentBase<any, any> {}
