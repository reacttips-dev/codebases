import { PureComponent } from "react";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { universalSearchOnFocus } from "../../actions/universalSearchActions";
import {
    setStateCompareStatusAction,
    setUserCompareStatusAction,
} from "../../actions/userData/userEngagementActions";
import "./QueryBar.scss";
import { setStateCompareStatus, setUserCompareStatue } from "./QueryBarUtils";
import { SwNavigator } from "common/services/swNavigator";

// https://stackoverflow.com/a/31899998
export interface ICompareItem {
    name: string;
    displayName: string;
    icon: string;
    link: string;
    isDisabled: boolean;
    color: string;
    tooltipData?: any;
}

export abstract class BaseQueryBar<P = {}, S = {}> extends PureComponent<P, S> {
    protected ref;
    protected services;
    private rootScopeHandler;
    private setStateInProgress;

    constructor(props, context) {
        super(props, context);

        this.services = {
            rootScope: Injector.get<any>("$rootScope"),
            modal: Injector.get<any>("$modal"),
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        };
    }

    public componentDidMount() {
        this.rootScopeHandler = this.services.rootScope.$on("navChangeComplete", () => {
            this.setStateInProgress = true;
            this.setState(this.getState(), () => {
                this.setStateInProgress = false;
            });
        });
    }

    public componentWillUnmount() {
        if (typeof this.rootScopeHandler === "function") {
            this.rootScopeHandler();
        }
    }

    public componentDidUpdate(prevProps, prevState) {
        // console.log('update');window.dispatchEvent(new Event('resize'));
    }

    protected abstract getState();
}

export const mapStateToProps = ({
    userData: {
        userEngagement: { userDidCompare, states },
    },
    routing: { pageChanged, chosenItems = [] },
}) => {
    return {
        userDidCompare,
        statesDidCompare: states,
        pageChanged,
        chosenItems,
    };
};

export const mapDispatchToProps = (dispatch, props) => {
    return {
        onUserDidCompare: () => {
            if (!props.userDidCompare) {
                setUserCompareStatue();
                dispatch(setUserCompareStatusAction(true));
            }
        },
        onStateCompare: (stateId) => {
            setStateCompareStatus(stateId);
            dispatch(setStateCompareStatusAction(stateId));
        },
        universalSearchOnFocus: (searchText) => {
            dispatch(universalSearchOnFocus(searchText));
        },
    };
};
