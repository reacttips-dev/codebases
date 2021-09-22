export const hasCents = (price: number | string) => {
    // we validate if we have an int number in a float format (40.00), if so we want to return false
    const formattedValue = Math.round((parseFloat("" + price) % 1) * 100);

    if (formattedValue <= 0) {
        return false;
    }
    return true;
};
