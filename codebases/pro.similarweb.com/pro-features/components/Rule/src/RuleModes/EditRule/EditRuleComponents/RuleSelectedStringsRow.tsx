import React from "react";
import { i18nFilter } from "filters/ngFilters";
import {
    CustomStringsChipsContainer,
    CustomStringsChipsRowContainer,
    CustomStringsChipsRowTitle,
    CustomStringsViewAllChipsLink,
} from "components/Rule/src/RuleModes/EditRule/EditRuleModeStyles";
import { CompleteRuleChipItem } from "components/Rule/src/styledComponents";
import { FullStringListModal } from "components/Rule/src/RuleModes/EditRule/EditRuleModals/FullStringListModal";

const MAX_CHIPS_IN_ROW = 10;

interface IRuleSelectedStringsRowProps {
    stringsList: string[];
    title: string;
    onRemoveStrings: (strings: string[]) => void;
}

export const RuleSelectedStringsRow: React.FC<IRuleSelectedStringsRowProps> = (props) => {
    const { stringsList, title, onRemoveStrings } = props;

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const chipsContainerRef = React.useRef(null);
    const chipsViewAllLinkRef = React.useRef(null);
    const [isOpenViewAllChipsModal, setIsOpenViewAllChipsModal] = React.useState(false);

    const openViewAllChipsModal = React.useCallback(() => {
        setIsOpenViewAllChipsModal(true);
    }, []);

    const closeViewAllChipsModal = React.useCallback(() => {
        setIsOpenViewAllChipsModal(false);
    }, []);

    // show view all strings button in case not all strings are viewed in a single row.
    React.useLayoutEffect(() => {
        if (chipsContainerRef.current) {
            chipsViewAllLinkRef.current.style.display = "none";
            if (
                stringsList.length > MAX_CHIPS_IN_ROW ||
                chipsContainerRef.current.scrollHeight > chipsContainerRef.current.offsetHeight
            ) {
                chipsViewAllLinkRef.current.style.display = "block";
            }
        }
    }, [stringsList]);

    return (
        <CustomStringsChipsRowContainer>
            <CustomStringsChipsRowTitle>{title}:</CustomStringsChipsRowTitle>
            <CustomStringsChipsContainer ref={chipsContainerRef}>
                {stringsList.slice(0, MAX_CHIPS_IN_ROW).map((exactString) => (
                    <CompleteRuleChipItem
                        key={exactString}
                        text={exactString}
                        onCloseItem={() => onRemoveStrings([exactString])}
                    >
                        {exactString}
                    </CompleteRuleChipItem>
                ))}
            </CustomStringsChipsContainer>
            <CustomStringsViewAllChipsLink
                ref={chipsViewAllLinkRef}
                onClick={openViewAllChipsModal}
            >
                {services.i18n("segmentWizard.editRule.custom.string.row.button.viewAll", {
                    count: stringsList.length,
                })}
            </CustomStringsViewAllChipsLink>

            <FullStringListModal
                isOpen={isOpenViewAllChipsModal}
                stringsList={stringsList}
                typeName={title.toLowerCase()}
                onRemoveStrings={onRemoveStrings}
                onClose={closeViewAllChipsModal}
            />
        </CustomStringsChipsRowContainer>
    );
};
