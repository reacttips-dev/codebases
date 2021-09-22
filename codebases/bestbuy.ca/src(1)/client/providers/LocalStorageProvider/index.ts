import getLogger from "../../../common/logging/getLogger";

/**
 * Gets and sets item into local storage
 */
export const localStorage = {
    /**
     * clears all items from local storage
     */
    clear: () => {
        window.localStorage.clear();
    },

    /**
     * Gets stored item from session storage
     * @param key The key of the stored item
     */
    getItem: (key: string): any => {

        try {
            const storedItem = window.localStorage.getItem(key);
            return storedItem ? JSON.parse(storedItem) : null;
        } catch (error) {
            getLogger().error(new Error("Error getting item from the localStorage" + error));
            return null;
        }
    },

    /**
     * Removes an item from local storage
     * @param key The key of the stored item
     */
    removeItem: (key: string) => {
        delete window.localStorage[key];
    },

    /**
     * Sets item into local storage
     * @param key The key of the stored item
     * @param value of the item
     */
    setItem: (key: string, value: object) => {

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            getLogger().error(new Error("Error setting item into the localStorage" + error));
            return;
        }
    },
};

export default localStorage;
