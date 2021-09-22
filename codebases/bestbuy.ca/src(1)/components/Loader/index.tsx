import CircularProgress from "material-ui/CircularProgress";
import * as React from "react";
export const Loading = () => (React.createElement("div", { style: { textAlign: "center" } },
    React.createElement(CircularProgress, { style: { marginTop: "40px" } })));
const Loader = (props) => React.createElement("div", null,
    props.isLoading && React.createElement(Loading, null),
    props.isLoading || props.children);
export default Loader;
//# sourceMappingURL=index.js.map