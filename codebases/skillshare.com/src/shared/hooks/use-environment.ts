import { useContext } from 'react';
import { EnvironmentContext } from '../../components/providers';
export function useEnvironment() {
    return useContext(EnvironmentContext).variables;
}
//# sourceMappingURL=use-environment.js.map