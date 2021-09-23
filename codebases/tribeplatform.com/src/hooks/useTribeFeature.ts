import { useFeature } from '@optimizely/react-sdk';
const useTribeFeature = (feature, overrides) => {
    try {
        const [isEnabled, variables, clientReady, didTimeout] = useFeature(feature, { autoUpdate: true }, overrides);
        return { isEnabled, variables, clientReady, didTimeout };
    }
    catch {
        // Catch case where OptimizelyProvider is not installed properly
        return {
            isEnabled: false,
            variables: null,
            clientReady: false,
            didTimeout: false,
        };
    }
};
export default useTribeFeature;
//# sourceMappingURL=useTribeFeature.js.map