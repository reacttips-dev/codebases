import { IRootScopeService } from "angular";
import { Injector } from "common/ioc/Injector";
import {
    endPointPath,
    endPointPathMobile,
    excelEndPointPath,
    excelEndPointPathMobile,
} from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/consts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IDurationData } from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

const fetchService = DefaultFetchService.getInstance();

const useQueryParams = (params, durationObject: IDurationData, useMTD, granularity) => {
    const { key, isWWW, country, webSource } = params;
    const { from, to, isWindow, compareFrom, compareTo } = durationObject.forAPI;
    const timeGranularity = granularity.value;
    let { latest } = durationObject.forAPI;
    if (useMTD) {
        latest = "l";
    }
    const queryParams = useMemo(
        () =>
            new URLSearchParams({
                includeSubDomains: JSON.stringify(isWWW === "*"),
                keys: key,
                from,
                to,
                country,
                timeGranularity,
                webSource,
                ...(!!latest && { latest }),
                ...(compareFrom && compareTo && { compareFrom, compareTo }),
                isWindow: JSON.stringify(isWindow),
            }),
        [
            key,
            isWWW,
            country,
            from,
            to,
            webSource,
            isWindow,
            timeGranularity,
            latest,
            compareFrom,
            compareTo,
        ],
    );

    return queryParams;
};

export const useData = (params, durationObject: IDurationData, useMTD, granularity) => {
    // tslint:disable-next-line:prefer-const
    let [data, setData] = useState(null);
    let isFetching = false;

    const newQueryParams = useQueryParams(params, durationObject, useMTD, granularity);
    const queryParams = useRef<URLSearchParams>();
    if (queryParams.current !== newQueryParams) {
        /* fixes(SIM-29220):
          using ref protection here instead of useState because need to
          determine if data needs reload on the same render cycle.
          webSource is changing without killing the component
          so we have a situation with old data but new websource which
          causes errors down the render tree */
        data = null;
        isFetching = true;
    }
    const getEndPointUrl = useCallback(() => {
        return params.webSource === devicesTypes.MOBILE
            ? `${endPointPathMobile}?${newQueryParams.toString()}`
            : `${endPointPath}?${newQueryParams.toString()}`;
    }, [newQueryParams]);

    const getExcelUrl = useCallback(() => {
        return params.webSource === devicesTypes.MOBILE
            ? `${excelEndPointPathMobile}?${newQueryParams.toString()}`
            : `${excelEndPointPath}?${newQueryParams.toString()}`;
    }, [newQueryParams]);

    useEffect(() => {
        const fetchData = async () => {
            let data = null;
            try {
                data = await fetchService.get(getEndPointUrl());
                // tslint:disable-next-line:no-empty
            } catch (e) {
            } finally {
                queryParams.current = newQueryParams;
                setData(data);
            }
        };
        fetchData();
    }, [newQueryParams]);
    return { data, isFetching, getExcelUrl };
};

const getAvailableGranularities = (isMobileWeb, isWindow, isPeriodOverPeriod) => ({
    daily: {
        title: "D",
        disabled: isMobileWeb() || isPeriodOverPeriod(),
        value: "Daily",
        index: 0,
    },
    weekly: {
        title: "W",
        disabled: isMobileWeb() || isPeriodOverPeriod(),
        value: "Weekly",
        index: 1,
    },
    monthly: { title: "M", disabled: isWindow(), value: "Monthly", index: 2 },
});
export const useGranularities = ({
    isMobileWeb,
    isWindow,
    isPeriodOverPeriod,
    periodDuration,
    urlGranularityParam,
    updateUrlParam,
}) => {
    const { daily, weekly, monthly } = getAvailableGranularities(
        isMobileWeb,
        isWindow,
        isPeriodOverPeriod,
    );
    const availableGranularities = [daily, weekly, monthly];

    function resetSelectedGranularity() {
        if (isMobileWeb() || isPeriodOverPeriod()) {
            return monthly;
        }
        if (isWindow()) {
            return daily;
        }
        if (periodDuration <= 2) {
            return weekly;
        }
        return monthly;
    }

    const [selectedGranularity, setGranularity] = useState(resetSelectedGranularity());
    const chosenAvailableGranularity = availableGranularities.find(
        ({ value }) => value === selectedGranularity.value,
    );
    if (chosenAvailableGranularity.disabled) {
        setGranularity(resetSelectedGranularity());
    }
    const updateGranularity = (val) =>
        setGranularity(availableGranularities.find(({ value }) => value === val));
    if (urlGranularityParam && urlGranularityParam !== selectedGranularity.value) {
        const granularityFromParam = availableGranularities.find(
            ({ value }) => value === urlGranularityParam,
        );
        if (granularityFromParam.disabled) {
            updateUrlParam(resetSelectedGranularity());
        } else {
            setGranularity(granularityFromParam);
        }
    }
    return { selectedGranularity, availableGranularities, updateGranularity };
};
const mtdSession = {
    cacheValue: null,
    ttl: null,
};
export const useMTD = ({
    isWindow,
    isMobileWeb,
    isPeriodOverPeriod,
    durationObject,
    component,
    urlMtdParam,
}) => {
    function isMTDSupported() {
        if (isWindow() || isMobileWeb() || isPeriodOverPeriod()) {
            return false;
        }
        const to = durationObject.raw.to.valueOf();
        const componentEndDate = component.endDate.valueOf();
        return to === componentEndDate;
    }
    function loadInitialMTDValue() {
        const openByDefault = true;
        if (!isMTDSupported()) {
            return false;
        }
        if (urlMtdParam) {
            return urlMtdParam;
        }
        if (mtdSession.ttl && Date.now() - mtdSession.ttl <= 1000 * 60 * 30) {
            return mtdSession.cacheValue;
        }
        return openByDefault;
    }
    const [isMTDOn, setMTD] = useState(loadInitialMTDValue());
    const isMTDActive = () => isMTDOn && isMTDSupported();
    if (isMTDOn && !isMTDSupported()) {
        setMTD(false);
    }
    return {
        isMTDActive: isMTDActive(),
        isMTDSupported: isMTDSupported(),
        setMTD: () => {
            mtdSession.cacheValue = !isMTDOn;
            mtdSession.ttl = Date.now();
            setMTD(mtdSession.cacheValue);
        },
    };
};

interface IModalInstance {
    dismiss(): void;
}

export const useAddToDashboard = () => {
    const $rootScope = Injector.get<IRootScopeService>("$rootScope");
    const $modal = Injector.get("$modal") as any;
    const modalRef = useRef<IModalInstance>();

    const closeModal = useCallback(() => {
        if (modalRef.current) {
            modalRef.current.dismiss();
        }
    }, [modalRef.current]);

    const openModal = useCallback(
        (getWidgetModel) => {
            closeModal();
            modalRef.current = $modal.open({
                animation: true,
                controller: "widgetAddToDashboardController as ctrl",
                templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
                windowClass: "add-to-dashboard-modal",
                resolve: {
                    widget: () => null,
                    customModel: () => getWidgetModel(),
                },
                scope: $rootScope.$new(true),
            });
            return modalRef.current;
        },
        [modalRef.current],
    );
    useEffect(() => closeModal, [modalRef.current]);

    return { addToDashboard: openModal };
};
