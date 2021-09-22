import * as React from "react";
import { Col } from "../Components";
export const Main = ({ xs = 12, sm = 8, md = 8, lg = 8, xl = 8, className = "", children }) => {
    return (React.createElement(Col, { tagName: "main", className: className, xs: xs, sm: sm, md: md, lg: lg, xl: xl }, children));
};
export const Aside = ({ xs = 12, sm = 4, md = 4, lg = 4, xl = 4, className = "", children }) => {
    return (React.createElement(Col, { tagName: "aside", className: className, xs: xs, sm: sm, md: md, lg: lg, xl: xl }, children));
};
//# sourceMappingURL=TwoArea.js.map