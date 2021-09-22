import getLogger from "../../../common/logging/getLogger";

/**
 * Gets and sets state into session storage
 */
export const sessionStorage = {
    /**
     * Gets stored state from session storage
     * @param key The key of the stored state
     */
    getItem: (key: string): any => {
        try {
            const storedItem = window.sessionStorage.getItem(key);
            if (!storedItem) {
                return null;
            }

            return JSON.parse(storedItem);
        } catch (error) {
            getLogger().error(new Error("Error getting item from the sessionStorage" + error));
            return null;
        }
    },

    /**
     * Removes item from session storage
     * @param key The key of the stored state
     */
    removeItem: (key: string) => {
        try {
            if (this.getItem(key)) {
                window.sessionStorage.removeItem(key);
            }
        } catch (error) {
            getLogger().error(new Error("Error removing item from the sessionStorage" + error));
            return;
        }
    },

    /**
     * Sets state into session storage
     * @param key The key of the stored state
     * @param state The state
     */
    setItem: (key: string, state: object) => {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            getLogger().error(new Error("Error setting item into the sessionStorage" + error));
            return;
        }
    },
};

export default sessionStorage;
