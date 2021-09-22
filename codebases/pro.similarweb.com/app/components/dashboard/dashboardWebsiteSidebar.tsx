import * as React from "react";
import { Component } from "react";
import { Injector } from "common/ioc/Injector";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import autobind from "autobind-decorator";
import { Sidebar } from "@similarweb/ui-components/dist/sidebar";
import { DashboardWebsitesEditor } from "./dashboardWebsitesEditor";

@SWReactRootComponent
export class DashboardWebsiteSidebar extends Component<
    {
        //Props
        websites: Array<any>;
        onClickFunc(websiteMap): (websiteMap) => void;
        onSideBarToggle(): () => void;
        onSideBarClose(): () => void;
        isOpen: boolean;
    },
    {
        //State
    }
> {
    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <Sidebar
                isSidebarOpen={this.props.isOpen}
                animationDirection={"right"}
                onSidebarToggle={this.props.onSideBarToggle}
                onCloseButtonClick={this.props.onSideBarClose}
                showCloseButton={true}
            >
                <DashboardWebsitesEditor
                    websites={this.props.websites}
                    onClickFunc={this.props.onClickFunc}
                />
            </Sidebar>
        );
    }
}
