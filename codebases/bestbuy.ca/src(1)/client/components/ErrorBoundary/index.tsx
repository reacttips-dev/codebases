import * as React from "react";
import ErrorBoundary, {Props as ErrorBoundaryProps} from "./ErrorBoundary";
import getLogger from "common/logging/getLogger";

export interface Props extends ErrorBoundaryProps {
  errorMsg?: string;
}
const WebappErrorBoundary: React.FC<Props> = ({errorMsg, fallback, children}) => {
  const logError = (error: string, errorInfo: any) => {
    getLogger().error(errorMsg || error);
    console.error(errorMsg || error, errorInfo);
  };
  return (
    <ErrorBoundary
      onError={logError}
      fallback={fallback}
    >
      {children}
    </ErrorBoundary>
  );
};

export default WebappErrorBoundary;
