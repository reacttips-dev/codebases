const CatalogHelper = {
    State: {
        getNanodegrees: (state) => {
            return _.get(state, 'catalog.nanodegrees') || [];
        },
    },
};

export default CatalogHelper;