import * as React from "react";
import * as styles from "./style.css";
const Btn = (props) => (React.createElement("button", Object.assign({ disabled: props.isDisabled, className: props.classNameList, onClick: props.onClick, type: props.type }, props.extraAttrs),
    React.createElement("span", { className: styles.content, tabIndex: -1 }, props.children)));
const Lnk = (props) => (React.createElement("a", Object.assign({ href: props.isDisabled ? "javascript:void(0);" : props.href, className: props.classNameList, onClick: props.onClick }, props.extraAttrs),
    React.createElement("span", { className: styles.content, tabIndex: -1 }, props.children)));
export class Button extends React.Component {
    render() {
        return this.props.href ? (React.createElement(Lnk, Object.assign({}, this.props, { classNameList: this.generateClassNameList() }))) : (React.createElement(Btn, Object.assign({}, this.props, { classNameList: this.generateClassNameList() })));
    }
    generateClassNameList() {
        const classList = [
            styles.button,
            this.props.appearance ? styles[this.props.appearance] : undefined,
            this.props.className,
            this.props.size ? styles[this.props.size] : undefined,
            this.props.shouldFitContainer ? styles.fitContainer : undefined,
            this.props.isDisabled ? styles.disabled : undefined,
        ];
        return classList.filter((className) => className).join(" ");
    }
}
Button.defaultProps = {
    appearance: "primary",
    isDisabled: false,
    shouldFitContainer: false,
    size: "regular",
    type: "button",
};
export default Button;
//# sourceMappingURL=button.js.map