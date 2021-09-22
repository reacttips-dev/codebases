import { useTrack } from "components/WithTrack/src/useTrack";
import createHomePageTrackingService from "../services/tracking/homePageTrackingService";

const useHomePageTrackingService = () => {
    const [track] = useTrack();

    return createHomePageTrackingService(track);
};

export default useHomePageTrackingService;
