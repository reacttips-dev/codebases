import { useTrack } from "components/WithTrack/src/useTrack";
import createContactsTrackingService from "pages/sales-intelligence/services/tracking/contactsTrackingService";

const useContactsTrackingService = () => {
    const [track] = useTrack();
    return createContactsTrackingService(track);
};

export default useContactsTrackingService;
