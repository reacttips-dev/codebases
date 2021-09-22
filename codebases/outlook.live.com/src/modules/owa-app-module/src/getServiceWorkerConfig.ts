import { Module } from 'owa-workloads/lib/store/schema/Module';
import { ServiceWorkerConfig } from 'owa-shared-bootstrap';

export function getServiceWorkerConfig(
    mod: Module,
    isInstallingOpx?: boolean
): ServiceWorkerConfig | undefined {
    switch (mod) {
        case Module.CalendarDeepLink:
            return isInstallingOpx
                ? {
                      app: 'calendarDeepOpx',
                      expectedXAppNameHeader: 'CalendarDeepOpx',
                  }
                : undefined;
        case Module.Mail:
        case Module.Calendar:
        case Module.FilesHub:
            return {
                app: 'mail',
                expectedXAppNameHeader: 'Mail',
            };
    }
    return undefined;
}
