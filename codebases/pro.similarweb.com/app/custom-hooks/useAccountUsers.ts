import { useEffect, useState } from "react";
import { IAccountUser, SharingService } from "sharing/SharingService";

export const useAccountUsers = () => {
    const [accountUsers, setAccountUsers] = useState<IAccountUser[]>([]);

    useEffect(() => {
        const getGetAccountUsers = async () => {
            const { users } = await SharingService.getAccountUsers();
            setAccountUsers(users);
        };

        getGetAccountUsers();
    }, []);

    return accountUsers;
};
