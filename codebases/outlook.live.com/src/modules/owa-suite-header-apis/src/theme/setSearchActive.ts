import getO365ShellShim from '../utils/getO365ShellShim';

export default function setSearchActive(isSearchActive: boolean) {
    const shim = getO365ShellShim();
    if (shim) {
        shim.Theme.SetSearchActive(isSearchActive);
    }
}
