import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
export class LoadingIndicator extends React.Component {
    render() {
        return (React.createElement("div", null, this.props.isLoading ? React.createElement("div", { style: { textAlign: "center" } },
            React.createElement(CircularProgress, { style: { marginTop: "20px" } })) : this.props.children));
    }
}
export default LoadingIndicator;
//# sourceMappingURL=loading-indicator.js.map