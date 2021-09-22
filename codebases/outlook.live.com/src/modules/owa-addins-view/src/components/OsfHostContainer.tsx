import * as React from 'react';
import type { IAddinCommand, IAddinCommandTelemetry } from 'owa-addins-store';
import { isPersistentTaskpaneEnabled } from 'owa-addins-feature-flags';
import {
    DisplayNotificationDelegate,
    ManifestCacheProvider,
    NotifyHostActions,
    OnInsertOsfControlDelegate,
    OsfControl,
    OsfControlAdapter,
} from 'owa-addins-osf-facade';

export interface OsfHostContainerProps extends OsfControl {
    addinCommand: IAddinCommand;
    controlId: string;
    hostItemIndex: string;
    manifestCacheProvider: ManifestCacheProvider;
    isDialog?: boolean;
    sourceLocation?: string;
    style?: React.CSSProperties;
    className?: string;
    notifyHostActions?: NotifyHostActions;
    onInsertOsfControl?: OnInsertOsfControlDelegate;
    onDisplayNotification?: DisplayNotificationDelegate;
    osfControlAdapter?: OsfControlAdapter; // Used for testing purposes only
    addinCommandTelemetry?: IAddinCommandTelemetry;
}

export class OsfHostContainer extends React.Component<OsfHostContainerProps, {}> {
    private extensionContainer: HTMLDivElement;
    private osfControlAdapter: OsfControlAdapter;

    constructor(props: OsfHostContainerProps, context?: any) {
        super(props, context);
        this.osfControlAdapter = this.props.osfControlAdapter
            ? this.props.osfControlAdapter
            : new OsfControlAdapter(
                  props.hostItemIndex,
                  props.manifestCacheProvider,
                  props.notifyHostActions,
                  props.onInsertOsfControl,
                  props.onDisplayNotification,
                  props.addinCommandTelemetry
              );
    }

    refCallback = (element: HTMLDivElement): void => {
        if (!element) {
            return;
        }

        this.extensionContainer = element;
        this.osfControlAdapter.insertOsfControl(this.props, this.extensionContainer);
    };

    handlerContainerOnFocus = (): void => {
        this.notifyAgave(OSF.AgaveHostAction.TabIn);
    };

    public componentDidMount() {
        this.osfControlAdapter.onInsertOsfControl();
    }

    //tslint:disable-next-line:react-strict-mode  Tracked by WI 78438
    public UNSAFE_componentWillReceiveProps(nextProps: OsfHostContainerProps) {
        if (isPersistentTaskpaneEnabled() && this.isNewHostItemIndex(nextProps)) {
            this.osfControlAdapter.updateHostItemIndex(nextProps.hostItemIndex);
        }
    }

    /**
     * We should only rerender if there is a new control ID (e.g. There's a different sandbox to render)
     */
    public shouldComponentUpdate(nextProps: OsfHostContainerProps): boolean {
        return this.isNewOsfControl(nextProps);
    }

    //tslint:disable-next-line:react-strict-mode  Tracked by WI 78438
    public componentWillUpdate(): void {
        this.osfControlAdapter.purgeOsfControl();
    }

    public componentDidUpdate() {
        this.osfControlAdapter.onInsertOsfControl();
    }

    public componentWillUnmount(): void {
        this.osfControlAdapter.purgeOsfControl();
        this.osfControlAdapter.dispose();
        this.osfControlAdapter = null;
    }

    public notifyAgave(action: OSF.AgaveHostAction) {
        this.osfControlAdapter.notifyAgave(action);
    }

    private isNewOsfControl(nextProps: OsfHostContainerProps) {
        return this.props.controlId != nextProps.controlId;
    }

    private isNewHostItemIndex(nextProps: OsfHostContainerProps) {
        return this.props.hostItemIndex != nextProps.hostItemIndex;
    }

    render(): JSX.Element {
        if (!!this.extensionContainer) {
            this.osfControlAdapter.insertOsfControl(this.props, this.extensionContainer);
        }

        return (
            <div
                ref={this.refCallback}
                style={this.props.style}
                className={this.props.className}
                onFocus={this.handlerContainerOnFocus}
            />
        );
    }
}
