import * as _ from "lodash";
import { DefaultFetchService } from "../../services/fetchService";
import { IAccountUser, IAccountUsersResponse, SharingService } from "sharing/SharingService";

let accountUsers: IAccountUser[];
const getUserById = _.memoize((userId) => {
    const user = _.find(accountUsers || [], { Id: parseInt(userId) });
    return user;
});

const fetchService = DefaultFetchService.getInstance();

export interface ShareDashboardServiceResponse {
    addedAccountIds: string[];
    addedUserIds: string[];
    userIds: string[];
    accountIds: string[];
    dashboardTitle: string;
}
export const ShareDashboardService = {
    share: ({
        dashboardId,
        userIds,
        message,
    }: {
        dashboardId: string;
        userIds?: number[];
        message?: string;
    }) => {
        return new Promise<{
            err?: Error;
            success?: boolean;
            response?: ShareDashboardServiceResponse;
        }>((resolve) => {
            if (!dashboardId) {
                resolve({ err: new Error("dashboardId is undefined") });
            } else {
                const payload = Object.assign(
                    {},
                    {
                        userIds: userIds.length > 0 ? userIds : undefined,
                        message: message !== "" ? message : undefined,
                    },
                );
                fetchService
                    .put<ShareDashboardServiceResponse>(
                        ShareDashboardService.shareUrl(dashboardId),
                        payload,
                    )
                    .then((response) => {
                        resolve({ err: null, success: true, response });
                    })
                    .catch((err) => {
                        resolve({ err });
                    });
            }
        });
    },
    unShare: ({ dashboardId }: { dashboardId: string }) => {
        return new Promise<{ err: Error; success?: boolean; response?: Response }>((resolve) => {
            if (!dashboardId) {
                resolve({ err: new Error("dashboardId is undefined") });
            } else {
                fetchService
                    .delete(ShareDashboardService.unShareUrl(dashboardId))
                    .then((response) => {
                        resolve({ err: null, success: true });
                    })
                    .catch((err) => {
                        resolve({ err });
                    });
            }
        });
    },
    getSharedWithMe: () => {
        return new Promise((resolve) => {
            fetchService
                .get<Response>(ShareDashboardService.sharedWithMeUrl())
                .then((dashboards) => {
                    resolve({ err: null, dashboards });
                })
                .catch((err) => {
                    resolve({ err });
                });
        });
    },
    shareUrl: (dashboardId: string) => {
        return `api/userdata/dashboards/shared/${dashboardId}`;
    },
    unShareUrl: (dashboardId: string) => {
        return `api/userdata/dashboards/shared/${dashboardId}`;
    },
    sharedWithMeUrl: () => {
        return `api/userdata/dashboards/shared`;
    },
    accountUsersUrl: () => `api/userdata/dashboards/share-users`,
    getDashboardOwner: (ownerId: number) => {
        return new Promise<{ err?: Error; owner: IAccountUser }>((resolve, reject) => {
            if (accountUsers) {
                resolve({ owner: getUserById(ownerId) });
            } else {
                SharingService.getAccountUsers()
                    .then((response) => {
                        const { err, users } = response;
                        if (!err) {
                            accountUsers = users;
                            resolve({ owner: getUserById(ownerId) });
                        } else {
                            reject({ err });
                        }
                    })
                    .catch((err) => {
                        reject({ err });
                    });
            }
        });
    },
    getDashboardViewers: (viewers: number[]) => {
        return new Promise<{ err?: Error; viewers: IAccountUser[] }>((resolve, reject) => {
            if (accountUsers) {
                resolve({ viewers: viewers.map(getUserById) });
            } else {
                SharingService.getAccountUsers()
                    .then((response) => {
                        const { err, users } = response;
                        if (!err) {
                            accountUsers = users;
                            resolve({ viewers: viewers.map(getUserById) });
                        } else {
                            reject({ err });
                        }
                    })
                    .catch((err) => {
                        reject({ err });
                    });
            }
        });
    },
};
