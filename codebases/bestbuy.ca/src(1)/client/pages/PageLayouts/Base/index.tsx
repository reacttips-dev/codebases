import * as React from "react";
import Header from "components/Header";
import Footer from "components/Footer";
import PageContent from "../../../components/PageContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as styles from "./styles.css";

export interface BaseLayoutProps {
    isStandalone?: boolean;
}

export interface LoaderProps {
    useLoader?: boolean;
    loading?: boolean;
}

const LoadingScreen: React.FunctionComponent = () => {
    const [showSpinner, setSpinnerVisibility] = React.useState(false);
    let timeoutId: number;

    React.useEffect(() => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            setSpinnerVisibility(true);
        }, 500);
        return () => window.clearTimeout(timeoutId);
    });

    return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner}>
                {showSpinner && <CircularProgress className={styles.circularSpinner} />}
            </div>
        </div>
    );
};

const BaseLayout: React.FC<BaseLayoutProps> = ({children, isStandalone}) => (
    <>
        {!isStandalone && <Header />}
        <PageContent>{children}</PageContent>
        {!isStandalone && <Footer />}
    </>
);

export const withLoadingScreen = <T extends {}>(
    Component: React.ComponentType<T>,
): React.FunctionComponent<T & LoaderProps> => {
    return (props) => {
        return <Component {...props}>{props.loading ? <LoadingScreen /> : props.children}</Component>;
    };
};

export const withBaseLayout = <T extends {}>(
    Component: React.ComponentType<T>,
): React.FunctionComponent<T & BaseLayoutProps> => {
    return (props) => (
        <BaseLayout {...props}>
            <Component {...props} />
        </BaseLayout>
    );
};
