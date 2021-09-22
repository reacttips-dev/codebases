import React, { useContext } from "react";

type MultiSelectorContextType = {
    onCloseRightSideBar(): void;
};

const MultiSelectorContext = React.createContext<MultiSelectorContextType>(null);

export const useMultiSelectorContext = () => {
    return useContext(MultiSelectorContext);
};

export default MultiSelectorContext;
