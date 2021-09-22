import { useTrack } from "components/WithTrack/src/useTrack";
import createRightSidebarTrackingService from "../services/tracking/rightSidebarTrackingService";

const useRightSidebarTrackingService = () => {
    const [track] = useTrack();

    return createRightSidebarTrackingService(track);
};

export default useRightSidebarTrackingService;
