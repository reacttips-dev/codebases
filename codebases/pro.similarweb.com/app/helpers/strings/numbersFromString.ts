export const numbersFromString = (str?: string | null) =>
    ((str || "").match(/\d+/g) || []).map(Number);
