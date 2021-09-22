import React, { Component, ReactNode } from "react";
interface IContentErrorProps {
    children: (p: boolean) => ReactNode;
}
export class ContentError extends Component<IContentErrorProps> {
    public static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    public render() {
        return this.props.children(this.state.hasError);
    }
    // tslint:disable-next-line:member-ordering
    public state = { hasError: false };
}
