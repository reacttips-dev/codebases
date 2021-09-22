import * as React from 'react';

export interface StrategyContextProps<TFolderViewProps, TRibbonProps> {
    folderView?: React.FC<TFolderViewProps> | undefined;
    ribbon?: React.FC<TRibbonProps>;
}

export const StrategyContext = React.createContext<StrategyContextProps<any, any> | undefined>(
    undefined
);

export function useStrategy<TReturnType>(
    strategy: keyof StrategyContextProps<any, any>
): React.FC<TReturnType> | undefined {
    return React.useContext(StrategyContext)?.[strategy];
}
