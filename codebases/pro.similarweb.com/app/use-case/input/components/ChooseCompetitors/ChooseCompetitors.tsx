import {
    IChooseMyCompetitorsProps,
    SelectCompetitors,
} from "components/Workspace/Wizard/src/steps/SelectCompetitors";
import { ISite } from "components/Workspace/Wizard/src/types";
import { i18nFilter } from "filters/ngFilters";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useSimilarSites } from "../../hooks/useSimilarSites";

interface IChooseCompetitors
    extends Omit<
        IChooseMyCompetitorsProps,
        "competitors" | "showBackButton" | "enableSmallSiteNotification" | "isLoading"
    > {
    selectedSite: ISite;
}

const ChooseCompetitors: FC<IChooseCompetitors> = ({
    selectedSite,
    onCompetitorsUpdate,
    getAutoComplete,
    ...restProps
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const suggestions = useSuggestions(selectedSite, setIsLoading);
    const getSuggestions = useCallback(() => suggestions, [suggestions]);

    return (
        <SelectCompetitors
            {...restProps}
            getSuggestions={getSuggestions}
            getAutoComplete={getAutoComplete}
            onCompetitorsUpdate={onCompetitorsUpdate}
            competitors={[]}
            isLoading={isLoading}
            enableSmallSiteNotification={false}
            showBackButton={false}
        />
    );
};

const useSuggestions = (selectedSite, setIsLoading) => {
    const similarSites = useSimilarSites(selectedSite, setIsLoading);

    return useMemo(
        () => ({
            title: i18nFilter()("workspaces.marketing.wizard.add_competitors.similarsites"),
            items: similarSites,
        }),
        [similarSites],
    );
};

export default ChooseCompetitors;
