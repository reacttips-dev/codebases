export const LEADING_FOLDERS_DATA_READY = "Leading_Folders_Data_Ready";
export const LEADING_FOLDERS_FETCH_DATA = "leading_Folders_Fetch_Data";

export const leadingFolderDataReady = (data) => {
    return {
        type: LEADING_FOLDERS_DATA_READY,
        data,
    };
};

export const leadingFolderFetchData = () => {
    return {
        type: LEADING_FOLDERS_FETCH_DATA,
    };
};
