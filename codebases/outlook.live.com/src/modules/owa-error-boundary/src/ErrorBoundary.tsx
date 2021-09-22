import * as React from 'react';
import { observer } from 'mobx-react';
import { errorThatWillCauseAlert, TraceErrorObject } from 'owa-trace';

export interface ErrorComponentProps {
    error: Error;
    windowIcons?: React.FunctionComponent<any>;
}

export enum ErrorComponentType {
    Full,
    Simple,
    None,
}

export interface ErrorBoundaryProps {
    children?: React.ReactNode;
    onError?: (error: TraceErrorObject, errorInfo: React.ErrorInfo) => void;
    type?: ErrorComponentType;
    fullErrorComponent?: React.ComponentType<{ error: Error } & any>;
    fullErrorComponentProps?: any;
    suppressErrorReport?: boolean;
    windowIcons?: React.FunctionComponent<any>;
}

export interface ErrorBoundaryState {
    error?: TraceErrorObject;
}

@observer
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {};
    }

    componentDidCatch(error: TraceErrorObject, errorInfo: React.ErrorInfo) {
        this.props.onError?.(error, errorInfo);

        if (!this.props.suppressErrorReport) {
            error.component = true;
            error.diagnosticInfo = (error.diagnosticInfo || '') + errorInfo.componentStack;
            errorThatWillCauseAlert(error);
        }

        this.setState({
            error: error,
        });
    }

    render() {
        const { error } = this.state;
        const { children, type, windowIcons } = this.props;

        if (error) {
            if (type == ErrorComponentType.None) {
                return null;
            } else if (type == ErrorComponentType.Simple || !this.props.fullErrorComponent) {
                return <div>{error}</div>;
            }

            const FullErrorComponent = this.props.fullErrorComponent;

            return (
                <FullErrorComponent
                    error={error}
                    windowIcons={windowIcons}
                    {...this.props.fullErrorComponentProps}
                />
            );
        } else {
            return children;
        }
    }
}
