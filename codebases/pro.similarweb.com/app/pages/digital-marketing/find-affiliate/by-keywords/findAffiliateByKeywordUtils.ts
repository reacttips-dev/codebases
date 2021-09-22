export const getStoredGroupName = (keyword, i18n, userGroups, maxLength) => {
    const prefixKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    const NameLong = `${prefixKeyword} ${i18n("find.affiliate.by.opportunities.header.title")}`;
    const NameShort = `${prefixKeyword} ${i18n(
        "find.affiliate.by.opportunities.header.title.short",
    )}`;
    const Name = NameLong.length < maxLength ? NameLong : NameShort;
    const groupsWithSameName = userGroups.filter((group) => group.Name.includes(Name));
    return `${Name}${groupsWithSameName.length > 0 ? ` ${groupsWithSameName.length}` : ""}`;
};
