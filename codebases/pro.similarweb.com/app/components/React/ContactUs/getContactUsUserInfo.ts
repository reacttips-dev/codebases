import { swSettings } from "common/services/swSettings";
import { numbersFromString } from "helpers/strings/numbersFromString";

interface IUserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    employeesMin: number;
    employeesMax: number;
}

const getUserInfo = (): IUserInfo => {
    const {
        username: email,
        firstname: firstName,
        lastname: lastName,
        customData,
        phone,
    } = swSettings.user;
    const [employeesMin, employeesMax] = numbersFromString(customData?.quiz?.employees);

    return {
        firstName,
        lastName,
        email,
        phone,
        employeesMin,
        employeesMax,
    };
};

export default getUserInfo;
