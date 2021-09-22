export const getAvailabilitySchema = (availabilityStatus: string): string | null => {
    switch (availabilityStatus) {
        case "InStock":
            return "http://schema.org/InStock";
        case "InStockOnlineOnly":
            return "http://schema.org/OnlineOnly";
        case "Preorder":
            return "http://schema.org/PreOrder";
        case "InStoreOnly":
            return "http://schema.org/InStoreOnly";
        case "OutOfStock":
        case "SoldOutOnline":
        case "NotAvailable":
        case "OutofStockInRegion":
        case "BackOrder":
            return "http://schema.org/OutOfStock";
        default:
            return null;
    }
};

export const getUrl = (): string | null => {
    if (typeof window !== "undefined" && window.location && window.location.href) {
        return window.location.href;
    }
    return null;
};

export const getPriceValidUntil = (saleEndDate?: string): string => {
    if (saleEndDate) {
        return saleEndDate;
    }
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split("T")[0];
};
