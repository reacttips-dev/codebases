export const createProps = (props, classNames) => {
    const newProps = {};
    Object.keys(props)
        .filter((key) => key === "children")
        .forEach((key) => (newProps[key] = props[key]));
    const className = classNames.filter((cn) => cn).join(" ");
    return Object.assign({}, newProps, { className });
};
export default createProps;
//# sourceMappingURL=createProps.js.map