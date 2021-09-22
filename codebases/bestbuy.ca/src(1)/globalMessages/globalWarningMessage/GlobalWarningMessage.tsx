import * as React from "react";
import { GlobalErrorMessage } from "./../globalErrorMessage";
// TODO: get rid of this after rebranding cutover
class GlobalWarningMessage extends React.Component {
    render() {
        return React.createElement(GlobalErrorMessage, Object.assign({}, this.props));
    }
}
export default GlobalWarningMessage;
//# sourceMappingURL=GlobalWarningMessage.js.map