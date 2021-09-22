import React from "react";
import classNames from "classnames";
import { Collapsible } from "@similarweb/ui-components/dist/collapsible";
import useUnlockModal from "custom-hooks/useUnlockModal";
import { useTrack } from "components/WithTrack/src/useTrack";
import StyledFiltersBoxHeader from "../FiltersBoxHeader/StyledFiltersBoxHeader";
import TrialLockOverlay from "pages/lead-generator/components/TrialLockOverlay/TrialLockOverlay";
import { LeadGeneratorPrefaceBox } from "pages/lead-generator/lead-generator-new/components/elements";
import I18n, { useTranslation } from "components/WithTranslation/src/I18n";
import {
    DISABLED_FILTER_TOOLTIP_KEY,
    FILTER_EVENT_TRACK_CATEGORY,
} from "pages/lead-generator/lead-generator-new/constants";
import { buildFiltersEventTrackAction } from "pages/lead-generator/lead-generator-new/helpers";
import { usePrevious } from "components/hooks/usePrevious";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";

export type FiltersBoxProps = {
    title: string;
    subtitle: string;
    subtitleCollapsed: string;
    preface: string;
    dataAutomation: string;
    className?: string;
    trialHookName?: string;
    isDesktopOnly?: boolean;
    initiallyCollapsed?: boolean;
    disabled?: boolean;
    hasValue: boolean;
    isLocked?(): boolean;
};

const FiltersBox: React.FC<FiltersBoxProps> = (props) => {
    const {
        title,
        subtitle,
        hasValue,
        subtitleCollapsed,
        children,
        isLocked,
        preface,
        dataAutomation,
        trialHookName,
        disabled = false,
        className = null,
        initiallyCollapsed = true,
    } = props;
    const [collapsed, setCollapsed] = React.useState(initiallyCollapsed);
    const [track] = useTrack();
    const translate = useTranslation();
    const prevDisabled = usePrevious(disabled);
    const openUnlockModal = useUnlockModal(trialHookName, trialHookName, "TrialBanner");

    // Collapse the box if it becomes disabled
    React.useEffect(() => {
        if (typeof prevDisabled !== "undefined" && prevDisabled !== disabled && disabled) {
            if (!collapsed) {
                setCollapsed(true);
            }
        }
    }, [disabled, collapsed]);

    function handleCollapse(): void {
        if (disabled) return;

        const eventName = collapsed ? "Expand" : "Collapse";

        setCollapsed(!collapsed);
        track(
            FILTER_EVENT_TRACK_CATEGORY,
            "click",
            buildFiltersEventTrackAction(eventName, translate(title)),
        );
    }

    function renderBoxContent(): JSX.Element {
        if (isLocked?.() && trialHookName) {
            return (
                <TrialLockOverlay
                    onUnlockClick={openUnlockModal}
                    className={classNames({ disabled })}
                />
            );
        }

        return (
            <Collapsible
                isActive={!collapsed}
                className={classNames("filters-box-collapsible", { ["expanded"]: !collapsed })}
            >
                {children}
            </Collapsible>
        );
    }

    function renderBoxWrapper(): JSX.Element {
        if (disabled) {
            return (
                <PlainTooltip placement="top" text={translate(DISABLED_FILTER_TOOLTIP_KEY)}>
                    {renderBox()}
                </PlainTooltip>
            );
        }

        return renderBox();
    }

    function renderBox(): JSX.Element {
        return (
            <div
                data-automation={dataAutomation}
                className={classNames(className, {
                    expanded: !collapsed,
                    "with-value": hasValue,
                    disabled,
                })}
            >
                <StyledFiltersBoxHeader
                    title={title}
                    disabled={disabled}
                    collapsed={collapsed}
                    onCollapseClick={handleCollapse}
                    subtitle={collapsed ? subtitleCollapsed : subtitle}
                />
                {renderBoxContent()}
            </div>
        );
    }

    return (
        <>
            {preface && (
                <LeadGeneratorPrefaceBox>
                    <I18n>{preface}</I18n>
                </LeadGeneratorPrefaceBox>
            )}
            {renderBoxWrapper()}
        </>
    );
};

export default FiltersBox;
