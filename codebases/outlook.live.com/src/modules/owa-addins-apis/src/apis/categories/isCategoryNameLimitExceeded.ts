const MAX_CATEGORY_NAME_CHARACTER_LIMIT = 255;

export default function isCategoryNameLimitExceeded(categories: string[]): boolean {
    for (let category of categories) {
        var categoryLength = category.length;
        if (categoryLength <= 0 || categoryLength > MAX_CATEGORY_NAME_CHARACTER_LIMIT) {
            return true;
        }
    }

    return false;
}
