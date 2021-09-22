import swLog from "@similarweb/sw-log/index";
import {
    receiveSegmentsModuleMeta,
    requestSegmentsModuleMeta,
} from "actions/segmentsModuleActions";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import NgRedux from "ng-redux";
import segmentsApiService from "services/segments/segmentsApiService";
import { MODE } from "pages/segments/analysis/SegmentsAnalysisTrafficContainer";
import {
    getDurationSetupForSegmentsGroup,
    getValidDurationBySetup,
} from "pages/segments/analysis/SegmentsAnalysisHelper";
import { isAvailable } from "common/services/pageClaims";

export function checkDurationIsValid() {
    const swNavigator = Injector.get<any>("swNavigator");
    const currentRouteState = swNavigator.current();
    const { duration } = swNavigator.getParams();
    return currentRouteState.overrideDurationFilterParams?.validDuration === duration;
}

export async function loadCustomSegmentsMetadata(forceLoad = false) {
    try {
        const $ngRedux = Injector.get<NgRedux.INgRedux>("$ngRedux");
        const { segmentsModule } = $ngRedux.getState();
        if (!forceLoad && segmentsModule.customSegmentsMeta) {
            return true;
        }
        $ngRedux.dispatch(requestSegmentsModuleMeta());
        await new segmentsApiService()
            .getUserCustomSegmentsAndSegmentGroups()
            .then((customSegmentsMeta) => {
                $ngRedux.dispatch(receiveSegmentsModuleMeta(customSegmentsMeta));
            })
            .catch((error) => {
                swLog.error("request failed", error);
            });
        return true;
    } catch (e) {
        swLog.error("request failed", e);
        return true;
    }
}

export function resolveOverrideDurationFilterParams(state, params) {
    const $ngRedux = Injector.get<NgRedux.INgRedux>("$ngRedux");

    const {
        segmentsModule: { customSegmentsMeta },
    } = $ngRedux.getState();
    // get current segments group viewed
    const segmentsGroup =
        params.mode === MODE.group
            ? customSegmentsMeta.SegmentGroups.find((grp) => grp.id === params.id)
            : undefined;
    if (segmentsGroup) {
        // if viewing segments group, then get its duration filter setup and valid duration and resolve overridden duration filter params
        const groupDurationSetup = getDurationSetupForSegmentsGroup(
            segmentsGroup,
            swSettings.components[state.configId],
        );
        const validDuration = getValidDurationBySetup(groupDurationSetup, params.duration);
        return {
            validDuration,
            validComparedDuration: "",
            isDurationDisabled: !groupDurationSetup.durationEnabled,
            overrideDatepickerPresets: groupDurationSetup.allowedPresets,
            minDate: groupDurationSetup.minDate,
            maxDate: groupDurationSetup.maxDate,
        };
    }
}

export function segmentsRootController() {
    this.isReady = false;
    loadCustomSegmentsMetadata().then(() => {
        this.isReady = true;
    });
}

export function segmentsAnalysisController(controllerState) {
    return function ($scope, $timeout, swNavigator) {
        const $state = Injector.get<any>("$state");
        const updateDurationFilterParams = (state, params) => {
            $state.current.overrideDurationFilterParams = resolveOverrideDurationFilterParams(
                state,
                params,
            );
            $state.current.overrideDatepickerPreset =
                $state.current.overrideDurationFilterParams?.overrideDatepickerPresets;

            if ($state.current.overrideDurationFilterParams) {
                if ($state.current.overrideDurationFilterParams.validDuration !== params.duration) {
                    $state.current.overrideDurationFilterParams.skipValidation = false;
                    swNavigator.updateParams(
                        {
                            duration: $state.current.overrideDurationFilterParams.validDuration,
                        },
                        { location: "replace" },
                    );
                } else {
                    $state.current.overrideDurationFilterParams.skipValidation = true;
                }
            }
        };
        updateDurationFilterParams($state.current, $state.params);
        $scope.$on("navChangeSuccess", () => {
            if ($state.includes(controllerState)) {
                updateDurationFilterParams($state.current, $state.params);
            }
        });
    };
}

export const hasSegmentsClaim = () => isAvailable(swSettings.components.CustomSegments);
