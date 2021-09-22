import React from "react";
import useFiltersRegistry from "../hooks/useFiltersRegistry";
import { SupportedFilterKey } from "../types/filters";
import { FilterContainerProps, WithFilterKeyProp, WithFiltersKeysProp } from "../types/common";

type WithFiltersGroupRegistryProps = {
    groupFilters: {
        key: SupportedFilterKey;
        Component: React.ComponentType<
            WithFilterKeyProp & Pick<FilterContainerProps, "onRegister">
        >;
    }[];
    onFilterRegister(key: string): void;
};

type ConsumerProps = WithFiltersKeysProp & {
    renderContent(): React.ReactNode;
};

const withFiltersGroupRegistry = <PROPS extends ConsumerProps>(
    ConsumerComponent: React.ComponentType<PROPS>,
) => {
    return function WrappedWithFiltersGroupRegistry(
        props: WithFiltersGroupRegistryProps & Omit<PROPS, keyof ConsumerProps>,
    ) {
        const { groupFilters, onFilterRegister, ...rest } = props;
        const { filtersKeys, registerFilter } = useFiltersRegistry();

        const handleFilterRegister = (key: SupportedFilterKey) => {
            registerFilter(key);
            onFilterRegister(key);
        };

        const renderContent = () => {
            return (
                <>
                    {groupFilters.map((filter) => (
                        <filter.Component
                            key={filter.key}
                            filterKey={filter.key}
                            onRegister={handleFilterRegister}
                        />
                    ))}
                </>
            );
        };

        return (
            <ConsumerComponent
                filtersKeys={filtersKeys}
                renderContent={renderContent}
                {...((rest as unknown) as PROPS)}
            />
        );
    };
};

export default withFiltersGroupRegistry;
