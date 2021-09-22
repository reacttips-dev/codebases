import { isFeatureEnabled } from 'owa-feature-flags';
import { Module } from 'owa-workloads';

export default function isOfficeRailEnabled(selectedModule: Module): boolean {
    return (
        isFeatureEnabled('tri-officeRail') &&
        (selectedModule === Module.Mail ||
            selectedModule === Module.Calendar ||
            selectedModule === Module.AppHost ||
            selectedModule === Module.People ||
            selectedModule === Module.FilesHub)
    );
}
