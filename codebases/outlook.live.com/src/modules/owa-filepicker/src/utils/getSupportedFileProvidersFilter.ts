import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { FileProvidersFilter } from '../store/schema/FileProvidersFilter';

export default function getSupportedFileProvidersFilter(): FileProvidersFilter {
    return isConsumer()
        ? FileProvidersFilter.InsertLinkConsumer
        : FileProvidersFilter.InsertLinkBusiness;
}
