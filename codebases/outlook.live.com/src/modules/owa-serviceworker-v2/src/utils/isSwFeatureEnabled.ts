export type SwFeature = 'presd';

export default function isSwFeatureEnabled(feature: SwFeature): boolean {
    const search = self.location.search;
    return !!search && search.indexOf(`${feature}=1`) > -1;
}
