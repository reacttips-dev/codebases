export class CookieManager {
    getCookie = (name: string) => {
        const parts = document.cookie.split("; " + name + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
        return null;
    };
    setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    deleteCookie = (name: string) => {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    };
}
