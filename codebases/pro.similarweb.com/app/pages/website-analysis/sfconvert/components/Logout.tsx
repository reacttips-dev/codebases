import React from "react";

type LogoutProps = { children: React.ReactChild; swSettings: Record<string, any> };

export const Logout = ({ children, swSettings }: LogoutProps) => {
    return (
        <a
            href={`${swSettings?.swsites?.login}/logout?returnUrl=${encodeURIComponent(
                location.href,
            )}`}
        >
            {children}
        </a>
    );
};
