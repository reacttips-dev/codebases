export const getSelectedText = (
    id: string,
    array: { id: string | number; text: string }[],
): string => {
    const option = array.find((item) => Number(item.id) === Number(id));
    return option?.text || "";
};
