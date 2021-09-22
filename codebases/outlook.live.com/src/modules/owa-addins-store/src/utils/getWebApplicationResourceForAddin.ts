import getAddinCommandForControl from '../store/getAddinCommandForControl';

export default function getWebApplicationResourceForAddin(controlId: string) {
    return getAddinCommandForControl(controlId).extension.WebApplicationResource;
}
