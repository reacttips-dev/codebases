import * as React from "react";
import * as styles from "./styles.css";
import {GlobalStyles, LayoutTypes} from "../";
import {withBaseLayout, withLoadingScreen} from "../Base";
import {classname} from "utils/classname";

const Header: React.FunctionComponent = ({children}) => <div className={styles.header}>{children}</div>;

const Main: React.FunctionComponent = ({children}) => <main className={styles.main}>{children}</main>;

const SingleColumn: React.FunctionComponent = ({children}) => (
    <>
        <GlobalStyles.Provider
            value={{
                browserSizeLayout: styles.browserSizeLayout,
                siteSizeLayout: styles.siteSizeLayout,
                layoutName: LayoutTypes.singleColumn,
                contentSections: {
                    textContent: styles.textContent,
                    backgroundMountedContent: styles.backgroundMountedContent,
                },
            }}>
            <div className={classname([styles.singleColumn, LayoutTypes.singleColumn])}>{children}</div>
        </GlobalStyles.Provider>
    </>
);

const Footer: React.FunctionComponent = ({children}) => <div className={styles.footer}>{children}</div>;

export default {
    Container: withBaseLayout(SingleColumn),
    Header,
    Main: withLoadingScreen(Main),
    Footer: withLoadingScreen(Footer),
};
