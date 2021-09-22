import React from "react";

type ContactsItemContextProps = {
    isRevealed: boolean;
    role?: string;
};

export const ContactItemContext = React.createContext<ContactsItemContextProps>(null);
