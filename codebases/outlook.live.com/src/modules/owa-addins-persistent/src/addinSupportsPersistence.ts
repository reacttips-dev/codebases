import type { AddinCommand } from 'owa-addins-store';

export default function addinSupportsPersistence(addin: AddinCommand): boolean {
    return addin.isActionable && (<any>addin.control).Action.SupportsPersistence;
}
