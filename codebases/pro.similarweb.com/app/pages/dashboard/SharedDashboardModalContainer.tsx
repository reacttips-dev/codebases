import swLog from "@similarweb/sw-log";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import { PureComponent } from "react";
import { allTrackers } from "services/track/track";
import {
    ShareDashboardType,
    SharedDashboardModal,
} from "../../../.pro-features/components/Dashboard/SharedDashboardModal";
import { i18nFilter } from "../../filters/ngFilters";
import { ShareDashboardService } from "./ShareDashboardService";
import { IAccountUser } from "sharing/SharingService";

interface ISharedDashboardModalContainerProps {
    isOpen: boolean;
    onCloseClick: () => void;
    step: any;
    dashboardId: string;
    dashboardTitle: string;
    setDashboardShared: () => void;
    setDashboardUnshared: () => void;
    selectedShareDashboardType: ShareDashboardType;
    sharedWithUsers: number[];
    isShared: boolean;
}

interface ISharedDashboardModalContainerState {
    sharedWithUsers?: IAccountUser[];
}

@SWReactRootComponent
export class SharedDashboardModalContainer extends PureComponent<
    ISharedDashboardModalContainerProps,
    ISharedDashboardModalContainerState
> {
    public static defaultProps = {
        selectedShareDashboardType: ShareDashboardType.All,
    };

    private services = {
        swLog,
        swTrack: {
            all: {
                trackEvent: allTrackers.trackEvent.bind(allTrackers),
            },
        },
        i18nFilter,
        ShareDashboardService,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            sharedWithUsers: [],
        };
    }

    public async componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            const { viewers } = await this.services.ShareDashboardService.getDashboardViewers(
                this.props.sharedWithUsers,
            );
            this.setState({
                sharedWithUsers: viewers,
            });
        }
    }

    public render() {
        return (
            <SharedDashboardModal
                dashboardId={this.props.dashboardId}
                dashboardTitle={this.props.dashboardTitle}
                translate={this.services.i18nFilter()}
                services={this.services}
                isOpen={this.props.isOpen}
                isShared={this.props.isShared}
                onCloseClick={this.props.onCloseClick}
                setDashboardShared={this.props.setDashboardShared}
                setDashboardUnshared={this.props.setDashboardUnshared}
                selectedShareDashboardType={this.props.selectedShareDashboardType}
                sharedWithUsers={this.state.sharedWithUsers}
            />
        );
    }
}
