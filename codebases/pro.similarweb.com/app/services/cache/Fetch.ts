export const fetchStartupUserData = async () => {
    const res = await fetch("/api/startupUserData", { credentials: "include" });
    const resJson = await res.json();
    return resJson.userData;
};

export const fetchStartupSettings = async () => {
    const res = await fetch("/api/startupSettings", { credentials: "include" });
    return res.json();
};
