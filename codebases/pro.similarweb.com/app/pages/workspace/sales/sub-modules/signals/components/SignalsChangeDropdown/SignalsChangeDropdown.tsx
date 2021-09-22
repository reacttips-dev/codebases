import React from "react";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { SignalWithId } from "../../types";

// Constants
import {
    SIGNALS_CHANGE_DROPDOWN_DEFAULT_ITEM,
    SIGNALS_CHANGE_DROPDOWN_DEFAULT_ITEM_CODE,
    SIGNALS_CHANGE_DROPDOWN_TITLE,
    SIGNALS_CHANGE_DROPDOWN_TITLE_PREFIX,
} from "../../constants";

// Hooks
import { useTranslation } from "components/WithTranslation/src/I18n";

// Helpers
import { hasNonZeroCount, isSubFilterItemSelected } from "../../helpers";
import signalsTrackingService from "../../services/signalsTrackingService";

type SignalsChangeDropdownProps = {
    value: string | null;
    disabled?: boolean;
    className?: string;
    selectedSignal: SignalWithId;
    onChange(key: string): void;
};

const SignalsChangeDropdown: React.FC<SignalsChangeDropdownProps> = ({
    onChange,
    selectedSignal,
    className = null,
    disabled = false,
    value,
}) => {
    const t = useTranslation();
    const resetSelection = React.useCallback(() => {
        onChange(null);
    }, [onChange]);
    const handleSelection = React.useCallback(
        (item: { id: string; children: string }) => {
            signalsTrackingService.trackSubFiltersDropdownSelection(item.id);

            if (item.id === SIGNALS_CHANGE_DROPDOWN_DEFAULT_ITEM_CODE) {
                resetSelection();
            } else {
                onChange(item.id);
            }
        },
        [onChange],
    );
    const trackToggleAction = React.useCallback(
        (open, clickedOutside) => {
            if (open) {
                signalsTrackingService.trackSubFiltersDropdownOpen(selectedSignal.id);
            } else if (clickedOutside) {
                signalsTrackingService.trackSubFiltersDropdownClose(selectedSignal.id);
            }
        },
        [selectedSignal],
    );
    const renderItems = React.useCallback(() => {
        return [SIGNALS_CHANGE_DROPDOWN_DEFAULT_ITEM, ...selectedSignal.sub_filters]
            .filter(hasNonZeroCount)
            .map((f) => {
                let text = getItemTranslation(f.code);

                if (f.code !== SIGNALS_CHANGE_DROPDOWN_DEFAULT_ITEM_CODE) {
                    text += ` (${f.count})`;
                }

                return (
                    <EllipsisDropdownItem
                        id={f.code}
                        key={f.code}
                        selected={isSubFilterItemSelected(f.code, value)}
                    >
                        {text}
                    </EllipsisDropdownItem>
                );
            });
    }, [value, selectedSignal]);

    React.useEffect(() => {
        if (value !== null) {
            resetSelection();
        }
    }, [resetSelection, selectedSignal]);

    function getItemTranslation(code: string): string {
        return t(`${SIGNALS_CHANGE_DROPDOWN_TITLE_PREFIX}.${code}`);
    }

    function getSelectedText(): string {
        if (value !== null) {
            return getItemTranslation(value);
        }

        return "";
    }

    return (
        <div className={className}>
            <ChipDownContainer
                tooltipDisabled
                disabled={disabled}
                onClick={handleSelection}
                onCloseItem={resetSelection}
                onToggle={trackToggleAction}
                selectedIds={{ [value]: true }}
                selectedText={getSelectedText()}
                buttonText={t(SIGNALS_CHANGE_DROPDOWN_TITLE)}
            >
                {renderItems()}
            </ChipDownContainer>
        </div>
    );
};

export default SignalsChangeDropdown;
