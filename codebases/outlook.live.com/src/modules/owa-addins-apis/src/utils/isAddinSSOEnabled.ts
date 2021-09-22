import { getWebApplicationResourceForAddin } from 'owa-addins-store';

export default function isAddinSSOEnabled(controlId: string): boolean {
    return !!getWebApplicationResourceForAddin(controlId);
}
