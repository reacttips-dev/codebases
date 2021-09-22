import React from "react";
import { BenchmarksQuotaType } from "../../types/benchmarks";
import GeneratorQuotaExceeded from "../GeneratorQuotaExceeded/GeneratorQuotaExceeded";

type GeneratorUltimateContainerProps = {
    hasResults: boolean;
    quota: BenchmarksQuotaType;
    children: React.ReactNode | React.ReactNode[];
};

const GeneratorUltimateContainer = (props: GeneratorUltimateContainerProps) => {
    const { quota, hasResults, children } = props;

    if (hasResults || quota.remaining > 0) {
        return <>{children}</>;
    }

    return <GeneratorQuotaExceeded viewsLimit={quota.total} />;
};

export default GeneratorUltimateContainer;
