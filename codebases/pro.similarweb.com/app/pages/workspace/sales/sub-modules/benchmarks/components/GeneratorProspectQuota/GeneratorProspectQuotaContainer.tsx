import React from "react";
import { BenchmarksQuotaType } from "../../types/benchmarks";
import GeneratorProspectQuota from "../GeneratorProspectQuota/GeneratorProspectQuota";
import GeneratorProspectQuotaExceeded from "../GeneratorProspectQuotaExceeded/GeneratorProspectQuotaExceeded";

type GeneratorProspectQuotaContainerProps = {
    hasResults: boolean;
    quota: BenchmarksQuotaType;
    children: React.ReactNode | React.ReactNode[];
    onUpgrade(): void;
    onContinue(): void;
};

const GeneratorProspectQuotaContainer = (props: GeneratorProspectQuotaContainerProps) => {
    const { quota, hasResults, children, onUpgrade, onContinue } = props;
    const [isContentShown, setIsContentShown] = React.useState(false);

    const handleContinueClick = () => {
        onContinue();
        setIsContentShown(true);
    };

    if (isContentShown) {
        return <>{children}</>;
    }

    if (hasResults || quota.remaining > 0) {
        return (
            <GeneratorProspectQuota
                remainingViews={quota.remaining}
                onContinueClick={handleContinueClick}
                onUpgradeClick={onUpgrade}
            />
        );
    }

    return <GeneratorProspectQuotaExceeded onUpgradeClick={onUpgrade} />;
};

export default GeneratorProspectQuotaContainer;
