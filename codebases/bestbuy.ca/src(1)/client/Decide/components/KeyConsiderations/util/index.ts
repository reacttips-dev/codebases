export const isValidAttributeValue = (value: number, maxTiles: number = 5) =>
    typeof value === "number" && value > 0 && value <= maxTiles;
