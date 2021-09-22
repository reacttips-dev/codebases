import React from "react";
import { useTrack } from "components/WithTrack/src/useTrack";
import createTargetAccountsTrackingService from "../services/tracking/targetAccountsTrackingService";

const useTargetAccountsTrackingService = () => {
    const [track] = useTrack();

    return React.useMemo(() => {
        return createTargetAccountsTrackingService(track);
    }, [track]);
};

export default useTargetAccountsTrackingService;
