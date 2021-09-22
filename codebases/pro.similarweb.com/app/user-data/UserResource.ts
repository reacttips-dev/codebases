import { DefaultFetchService } from "services/fetchService";
import { openDB } from "idb";
import swLog from "@similarweb/sw-log";
import { CacheService } from "services/cache/CacheService";
import { IDashboard } from "../components/dashboard/services/IDashboard";
import {
    IWidgetProperties,
    widgetPos,
} from "components/dashboard/dashboard-templates/DashboardTemplateService";

const fetchService = DefaultFetchService.getInstance();
interface DashboardRelatedWorkspaceResponse {
    investorsLinks: Array<string>;
    marketingLinks: Array<string>;
    salesLinks: Array<string>;
}

interface IWidgetResponse {
    addedTime: string;
    dashboardId: string;
    id: string;
    pos: widgetPos;
    properties: IWidgetProperties;
}
export interface IUserResourceNew {
    addDashboard: (dashboard: IDashboard) => Promise<IDashboard>;
    duplicateDashboard: (dashboardId: string, newDashboardName: string) => Promise<IDashboard>;
    bulkAddDashboards: (dashboards: Array<IDashboard>) => Promise<Array<IDashboard>>;
    updateDashboard: (dashboard: IDashboard) => Promise<IDashboard>;
    updateDashboardWidgets: (dashboard: IDashboard) => Promise<IDashboard>;
    deleteDashboard: (dashboard: IDashboard) => Promise<{ data: string }>;
    getDashboardRelatedWorkspace: (id: string) => Promise<DashboardRelatedWorkspaceResponse>;
    addWidget: (widget: any) => Promise<IWidgetResponse>;
    updateWidget: (widget: any) => Promise<IWidgetResponse>;
    deleteWidget: (id: string) => Promise<void>;
    htmlToPdf: (data: any) => Promise<any>;
    htmlToPng: (data: any) => Promise<any>;
}

export interface IduplicateDashboardTo {
    Id: string; // dashboard ID
    Name: string; // new dashboard name
    UserId: string;
}
export async function duplicateDashboardTo(data: IduplicateDashboardTo) {
    return await fetchService
        .post("/api/userdata/dashboards/duplicateTo", data)
        .then(onSuccess)
        .catch(onFailure);
}
const onSuccess = (data) => {
    return {
        success: true,
        payload: data,
    };
};

const onFailure = (errMsg) => {
    return {
        success: false,
        payload: errMsg,
    };
};

const widgetRequestTrasnformer = (data) => {
    const newData = { ...data };
    if (typeof data.properties === "object" && data.properties !== null) {
        newData.properties = JSON.stringify(data.properties);
    }

    if (typeof data.pos === "object" && data.pos !== null) {
        newData.pos = JSON.stringify(data.pos);
    }
    return newData;
};

const widgetResponseTransform = (response) => {
    const data = response.data;
    updateDashboardCache(data);
    data.pos = JSON.parse(data.pos) || JSON.parse(data.position) || {};
    data.properties = JSON.parse(data.properties);
    if (data.position) {
        delete data.position;
    }
    return data;
};

// Converts resource data into FormData object (https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects).
// This was originally made in order to solve the issue of huge PDF markup.
const formDataRequestTransformar = (data) => {
    if (typeof data === "undefined") {
        return data;
    }

    const fd = new FormData();
    data.forEach((value, key) => {
        if (value instanceof FileList) {
            if (value.length === 1) {
                fd.append(key, value[0]);
            } else {
                for (let i = 0; i < value.length; i++) {
                    fd.append(`${key}_${i}`, value[i]);
                }
            }
        } else {
            fd.append(key, value);
        }
    });

    return fd;
};

const addDashboard = async (dashboard: IDashboard): Promise<IDashboard> => {
    const response: any = await fetchService.post("/api/userdata/dashboards/add", dashboard);
    return response.data;
};

const duplicateDashboard = async (
    dashboardId: string,
    newDashboardName: string,
): Promise<IDashboard> => {
    const requestBody = {
        id: dashboardId,
        name: newDashboardName,
    };

    const response: any = await fetchService.post(
        "/api/userdata/dashboards/duplicate",
        requestBody,
    );
    updateDashboardCache(response.data);
    return response.data;
};

const bulkAddDashboards = async (dashboards: IDashboard[]): Promise<Array<IDashboard>> => {
    const response: any = await fetchService.post("/api/userdata/dashboards/add/bulk", dashboards);
    updateDashboardCache(response.data);
    return response.data;
};

const updateDashboard = async (dashboard: IDashboard): Promise<IDashboard> => {
    const response: any = await fetchService.post("/api/userdata/dashboards/update", dashboard);
    updateDashboardCache(response.data);
    return response.data;
};

const updateDashboardWidgets = async (dashboard: IDashboard): Promise<IDashboard> => {
    const response: any = await fetchService.post(
        "/api/userdata/dashboards/updatewidgets",
        dashboard,
    );
    updateDashboardCache(response.data);
    return response.data;
};

const deleteDashboard = async (dashboard: IDashboard): Promise<{ data: string }> => {
    const response: any = await fetchService.post(
        `/api/userdata/dashboards/remove/${dashboard.id}`,
    );
    deleteDashboardCache(response.data);
    return response;
};

const getDashboardRelatedWorkspace = async (
    id: string,
): Promise<DashboardRelatedWorkspaceResponse> => {
    return fetchService.get(`api/userdata/workspaces/workspace/dashboard/${id}`);
};

const addWidget = async (widget: any): Promise<IWidgetResponse> => {
    const stringData = widgetRequestTrasnformer(widget);
    const response = await fetchService.post("/api/userdata/widgets/add", stringData);
    return widgetResponseTransform(response);
};

const updateWidget = async (widget: any): Promise<IWidgetResponse> => {
    const stringData = widgetRequestTrasnformer(widget);
    const response = await fetchService.post("/api/userdata/widgets/update", stringData);
    return widgetResponseTransform(response);
};

const deleteWidget = async (id: string) => {
    await fetchService.post(`/api/userdata/widgets/remove/${id}`, {});
};

const htmlToPdf = async (data) => {
    const formData = formDataRequestTransformar(data);
    const response: any = await fetchService.post("CustomPfd/GetCustomPdf", formData, {
        headers: {
            "Content-Type": undefined,
        },
    });
    return response.data;
};

const htmlToPng = async (data) => {
    const formData = formDataRequestTransformar(data);
    const response: any = await fetchService.post("CustomPng/GetCustomPng", formData, {
        headers: {
            "Content-Type": undefined,
        },
    });
    return response.data;
};

const updateDashboardCache = async (data) => {
    if (!window.indexedDB || typeof Worker === "undefined") {
        return;
    }

    let db = null;
    let tx = null;
    let store = null;
    let userdata = null;
    try {
        db = await openDB("pro-cache-db", CacheService.CURRENT_IDB_VERSION);
        tx = db.transaction(["cache"], "readwrite");
        store = tx.objectStore("cache");
        userdata = await store.get("userdata");
    } catch (e) {
        swLog.warn("Failed to open object store in IndexedDB");
        return;
    }

    let filteredDashboards;
    let newDashboard;
    let newDashboards;

    // handle bulk dashboards actions
    if (Array.isArray(data)) {
        filteredDashboards = userdata.value.dashboards.filter((board) => {
            const updatedDashboardFromCache = data.find((b) => b.id === board.id);
            return !updatedDashboardFromCache || updatedDashboardFromCache.id !== board.id;
        });
        newDashboards = filteredDashboards.concat(data);
    } else {
        if (data.dashboardId) {
            // handle single widget action
            newDashboards = userdata.value.dashboards.map((dashboard) => {
                if (dashboard.id === data.dashboardId) {
                    const widgetIndexInDashboard = dashboard.widgets.findIndex(
                        (w) => w.id === data.id,
                    );
                    // if widgetId exists in dashboard - update it
                    if (widgetIndexInDashboard > -1) {
                        dashboard.widgets[widgetIndexInDashboard] = data;
                    } else {
                        // otherwise - push it to widgets array
                        dashboard.widgets.push(data);
                    }
                }
                return dashboard;
            });
        } else {
            // handle single dashboard action
            newDashboard = data.data || data;
            const existingDashboard = userdata.value.dashboards.find(
                (d) => d.id === newDashboard.id,
            );
            if (existingDashboard) {
                // updating existing dashboard
                newDashboards = userdata.value.dashboards.map((dashboard) => {
                    if (dashboard.id === newDashboard.id) {
                        Object.keys(newDashboard).forEach((key) => {
                            dashboard[key] = newDashboard[key];
                        });
                    }
                    return dashboard;
                });
            } else {
                // adding new dashboard
                filteredDashboards = userdata.value.dashboards.filter(
                    (board) => board.id !== newDashboard.id,
                );
                newDashboards = [...filteredDashboards, newDashboard];
            }
        }
    }

    const newUserData = {
        ...userdata.value,
        dashboards: newDashboards,
    };

    const putTx = db.transaction(["cache"], "readwrite");
    const putStore = putTx.objectStore("cache");

    const item = {
        key: "userdata",
        value: newUserData,
    };

    putStore.put(item);
    await putTx.done;
    db.close();
};

const deleteDashboardCache = async (data) => {
    if (!window.indexedDB || typeof Worker === "undefined") {
        return;
    }

    let db = null;
    let tx = null;
    let store = null;
    let userdata = null;

    try {
        db = await openDB("pro-cache-db", 4);
        tx = db.transaction(["cache"], "readwrite");
        store = tx.objectStore("cache");
        userdata = await store.get("userdata");
    } catch (e) {
        swLog.warn("Could not open objectStore");
        return;
    }

    const filteredDashboards = userdata.value.dashboards.filter((board) => board.id !== data.data);

    const newDashboards = [...filteredDashboards];

    const newUserData = {
        ...userdata.value,
        dashboards: newDashboards,
    };

    const putTx = db.transaction(["cache"], "readwrite");
    const putStore = putTx.objectStore("cache");

    const item = {
        key: "userdata",
        value: newUserData,
    };

    putStore.put(item);
    await putTx.done;
    db.close();
};

export const UserResource: IUserResourceNew = {
    addDashboard,
    duplicateDashboard,
    bulkAddDashboards,
    updateDashboard,
    updateDashboardWidgets,
    deleteDashboard,
    getDashboardRelatedWorkspace,
    addWidget,
    updateWidget,
    deleteWidget,
    htmlToPdf,
    htmlToPng,
};
