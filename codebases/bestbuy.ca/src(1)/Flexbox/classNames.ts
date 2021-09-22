import * as styles from "./styles/style.css";
export const getClass = (className) => {
    return styles && styles[className] ? styles[className] : className;
};
export default getClass;
//# sourceMappingURL=classNames.js.map