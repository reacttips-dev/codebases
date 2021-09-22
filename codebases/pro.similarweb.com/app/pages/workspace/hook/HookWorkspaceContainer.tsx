import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import { TrialExpired } from "../../../../.pro-features/components/Workspace/TrialExpired/src/TrialExpired";
import TrialExpiredNoTouch from "../../../../.pro-features/components/Workspace/TrialExpiredNoTouch/src/TrialExpiredNoTouch";

const HookWorkspaceContainer = () => {
    const userName = swSettings.user.firstname;
    const isNoTouch = swSettings.components.Home.resources.CanPurchaseNoTouch;

    return !isNoTouch ? <TrialExpired userName={userName} /> : <TrialExpiredNoTouch />;
};

SWReactRootComponent(HookWorkspaceContainer, "HookWorkspaceContainer");
