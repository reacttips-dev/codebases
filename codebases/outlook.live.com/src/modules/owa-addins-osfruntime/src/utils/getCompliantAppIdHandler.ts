import type Extension from 'owa-service/lib/contract/Extension';
import '../osfruntime';

export function getCompliantAppIdHandler(extension: Extension): string {
    return Telemetry.PrivacyRules.GetAssetId(
        OSF.StoreType.Exchange,
        extension?.MarketplaceAssetID,
        extension?.Id,
        extension?.ProviderName,
        extension?.TypeString
    );
}
