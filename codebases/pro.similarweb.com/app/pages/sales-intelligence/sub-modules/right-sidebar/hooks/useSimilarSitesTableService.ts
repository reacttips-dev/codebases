import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SimilarSiteType } from "../types/similar-sites";
import createSimilarSitesTableService from "../services/similarSitesTableService";

const useSimilarSitesTableService = (websites: SimilarSiteType[]) => {
    const translate = useTranslation();

    return React.useMemo(() => createSimilarSitesTableService(websites, translate), [websites]);
};

export default useSimilarSitesTableService;
