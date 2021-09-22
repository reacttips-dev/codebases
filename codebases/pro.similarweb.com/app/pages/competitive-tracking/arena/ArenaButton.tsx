import React, { useState } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import { PreferencesService } from "services/preferences/preferencesService";
import {
    EUserArenaOrTrackerPreference,
    UserArenaOrTrackerPreferenceKey,
} from "pages/competitive-tracking/arena/types";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export const ArenaButton = ({ onClickCallback }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const onClick = () => {
        onClickCallback();
        setIsLoading(true);
        PreferencesService.add({
            [UserArenaOrTrackerPreferenceKey]: EUserArenaOrTrackerPreference.ARENA,
        }).then(() => {
            setIsLoading(false);
        });
    };
    return (
        <Button type={"flat"} onClick={onClick} isLoading={isLoading} isDisabled={isLoading}>
            {i18nFilter()("competitive.tracker.arena.teaser.arena")}
        </Button>
    );
};
