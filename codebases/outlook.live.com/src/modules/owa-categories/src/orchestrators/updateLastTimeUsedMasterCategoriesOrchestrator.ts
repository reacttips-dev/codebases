import { orchestrator } from 'satcheljs';
import {
    updateLastTimeUsedMasterCategories,
    logErrorOnUpdateMasterListFailed,
    logErrorIfNotFoundMatch,
} from '../actions/masterCategoryListOperation';
import * as trace from 'owa-trace';
import getMasterCategoryList from '../utils/getMasterCategoryList';
import updateMasterCategoryListService from '../services/updateMasterCategoryListService';
import updateLastTimeUsedCategory from '../mutators/updateLastTimeUsedCategoryMutator';

// Orchestrator to update the last time used timestamp in the master category list
orchestrator(updateLastTimeUsedMasterCategories, actionMessage => {
    const { categoriesToUpdateLastTimeUsed, mailboxInfo } = actionMessage;

    if (!categoriesToUpdateLastTimeUsed || categoriesToUpdateLastTimeUsed.length === 0) {
        trace.errorThatWillCauseAlert('No categories to change');
        return;
    }

    let masterList = getMasterCategoryList(mailboxInfo);

    let foundMatch = false;

    // Update local store
    const currentTime = new Date().toISOString();
    categoriesToUpdateLastTimeUsed.forEach(category => {
        for (let i = 0; i < masterList.length; i++) {
            if (category === masterList[i].Name) {
                updateLastTimeUsedCategory(masterList[i], currentTime);
                foundMatch = true;
                break;
            }
        }
    });

    // Log the error if not finding the category to change and do not make service request
    if (!foundMatch) {
        logErrorIfNotFoundMatch(false /* foundMatch */, 'updateLastTimeUsed');
        return;
    }

    // Issue service request
    updateMasterCategoryListService(
        undefined /* categoriesToAdd */,
        undefined /* categoriesToRemove */,
        undefined /* categoriesToChange */,
        categoriesToUpdateLastTimeUsed,
        mailboxInfo
    )
        .then(response => {
            if (!response.WasSuccessful) {
                logErrorOnUpdateMasterListFailed(
                    'updateLastTimeUsed',
                    response.ErrorCode.toString()
                );
            }
        })
        .catch(() => {
            logErrorOnUpdateMasterListFailed('updateLastTimeUsed');
        });
});
