import * as React from "react";

export interface Props {
  fallback?: any;
  onError?: (error: string, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    public static getDerivedStateFromError() {
      return { hasError: true };
    }

    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    public componentDidCatch(error, errorInfo) {
      const {onError} = this.props;
      if (onError) {
        onError(error, errorInfo);
      }
    }

    public render() {
      if (this.state.hasError) {
        return this.props.fallback || null;
      }
      return this.props.children;
    }
}

export default ErrorBoundary;
