import { useContext } from 'react';
import { FeaturesContext } from '../../components/providers';
export function useFeature(name) {
    var flags = useContext(FeaturesContext).flags;
    var treatment = flags[name] || 'control';
    return {
        treatment: treatment,
    };
}
//# sourceMappingURL=use-feature.js.map