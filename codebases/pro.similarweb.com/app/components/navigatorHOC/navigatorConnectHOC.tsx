import * as React from "react";
import { connect } from "react-redux";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../scripts/common/services/swNavigator";
import { batchActions } from "../../actions/marketingWorkspaceActions";

const dispatchNew = (dispatch) => (action) => {
    // handle batch of actions
    if (action.actions && Array.isArray(action.actions)) {
        const params = action.actions.reduce((result, curAction) => {
            if (curAction.urlMapping) {
                return {
                    ...result,
                    ...curAction.urlMapping,
                };
            }
            return result;
        }, {});
        return Injector.get<SwNavigator>("swNavigator").applyUpdateParams(params);
    }
    // single action
    else {
        if (action.urlMapping) {
            const params = action.urlMapping;
            return Injector.get<SwNavigator>("swNavigator").applyUpdateParams(params);
        } else {
            dispatch(action);
        }
    }
};

const mapDispatchToPropsFactory = (mapDispatchToProps) => (dispatch, ownProps) => {
    return mapDispatchToProps(dispatchNew(dispatch), ownProps);
};

export const NavigatorConnectHOC = (
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options,
    mapUrlToAction = {},
    useBatchActions = false,
) => (Component) => {
    class NavigatorConnectHOCClass extends React.PureComponent<any, any> {
        private $rootScope = Injector.get<any>("$rootScope");
        private swNavigator = Injector.get<SwNavigator>("swNavigator");
        private $off;

        constructor(props, context) {
            super(props, context);
            this.$off = this.$rootScope.$on("navUpdate", this.updateUrlParams);
            this.updateUrlParams(null, this.swNavigator.current(), this.swNavigator.getParams());
        }

        public componentWillUnmount() {
            this.$off();
        }

        public render() {
            return <Component {...this.props} />;
        }

        private updateUrlParams = (event, toState, toParams) => {
            if (useBatchActions) {
                const actions = Object.keys(mapUrlToAction).reduce((acc, paramName) => {
                    const valueFromUrl = toParams[paramName] || null;
                    const action = mapUrlToAction[paramName](valueFromUrl, toParams);
                    if (action) {
                        return [...acc, action];
                    } else {
                        return acc;
                    }
                }, []);
                if (actions) {
                    Injector.get<any>("$ngRedux").dispatch(batchActions(...actions));
                }
            } else {
                Object.keys(mapUrlToAction).forEach((paramName) => {
                    const valueFromUrl = toParams[paramName] || null;
                    const action = mapUrlToAction[paramName](valueFromUrl, toParams);
                    if (action) {
                        Injector.get<any>("$ngRedux").dispatch(action);
                    }
                });
            }
        };
    }

    return connect(
        mapStateToProps,
        mapDispatchToPropsFactory(mapDispatchToProps),
        mergeProps,
        options,
    )(NavigatorConnectHOCClass);
};
