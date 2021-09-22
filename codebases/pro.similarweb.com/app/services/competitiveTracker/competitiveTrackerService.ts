import { DefaultFetchService } from "services/fetchService";
import {
    ITracker,
    ITrackers,
    ITrackerID,
    ITrackerBase,
    ITrackerAPI,
    ITrackersAPI,
    ETrackerType,
} from "services/competitiveTracker/types";

const ENDPOINT = "api/userdata/competitiveTrackers";

const MAX_MARKETING_TRACKERS = 3;
const MAX_RESEARCH_TRACKERS = 3;
let trackers: ITrackers;

const consolidateTracker = ({
    Id,
    LastUpdated,
    Competitors,
    Parameters,
    Country,
    IndustryId,
    MainPropertyId,
    MainPropertyType,
    Type,
    Name,
}: ITrackerAPI) => ({
    id: Id,
    lastUpdated: LastUpdated,
    competitors: Competitors,
    country: Country,
    parameters: Parameters,
    industryId: IndustryId,
    mainPropertyId: MainPropertyId,
    mainPropertyType: MainPropertyType,
    type: Type,
    name: Name,
});
const consolidateTrackers = (trackers: ITrackersAPI) => trackers.map(consolidateTracker);

const fetch = (): Promise<ITrackersAPI> => {
    const fetchService = DefaultFetchService.getInstance();
    const getPromise = fetchService.get<ITrackersAPI>(ENDPOINT);
    return getPromise;
};

const get = (typeArg: ETrackerType = ETrackerType.Research): ITrackers =>
    trackers.filter(typeFilter(typeArg));

const getById = (trackerId: ITrackerID): ITracker => trackers.find(({ id }) => id === trackerId);

const init = (trackersArg: ITrackersAPI): void => {
    trackers = consolidateTrackers(trackersArg);
};

const updateLocal = (trackerPromise: Promise<ITrackersAPI | Response>) => {
    trackerPromise.then((newTrackers) => {
        trackers = consolidateTrackers(newTrackers as ITrackersAPI);
    });
};

const remove = async (id: ITrackerID): Promise<Response> => {
    const fetchService = DefaultFetchService.getInstance();
    const removePromise = fetchService.delete(ENDPOINT, { id });
    updateLocal(removePromise);
    return removePromise;
};

const add = (newTracker: ITrackerBase): Promise<ITrackersAPI> => {
    const fetchService = DefaultFetchService.getInstance();
    const addPromise = fetchService.post<ITrackersAPI>(ENDPOINT, newTracker);
    updateLocal(addPromise);
    return addPromise;
};

const modify = (tracker: ITracker): Promise<ITrackersAPI> => {
    const fetchService = DefaultFetchService.getInstance();
    const modifyPromise = fetchService.put<ITrackersAPI>(ENDPOINT, tracker);
    updateLocal(modifyPromise);
    return modifyPromise;
};

const typeFilter = (typeArg) => ({ type }) => type === typeArg;

const removeAll = (typeArg: ETrackerType = ETrackerType.Research) => {
    trackers.filter(typeFilter(typeArg)).map(({ id }) => {
        remove(id);
    });
};

const allowToAddTracker = (type: ETrackerType = ETrackerType.Research) => {
    const max = type === ETrackerType.Marketing ? MAX_MARKETING_TRACKERS : MAX_RESEARCH_TRACKERS;
    return get().length < max;
};

export const CompetitiveTrackerService = {
    get,
    getById,
    fetch,
    remove,
    init,
    modify,
    add,
    removeAll,
    allowToAddTracker,
    MAX_RESEARCH_TRACKERS,
    MAX_MARKETING_TRACKERS,
};

export type ICompetitiveTrackerService = typeof CompetitiveTrackerService;
