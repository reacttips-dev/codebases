import React from "react";
import { SignalsTab } from "../../types";
import { SIGNALS_GROUP_TITLE_PREFIX } from "../../constants";
import { getDropdownGroupKeysInCorrectOrder } from "../../../../helpers";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { DropdownItemId } from "pages/workspace/sales/components/custom-dropdown/types";
import DropdownItemsGroup from "pages/workspace/sales/components/custom-dropdown/DropdownItemsGroup/DropdownItemsGroup";
import ScrollableDropdownContainer from "pages/workspace/sales/components/custom-dropdown/ScrollableDropdownContainer/ScrollableDropdownContainer";

type SignalsTabPanelProps = {
    index: number;
    tab: SignalsTab;
    className?: string;
    itemsLocked?: boolean;
    selectedItemId: DropdownItemId;
    onItemClick(id: DropdownItemId, tabIndex: number): void;
};

const SignalsTabPanel: React.FC<SignalsTabPanelProps> = ({
    tab,
    index,
    onItemClick,
    selectedItemId,
    itemsLocked = false,
}) => {
    const t = useTranslation();
    const handleItemClick = React.useCallback(
        (id: DropdownItemId) => {
            onItemClick(id, index);
        },
        [index, onItemClick],
    );

    return (
        <ScrollableDropdownContainer>
            {getDropdownGroupKeysInCorrectOrder(tab.signalsGroup)
                .filter((key) => tab.signalsGroup[key].length !== 0)
                .map((name) => (
                    <DropdownItemsGroup
                        key={name}
                        icon="category"
                        selectedItemId={selectedItemId}
                        onItemClick={handleItemClick}
                        items={tab.signalsGroup[name]}
                        itemsLocked={itemsLocked && index !== 0}
                        title={t(`${SIGNALS_GROUP_TITLE_PREFIX}.${name}`)}
                    />
                ))}
        </ScrollableDropdownContainer>
    );
};

export default React.memo(SignalsTabPanel);
