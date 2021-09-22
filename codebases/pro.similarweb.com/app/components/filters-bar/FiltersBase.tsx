import { IRootScopeService } from "angular";
import autobind from "autobind-decorator";
import { swSettings } from "common/services/swSettings";
import * as React from "react";
import { Component } from "react";
import { Injector } from "../../../scripts/common/ioc/Injector";
import * as utils from "./utils";
import { SwTrack } from "services/SwTrack";

export interface IFiltersBaseState {
    isSideBarOpen: boolean;
}

export class FiltersBase<P = {}, S extends IFiltersBaseState = IFiltersBaseState> extends Component<
    P,
    S
> {
    protected services;

    constructor(props, context) {
        super(props, context);
        this.services = {
            swSettings,
            swNavigator: Injector.get<any>("swNavigator"),
            rootScope: Injector.get<IRootScopeService>("$rootScope"),
            modalService: Injector.get<any>("$modal"),
            track: SwTrack,
        };
    }

    @autobind
    protected toggleSidebar() {
        const isSideBarOpen = !this.state.isSideBarOpen;
        this.setState({
            isSideBarOpen,
        });
    }

    @autobind
    protected onSideBarToggle(isOpen: boolean) {
        utils.trackSideBar(isOpen);
        this.setState({
            isSideBarOpen: isOpen,
        });
    }

    protected setStateAsync(newState) {
        return new Promise<void>((resolve, reject) => {
            this.setState(newState, resolve);
        });
    }

    @autobind
    protected trackFilterDropDownStatus(eventName: string) {
        return (isOpen: boolean) => {
            this.services.track.all.trackEvent("Drop down", isOpen ? "open" : "close", eventName);
        };
    }

    @autobind
    protected trackFilterValue(eventName: string, eventValue?: string) {
        this.services.track.all.trackEvent("Drop Down", "click", eventName, eventValue);
    }
}
