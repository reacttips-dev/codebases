import DurationService from "services/DurationService";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { DefaultFetchService } from "services/fetchService";
import { getMockAnnotations } from "./AnnotationMock";
import { IUser } from "app/@types/ISwSettings";
import { swSettings } from "common/services/swSettings";
import { IAnnotation } from "./Annotation";

const useMock = false; // set to true if backend is not ready or not working and we need to work on ui
const endPointUrl = "gw/annotations";
export const get = async (
    chartIdForAnnotations: string,
): Promise<{ annotations: IAnnotation[] }> => {
    const fetchService = DefaultFetchService.getInstance();
    const user: IUser = swSettings.user;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { duration } = swNavigator.getParams();
    const durationObject = DurationService.getDurationData(duration);
    const { from: fromApi, to: toApi } = durationObject.forAPI;
    if (useMock) {
        return new Promise<{ annotations: IAnnotation[] }>((resolve, reject) => {
            setTimeout(() => {
                const annotations = getMockAnnotations(chartIdForAnnotations);
                resolve({ annotations });
            }, 300);
        });
    }
    const dateToUTC = (dateString: string, separator = "|") => {
        const date = dateString.split(separator);
        return Date.UTC(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2], 10));
    };
    const from = dateToUTC(fromApi);
    const to = dateToUTC(toApi);
    const queryParams = {
        from,
        to,
    };
    const response = await fetchService.get<IAnnotation[]>(
        `${endPointUrl}/${user.accountId}/${user.id}/${chartIdForAnnotations}`,
        queryParams,
    );
    return { annotations: response };
};
let idForMock = 1000;
export const add = async (
    chartIdForAnnotations: string,
    user: IUser,
    annotation: IAnnotation,
): Promise<IAnnotation> => {
    if (useMock) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                idForMock++;
                console.log("faking add backend", annotation, idForMock);
                resolve({ ...annotation, id: "" + idForMock, editable: true });
            }, 300);
        });
    }
    const fetchService = DefaultFetchService.getInstance();
    const body = {
        ...annotation,
    };
    const response = await fetchService.post<IAnnotation>(
        `${endPointUrl}/${user.accountId}/${user.id}/${chartIdForAnnotations}`,
        body,
    );
    return response;
};
export const update = async (chartId: string, user: IUser, annotation): Promise<any> => {
    if (useMock) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("faking update backend", annotation);
                resolve({
                    updated: true,
                });
            }, 300);
        });
    }
    const fetchService = DefaultFetchService.getInstance();
    const body = {
        id: annotation.id,
        text: annotation.text,
    };
    const response = await fetchService.put(
        `${endPointUrl}/${user.accountId}/${user.id}/${chartId}`,
        body,
    );
    return response;
};

export const remove = async (
    chartId: string,
    user: IUser,
    annotation: IAnnotation,
): Promise<any> => {
    if (useMock) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("faking delete backend", annotation);
                resolve({
                    deleted: true,
                });
            }, 300);
        });
    }
    const fetchService = DefaultFetchService.getInstance();
    const response = await fetchService.delete(
        `${endPointUrl}/${user.accountId}/${user.id}/${chartId}/${annotation.id}`,
    );
    return response;
};
