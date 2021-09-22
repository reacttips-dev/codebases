import getO365ShellShim from './getO365ShellShim';

export function updateHeaderButtonState(id: string, isActive: boolean) {
    getO365ShellShim().Extensibility.UpdateButtonState(id, isActive);
}
