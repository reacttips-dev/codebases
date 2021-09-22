import * as React from "react";
import * as styles from "./styles.css";
import {GlobalStyles, LayoutTypes} from "../";
import {withBaseLayout, BaseLayoutProps, withLoadingScreen} from "../Base";
import {classname} from "utils/classname";

const SideBar: React.FunctionComponent = ({children}) => <aside className={styles.sideBar}>{children}</aside>;

const Main: React.FunctionComponent = ({children}) => <main className={styles.main}>{children}</main>;

const Header: React.FunctionComponent = ({children}) => <div className={styles.header}>{children}</div>;

const Footer: React.FunctionComponent = ({children}) => <div className={styles.footer}>{children}</div>;

export const TwoColumn: React.FunctionComponent<BaseLayoutProps> = (props) => (
    <GlobalStyles.Provider
        value={{
            browserSizeLayout: styles.browserSizeLayout,
            siteSizeLayout: styles.siteSizeLayout,
            layoutName: LayoutTypes.twoColumn,
            contentSections: {
                textContent: styles.textContent,
                backgroundMountedContent: styles.backgroundMountedContent,
            },
        }}>
        <div className={classname([styles.twoColumn, LayoutTypes.twoColumn])}>{props.children}</div>
    </GlobalStyles.Provider>
);

export default {
    Container: withBaseLayout(TwoColumn),
    Header,
    Main: withLoadingScreen(Main),
    SideBar: withLoadingScreen(SideBar),
    Footer: withLoadingScreen(Footer),
};
