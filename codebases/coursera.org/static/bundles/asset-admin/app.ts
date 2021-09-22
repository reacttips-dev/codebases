import Fluxible from 'vendor/cnpm/fluxible.v0-4/index';

import AssetAdminStore from 'bundles/asset-admin/stores/AssetAdminStore';

const app = new Fluxible();

app.registerStore(AssetAdminStore);

export default app;
