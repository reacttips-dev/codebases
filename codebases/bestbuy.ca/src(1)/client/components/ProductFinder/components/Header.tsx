import * as React from "react";
import { Loader, LoadingSkeleton } from "@bbyca/bbyca-components";
import { FormattedMessage } from "react-intl";
import * as styles from "../styles.css";
import messages from "../translations/messages";

interface HeaderProps {
    loading: boolean;
}

export const HeaderSkeleton = () => (
    <>
        <LoadingSkeleton.Title maxWidth={150} />
        <LoadingSkeleton.Line maxWidth={350} />
    </>
);

const Header = ({
    loading,
}: HeaderProps) => {
    return (
        <Loader
            loading={loading}
            loadingDisplay={<HeaderSkeleton />}
        >
            <h2>
                <FormattedMessage {...messages.startingHeader} />
            </h2>
            <p className={styles.subHeader}>
                <FormattedMessage {...messages.startingSubHeader} />
            </p>
        </Loader>
    );
};

export default Header;
