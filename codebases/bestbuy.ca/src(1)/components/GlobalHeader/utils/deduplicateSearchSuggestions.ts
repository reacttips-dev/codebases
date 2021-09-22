const deduplicateSearchSuggestions = (suggestions) => {
    const uniqueNames = new Set(suggestions.map((suggestion) => suggestion.name.toLowerCase()));
    const result = Array.from(uniqueNames.values()).map((name) => ({ name }));
    const categories = suggestions.filter((suggestion) => !!suggestion.categoryName)
        .map((s) => ({ name: s.name.toLowerCase(), categoryName: s.categoryName, path: s.path }));
    return [...result.slice(0, 1), ...categories, ...result.slice(1)];
};
export default deduplicateSearchSuggestions;
//# sourceMappingURL=deduplicateSearchSuggestions.js.map