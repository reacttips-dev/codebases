// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import NaptimeStore from 'bundles/naptimejs/stores/NaptimeStore';
import ApplicationStore from 'bundles/ssr/stores/ApplicationStore';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'vend... Remove this comment to see the full error message
import Fluxible from 'vendor/cnpm/fluxible.v0-4/lib/Fluxible';

const app = new Fluxible();

app.registerStore(ApplicationStore);
app.registerStore(NaptimeStore);

export default app;
