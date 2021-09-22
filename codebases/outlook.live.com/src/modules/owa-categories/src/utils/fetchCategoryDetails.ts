import findCategoryDetailsService from '../services/findCategoryDetailsService';
import processFindCategoryDetailsResponse from '../mutators/processFindCategoryDetailsResponse';
import type FindCategoryDetailsJsonResponse from 'owa-service/lib/contract/FindCategoryDetailsJsonResponse';
import { logUsage } from 'owa-analytics';

export default async function fetchCategoryDetails() {
    return findCategoryDetailsService()
        .then((response: FindCategoryDetailsJsonResponse) => {
            if (response.Body.ResponseClass === 'Success') {
                processFindCategoryDetailsResponse(response.Body);
            } else {
                logUsage('Category_ErrorFindCategoryDetails');
            }
        })
        .catch(err => {
            logUsage('Category_ErrorFindCategoryDetails');
        });
}
