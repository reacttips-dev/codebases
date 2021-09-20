const VersionPickerHelper = {
    PREFIX_SELECTED_VERSION_LOCALE: 'SELECTED_VERSION_LOCALE_FOR_ND',

    getVersionLocaleFromSessionStorage(ndKey) {
        let versionLocale = {
            version: '',
            locale: ''
        };
        // check session storage if a selected value exists for the given ndKey
        let selectedVersionLocale = sessionStorage.getItem(
            `${this.PREFIX_SELECTED_VERSION_LOCALE}_${ndKey}`
        );
        if (!_.isEmpty(selectedVersionLocale)) {
            versionLocale = JSON.parse(selectedVersionLocale);
        }
        return versionLocale;
    },

    setVersionLocaleToSessionStorage(ndKey, version, locale) {
        sessionStorage.setItem(
            `${this.PREFIX_SELECTED_VERSION_LOCALE}_${ndKey}`,
            JSON.stringify({
                version,
                locale
            })
        );
    },
};

export default VersionPickerHelper;