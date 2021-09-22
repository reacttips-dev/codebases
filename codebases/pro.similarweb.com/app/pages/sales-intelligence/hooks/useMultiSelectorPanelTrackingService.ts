import { useTrack } from "components/WithTrack/src/useTrack";
import createMultiSelectorPanelTrackingService from "../services/tracking/createMultiSelectorPanelService";

const useMultiSelectorPanelTrackingService = () => {
    const [track] = useTrack();

    return createMultiSelectorPanelTrackingService(track);
};

export default useMultiSelectorPanelTrackingService;
