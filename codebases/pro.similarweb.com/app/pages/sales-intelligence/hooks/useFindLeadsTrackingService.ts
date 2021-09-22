import { useTrack } from "components/WithTrack/src/useTrack";
import createFindLeadsTrackingService from "../services/tracking/findLeadsTrackingService";

const useFindLeadsTrackingService = () => {
    const [track] = useTrack();

    return createFindLeadsTrackingService(track);
};

export default useFindLeadsTrackingService;
