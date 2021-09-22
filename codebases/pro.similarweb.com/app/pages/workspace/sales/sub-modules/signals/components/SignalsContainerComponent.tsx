import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SignalWithId } from "../types";
import { AD_NETWORKS_FILTER_ID, SIGNAL_NAME_PREFIX } from "../constants";
import { StyledChangeDropdown } from "./SignalsChangeDropdown/styles";
import { SignalsContainerConnectedProps } from "./SignalsContainer";
import SignalsMainDropdownContainer from "./SignalsMainDropdown/SignalsMainDropdownContainer";
import AdNetworksDropdownContainer from "../../feed/components/AdNetworksDropdown/AdNetworksDropdown";

export type SignalsContainerProps = {
    disabled?: boolean;
    className?: string;
    workspaceId: string;
    updatingList: boolean;
    countryCode: number;
    opportunitiesListId: string;
    onChange(eventFilterType?: string, eventFilterSubType?: string): void;
};

const SignalsContainerComponent: React.FC<
    SignalsContainerConnectedProps & SignalsContainerProps
> = ({
    countryCode,
    isSignalsFetching,
    workspaceId,
    opportunitiesListId,
    mostUsedSignalsKeys,
    updatingList,
    className = null,
    disabled = false,
    selectedSignal,
    selectedSubFilterId,
    selectSignal,
    onChange,
    updateSignalsUse,
    selectSignalSubFilter,
    selectTab,
    fetchSignals,
    fetchSignalsForAllOrInverse,
    getSignalUse,
    syncSignalUse,
}) => {
    const translate = useTranslation();

    const handleClose = useCallback(() => {
        selectTab(0);
        selectSignal(null);
        selectSignalSubFilter(null);
        onChange();
    }, [onChange]);

    const handleSelect = useCallback(
        (id: SignalWithId["id"]) => {
            selectSignal(id);
            selectSignalSubFilter(null);
            updateSignalsUse({ listId: opportunitiesListId, itemId: id });
            onChange(id);
        },
        [opportunitiesListId],
    );

    const handleSecondSelect = useCallback(
        (subType: string) => {
            selectSignalSubFilter(subType);
            onChange(selectedSignal.id, subType ? subType : undefined);
        },
        [selectedSignal],
    );

    const selectedText = useMemo(() => {
        if (!selectedSignal) {
            return null;
        }

        return translate(`${SIGNAL_NAME_PREFIX}.${selectedSignal.id}`);
    }, [selectedSignal]);

    const selectedId = useMemo(() => {
        if (!selectedSignal) {
            return null;
        }

        return selectedSignal.id;
    }, [selectedSignal]);

    useEffect(() => {
        fetchSignals(workspaceId, opportunitiesListId, countryCode);
        fetchSignalsForAllOrInverse(workspaceId, opportunitiesListId, countryCode);
        getSignalUse();

        return () => {
            syncSignalUse();
            selectSignal(null);
            selectSignalSubFilter(null);
        };
    }, []);

    useEffect(() => {
        if (updatingList) {
            selectSignal(null);
            selectSignalSubFilter(null);
        }
    }, [updatingList]);

    function renderSecondDropdown() {
        if (typeof selectedSignal?.sub_filters === "undefined") {
            return null;
        }

        if (selectedId === AD_NETWORKS_FILTER_ID) {
            return (
                <AdNetworksDropdownContainer
                    value={selectedSubFilterId}
                    selectedSignal={selectedSignal}
                    onChange={handleSecondSelect}
                    disabled={disabled || isSignalsFetching}
                    opportunitiesListId={opportunitiesListId}
                />
            );
        }

        return (
            <StyledChangeDropdown
                value={selectedSubFilterId}
                selectedSignal={selectedSignal}
                onChange={handleSecondSelect}
                disabled={disabled || isSignalsFetching}
            />
        );
    }

    return (
        <div className={className}>
            <SignalsMainDropdownContainer
                selected={selectedId}
                onChange={handleSelect}
                selectedText={selectedText}
                onCloseItem={handleClose}
                disabled={disabled || isSignalsFetching}
                mostUsedSignalsKeys={mostUsedSignalsKeys}
            />
            {renderSecondDropdown()}
        </div>
    );
};

export default SignalsContainerComponent;
