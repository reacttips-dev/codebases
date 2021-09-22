import { getStore as getLeftRailStore } from '../store/store';
import type { OfficeApp } from '../store/schema/OfficeApp';

export default function getSelectedOfficeRailApp(): OfficeApp | null {
    return getLeftRailStore().selectedApp;
}
