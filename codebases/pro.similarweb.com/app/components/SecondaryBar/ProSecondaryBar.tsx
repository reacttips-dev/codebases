import { NavBar } from "@similarweb/ui-components/dist/navigation-bar";
import { setSecondaryBarType, toggleSecondaryBar } from "actions/secondaryBarActions";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC, useEffect, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { SecondaryBarContext } from "./Utils/SecondaryBarContext";
import { resolveSecondaryBarContents } from "./Utils/SecondaryBarResolver";
import _ from "lodash";
import { Injector } from "common/ioc/Injector";
import { IRootScopeService } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import { IRouterState } from "routes/allStates";

interface IProSecondaryBarProps {
    params: any; // From redux routing store
    currentPage: string; // From redux routing store
    currentModule: string; // From redux routing store
    isSecondaryBarOpened: boolean; // From redux secondaryBar store
    secondaryBarType: SecondaryBarType; // From redux secondaryBar store
    toggleSecondaryBar: (isOpened: boolean) => void; // From redux secondaryBar store
    setSecondaryBarType: (type: SecondaryBarType) => void; // From redux secondaryBar store
}

const ProSecondaryBar: FC<IProSecondaryBarProps> = (props) => {
    const {
        params,
        currentPage,
        currentModule,
        isSecondaryBarOpened,
        secondaryBarType,
        toggleSecondaryBar,
        setSecondaryBarType,
    } = props;

    const context = {
        params,
        currentPage,
        currentModule,
        toggleSecondaryBar,
        setSecondaryBarType,
    };

    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            rootScope: Injector.get<IRootScopeService>("$rootScope"),
        };
    }, []);

    /**
     * The state tree contains states that have a field called "secondaryBarType".
     * this function searches through the state tree, until a relevant state is found
     * and updates the secondary bar type according to the given state.
     */
    const resolveSecondaryBarTypeFromState = useCallback((state: IRouterState) => {
        const stateWithType = services.swNavigator.getNearestStateWithSecondaryBarType(state);
        const secondaryBarType = stateWithType?.secondaryBarType ?? "None";
        return secondaryBarType;
    }, []);

    const resolveSecondaryBarIsOpen = useCallback((state: IRouterState) => {
        const stateWithOpenSetting = services.swNavigator.getNearestStateWithSecondaryOpenStatus(
            state,
        );
        const secondaryBarIsOpen = stateWithOpenSetting?.isSecondaryBarOpen ?? null;
        return secondaryBarIsOpen;
    }, []);

    useEffect(() => {
        // Upon initial load of the secondary bar, we want to resolve the initial secondary bar type
        // according to the current state. this is done to handle cases where the user refreshed the
        // browser, or accessed a url directly.
        const initialState = services.swNavigator.current();
        const initialBarType = resolveSecondaryBarTypeFromState(initialState);
        setSecondaryBarType(initialBarType);

        // Whenever a route is updated - resolve the relevant secondary bar type
        // and open/closed state
        // from the navigation state tree.
        const handleStateUpdate = _.debounce((evt, toState) => {
            const updatedSecondaryBarType = resolveSecondaryBarTypeFromState(toState);
            setSecondaryBarType(updatedSecondaryBarType);

            const isSecondaryBarOpen = resolveSecondaryBarIsOpen(toState);
            if (isSecondaryBarOpen !== null) {
                toggleSecondaryBar(isSecondaryBarOpen);
            }
        }, 100);

        services.rootScope.$on("navUpdate", handleStateUpdate);
        services.rootScope.$on("navChangeComplete", handleStateUpdate);
    }, [services]);

    const contents = useMemo(() => {
        return resolveSecondaryBarContents(secondaryBarType);
    }, [secondaryBarType]);

    const navBarContainerClassName = useMemo(() => {
        return services.swNavigator.getPropertyValueFromHierarchy(
            currentPage,
            "navBarContainerClassName",
        );
    }, [currentPage]);

    return (
        <SecondaryBarContext.Provider value={context}>
            <div style={{ height: "100%" }} className={navBarContainerClassName}>
                <NavBar
                    height={"100%"}
                    isVisible={isSecondaryBarOpened && secondaryBarType !== "None"}
                    getHeaderComponent={() => contents?.SecondaryBarHeader}
                    getBodyComponent={() => contents?.SecondaryBarBody}
                    getFooterComponent={() => contents?.SecondaryBarFooter}
                />
            </div>
        </SecondaryBarContext.Provider>
    );
};

const mapStateToProps = (state) => {
    const { currentPage, currentModule, params } = state.routing;
    const { isSecondaryBarOpened, secondaryBarType } = state.secondaryBar;

    return {
        params,
        currentPage,
        currentModule,
        isSecondaryBarOpened,
        secondaryBarType,
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        toggleSecondaryBar: (isOpened: boolean) => {
            dispatch(toggleSecondaryBar(isOpened));
        },
        setSecondaryBarType: (type: SecondaryBarType) => {
            dispatch(setSecondaryBarType(type));
        },
    };
};

const connectedBar = connect(mapStateToProps, mapDispatchToProps)(ProSecondaryBar);
export default SWReactRootComponent(connectedBar, "ProSecondaryBar");
