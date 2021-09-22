import * as React from 'react';
import App from 'owa-application/lib/components/App';
import { SkipLinkPlaceholder, SkipLinkPlaceholderHandle } from 'owa-skip-link';
import type { SearchBoxContainerHandle } from 'owa-search';
import { getBootstrapOptions } from '../optionsRegistry';
import { observer } from 'mobx-react-lite';
import { OwaSuiteHeader } from 'owa-suite-header';
import { Module } from 'owa-workloads';
import { lazySetupAppModuleKeys } from './lazy/lazyFunctions';
import { useLazyKeydownHandler } from 'owa-hotkeys';
import { applyFavicon } from 'owa-favicon';
import type { AppBarProps } from 'owa-appbar';
import isOfficeRailEnabled from 'owa-left-rail-utils/lib/isOfficeRailEnabled';
import { RebootModal } from 'owa-force-reboot';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { ProjectionPopoutHost } from 'owa-projection-popout';
import { getCurrentModule } from 'owa-app-module-store';

const DEFAULT_FAVICON_RELATIVE_PATH = 'resources/images/favicons/mail-seen.ico';

export interface AppModuleProps {
    wrapSuiteHeader?: (suiteHeader: React.ReactNode) => React.ReactNode;
    AppBarComponent?: React.FC<AppBarProps>;
}

export default observer(function AppModule(props: AppModuleProps) {
    useLazyKeydownHandler(undefined, lazySetupAppModuleKeys.importAndExecute, undefined);

    // we will default to the mail module
    const currentModule = getCurrentModule() || Module.Mail;
    const appModuleProps = getBootstrapOptions(currentModule)!.appModuleProps;
    const skipLinkRef = React.useRef<SkipLinkPlaceholderHandle>(null);
    const searchBoxRef = React.useRef<SearchBoxContainerHandle>(null);
    const isSkiplinkEnabled = appModuleProps.isSkiplinkEnabled?.();

    const renderSkipLinkPlaceholder = React.useCallback(() => {
        return isSkiplinkEnabled ? <SkipLinkPlaceholder ref={skipLinkRef} /> : undefined;
    }, [isSkiplinkEnabled]);

    const headerInfo = appModuleProps.getHeaderInfo?.(searchBoxRef);
    const headerProps = headerInfo?.props;
    if (headerProps && props.wrapSuiteHeader) {
        headerProps.wrapSuiteHeader = props.wrapSuiteHeader;
    }
    const renderHeader = React.useCallback(() => {
        const OverrideHeader = appModuleProps.overrideHeader?.();
        return isHostAppFeatureEnabled('hideAppSuiteHeader') ? undefined : OverrideHeader ? (
            <OverrideHeader />
        ) : headerProps ? (
            <OwaSuiteHeader {...headerProps} />
        ) : undefined;
    }, [
        currentModule,
        headerProps?.searchAlignmentWidth,
        headerProps?.enableResponsiveLayout,
        headerInfo?.changes,
    ]);

    applyFavicon(appModuleProps.overrideFavIcon || DEFAULT_FAVICON_RELATIVE_PATH);

    return (
        <App renderHeader={renderHeader} renderSkipLinkPlaceholder={renderSkipLinkPlaceholder}>
            {props.AppBarComponent &&
                !isHostAppFeatureEnabled('hideOfficeRail') &&
                isOfficeRailEnabled(currentModule) && (
                    <props.AppBarComponent
                        selectedModule={currentModule}
                        activeModuleAction={appModuleProps.activeModuleAction}
                    />
                )}
            {appModuleProps.renderModule(searchBoxRef, skipLinkRef)}
            {isFeatureEnabled('fwk-reboot-notif') && <RebootModal />}
            <ProjectionPopoutHost module={currentModule} />
        </App>
    );
});
