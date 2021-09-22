import * as React from "react";
import { FC, useState } from "react";
import { Injector } from "common/ioc/Injector";
import { canCreateSneak, setKeyParam } from "pages/sneakpeek/utilities";
import ResultsMain from "pages/sneakpeek/components/ResultsMain";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import DurationService from "services/DurationService";
import { SwNavigator } from "common/services/swNavigator";

const SneakpeekResultsPage: FC<any> = (props) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const [isNavError, setIsNavError] = useState<boolean>(false);
    const { queryId, duration, ...restOfParams } = swNavigator.getParams();
    const { from, to } = DurationService.getDurationData(duration).forAPI;
    const params = {
        queryId,
        duration,
        from,
        to,
        ...restOfParams,
    };

    if (!canCreateSneak() && !queryId) {
        setIsNavError(true);
        setTimeout(() => {
            swNavigator.go("websites_root-home");
        }, 3000);
    }
    if (isNavError) {
        return (
            <div className="alert alert-danger">
                <strong>Oops! Can't create a sneak! redirecting...</strong>
            </div>
        );
    }
    return (
        <ResultsMain
            selectedQueries={queryId}
            params={setKeyParam(params)}
            navigator={swNavigator}
        />
    );
};

export default SWReactRootComponent(SneakpeekResultsPage, "SneakpeekResultsPage");
