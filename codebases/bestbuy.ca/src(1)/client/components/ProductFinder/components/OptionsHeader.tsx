import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Loader, LoadingSkeleton } from "@bbyca/bbyca-components";
import messages from "../translations/messages";

interface OptionsHeaderProps {
    loading: boolean;
}

export const OptionsHeaderSkeleton = () => <LoadingSkeleton.Title width={220} />;

const OptionsHeader = ({
    loading,
}: OptionsHeaderProps) => {
    return (
        <Loader
            loading={loading}
            loadingDisplay={<OptionsHeaderSkeleton />}
        >
            <h2><FormattedMessage {...messages.optionsHeader} /></h2>
        </Loader>
    );
};

export default OptionsHeader;
