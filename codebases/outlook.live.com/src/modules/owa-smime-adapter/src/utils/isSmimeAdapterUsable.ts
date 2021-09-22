import { getStore } from '../store/store';
import SmimeInstallationStatus from '../store/schema/SmimeInstallationStatus';

/**
 * Returns status of S/MIME adapter
 */
export default function isSmimeAdapterUsable(): boolean {
    const smimeAdapterStore = getStore();
    return (
        smimeAdapterStore.installationStatus == SmimeInstallationStatus.Installed ||
        smimeAdapterStore.installationStatus == SmimeInstallationStatus.NotUpToDateCompatible
    );
}
