import React from "react";

export interface ISwitcherStateItem {
    name: string;
    display: React.ReactNode;
}

export const useSwitcherState = (
    items: ISwitcherStateItem[],
    initialIndex = 0,
): [number, ISwitcherStateItem, React.Dispatch<number>, React.Dispatch<ISwitcherStateItem[]>] => {
    const [switcherItems, setSwitcherItems] = React.useState<ISwitcherStateItem[]>(items);
    const [selectedSwitcherIndex, setSelectedSwitcherIndex] = React.useState<number>(initialIndex);

    const selectedSwitcherItem = React.useMemo(() => switcherItems[selectedSwitcherIndex], [
        switcherItems,
        selectedSwitcherIndex,
    ]);

    return [
        selectedSwitcherIndex,
        selectedSwitcherItem,
        setSelectedSwitcherIndex,
        setSwitcherItems,
    ];
};
