import { useTrack } from "components/WithTrack/src/useTrack";
import createStaticListTrackingService from "../services/tracking/staticListTrackingService";

const useStaticListTrackingService = () => {
    const [track] = useTrack();

    return createStaticListTrackingService(track);
};

export default useStaticListTrackingService;
