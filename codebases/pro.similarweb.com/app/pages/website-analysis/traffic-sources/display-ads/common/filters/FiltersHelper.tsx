export const getInitialSelectedItemsIds = (selected, list) => {
    const initialSelectedItemsIds = {};
    selected?.forEach((s) => {
        const item = list?.find((item) => item.text === s);
        if (item) {
            initialSelectedItemsIds[item.id] = true;
        }
    });
    return initialSelectedItemsIds;
};
