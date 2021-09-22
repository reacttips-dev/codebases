import { DefaultFetchService } from "services/fetchService";
import { i18nFilter } from "filters/ngFilters";

export interface IAccountUser {
    Id?: number;
    User?: string;
    Email?: string;
    FirstName?: string;
    LastName?: string;
}
export interface IShareUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}
export interface IAccountUsersResponse {
    users: IShareUser[];
}

const fetchService = DefaultFetchService.getInstance();
const accountUsersUrl = `api/userdata/dashboards/share-users`;
export const SharingService = {
    getAccountUsers: () => {
        return new Promise<{ err: Error; users?: IAccountUser[]; response?: Response }>(
            (resolve, reject) => {
                fetchService
                    .get(accountUsersUrl, {}, { preventAutoCancellation: true })
                    .then((response: IAccountUsersResponse) => {
                        const users = response.users.map((user) => {
                            return {
                                Id: user.id,
                                User: `${user.firstName} ${user.lastName}`,
                                Email: user.email,
                                FirstName: user.firstName,
                                LastName: user.lastName,
                            };
                        });
                        resolve({ err: null, users });
                    })
                    .catch((err) => {
                        resolve({ err });
                    });
            },
        );
    },
    getShareTooltip: ({ sharedWithAccounts, sharedWithUsers, users }): string => {
        const i18n = i18nFilter();
        // do not render anything unless we have the acocunt users
        if (!users) {
            return null;
        }
        let text = "";
        if (sharedWithAccounts.length > 0) {
            text = i18n("keyword.groups.sharing.tooltip.company");
        } else if (sharedWithUsers.length == 1) {
            const firstUser = (users as IAccountUser[]).find(
                (user) => user.Id.toString() === sharedWithUsers[0].toString(),
            );
            text = i18n(`keyword.groups.sharing.tooltip.user.single`, {
                name: `${firstUser.FirstName} ${firstUser.LastName}`,
            });
        } else {
            const firstUser = (users as IAccountUser[]).find(
                (user) => user.Id.toString() === sharedWithUsers[0].toString(),
            );
            text = i18n(`keyword.groups.sharing.tooltip.user.multiple`, {
                name: `${firstUser.FirstName} ${firstUser.LastName}`,
                count: sharedWithUsers.length - 1,
            });
        }
        return text;
    },
};
