import { DefaultFetchService } from "services/fetchService";
const fetchService = DefaultFetchService.getInstance();

export const overlapTableDataFetcher = ({ params }) => {
    return new Promise((resolve) => {
        fetchService
            .get(`api/websiteanalysis/GetAudienceInterestsMatrix`, params)
            .then((results) => {
                resolve(results);
            })
            .catch((e) => {
                resolve([]);
            });
    });
};
