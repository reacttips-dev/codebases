import React from "react";
import { useTrack } from "components/WithTrack/src/useTrack";
import createSimilarSitesTrackingService from "../services/similarSItesTrackingService";

const useSimilarSitesTrackingService = (prospectDomain: string) => {
    const [track] = useTrack();

    return React.useMemo(() => {
        return createSimilarSitesTrackingService(track, prospectDomain);
    }, [prospectDomain]);
};

export default useSimilarSitesTrackingService;
