import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import {
    StyledAutoRerunTooltipDescription,
    StyledSaveSearchAutoRerunText,
} from "pages/lead-generator/lead-generator-wizard/components/SaveSearch/StyledSaveSearchComponent";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import {
    SAVE_SEARCH_RE_RUN_SWITCH_TEXT,
    SAVE_SEARCH_RE_RUN_TOOLTIP_DESCRIPTION,
    SAVE_SEARCH_RE_RUN_TOOLTIP_MAX_WIDTH,
} from "../../constants/constants";

export type SavedSearchReRunSwitchProps = {
    toggled: boolean;
    disabled: boolean;
    className?: string;
    disabledReasonText: string;
    onToggle(toggled: boolean): void;
};

const SavedSearchReRunSwitch: React.FC<SavedSearchReRunSwitchProps> = ({
    toggled,
    disabled,
    className = null,
    disabledReasonText,
    onToggle,
}) => {
    const translate = useTranslation();
    const [switched, setSwitched] = React.useState(toggled);

    React.useEffect(() => {
        setSwitched(toggled);
    }, [toggled]);

    function handleSwitch() {
        setSwitched(!switched);
        onToggle(!switched);
    }

    function renderTooltipDescription() {
        let description = translate(SAVE_SEARCH_RE_RUN_TOOLTIP_DESCRIPTION);

        if (disabled) {
            description = disabledReasonText;
        }

        return <StyledAutoRerunTooltipDescription>{description}</StyledAutoRerunTooltipDescription>;
    }

    return (
        <PlainTooltip
            placement="bottom"
            tooltipContent={renderTooltipDescription()}
            maxWidth={SAVE_SEARCH_RE_RUN_TOOLTIP_MAX_WIDTH}
        >
            <div className={className}>
                <StyledSaveSearchAutoRerunText>
                    {translate(SAVE_SEARCH_RE_RUN_SWITCH_TEXT)}
                </StyledSaveSearchAutoRerunText>
                <OnOffSwitch isDisabled={disabled} isSelected={switched} onClick={handleSwitch} />
            </div>
        </PlainTooltip>
    );
};

export default SavedSearchReRunSwitch;
