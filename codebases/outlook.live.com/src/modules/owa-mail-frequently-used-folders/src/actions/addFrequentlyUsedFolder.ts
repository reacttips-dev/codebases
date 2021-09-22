import saveFrequentlyUsedFolders from '../services/saveFrequentlyUsedFolders';
import { getStore } from '../store/store';
import type { FrequentlyUsedFolder } from 'owa-mail-store';
import { action } from 'satcheljs/lib/legacy';

const MAX_FOLDER_LIST_SIZE: number = 10;
const FOLDER_INCREMENT: number = 5;
const MAX_FOLDER_WEIGHT: number = 20;
const MILLISECONDS_IN_WEEK: number = 7 * 86400000;

// sort folders by weight
const sortFolders = action('sortFolders')(function sortFolders() {
    const store = getStore();
    const sortedList = store.frequentlyUsedFolders.sort((folder1, folder2) => {
        if (folder1.Weight == folder2.Weight) {
            return Math.abs(Date.parse(folder2.lvt) - Date.parse(folder1.lvt));
        }

        return folder2.Weight - folder1.Weight;
    });

    store.frequentlyUsedFolders = sortedList;
});

// add folder to frequently used folder list
export default action('addFrequentlyUsedFolder')(function addFrequentlyUsedFolder(
    folderId: string
) {
    let foundFolder = false;
    const store = getStore();

    if (!store.isInitialized) {
        return;
    }

    // If a folder is found in frequently used folder list, increment its weight and decrement weight of remaining folders
    for (let i = store.frequentlyUsedFolders.length - 1; i >= 0; i--) {
        const folder: FrequentlyUsedFolder = store.frequentlyUsedFolders[i];

        if (folder.FolderId == folderId) {
            folder.Weight += FOLDER_INCREMENT;
            folder.Weight = Math.min(folder.Weight, MAX_FOLDER_WEIGHT);
            folder.lvt = new Date().toISOString();
            foundFolder = true;
        } else {
            folder.Weight--;
            folder.Weight = Math.max(folder.Weight, 0);

            if (folder.Weight <= 0) {
                // Handle isNaN case for lastVisitedTime
                const timeSinceFolderVisited: number = Math.abs(
                    Date.now() - Date.parse(folder.lvt)
                );
                const visitedWithinTimePeriod =
                    timeSinceFolderVisited < MILLISECONDS_IN_WEEK && timeSinceFolderVisited >= 0;

                if (!visitedWithinTimePeriod) {
                    store.frequentlyUsedFolders.splice(i, 1);
                }
            }
        }
    }

    // Add folder to the list if it was not found
    if (!foundFolder) {
        store.frequentlyUsedFolders.push({
            FolderId: folderId,
            Weight: MAX_FOLDER_LIST_SIZE,
            lvt: new Date().toISOString(),
        });
    }

    // Sort folder list
    sortFolders();

    // Trim folder list to keep max items
    store.frequentlyUsedFolders.splice(MAX_FOLDER_LIST_SIZE);

    // save user options
    saveFrequentlyUsedFolders();
});
